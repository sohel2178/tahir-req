"use client";

import React, { useEffect, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  formatDuration,
  formatMonthlyDate,
  getFuelConsumption,
  getMonthlyDataInfo,
} from "@/lib/utils";
import DevicePopOver from "./DevicePopOver";
import DailyReportInfoCard from "../cards/DailyReportInfoCard";
import MonthlyItemComponent from "../motion/MonthlyItem";
import { RefreshCw } from "lucide-react";
import { Device } from "@/types/device";
import { MonthlyItem, MonthlyReportRequest } from "@/types/report";
import { ReportAPI } from "@/lib/api";

interface Props {
  device: Device;
}

interface MonthSelectorProps {
  date: Date;
  setDate: (date: Date) => void;
}

const Info = ({
  monthlyData,
  device,
}: {
  monthlyData: MonthlyItem[];
  device: Device;
}) => {
  const info = getMonthlyDataInfo(monthlyData);

  return (
    <div className="flex justify-between w-full">
      <DailyReportInfoCard
        title="Total Distance"
        value={(info.totalDistance / 1000).toFixed(2)}
        unit="km"
      />
      <DailyReportInfoCard
        title="Running Time"
        value={formatDuration(info.totalRunningTime)}
      />
      {device.mileage !== undefined && device.mileage > 0 && (
        <DailyReportInfoCard
          title="Fuel Consume"
          value={getFuelConsumption(
            info.totalDistance,
            device.mileage,
            device.congestion_consumption,
            info.totalCongestionTime,
          )}
          unit="Lit"
        />
      )}
    </div>
  );
};

const MonthSelector = ({ date, setDate }: MonthSelectorProps) => {
  const handleNextClick = () => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    setDate(d);
  };

  const handlePrevClick = () => {
    const d = new Date(date);
    d.setMonth(d.getMonth() - 1);
    setDate(d);
  };
  return (
    <div className="flex gap-3 items-center">
      <Button onClick={handlePrevClick} variant="outline">
        <ChevronLeft className="text-xl sm:text-2xl" />
      </Button>

      <span className="subtle-regular">{formatMonthlyDate(date)}</span>

      <Button onClick={handleNextClick} variant="outline">
        <ChevronRight className="text-xl sm:text-2xl" />
      </Button>
    </div>
  );
};

function MonthlyReport({ device }: Props) {
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState<MonthlyItem[]>([]);

  //   console.log(device, "device");

  // device.congestion_consumption

  const fetchMonthlyReport = async (data: MonthlyReportRequest) => {
    try {
      const res = await ReportAPI.monthly_report(data);
      setMonthlyData(res);
    } catch (err) {
      console.error("❌ Failed to fetch daily report", err);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      startTransition(() => {
        const data: MonthlyReportRequest = {
          device_id: device.id,
          device_type: device.vehicle_type ? device.vehicle_type : 0,
          month: date.getMonth(),
          year: date.getFullYear(),
        };

        fetchMonthlyReport(data);
      });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [device, date]);
  return (
    <div className="w-full flex flex-col p-4">
      <div className="w-full flex flex-col gap-4 sticky left-0 right-0">
        <Info device={device} monthlyData={monthlyData} />

        <div className="flex justify-between gap-2 items-center">
          <MonthSelector date={date} setDate={setDate} />
          <DevicePopOver />
        </div>

        <div className="w-full mt-4">
          {isPending ? (
            <div className="flex justify-center">
              <RefreshCw className="mt-10 size-16 animate-spin" />
            </div>
          ) : (
            <div className="flex w-full flex-wrap gap-4 xl:gap-8 overflow-y-auto max-h-[70vh]">
              {monthlyData.map((x) => (
                <MonthlyItemComponent
                  key={x._id.day}
                  item={x}
                  device={device}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MonthlyReport;
