"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { RefreshCw } from "lucide-react";

import { Device } from "@/types/device";
import {
  Location,
  DailyTravelReport,
  DailyReportRequest,
} from "@/types/report";
import { DeviceAPI, ReportAPI } from "@/lib/api";

import { DailyDateSelector } from "@/components/menu/DailyDateSelector";
import UserReportMenu from "@/components/menu/UserReportMenu";

import AnimatedMarkerMap from "@/components/map/AnimatedMarkerMap";
import BottomInfoBar from "@/components/map/BottomControlCard";
import { useMarkerPlayback } from "@/hooks/useMarkerPlayback";
import { haversineDistance } from "@/lib/utils";
import { DateRangeSelector } from "@/components/menu/DateRangeSelector";

function calculateTotalDistance(data: Location[], endIndex?: number) {
  let total = 0;
  const limit = endIndex ?? data.length - 1;

  for (let i = 1; i <= limit; i++) {
    const prev = data[i - 1];
    const curr = data[i];

    total += haversineDistance(
      prev.geo.lat,
      prev.geo.lng,
      curr.geo.lat,
      curr.geo.lng
    );
  }

  return total; // meters
}

export default function DailyTravelReportPage() {
  const { id } = useParams<{ id: string }>();

  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  const [dailyData, setDailyData] = useState<DailyTravelReport>({});

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 🎮 Playback state
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);

  const locations: Location[] = dailyData.data ?? [];
  const currentLocation = locations[currentIndex];

  /* ------------------ Fetch Device ------------------ */
  useEffect(() => {
    if (!id) return;

    DeviceAPI.getCurrentDevice(id)
      .then(setDevice)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  /* ------------------ Fetch Report ------------------ */
  useEffect(() => {
    if (!device) return;

    //     const payload: DailyReportRequest = {
    //       device_id: device.id,
    //       device_type: device.vehicle_type ?? 0,
    //       day: date.getDate(),
    //       month: date.getMonth(),
    //       year: date.getFullYear(),
    //     };

    //     setPending(true);
    //     setPlaying(false);
    //     setCurrentIndex(0);

    //     ReportAPI.daily_travel_report(payload)
    //       .then(setDailyData)
    //       .catch(console.error)
    //       .finally(() => setPending(false));
  }, [device, startDate, endDate]);

  /* ------------------ Marker Playback ------------------ */
  useMarkerPlayback({
    data: locations,
    playing,
    speed,
    index: currentIndex,
    setIndex: setCurrentIndex,
  });

  const totalDistance = useMemo(() => {
    if (!locations.length) return 0;
    return calculateTotalDistance(locations);
  }, [locations]);

  const currentDistance = useMemo(() => {
    if (!locations.length) return 0;
    return calculateTotalDistance(locations, currentIndex);
  }, [locations, currentIndex]);

  /* ------------------ Guards ------------------ */
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">Loading…</div>
    );

  if (!device)
    return (
      <div className="h-screen flex items-center justify-center">
        Device not found
      </div>
    );

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* 🔝 Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#16364d] px-3 text-white flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">
            Daily Report of{" "}
            <span className="text-sm">{device.registration_number}</span>
          </h1>
          <p className="text-xs opacity-80">
            Report On{" "}
            {/* {date.toLocaleString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })} */}
          </p>
        </div>

        <div className="flex gap-1">
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
          <UserReportMenu deviceId={device.id} />
        </div>
      </header>

      {/* 🗺️ Map */}
      <div className="absolute top-16 bottom-[72px] left-0 right-0">
        {pending ? (
          <div className="h-full flex items-center justify-center">
            <RefreshCw className="animate-spin" />
          </div>
        ) : (
          <AnimatedMarkerMap data={locations} index={currentIndex} />
        )}
      </div>

      {/* 🎛 Bottom Control */}
      <BottomInfoBar
        playing={playing}
        onPlayToggle={() => setPlaying((p) => !p)}
        speed={speed}
        onSpeedChange={setSpeed}
        progress={
          locations.length ? (currentIndex / (locations.length - 1)) * 100 : 0
        }
        speedValue={currentLocation?.geo.speed ?? 0}
        distance={totalDistance}
        time={currentLocation?.devicetime}
        onSeek={(percent) => {
          if (!locations.length) return;
          const idx = Math.floor((percent / 100) * locations.length);
          setCurrentIndex(idx);
        }}
        currentDistance={currentDistance}
      />
    </div>
  );
}
