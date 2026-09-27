// "use client";

// import { useEffect } from "react";
// import toast from "react-hot-toast";

// import {
//   getFCMToken,
//   subscribeForegroundMessages,
// } from "@/lib/firebase-messaging";

// import { UserAPI } from "@/lib/api";

// export default function SWRegister() {
//   useEffect(() => {
//     initialize();

//     async function initialize() {
//       if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
//         return;
//       }

//       try {
//         // Register PWA Service Worker
//         const registration = await navigator.serviceWorker.register("/sw.js");

//         console.log("✅ PWA Service Worker registered");

//         // Skip if notifications aren't supported
//         if (!("Notification" in window)) {
//           return;
//         }

//         // Don't ask again if already denied
//         if (Notification.permission === "denied") {
//           console.warn("Notification permission denied");
//           return;
//         }

//         // Request permission
//         if (Notification.permission === "default") {
//           const permission = await Notification.requestPermission();

//           if (permission !== "granted") {
//             return;
//           }
//         }

//         // Get FCM Token
//         const token = await getFCMToken(registration);

//         if (token) {
//           console.log("FCM Token:", token);

//           // TODO:
//           // await api.post("/users/fcm-token", { token });
//         }

//         // Listen foreground messages
//         await subscribeForegroundMessages((payload) => {
//           console.log("Foreground Notification", payload);

//           toast.success(payload.notification?.title ?? "New Notification", {
//             duration: 5000,
//           });
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   }, []);

//   return null;
// }

"use client";

import { useEffect } from "react";

export default function SWRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        console.log("✅ PWA Service Worker registered");
      })
      .catch((err) => {
        console.error("❌ Service Worker registration failed", err);
      });
  }, []);

  return null;
}
