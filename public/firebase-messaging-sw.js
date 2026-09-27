importScripts(
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAsM3X9NrOF97Hk6fyqtmGlObT93HjnBeA",
  authDomain: "tiktiki-97da4.firebaseapp.com",
  projectId: "tiktiki-97da4",
  storageBucket: "tiktiki-97da4.appspot.com",
  messagingSenderId: "118654296430",
  appId: "1:118654296430:web:450899d6deae5efd99e17f",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[FCM Background]", payload);

  const notificationTitle = payload.notification?.title ?? "Tiktiki";

  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: payload.data,
    requireInteraction: true,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});
