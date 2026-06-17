"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserDeviceCard } from "@/components/cards/UserDeviceCard";

export default function UserListView() {
  return (
    <div className="space-y-3 px-3 pt-3">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        <Badge>All(2)</Badge>
        <Badge variant="secondary">Running(0)</Badge>
        <Badge variant="secondary">Stopped(2)</Badge>
        <Badge variant="secondary">Idle(0)</Badge>
      </div>

      {/* Search */}
      <Input placeholder="Search Device by Reg, Driver name or phone" />

      {/* Cards */}
      {/* <UserDeviceCard />
      <UserDeviceCard /> */}
    </div>
  );
}
