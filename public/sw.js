/* SMOSpace Web Push service worker. Shows notifications pushed from the server
   and focuses/opens the app when one is clicked. */

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }

  // Visible in the service worker console (DevTools > Application > Service Workers).
  console.log('[sw] push received:', data);

  const title = data.title || 'SMOSpace';
  const options = {
    body: data.body || '',
    icon: data.icon || '/vite.svg',
    badge: '/vite.svg',
    tag: data.tag,
    data: { url: data.url || '/' },
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration
      .showNotification(title, options)
      .catch((err) => console.error('[sw] showNotification failed:', err)),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if ('navigate' in client) client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    }),
  );
});
