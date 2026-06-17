"use client";
import React from "react";
import ExpandCollapseWrapper from "../cards/ExpandCollapseWrapper";
import { motion } from "framer-motion";
import { ampmFormat, getOrdinalSuffix } from "@/lib/utils";
import { Hourly } from "@/types/report";

interface Props {
  hourly: Hourly[];
}

const HourlyItem = ({ hourly }: { hourly: Hourly }) => {
  return (
    <div className="w-full border justify-between items-center flex p-2 subtle-regular rounded-md">
      <div className="flex w-[50px] justify-start">
        <span>{getOrdinalSuffix(hourly._id + 1)}</span>
      </div>
      <div className="flex flex-1 justify-end ">
        <span>{ampmFormat(hourly.start)}</span>
      </div>
      <div className="flex flex-1 justify-end">
        <span>{ampmFormat(hourly.end)}</span>
      </div>
      <div className="flex flex-1 justify-end">
        <span>{hourly.distance}</span>
      </div>
    </div>
  );
};

function HourlyReport({ hourly }: Props) {
  return (
    <ExpandCollapseWrapper title="Hourly Report">
      <motion.div
        className="w-full flex flex-col gap-1"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        layout
      >
        <div className="w-full justify-between items-center flex p-2 subtle-regular">
          <div className="flex w-[50px] justify-start">
            <span>Hours</span>
          </div>
          <div className="flex flex-1 justify-end">
            <span>Start</span>
          </div>
          <div className="flex flex-1 justify-end">
            <span>End</span>
          </div>
          <div className="flex flex-1 justify-end">
            <span>Distance(Km)</span>
          </div>
        </div>

        {hourly.map((hourly, index) => (
          <HourlyItem key={index} hourly={hourly} />
        ))}
      </motion.div>
    </ExpandCollapseWrapper>
  );
}

export default HourlyReport;
