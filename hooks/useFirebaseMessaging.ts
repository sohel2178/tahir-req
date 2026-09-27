"use client";

import { useEffect, useState } from "react";
import {
  getFCMToken,
  subscribeForegroundMessages,
} from "@/lib/firebase-messaging";

export function useFirebaseMessaging() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      if (!("serviceWorker" in navigator)) {
        console.log("Service Worker not supported");
        return;
      }

      if (!("Notification" in window)) {
        console.log("Notification API not supported");
        return;
      }

      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        console.log("Notification permission denied");
        return;
      }

      const fcmToken = await getFCMToken(registration);

      if (!fcmToken) {
        console.log("Unable to obtain FCM token");
        return;
      }

      console.log("FCM Token:", fcmToken);

      setToken(fcmToken);

      // TODO:
      // await api.post("/users/fcm-token", {
      //     token: fcmToken,
      // });

      subscribeForegroundMessages((payload) => {
        console.log("Foreground Message", payload);

        // Later we'll show Sonner/Shadcn toast here.
      });
    } catch (err) {
      console.error("Firebase Messaging Error", err);
    }
  }

  return {
    token,
  };
}
