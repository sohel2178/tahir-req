"use client";

import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import {
  User,
  CreditCard,
  Globe,
  Building,
  Headphones,
  PlayCircle,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

const items = [
  { icon: User, label: "Profile" },
  { icon: CreditCard, label: "Payment Guide" },
  { icon: Globe, label: "Language" },
  { icon: Building, label: "Company Information" },
  { icon: Headphones, label: "Customer Service" },
  { icon: PlayCircle, label: "Tutorial" },
  { icon: LogOut, label: "Logout" },
];

export default function SettingsPage() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  return (
    <div className="px-3 pt-4">
      <Card className="divide-y">
        {items.map((i) => {
          const Icon = i.icon;
          return (
            <div
              key={i.label}
              className="flex items-center gap-3 p-4"
              onClick={() => {
                if (i.label === "Logout") {
                  logout();
                  router.push("/login");
                }
              }}
            >
              <Icon className="h-5 w-5" />
              <span>{i.label}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
