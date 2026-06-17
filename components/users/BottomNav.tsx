"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Bell, AlertTriangle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/user", label: "List View", icon: Home },
  { href: "/user/map", label: "Map View", icon: Map },
  { href: "/user/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/user/notifications", label: "Notification", icon: Bell },
  { href: "/user/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const path = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      {nav.map((n) => {
        const active = path === n.href;
        const Icon = n.icon;
        return (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "flex flex-col items-center text-xs",
              active ? "text-[#16364d] font-semibold" : "text-gray-400"
            )}
          >
            <Icon className={cn("h-5 w-5 mb-1", active && "text-[#16364d]")} />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
