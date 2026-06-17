"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { userDeviceRoutes } from "@/lib/routes";

export default function ReportsMenu({ deviceId }: { deviceId: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="space-y-2 z-[9999]">
        {userDeviceRoutes
          .filter(
            (route) =>
              !pathname.endsWith(`/user/devices/${deviceId}/${route.path}`)
          )
          .map((route) => (
            <DropdownMenuItem
              key={route.path}
              onClick={() =>
                router.push(`/user/devices/${deviceId}/${route.path}`)
              }
            >
              {route.name}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
