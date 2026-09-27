"use client";

import { ReactNode } from "react";
import { useFirebaseMessaging } from "@/hooks/useFirebaseMessaging";

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  useFirebaseMessaging();

  return <>{children}</>;
}
