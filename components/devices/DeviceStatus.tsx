"use client";

import { RedisGeo } from "@/types/device";
import {
  Car,
  BatteryCharging,
  Battery,
  Power,
  Satellite,
  Zap,
} from "lucide-react";

export default function DeviceStatus({ geo }: { geo?: RedisGeo }) {
  if (!geo) {
    return <span className="text-red-500 text-xs">❌ Not Reporting</span>;
  }

  const voltage = geo.external_voltage ?? 0;

  // 🔥 Smart voltage classification
  let voltageColor = "text-gray-400";
  let voltageLabel = "Unknown";

  if (voltage >= 10 && voltage <= 15) {
    voltageLabel = "12V System";
    voltageColor =
      voltage < 11
        ? "text-red-500"
        : voltage < 12
          ? "text-yellow-500"
          : "text-green-500";
  } else if (voltage >= 20 && voltage <= 30) {
    voltageLabel = "24V System";
    voltageColor =
      voltage < 22
        ? "text-red-500"
        : voltage < 24
          ? "text-yellow-500"
          : "text-green-500";
  } else if (voltage >= 40 && voltage <= 70) {
    voltageLabel = "EV Battery";
    voltageColor =
      voltage < 48
        ? "text-red-500"
        : voltage < 58
          ? "text-yellow-500"
          : "text-green-500";
  } else {
    voltageLabel = "Out of Range";
    voltageColor = "text-gray-400";
  }

  return (
    <div className="flex items-center gap-3">
      {/* ACC */}
      <div title={`ACC: ${geo.acc === "ON" ? "ON" : "OFF"}`}>
        <Car
          size={18}
          className={geo.acc === "ON" ? "text-green-500" : "text-gray-400"}
        />
      </div>

      {/* Charging */}
      <div title={geo.charging === "ON" ? "Charging" : "Not Charging"}>
        {geo.charging === "ON" ? (
          <BatteryCharging size={18} className="text-blue-500" />
        ) : (
          <Battery size={18} className="text-gray-400" />
        )}
      </div>

      {/* Relay */}
      <div title={`Relay: ${geo.fuel_line === "OFF" ? "OFF" : "ON"}`}>
        <Power
          size={18}
          className={
            geo.fuel_line === "OFF" ? "text-red-500" : "text-green-500"
          }
        />
      </div>

      {/* Satellites */}
      <div title={`Satellites: ${geo.number_of_satellite ?? 0}`}>
        <Satellite size={18} className="text-yellow-500" />
      </div>

      {/* Voltage (SMART ⚡) */}
      <div title={`${voltage}V (${voltageLabel})`}>
        <Zap size={18} className={voltageColor} />
      </div>
    </div>
  );
}
