// jeek-admin-panel/src/lib/push.ts
// Web Push (VAPID) registration for this device. Subscriptions are saved in Firestore
// (`pushSubscriptions`) so the scheduled GitHub Action can send order notifications.
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Language } from '../types';

const VAPID_PUBLIC_KEY = (import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined) || '';

export type PushStatus =
  | 'unsupported' // browser can't do Web Push
  | 'ios-install' // iPhone/iPad: must be added to the Home Screen first
  | 'not-configured' // VITE_VAPID_PUBLIC_KEY missing in this build
  | 'blocked' // user denied the permission in browser settings
  | 'off' // supported, this device is not registered
  | 'on'; // this device is registered

function isIos(): boolean {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && navigator.maxTouchPoints > 1);
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function getRegistration(): Promise<ServiceWorkerRegistration> {
  // './sw.js' resolves next to index.html, so it also works from a GitHub Pages sub-folder.
  await navigator.serviceWorker.register('./sw.js');
  return navigator.serviceWorker.ready;
}

async function saveSubscription(sub: PushSubscription, lang: Language): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  const json = sub.toJSON();
  const id = await sha256Hex(sub.endpoint);
  await setDoc(doc(db, 'pushSubscriptions', id), {
    endpoint: sub.endpoint,
    keys: { p256dh: json.keys?.p256dh ?? '', auth: json.keys?.auth ?? '' },
    lang,
    userAgent: navigator.userAgent.slice(0, 300),
    updatedAtMs: Date.now(),
  });
}

export async function getPushStatus(): Promise<PushStatus> {
  if (isIos() && !isStandalone()) return 'ios-install';
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    return 'unsupported';
  }
  if (!VAPID_PUBLIC_KEY) return 'not-configured';
  if (Notification.permission === 'denied') return 'blocked';
  if (Notification.permission !== 'granted') return 'off';
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  return sub ? 'on' : 'off';
}

/** Asks permission, subscribes this device and registers it for order notifications. */
export async function enablePush(lang: Language): Promise<PushStatus> {
  const status = await getPushStatus();
  if (status !== 'off' && status !== 'on') return status;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return permission === 'denied' ? 'blocked' : 'off';

  const reg = await getRegistration();
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }
  await saveSubscription(sub, lang);
  return 'on';
}

/** Unsubscribes this device and removes it from Firestore. */
export async function disablePush(): Promise<PushStatus> {
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  if (sub) {
    const id = await sha256Hex(sub.endpoint);
    await sub.unsubscribe();
    if (db) await deleteDoc(doc(db, 'pushSubscriptions', id)).catch(() => undefined);
  }
  return getPushStatus();
}

/** On every panel load: re-save the subscription (covers rotated endpoints / language change). */
export async function syncPush(lang: Language): Promise<void> {
  if ((await getPushStatus()) !== 'on') return;
  const reg = await getRegistration();
  const sub = await reg.pushManager.getSubscription();
  if (sub) await saveSubscription(sub, lang);
}
