"use client";

import { useEffect, useState } from "react";
import { Device } from "@/types/device";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { getVehicleIcon, getVehicleTypeLabel } from "@/lib/vehicle";
import { SignalStrength } from "@/components/users/SignalStrength";
import { motion, AnimatePresence } from "framer-motion";

import { reverseGeocode } from "@/lib/reverseGeocode";
import UserReportMenu from "../menu/UserReportMenu";

export function UserDeviceCard({ device }: { device: Device }) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  const geo = device.geo;
  const voltage = geo?.external_voltage || "0.00";

  useEffect(() => {
    if (!open) return;
    if (address) return; // already fetched
    if (!geo?.lat || !geo?.lng) return;

    setAddressLoading(true);

    reverseGeocode(geo.lat, geo.lng).then((res) => {
      setAddress(res);
      setAddressLoading(false);
    });
  }, [open, geo?.lat, geo?.lng, address]);

  return (
    <Card className="overflow-hidden rounded-xl border bg-white">
      {/* ===== COLLAPSED HEADER ===== */}
      <div
        className="bg-white px-3 py-1 flex gap-3 items-start cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        {/* Vehicle Icon */}
        <div className="h-12 w-12 rounded-full bg-gray-400 flex items-center justify-center">
          <img
            src={getVehicleIcon(device.vehicle_type)}
            alt="vehicle"
            className="h-8 w-8"
          />
        </div>

        {/* Main Info */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">
              {device.registration_number}
            </h3>

            <div className="flex gap-2 items-center">
              {open ? (
                <ChevronUp className="text-gray-600" />
              ) : (
                <ChevronDown className="text-gray-600" />
              )}

              <UserReportMenu deviceId={device.id} />
            </div>
          </div>

          {/* Pills */}
          <div className="flex gap-2 mt-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-black text-white">
              {device.mileage ?? 0} KM
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black text-white">
              {geo?.speed ?? 0} K/H
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black text-white">
              {voltage} Volt
            </span>
          </div>

          {/* Indicators */}
          <div className="mt-3 grid grid-cols-4 gap-2 text-[11px] text-gray-600">
            {/* ACC */}
            <div className="flex flex-col items-center gap-1">
              <span>ACC</span>
              <span
                className={cn(
                  "h-3 w-3 rounded-full",
                  geo?.acc === "ON" ? "bg-green-500" : "bg-red-500"
                )}
              />
            </div>

            {/* RELAY */}
            <div className="flex flex-col items-center gap-1">
              <span>RELAY</span>
              <span
                className={cn(
                  "h-3 w-3 rounded-full",
                  geo?.fuel_line === "ON" ? "bg-green-500" : "bg-red-500"
                )}
              />
            </div>

            {/* CHARGING */}
            <div className="flex flex-col items-center gap-1">
              <span>CHARGING</span>
              <span
                className={cn(
                  "h-3 w-3 rounded-full",
                  geo?.charging === "ON" ? "bg-green-500" : "bg-red-500"
                )}
              />
            </div>

            {/* GSM */}
            <div className="flex flex-col items-center gap-1">
              <span>GSM</span>
              <SignalStrength
                value={(device.geo?.gsm_signal_strength ?? 0) as any}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== EXPANDED BODY (MOTION) ===== */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="bg-white p-4 space-y-4">
              {/* Driver */}
              <div className="flex flex-col items-center gap-2">
                <img
                  src={device.driver_photo || "/avatar.png"}
                  className="h-16 w-16 rounded-full"
                />
                <Phone className="text-gray-700" />
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <LabelValue
                  label="Vehicle Type"
                  value={getVehicleTypeLabel(device.vehicle_type)}
                />
                <LabelValue
                  label="Mileage"
                  value={`${device.congestion_consumption ?? 0} KM/LT`}
                />
                <LabelValue
                  label="Device Voltage Level"
                  value="VERY HIGH BATTERY"
                />
                <LabelValue
                  label="Number of Satellite"
                  value={`${geo?.number_of_satellite ?? 0} NOS`}
                />
                <LabelValue
                  label="Stop Duration"
                  value="169 HRS 4 MINS 5 SECS"
                  danger
                />
              </div>

              {/* Address */}
              <div className="text-sm">
                <p className="font-semibold">ADDRESS</p>

                {addressLoading ? (
                  <p className="text-gray-400">Fetching address…</p>
                ) : address ? (
                  <p className="text-gray-700">{address}</p>
                ) : (
                  <p className="text-gray-400">Address not available</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

/* ===== Helper ===== */
function LabelValue({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <>
      <p className="text-gray-600">{label}</p>
      <p className={cn("text-right", danger && "text-red-600 font-semibold")}>
        {value}
      </p>
    </>
  );
}
