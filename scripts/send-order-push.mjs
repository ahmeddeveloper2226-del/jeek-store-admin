// jeek-admin-panel/scripts/send-order-push.mjs
//
// Run by GitHub Actions on a schedule (see .github/workflows/order-push.yml).
// 1. Reads recent customer orders + maintenance requests from Firestore.
// 2. Finds the ones it has not announced yet (tracked in Firestore doc system/pushState).
// 3. Sends a Web Push notification to every admin device saved in `pushSubscriptions`.
//
// Required environment variables (GitHub repository secrets):
//   FIREBASE_SERVICE_ACCOUNT  full JSON of a Firebase service-account key
//   VAPID_PUBLIC_KEY          same value as VITE_VAPID_PUBLIC_KEY used to build the admin site
//   VAPID_PRIVATE_KEY         private half of the VAPID key pair
//   VAPID_SUBJECT             (optional) "mailto:you@example.com"

import { pathToFileURL } from 'node:url';

const WINDOW_MS = 3 * 24 * 60 * 60 * 1000; // only look at orders created in the last 3 days
const MAX_TRACKED_IDS = 500;
const COLLECTIONS = [
  { name: 'orders', stateKey: 'orders', kind: 'order' },
  { name: 'maintenanceOrders', stateKey: 'maintenance', kind: 'maintenance' },
];

const clip = (v, n = 80) => String(v ?? '').trim().slice(0, n);
const money = (n, lang) =>
  lang === 'ar' ? `${Number(n || 0).toLocaleString('en-US')} ج.م` : `${Number(n || 0).toLocaleString('en-US')} EGP`;

/** Builds the notification text for a list of new items, in the subscriber's language. */
export function buildPayload(items, lang) {
  const ar = lang === 'ar';

  if (items.length === 1) {
    const { kind, docId, data } = items[0];
    const name = clip(data.customerName, 60) || (ar ? 'عميل' : 'Customer');
    if (kind === 'order') {
      const units = (Array.isArray(data.items) ? data.items : []).reduce((s, i) => s + (Number(i?.quantity) || 0), 0);
      return {
        title: ar ? `🛒 طلب جديد ${clip(data.id, 20)}` : `🛒 New order ${clip(data.id, 20)}`,
        body: `${name} · ${money(data.total, lang)}` + (units ? ` · ${units} ${ar ? 'قطعة' : units === 1 ? 'item' : 'items'}` : ''),
        tag: `order-${docId}`,
        lang,
      };
    }
    const bike = clip(ar ? data.bikeModelAr || data.bikeModel : data.bikeModel, 50);
    const pkg = clip(ar ? data.servicePackageAr || data.servicePackage : data.servicePackage, 50);
    return {
      title: ar ? `🔧 طلب صيانة جديد ${clip(data.id, 20)}` : `🔧 New maintenance request ${clip(data.id, 20)}`,
      body: [name, bike, pkg].filter(Boolean).join(' · '),
      tag: `maintenance-${docId}`,
      lang,
    };
  }

  const orders = items.filter((i) => i.kind === 'order').length;
  const maint = items.length - orders;
  const parts = [];
  if (orders) parts.push(ar ? `${orders} طلب جديد` : `${orders} new order${orders === 1 ? '' : 's'}`);
  if (maint) parts.push(ar ? `${maint} طلب صيانة` : `${maint} maintenance request${maint === 1 ? '' : 's'}`);
  const names = [...new Set(items.map((i) => clip(i.data.customerName, 30)).filter(Boolean))];
  const shown = names.slice(0, 3).join(ar ? '، ' : ', ');
  const extra = names.length > 3 ? ` +${names.length - 3}` : '';
  return {
    title: `🛒 ${parts.join(' + ')}`,
    body: shown + extra,
    tag: `batch-${Date.now()}`,
    lang,
  };
}

/**
 * Core job. `db` is a Firestore (admin SDK) instance and `webpush` exposes sendNotification().
 * Returns a small summary so it is easy to test.
 */
