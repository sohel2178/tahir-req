"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export function useAuth(requiredRole?: string) {
  const { user, token, hydrated, setHydrated } = useAuthStore();
  const router = useRouter();

  // ✅ mark as hydrated once on mount
  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    if (!hydrated) return; // ⏳ wait until hydration done

    if (!token) {
      router.replace("/login");
    } else if (requiredRole && user?.role !== requiredRole) {
      router.replace("/");
    }
  }, [hydrated, token, user, requiredRole, router]);
}
