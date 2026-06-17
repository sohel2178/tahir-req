"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { RedisGeo } from "@/types/device";
import { DeviceAPI, CommandAPI } from "@/lib/api";

import FuelCut from "@/components/dialog/FuelCut";
import UserReportMenu from "@/components/menu/UserReportMenu";
import { useLiveGeo } from "@/hooks/useLiveGeo";

import toast from "react-hot-toast";
import LiveAnimatedMap from "@/components/map/LiveAnimatedMap";
import SpeedBadge from "@/components/motion/SpeedBadge";
import UserVehicleInfo from "@/components/motion/UserVehicleInfo";
import { useMapStore } from "@/store/map";

export default function LiveTrackingPage() {
  const { id } = useParams<{ id: string }>();

  // const [loading, setLoading] = useState(true);

  /* ✅ CALL HOOK UNCONDITIONALLY */
  const { selectedDevice, setSelectedDevice } = useMapStore();

  const geoHistory = useLiveGeo(selectedDevice?.id ?? "", selectedDevice?.geo);

  useEffect(() => {
    if (!id) return;

    const fetchDevice = async () => {
      const device = await DeviceAPI.getCurrentDevice(id);
      setSelectedDevice(device);
    };

    fetchDevice();
  }, [id]);

  const onConfirm = async () => {
    if (!selectedDevice) return;

    try {
      const commandData = {
        device_id: selectedDevice.id,
        command_type: "S20",
        power: geoHistory.at(-1)?.fuel_line === "ON" ? "OFF" : "ON",
        center_number: selectedDevice.center_number,
      };

      await CommandAPI.saveCommand(commandData);

      toast.success(
        `Command to ${
          selectedDevice.geo?.fuel_line === "ON" ? "cut off" : "restore"
        } fuel pump sent successfully`,
      );
    } catch (err) {
      toast.error("Failed to send fuel cut command");
    }
  };

  /* ✅ SAFE RETURNS AFTER HOOKS */

  if (!selectedDevice) {
    return (
      <div className="h-screen flex items-center justify-center">
        Device not found
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#16364d] px-4 flex items-center justify-between text-white">
        <div>
          <h1 className="text-lg font-semibold">Live Tracking</h1>
          <p className="text-xs opacity-80">
            of {selectedDevice.registration_number}
          </p>
        </div>

        <div className="flex gap-2">
          {selectedDevice.geo?.fuel_line !== undefined && (
            <FuelCut
              fuelLine={geoHistory.at(-1)?.fuel_line ?? "ON"}
              onConfirm={onConfirm}
            />
          )}

          <UserReportMenu deviceId={selectedDevice.id} />
        </div>
      </header>

      {/* ================= MAP ================= */}
      <div className="absolute left-0 right-0 bottom-0 top-16">
        <LiveAnimatedMap device={selectedDevice} />
      </div>

      <div className="fixed top-16  right-0 z-40">
        <SpeedBadge
          title="Speed (k/h)"
          speed={Number(geoHistory.at(-1)?.speed ?? 0)}
        />
      </div>

      <div className="fixed top-16  left-0 z-40">
        <SpeedBadge
          title="Distance (km)"
          speed={Number(geoHistory.at(-1)?.milage ?? 0) / 1000 || 0}
          isLeft={true}
        />
      </div>

      {geoHistory.length > 0 && geoHistory.at(-1) != null && (
        <UserVehicleInfo geo={geoHistory.at(-1) as RedisGeo} />
      )}
    </div>
  );
}
