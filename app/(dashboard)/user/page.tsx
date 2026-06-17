"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserDeviceCard } from "@/components/cards/UserDeviceCard";

import { Device } from "@/types/device";
import { DeviceAPI } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { de } from "date-fns/locale";
import ClientSearch from "@/components/motion/ClientSearch";

type Filter = "all" | "running" | "idle" | "stopped";

export default function UserDashboardPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableDevices, setTableDevices] = useState<Device[]>([...devices]);

  const fetchDevices = useCallback(async () => {
    try {
      const data = await DeviceAPI.list();
      setDevices(data);
      setTableDevices(data);
    } catch (err) {
      console.error("❌ Failed to fetch devices", err);
    }
  }, [setDevices]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return (
    <div className="px-3 pt-3 space-y-2">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        <Badge>All({devices.length})</Badge>
        <Badge variant="secondary">
          Running({devices.filter((d) => d.geo?.acc === "ON").length})
        </Badge>
        <Badge variant="secondary">
          Stopped({devices.filter((d) => d.geo?.acc === "OFF").length})
        </Badge>
        <Badge variant="secondary">Idle(0)</Badge>
      </div>

      {/* Search */}
      {/* <Input placeholder="Search Device by Reg, Driver name or phone" /> */}

      <ClientSearch
        callback={setTableDevices}
        data={devices}
        fields={["driver_name", "registration_number", "geo.acc"]}
        imgSrc="/icons/search.svg"
        placeholder="Search Device by Reg, Driver name or phone"
        otherClasses="w-full sm:w-[300px] lg:w-[400px]"
      />

      {/* List */}
      <div className="bg-[#e5e5e5] rounded-xl p-1 space-y-1">
        {tableDevices.map((d) => (
          <UserDeviceCard key={d.id} device={d} />
        ))}
      </div>
    </div>
  );
}
