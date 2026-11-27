/* Jeek Admin — service worker for Web Push order notifications.
 * Runs even when the admin panel tab / browser window is closed. */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : '' };
  }

  const scope = self.registration.scope;
  const title = data.title || 'Jeek Store';
  const options = {
    body: data.body || '',
    icon: scope + 'assets/aistudio/jeekstore1-removebg-preview.png',
    badge: scope + 'assets/aistudio/jeekstore1-removebg-preview.png',
    tag: data.tag || undefined,
    renotify: Boolean(data.tag),
    lang: data.lang || 'en',
    dir: data.lang === 'ar' ? 'rtl' : 'ltr',
    requireInteraction: true,
    data: { url: data.url || scope },
  };

  // A push must always show a notification (userVisibleOnly), so never skip this.
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || self.registration.scope;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.startsWith(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    }),
  );
});
