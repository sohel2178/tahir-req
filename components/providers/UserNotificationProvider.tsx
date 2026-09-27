"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

import {
  getFCMToken,
  subscribeForegroundMessages,
} from "@/lib/firebase-messaging";
import { UserAPI } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function UserNotificationProvider() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") return;
    if (user.role === "manager") return;

    initialize();
  }, [user]);

  async function initialize() {
    try {
      if (!("Notification" in window)) return;

      let registration = await navigator.serviceWorker.getRegistration("/");

      if (!registration) {
        registration = await navigator.serviceWorker.register("/sw.js");
      }

      if (Notification.permission === "denied") {
        return;
      }

      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          return;
        }
      }

      const token = await getFCMToken(registration);

      const lastToken = localStorage.getItem("fcm-token");

      if (token && token !== lastToken) {
        console.log("FCM Token:", token);

        await UserAPI.registerFCMToken(token);
        localStorage.setItem("fcm-token", token);
      }

      subscribeForegroundMessages((payload) => {
        console.log(payload);

        toast.success(payload.notification?.title ?? "New Notification");
      });
    } catch (err) {
      console.error(err);
    }
  }

  return null;
}
