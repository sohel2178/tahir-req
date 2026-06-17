"use client";
import React, { useEffect, useState, useTransition } from "react";
import DevicePopOver from "./DevicePopOver";
import RangeDateTimePicker from "@/components/motion/RangeDateTimePicker";
import { Device } from "@/types/device";
import { RangeReportRequest, RangeTravelResponse } from "@/types/report";
import { ReportAPI } from "@/lib/api";
import MapPlayer from "@/components/map/MapPlayer";
import toast from "react-hot-toast"; // 👈 optional, if you already use it

function RangeTravelReport({ device }: { device: Device }) {
  const [isPending, startTransition] = useTransition();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [rangeData, setRangeData] = useState<RangeTravelResponse>({});

  const fetchRangeTravelReport = async (data: RangeReportRequest) => {
    // console.log("Fetching range travel report with data:", data);
    try {
      const res = await ReportAPI.range_travel_report(data);
      setRangeData(res);
      console.log("✅ Fetched range travel report", res);
    } catch (err) {
      console.error("❌ Failed to fetch range travel report", err);
      toast.error("Failed to fetch report 😢");
    }
  };

  const validateDates = (): boolean => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end date!");
      return false;
    }

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = diffMs / (1000 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffMins < 5) {
      toast.error("Time range must be at least 5 minutes ⏱️");
      return false;
    }

    if (diffDays > 10) {
      toast.error("Time range cannot exceed 10 days 📅");
      return false;
    }

    if (diffMs < 0) {
      toast.error("End time must be after start time 🙃");
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!startDate || !endDate) return;

    const delayDebounce = setTimeout(() => {
      setRangeData({});
      startTransition(() => {
        if (!validateDates()) return;

        const data: RangeReportRequest = {
          device_id: device.id,
          device_type: device.vehicle_type ? device.vehicle_type : 0,
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString(),
        };

        fetchRangeTravelReport(data);
      });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [device, startDate, endDate]);

  return (
    <div className="w-full h-full relative">
      {/* Map Section */}
      {rangeData.data && rangeData.data.length > 0 && (
        <MapPlayer data={rangeData.data} />
      )}

      {/* Device Selector */}
      <div className="absolute top-5 left-5">
        <DevicePopOver />
      </div>

      {/* Date Range Picker */}
      <div className="absolute top-5 right-5">
        <RangeDateTimePicker
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </div>

      {/* Distance Display */}
      <div className="absolute top-5 -translate-x-1/2 flex items-center bg-white/90 backdrop-blur-md px-3 py-2 rounded-md gap-4 shadow-lg left-1/2">
        <p className="text-base font-semibold text-gray-900">
          {rangeData.distance ? (rangeData.distance / 1000).toFixed(2) : "0.00"}{" "}
          KM
        </p>
      </div>
    </div>
  );
}

export default RangeTravelReport;
