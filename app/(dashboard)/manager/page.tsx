"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ManagerDashboard() {
  useAuth("manager");
  const router = useRouter();
  useEffect(() => {
    router.replace("/manager/users"); // redirect to Users by default
  }, [router]);

  return null; // no UI, just redirect
}