export async function run({ db, webpush, now = Date.now(), log = console.log }) {
  const since = now - WINDOW_MS;
  const stateRef = db.collection('system').doc('pushState');
  const stateSnap = await stateRef.get();
  const firstRun = !stateSnap.exists;
  const state = stateSnap.exists ? stateSnap.data() : {};

  // Gather recent docs from every collection.
  const recent = {}; // stateKey -> [{ kind, docId, data }]
  for (const c of COLLECTIONS) {
    const snap = await db.collection(c.name).where('createdAtMs', '>=', since).get();
    recent[c.stateKey] = snap.docs
      .map((d) => ({ kind: c.kind, docId: d.id, data: d.data() }))
      .sort((a, b) => (a.data.createdAtMs || 0) - (b.data.createdAtMs || 0));
  }

  const isNew = (stateKey, item) => !(state[stateKey] || []).includes(item.docId);
  const fresh = firstRun ? [] : COLLECTIONS.flatMap((c) => recent[c.stateKey].filter((i) => isNew(c.stateKey, i)));
  fresh.sort((a, b) => (a.data.createdAtMs || 0) - (b.data.createdAtMs || 0));

  const summary = { firstRun, newItems: fresh.length, sent: 0, removed: 0, failed: 0 };
  let markAsNotified = true;

  if (fresh.length > 0) {
    const subsSnap = await db.collection('pushSubscriptions').get();
    const subs = subsSnap.docs
      .map((d) => ({ ref: d.ref, ...d.data() }))
      .filter((s) => s.endpoint && s.keys?.p256dh && s.keys?.auth);

    if (subs.length === 0) {
      log('New orders found but no devices are registered for notifications.');
    } else {
      const payloads = {};
      const results = await Promise.allSettled(
        subs.map((s) => {
          const lang = s.lang === 'ar' ? 'ar' : 'en';
          payloads[lang] ??= JSON.stringify(buildPayload(fresh, lang));
          return webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.keys.p256dh, auth: s.keys.auth } },
            payloads[lang],
            { TTL: 60 * 60 * 24, urgency: 'high' },
          );
        }),
      );

      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (r.status === 'fulfilled') {
          summary.sent++;
          continue;
        }
        const code = r.reason?.statusCode;
        if (code === 404 || code === 410) {
          // The device unsubscribed / the subscription expired: clean it up.
          await subs[i].ref.delete().catch(() => undefined);
          summary.removed++;
        } else {
          summary.failed++;
          log(`Push failed (${code ?? 'no status'}): ${clip(r.reason?.body || r.reason?.message, 200)}`);
        }
      }

      // If nothing was delivered because of a temporary problem, try again on the next run.
      if (summary.sent === 0 && summary.failed > 0) markAsNotified = false;
    }
  }

  // Save what has been announced (only ids still inside the look-back window, so it stays small).
  const next = { initialized: true, updatedAtMs: now };
  for (const c of COLLECTIONS) {
    const windowIds = recent[c.stateKey].map((i) => i.docId);
    const alreadyDone = (state[c.stateKey] || []).filter((id) => windowIds.includes(id));
    const ids = markAsNotified || firstRun ? windowIds : alreadyDone;
    next[c.stateKey] = ids.slice(-MAX_TRACKED_IDS);
  }
  await stateRef.set(next);

  log(
    firstRun
      ? `First run: marked ${COLLECTIONS.reduce((n, c) => n + recent[c.stateKey].length, 0)} existing order(s) as seen, no notifications sent.`
      : `Done: ${summary.newItems} new, ${summary.sent} delivered, ${summary.removed} stale device(s) removed, ${summary.failed} failed.`,
  );
  return summary;
}

async function main() {
  const { FIREBASE_SERVICE_ACCOUNT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;
  const missing = ['FIREBASE_SERVICE_ACCOUNT', 'VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY'].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing GitHub secret(s): ${missing.join(', ')}`);
    process.exit(1);
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
  } catch {
    console.error('FIREBASE_SERVICE_ACCOUNT is not valid JSON. Paste the whole downloaded key file.');
    process.exit(1);
  }

  const { initializeApp, cert } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const webpush = await import('web-push');

  initializeApp({ credential: cert(serviceAccount) });
  webpush.setVapidDetails(VAPID_SUBJECT || 'mailto:admin@jeek-store.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  const summary = await run({ db: getFirestore(), webpush });
  // Make the workflow go red (GitHub emails you) if devices exist but nothing could be delivered.
  if (summary.sent === 0 && summary.failed > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err?.message || err);
    process.exit(1);
  });
}
