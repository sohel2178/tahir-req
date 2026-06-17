"use client";

import { useParams } from "next/navigation";
import MonthlyReport from "@/components/report/MonthlyReport";
import { useEffect, useState } from "react";
import { Device } from "@/types/device";
import { useMapStore } from "@/store/map";
import { DeviceAPI } from "@/lib/api";

export default function AdminMonthlyReportPage() {
  const [device, setDevice] = useState<Device | null>(null);

  const { id } = useParams<{ id: string }>();
  const { setSelectedDevice } = useMapStore();

  useEffect(() => {
    if (!id) return;

    const fetchDevice = async () => {
      const device = await DeviceAPI.getCurrentDevice(id);
      setSelectedDevice(device);
      setDevice(device);
    };

    fetchDevice();
  }, [id]);

  if (!device) {
    return <p>Device not found in store</p>;
  }

  return (
    <div className="h-full w-full ">
      <MonthlyReport device={device} />
    </div>
  );
}
