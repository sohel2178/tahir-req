"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Pencil, UserPlus, UserX, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function ReportsMenu({ deviceId }: { deviceId: string }) {
  const router = useRouter();
  const { user } = useAuthStore();

  const basePath = user?.role === "manager" ? "/manager" : "/admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            router.push(`${basePath}/devices/${deviceId}/live-tracking`)
          }
        >
          Live Tracking
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`${basePath}/devices/${deviceId}/daily-report`)
          }
        >
          Daily Report
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`${basePath}/devices/${deviceId}/monthly-report`)
          }
        >
          Monthly Report
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`${basePath}/devices/${deviceId}/daily-travel-report`)
          }
        >
          Daily Travel Report
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            router.push(`${basePath}/devices/${deviceId}/range-travel-report`)
          }
        >
          Range Travel Report
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`${basePath}/devices/${deviceId}/speed-report`)
          }
        >
          Speed Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
