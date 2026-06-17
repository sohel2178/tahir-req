"use client";

import React, { useEffect, useState, useTransition } from "react";
import DevicePopOver from "./DevicePopOver";
import DailyReportDate from "./DailyReportDate";
import FrequencyChart from "../chart/FrequencyChart";
import TimeLineChart from "../chart/TimeLineChart";
import DailyReportInfoCard from "../cards/DailyReportInfoCard";
import { RefreshCw } from "lucide-react";
import { DailyReportRequest, DailySpeedReport } from "@/types/report";
import { Device } from "@/types/device";
import { ReportAPI } from "@/lib/api";

const Info = ({ speedReport }: { speedReport: DailySpeedReport }) => {
  return (
    <div className="flex  w-full justify-between">
      <DailyReportInfoCard
        title="Max Speed"
        value={speedReport?.info?.max || 0}
        unit="Km/hr"
      />

      <DailyReportInfoCard
        title="Avg Speed"
        value={speedReport?.info?.avg || 0}
        unit="Km/hr"
      />

      <DailyReportInfoCard
        title="Min Speed"
        value={speedReport?.info?.min || 0}
        unit="Km/hr"
      />
    </div>
  );
};

function SpeedReport({ device }: { device: Device }) {
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState(new Date());

  const [speedReport, setSpeedReport] = useState<DailySpeedReport>({});

  const fetchSpeedReport = async (data: DailyReportRequest) => {
    try {
      const res = await ReportAPI.daily_speed_report(data);
      setSpeedReport(res);
    } catch (err) {
      console.error("❌ Failed to fetch daily report", err);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      startTransition(() => {
        const data: DailyReportRequest = {
          device_id: device.id,
          device_type: device.vehicle_type ? device.vehicle_type : 0,
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
        };

        fetchSpeedReport(data);
      });
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [device, date]);
  return (
    <div className="w-full flex flex-col  p-4">
      <div className="w-full flex flex-col gap-4 sticky left-0 right-0 pb-4 z-10">
        <Info speedReport={speedReport} />
        <div className="flex justify-between gap-2 items-center">
          <DevicePopOver />
          <DailyReportDate date={date} setDate={setDate} />
        </div>
      </div>

      <div className="w-full mt-4">
        {isPending ? (
          <div className="flex justify-center">
            <RefreshCw className="mt-10 size-16 animate-spin" />
          </div>
        ) : (
          <div className="w-full gap-4 flex flex-col z-0 lg:flex-row lg:justify-between">
            <FrequencyChart data={speedReport?.frequency || []} />
            <TimeLineChart data={speedReport?.data || []} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SpeedReport;
