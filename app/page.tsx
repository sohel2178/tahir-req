// app/page.tsx
"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      if (user?.role === "admin") router.push("/admin");
      else if (user?.role === "manager") router.push("/manager");
      else router.push("/user");
    }
  }, [user, router]);

  // 🔥 IMPORTANT: render a splash instead of null
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-lg font-medium">Loading Tiktiki…</span>
      </div>
    );
  }

  return null;
}
