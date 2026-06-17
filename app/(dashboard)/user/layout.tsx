"use client";
import { ReactNode } from "react";
import { BottomNav } from "@/components/users/BottomNav";

import { usePathname } from "next/navigation";

export default function UserLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideBottomNav = pathname.includes("devices/");
  return (
    <div className="h-screen bg-[#EFF1F1] flex flex-col overflow-hidden">
      {/* FIXED HEADER */}

      <header className="shrink-0 bg-[#16364d] text-white px-4 py-3 z-20">
        <h1 className="text-lg font-semibold">Tiktiki</h1>
      </header>

      {/* SCROLLABLE CONTENT */}
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      {/* FIXED BOTTOM NAV */}

      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
