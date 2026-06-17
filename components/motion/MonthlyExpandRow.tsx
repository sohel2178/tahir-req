"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MonthlyItem } from "@/types/report";
import InfoRow from "../map/InfoRow";
import dateformat from "dateformat";
import { formatDuration, getFuelConsumption } from "@/lib/utils";

export default function ExpandRow({
  item,
  mileage,
  congestion_consumption,
}: {
  item: MonthlyItem;
  mileage: number;
  congestion_consumption: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md flex justify-between items-center">
        <div className="w-14 h-14 flex justify-center items-center text-white bg-[#16364d]">
          <p>{item._id.day}</p>
        </div>

        <div className="flex items-center mr-2 gap-2">
          <h2 className="text-md text-gray-900 font-medium uppercase">
            {(item.distance / 1000).toFixed(2)} km
          </h2>

          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setOpen((v) => !v)}
            className="cursor-pointer"
          >
            <ChevronDown className="text-gray-500" size={24} />
          </motion.span>
        </div>
      </div>

      {/* Expandable Content */}
      <motion.div
        layout
        initial={false}
        animate={{
          opacity: open ? 1 : 0,
          y: open ? 0 : -8,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`${
          open ? "block" : "hidden"
        } py-4 px-2 flex flex-col space-y-2 `}
      >
        <InfoRow
          label="Start Time"
          value={
            item.start_time
              ? dateformat(item.start_time, "hh:MM TT")
              : "Undefined"
          }
        />

        <InfoRow
          label="End Time"
          value={
            item.end_time ? dateformat(item.end_time, "hh:MM TT") : "Undefined"
          }
        />
        <InfoRow
          label="Idle Time"
          value={item.idle_time ? formatDuration(item.idle_time) : "0 min"}
        />
        <InfoRow
          label="Running Time"
          value={item.duration ? formatDuration(item.duration) : "0 min"}
        />
        <InfoRow
          label="Jam Time"
          value={
            item.congestion_time
              ? formatDuration(item.congestion_time)
              : "0 min"
          }
        />
        <InfoRow
          label="Fuel Required"
          value={
            getFuelConsumption(
              item.distance,
              mileage,
              congestion_consumption,
              item.congestion_time
            ) + " lit"
          }
        />
      </motion.div>
    </div>
  );
}
