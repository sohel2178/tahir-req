// app/(dashboard)/admin/page.tsx
"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  useAuth("admin");
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/users"); // redirect to Users by default
  }, [router]);

  return null; // no UI, just redirect
}
