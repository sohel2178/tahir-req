"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Device } from "@/types/device";
import { DeviceAPI, ReportAPI } from "@/lib/api";
import { MonthlyItem, MonthlyReportRequest } from "@/types/report";

import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import MonthlyExpandRow from "@/components/motion/MonthlyExpandRow";
import { getFuelConsumption, getMonthlyDataInfo } from "@/lib/utils";
import UserReportMenu from "@/components/menu/UserReportMenu";
import MonthlyDownloadMenu from "@/components/menu/MonthlyDownloadMenu";
import { generateMonthlyPdf } from "@/lib/pdf";
import { generateMonthlyExcel } from "@/lib/excel";

const Info = ({
  monthlyData,
  device,
}: {
  monthlyData: MonthlyItem[];
  device: Device;
}) => {
  const info = getMonthlyDataInfo(monthlyData);

  if (!device.mileage || !device.congestion_consumption) {
    return (
      <div className="h-screen flex items-center justify-center">
        Device Milage Not found
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mt-4 bg-white px-4 py-1 rounded-md">
      <div className="flex flex-col gap-1">
        <h2 className="text-md text-gray-900 font-semibold uppercase">
          Total Distance
        </h2>
        <h2 className="text-md text-gray-900 font-medium uppercase">
          {(info.totalDistance / 1000).toFixed(2)} km
        </h2>
      </div>

      <div className="flex flex-col gap-1 items-end">
        <h2 className="text-md text-gray-900 font-semibold uppercase">Fuel</h2>
        <h2 className="text-md text-gray-900 font-medium uppercase">
          {getFuelConsumption(
            info.totalDistance,
            device.mileage,
            device.congestion_consumption,
            info.totalCongestionTime
          )}{" "}
          Lit
        </h2>
      </div>
    </div>
  );
};

export default function MonthlyReportPage() {
  const { id } = useParams<{ id: string }>();

  const [device, setDevice] = useState<Device | null>(null);

  const [loading, setLoading] = useState(true);

  const [isPending, setPending] = useState(false);
  const [date, setDate] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState<MonthlyItem[]>([]);

  const fetchMonthlyReport = async (data: MonthlyReportRequest) => {
    try {
      const res = await ReportAPI.monthly_report(data);
      setMonthlyData(res);

      setPending(false);
    } catch (err) {
      console.error("❌ Failed to fetch daily report", err);
      setPending(false);
    }
  };

  useEffect(() => {
    if (!device) return;
    const delayDebounce = setTimeout(() => {
      const data: MonthlyReportRequest = {
        device_id: device.id,
        device_type: device.vehicle_type ? device.vehicle_type : 0,
        month: date.getMonth(),
        year: date.getFullYear(),
      };

      setPending(true);

      fetchMonthlyReport(data);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [device, date]);

  useEffect(() => {
    if (!id) return;

    const fetchDevice = async () => {
      try {
        const data = await DeviceAPI.getCurrentDevice(id);
        setDevice(data);
      } catch (err) {
        console.error("❌ Failed to fetch device", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">Loading…</div>
    );
  }

  if (!device) {
    return (
      <div className="h-screen flex items-center justify-center">
        Device not found
      </div>
    );
  }

  const nextClick = () => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    setDate(d);
  };

  const prevClick = () => {
    const d = new Date(date);
    d.setMonth(d.getMonth() - 1);
    setDate(d);
  };

  const downloadExcel = () => {
    // Implementation for downloading Excel
    generateMonthlyExcel(
      device,
      monthlyData,
      date.toLocaleString("en-US", { month: "long", year: "numeric" })
    );
  };

  const downloadPdf = () => {
    // Implementation for downloading PDF

    generateMonthlyPdf(
      device,
      monthlyData,
      date.toLocaleString("en-US", { month: "long", year: "numeric" })
    );
  };

  return (
    <div className="h-screen w-screen ">
      <header className="fixed top-0 left-0 right-0 z-50 h-48 bg-[#16364d] p-2 flex flex-col text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">
              Monthly Report of{" "}
              <span className="text-sm">{device.registration_number}</span>
            </h1>
            <p className="text-xs opacity-80">
              Report On{" "}
              {date.toLocaleString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex gap-1">
            <MonthlyDownloadMenu
              downloadExcel={downloadExcel}
              downloadPdf={downloadPdf}
            />
            <UserReportMenu deviceId={device.id} />
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <button
            className="bg-white text-[#16364d] px-4 py-2 rounded-md text-sm font-medium"
            onClick={prevClick}
          >
            <ChevronLeft className="inline-block mr-2 text-lg" />
          </button>

          <button className="bg-white text-[#16364d] px-4 py-2 rounded-md text-sm font-medium flex-1">
            {date.toLocaleString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </button>
          <button
            className="bg-white text-[#16364d] px-4 py-2 rounded-md text-sm font-medium"
            onClick={nextClick}
          >
            <ChevronRight className="inline-block mr-2 text-lg" />
          </button>
        </div>

        <Info device={device} monthlyData={monthlyData} />
      </header>

      <div className="absolute left-0 right-0 bottom-0 top-48  flex flex-col space-y-2 p-1 overflow-y-auto">
        {isPending ? (
          <div className="flex w-full justify-center mt-4">
            <RefreshCw className="animate-spin mr-2" />
          </div>
        ) : monthlyData.length === 0 ? (
          <p>No data available for this month.</p>
        ) : (
          monthlyData.map(
            (item) =>
              device &&
              device.mileage &&
              device.congestion_consumption && (
                <MonthlyExpandRow
                  key={item._id.day}
                  item={item}
                  mileage={device.mileage}
                  congestion_consumption={device.congestion_consumption}
                />
              )
          )
        )}
      </div>
    </div>
  );
}
