"use client";

import { useEffect, useState, useRef } from "react";
import { InfoWindow } from "@react-google-maps/api";
import { Device, RedisGeo } from "@/types/device";
import { reverseGeocode } from "@/lib/reverseGeocode";

import { formatDateTime, getStopDuration } from "@/lib/utils";

type Props = {
  position: google.maps.LatLngLiteral;
  device: Device;
  geo: RedisGeo;
  onClose: () => void;
};

export default function VehicleInfoWindow({
  position,
  device,
  geo,
  onClose,
}: Props) {
  const [address, setAddress] = useState<string>("Loading address...");
  const lastFetchRef = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();

    // 🧠 debounce 20 seconds
    if (now - lastFetchRef.current < 20000) return;

    lastFetchRef.current = now;

    const fetchAddress = async () => {
      try {
        const addr = await reverseGeocode(Number(geo.lat), Number(geo.lng));
        setAddress(addr || "Address not found");
      } catch (err) {
        setAddress("Address not found");
      }
    };

    fetchAddress();
  }, [geo.lat, geo.lng]);

  return (
    <InfoWindow position={position} onCloseClick={onClose}>
      <div className="w-[350px] rounded-xl shadow-lg bg-white p-3 text-sm">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="font-semibold text-base">
              🚗 {device.registration_number}
            </div>
            <div className="text-xs font-semibold uppercase">
              Imei: {device.id}
            </div>

            <div className="text-xs font-semibold uppercase">
              Number: {device.device_sim_number}
            </div>

            <div className="text-xs text-black uppercase">
              Stopped: {getStopDuration(geo)}
            </div>
            <div className="text-xs text-gray-800">
              {formatDateTime(geo.devicetime)}
            </div>
          </div>

          <div
            className={`text-xs px-2 py-1 rounded-full ${
              geo.acc === "ON"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {geo.acc === "ON" ? "Running" : "Stopped"}
          </div>
        </div>

        {/* ADDRESS */}
        <div className="text-[12px] text-gray-500 mb-3 flex gap-1 leading-snug">
          <span>📍</span>
          <span className="line-clamp-2">{address}</span>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
          <Stat label="⚡ Charging" value={geo.charging} isStatus />
          <Stat label="🔌 Relay" value={geo.fuel_line} isStatus />

          <Stat label="🏎 Speed" value={`${geo.speed || 0} km/h`} />
          <Stat label="🛰 Satellites" value={geo.number_of_satellite || "0"} />

          <Stat label="🔋 Ext Volt" value={`${geo.external_voltage} V`} />
          <Stat label="📱 Dev Volt" value={geo.voltage_level || "undefined"} />

          <Stat label="📶 GSM" value={geo.gsm_signal_strength || "0"} />
          <Stat
            label="🛣 Mileage"
            value={`${(Number(geo.milage ?? 0) / 1000).toFixed(0)} KM`}
          />
        </div>
      </div>
    </InfoWindow>
  );
}

/* 🧩 Small UI Helpers */

function Status({ label, value }: any) {
  const isOn = value === "ON";

  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={isOn ? "text-green-600" : "text-red-500"}>
        {value || "OFF"}
      </span>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Stat({ label, value, isStatus = false }: any) {
  const isOn = value === "ON";

  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}</span>

      {isStatus ? (
        <span
          className={`font-semibold ${
            isOn ? "text-green-600" : "text-red-500"
          }`}
        >
          {value}
        </span>
      ) : (
        <span className="font-medium text-gray-800">{value}</span>
      )}
    </div>
  );
}
