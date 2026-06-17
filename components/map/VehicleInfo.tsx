import { RedisGeo } from "@/types/device";
import { useEffect, useState } from "react";
import InfoRow from "./InfoRow";
import { formatLocalTime } from "@/lib/utils";
import { isRunningByGeo, getStopDurationByGeo } from "@/lib/stopDuration";
import { formatStopDuration } from "@/lib/stopDuration";
import { SignalStrength } from "../users/SignalStrength";
import { reverseGeocode } from "@/lib/reverseGeocode";

export default function VehicleInfo({ geo }: { geo: RedisGeo }) {
  const running = isRunningByGeo(geo);
  const [h, m, s] = getStopDurationByGeo(geo);

  const [address, setAddress] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!open) return;
      if (!geo?.lat || !geo?.lng) return;

      setAddressLoading(true);

      reverseGeocode(geo.lat, geo.lng).then((res) => {
        setAddress(res);
        setAddressLoading(false);
      });

      console.log("Fetching address...");
    }, 5000);

    return () => clearTimeout(delayDebounce);
  }, [open, geo?.lat, geo?.lng]);

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-lg border-b pb-2">
        Vehicle Information
      </h2>

      <InfoRow
        label="Ignition"
        value={geo?.acc === "ON" ? "ON" : "OFF"}
        success={geo?.acc === "ON"}
      />
      <InfoRow
        label="Charging"
        value={geo?.charging === "ON" ? "ON" : "OFF"}
        success={geo?.charging === "ON"}
      />
      <InfoRow
        label="Relay"
        value={geo?.fuel_line === "ON" ? "ON" : "OFF"}
        success={geo?.fuel_line === "ON"}
      />

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">GSM Signal Strength</span>
        <SignalStrength
          value={(geo?.gsm_signal_strength ?? 0) as any}
          size="sm"
        />
      </div>

      <InfoRow
        label="Battery Voltage"
        value={`${geo?.external_voltage ?? "0.00"} Volt`}
      />

      <InfoRow label="Voltage Level" value={geo?.voltage_level ?? "Unknown"} />

      <InfoRow
        label="Number of Satellite"
        value={`${geo?.number_of_satellite ?? "0"} Nos`}
      />
      <InfoRow label="Updates" value={formatLocalTime(geo?.update_time)} />

      <InfoRow
        label="Stop Duration"
        value={running ? "Running" : formatStopDuration(h, m, s)}
        success={running}
      />

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

      {/* <div className="text-sm">
        <p className="font-semibold">ADDRESS</p>

        {addressLoading ? (
          <p className="text-gray-400">Fetching address…</p>
        ) : address ? (
          <p className="text-gray-700">{address}</p>
        ) : (
          <p className="text-gray-400">Address not available</p>
        )}
      </div> */}
    </div>
  );
}
