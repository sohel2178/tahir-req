import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  Messaging,
} from "firebase/messaging";

import { firebaseApp } from "./firebase";

let messaging: Messaging | null = null;

export async function getFirebaseMessaging() {
  if (typeof window === "undefined") return null;

  if (!(await isSupported())) {
    return null;
  }

  if (!messaging) {
    messaging = getMessaging(firebaseApp);
  }

  return messaging;
}

export async function getFCMToken(
  serviceWorkerRegistration?: ServiceWorkerRegistration,
) {
  const messaging = await getFirebaseMessaging();

  if (!messaging) return null;

  return getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration,
  });
}

export async function subscribeForegroundMessages(
  callback: (payload: any) => void,
) {
  const messaging = await getFirebaseMessaging();

  if (!messaging) return;

  return onMessage(messaging, callback);
}
