"use client";
import React, { useEffect, useState, useTransition } from "react";
import DevicePopOver from "./DevicePopOver";
import DailyReportDate from "./DailyReportDate";
import { Device } from "@/types/device";
import { DailyReportRequest, DailyTravelReport } from "@/types/report";
import { ReportAPI } from "@/lib/api";
import MapPlayer from "../map/MapPlayer";

function DaillyTravelReport({ device }: { device: Device }) {
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState(new Date());
  const [dailyData, setDailyData] = useState<DailyTravelReport>({});

  const fetchDailyTravelReport = async (data: DailyReportRequest) => {
    try {
      const res = await ReportAPI.daily_travel_report(data);
      setDailyData(res);

      console.log("✅ Fetched daily report", res);
    } catch (err) {
      console.error("❌ Failed to fetch daily report", err);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDailyData({});
      startTransition(() => {
        const data: DailyReportRequest = {
          device_id: device.id,
          device_type: device.vehicle_type ? device.vehicle_type : 0,
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
        };

        fetchDailyTravelReport(data);
      });
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [device, date]);

  return (
    // <div className="w-full h-full">
    //   {dailyData.data && dailyData.data.length > 0 && (
    //     <MapPlayer data={dailyData.data} />
    //   )}
    // </div>

    <div className="w-full h-full relative">
      {dailyData.data && dailyData.data.length > 0 && (
        <MapPlayer data={dailyData.data} />
      )}

      <div className="absolute top-5 left-5">
        <DevicePopOver />
      </div>

      <div className="absolute top-5 right-5">
        <DailyReportDate date={date} setDate={setDate} />
      </div>

      <div className="absolute top-5 -translate-x-1/2 flex items-center bg-white/90 backdrop-blur-md px-3 py-2 rounded-md gap-4 shadow-lg left-1/2">
        <p className="text-base font-semibold text-gray-900">
          {dailyData.distance ? (dailyData.distance / 1000).toFixed(2) : "0.00"}{" "}
          KM
        </p>
      </div>
    </div>
  );
}

export default DaillyTravelReport;
