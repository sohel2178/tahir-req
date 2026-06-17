"use client";
import React, { useEffect, useState, useTransition } from "react";
import DevicePopOver from "./DevicePopOver";
import DailyReportDate from "./DailyReportDate";
import { formatDuration, getFuelConsumption } from "@/lib/utils";
import DailyReportInfoCard from "../cards/DailyReportInfoCard";
import { RefreshCw } from "lucide-react";
import TripLineReport from "../motion/TripLineReport";
import TripReport from "../motion/TripReport";
import HourlyReport from "../motion/HourlyReport";
import { Device } from "@/types/device";
import { DailyReport, DailyReportRequest } from "@/types/report";
import { ReportAPI } from "@/lib/api";

const Info = ({
  dailyData,
  device,
}: {
  dailyData: DailyReport;
  device: Device;
}) => {
  return (
    <div className="flex  w-full justify-between">
      <DailyReportInfoCard
        title="Total Distance"
        value={dailyData?.total_distance || 0}
        unit="Km"
      />

      <DailyReportInfoCard
        title="Running Time"
        value={
          dailyData?.running_time
            ? formatDuration(dailyData.running_time)
            : "O min"
        }
      />

      {device.mileage !== undefined && device.mileage > 0 && (
        <DailyReportInfoCard
          title="Fuel Consume"
          value={getFuelConsumption(
            dailyData.total_distance ? dailyData.total_distance * 1000 : 0,
            device.mileage,
            device.congestion_consumption,
            dailyData.congestion_time,
          )}
          unit="Lit"
        />
      )}
    </div>
  );
};

function DaillyReport({ device }: { device: Device }) {
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState(new Date());
  const [dailyData, setDailyData] = useState<DailyReport>({});

  const fetchDailyReport = async (data: DailyReportRequest) => {
    try {
      const res = await ReportAPI.daily_report(data);
      setDailyData(res);
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

        fetchDailyReport(data);
      });
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [device, date]);

  return (
    <div className="w-full flex flex-col  p-4">
      <div className="w-full flex flex-col gap-4 sticky top-20 left-0 right-0 background-light900_dark200 pb-4">
        <Info dailyData={dailyData} device={device} />
        <div className="flex justify-between gap-2 items-center">
          <DevicePopOver />
          <DailyReportDate date={date} setDate={setDate} />
        </div>

        <div className="w-full mt-4">
          {isPending ? (
            <div className="flex justify-center">
              <RefreshCw className="mt-10 size-16 animate-spin" />
            </div>
          ) : (
            <div className="w-full flex flex-col gap-8 ">
              {dailyData?.trip_report && (
                <TripLineReport trips={dailyData?.trip_report} />
              )}
              <div className="w-full flex flex-col gap-8 lg:flex-row lg:justify-between">
                <div className="w-full">
                  {dailyData?.trip_report && (
                    <TripReport trips={dailyData?.trip_report} />
                  )}
                </div>
                <div className="w-full">
                  {dailyData?.hourly_report && (
                    <HourlyReport hourly={dailyData.hourly_report} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DaillyReport;
