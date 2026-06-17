"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Device } from "@/types/device";
import { DeviceAPI, ReportAPI } from "@/lib/api";
import { DailyReport, DailyReportRequest, Hourly, Trip } from "@/types/report";

import { RefreshCw, Waypoints, ClockArrowUp, Fuel } from "lucide-react";
import { formatDuration, getFuelConsumption } from "@/lib/utils";
import UserReportMenu from "@/components/menu/UserReportMenu";
import { MonthlyBottomBottomNav } from "@/components/nav/MonthlyBottomNav";
import { DailyDateSelector } from "@/components/menu/DailyDateSelector";
import { HourlyItem, TripItem } from "@/components/report/ReportComponent";
import { HourlyDistanceChart } from "@/components/chart/ReportChart";

const TripReport = ({ trip_report }: { trip_report: Trip[] }) => {
  return (
    <div className="flex flex-col gap-1 w-full h-full rounded-md shadow-md p-2 bg-white text-gray-800 items-center">
      <h2 className="text-lg font-semibold">Trip report</h2>
      <div className="w-full h-[2px] bg-[#16364d]"></div>

      <div className="flex w-full flex-1 flex-col space-y-1  overflow-y-auto">
        {trip_report?.map((x, index) => (
          <TripItem key={index} trip={x} />
        ))}
      </div>
    </div>
  );
};

const HourlyReport = ({ hourly_report }: { hourly_report: Hourly[] }) => {
  return (
    <div className="flex flex-col gap-1 w-full h-full rounded-md shadow-md p-2 bg-white text-gray-800 items-center">
      <h2 className="text-lg font-semibold">Hourly report</h2>
      <div className="w-full h-[2px] bg-[#16364d]"></div>

      <div className="flex w-full flex-1 flex-col space-y-1  overflow-y-auto">
        {hourly_report?.map((x, index) => (
          <HourlyItem key={index} hourly={x} />
        ))}
      </div>
    </div>
  );
};

const ChartReport = ({ hourly_report }: { hourly_report: Hourly[] }) => {
  const chartData =
    hourly_report?.map((h) => ({
      hour: `${h._id + 1}`,
      distance: Number(h.distance),
    })) ?? [];
  return (
    <div className="flex flex-col gap-1 w-full h-full rounded-md shadow-md p-2 bg-white text-gray-800 items-center">
      <h2 className="text-lg font-semibold">Hourly Distance Chart</h2>
      <div className="w-full h-[2px] bg-[#16364d]"></div>

      <div className="flex w-full flex-1 flex-col space-y-1  overflow-y-auto">
        <HourlyDistanceChart data={chartData} />
      </div>
    </div>
  );
};

const Info = ({
  dailyData,
  device,
}: {
  dailyData: DailyReport;
  device: Device;
}) => {
  return (
    <div className="flex justify-between mt-3">
      <div className="flex flex-col gap-2 w-18 h-18 rounded-md shadow-md p-2 bg-white text-gray-800 items-center justify-center">
        <Waypoints className="text-[#16364d] opacity-80" size={18} />
        <p className="text-[10px] uppercase font-semibold leading-tight">
          {dailyData?.total_distance} KM
        </p>
      </div>

      <div className="flex flex-col gap-2 w-18 h-18 rounded-md shadow-md p-2 bg-white text-gray-800 items-center justify-center">
        <ClockArrowUp className="text-[#16364d] opacity-80" size={18} />
        <p className="text-[7px] uppercase font-semibold leading-tight">
          {dailyData?.running_time
            ? formatDuration(dailyData.running_time)
            : "O min"}
        </p>
      </div>

      <div className="flex flex-col gap-2 w-18 h-18 rounded-md shadow-md p-2 bg-white text-gray-800 items-center justify-center">
        <Fuel className="text-[#16364d] opacity-80" size={18} />
        <p className="text-[10px] uppercase font-semibold leading-tight">
          {getFuelConsumption(
            dailyData.total_distance ? dailyData.total_distance * 1000 : 0,
            device.mileage ? device.mileage : 8,
            device.congestion_consumption,
            dailyData.congestion_time
          )}{" "}
          Lit
        </p>
      </div>
    </div>
  );
};

export default function DailyReportPage() {
  const { id } = useParams<{ id: string }>();

  const [device, setDevice] = useState<Device | null>(null);

  const [loading, setLoading] = useState(true);

  const [isPending, setPending] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [date, setDate] = useState(new Date());
  const [dailyData, setDailyData] = useState<DailyReport>({});

  const fetchDailyReport = async (data: DailyReportRequest) => {
    try {
      const res = await ReportAPI.daily_report(data);
      setDailyData(res);
      setPending(false);
    } catch (err) {
      console.error("❌ Failed to fetch daily report", err);
      setPending(false);
    }
  };

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

  useEffect(() => {
    if (!device) return;
    const delayDebounce = setTimeout(() => {
      const data: DailyReportRequest = {
        device_id: device.id,
        device_type: device.vehicle_type ? device.vehicle_type : 0,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
      };

      fetchDailyReport(data);

      setPending(true);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [device, date]);

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

  return (
    <div className="h-screen w-screen ">
      <header className="fixed top-0 left-0 right-0 z-50 h-64 bg-[#16364d] p-2 flex flex-col text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">
              Daily Report of{" "}
              <span className="text-sm">{device.registration_number}</span>
            </h1>
            <p className="text-xs opacity-80">
              Report On{" "}
              {date.toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex gap-1">
            <DailyDateSelector date={date} setDate={setDate} />
            <UserReportMenu deviceId={device.id} />
          </div>
        </div>

        <Info device={device} dailyData={dailyData} />
      </header>

      <div className="absolute left-0 right-0 bottom-0 top-36  flex flex-col z-60">
        <MonthlyBottomBottomNav
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />

        {isPending ? (
          <div className="absolute left-0 right-0 bottom-16 top-0  p-2 flex items-center justify-center">
            <RefreshCw className="animate-spin mr-2" />
          </div>
        ) : (
          <div className="absolute left-0 right-0 bottom-16 top-0  p-2">
            {activeIndex === 0 &&
              dailyData.trip_report &&
              dailyData.trip_report.length > 0 && (
                <TripReport trip_report={dailyData.trip_report} />
              )}

            {activeIndex === 1 &&
              dailyData.hourly_report &&
              dailyData.hourly_report.length > 0 && (
                <HourlyReport hourly_report={dailyData.hourly_report} />
              )}

            {activeIndex === 2 &&
              dailyData.hourly_report &&
              dailyData.hourly_report.length > 0 && (
                <ChartReport hourly_report={dailyData.hourly_report} />
              )}
          </div>
        )}
      </div>
    </div>
  );
}
