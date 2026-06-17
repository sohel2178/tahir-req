import { ampmFormat, formatDuration, getOrdinalSuffix } from "@/lib/utils";
import { Hourly, Trip } from "@/types/report";
import { Clock, Route } from "lucide-react";

export const TripItem = ({ trip }: { trip: Trip }) => {
  const isOn = trip.status === "ON";

  return (
    <div className="w-full flex items-center gap-3 px-3 py-2 border-b bg-white">
      {/* Status indicator */}
      <div className="flex flex-col items-center justify-center w-10">
        <div
          className={`w-3 h-3 rounded-full ${
            isOn ? "bg-green-500" : "bg-gray-400"
          }`}
        />
        <span className="text-[9px] mt-1 uppercase font-semibold text-gray-600">
          {trip.status}
        </span>
      </div>

      {/* Time info */}
      <div className="flex flex-col text-xs text-gray-700 min-w-[90px]">
        <span className="font-medium">{ampmFormat(trip.start)}</span>
        <span className="opacity-70">{ampmFormat(trip.end)}</span>
      </div>

      {/* Duration */}
      <div className="flex-1 text-xs text-gray-800 font-semibold">
        {formatDuration(trip.duration)}
      </div>

      {/* Distance */}
      <div className="flex items-center gap-1 text-xs font-semibold text-[#16364d]">
        <Route size={14} />
        <span>{trip.distance} km</span>
      </div>
    </div>
  );
};

export const HourlyItem = ({ hourly }: { hourly: Hourly }) => {
  return (
    <div className="w-full flex items-center gap-3 px-3 py-2 border-b justify-between bg-white">
      {/* Hour index */}
      <div className="w-10 flex flex-col items-center justify-center">
        <span className="text-xs font-semibold text-[#16364d]">
          {getOrdinalSuffix(hourly._id + 1)}
        </span>
        <span className="text-[9px] uppercase text-gray-500">Hour</span>
      </div>

      {/* Time range */}
      <div className="flex items-center gap-2 min-w-[120px] text-xs text-gray-700">
        <Clock size={14} className="opacity-70" />
        <div className="flex flex-col leading-tight">
          <span className="font-medium">{ampmFormat(hourly.start)}</span>
          <span className="opacity-70">{ampmFormat(hourly.end)}</span>
        </div>
      </div>

      {/* Spacer */}
      {/* <div className="flex-1" /> */}

      {/* Distance */}
      <div className="flex items-center gap-1 text-xs font-semibold text-[#16364d]">
        <Route size={14} />
        <span>{hourly.distance} km</span>
      </div>
    </div>
  );
};
