"use client";

import { useParams } from "next/navigation";
import DaillyReport from "@/components/report/DaillyReport";
import { useMapStore } from "@/store/map";
import { DeviceAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import { Device } from "@/types/device";

export default function AdminDailyReportPage() {
  // const { id } = useParams();
  // const getDeviceById = useDeviceStore((state) => state.getDeviceById);
  // const device = getDeviceById(id as string);
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
      <DaillyReport device={device} />
    </div>
  );
}
