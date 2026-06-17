"use client";
import React from "react";
import ExpandCollapseWrapper from "../cards/ExpandCollapseWrapper";
import { motion } from "framer-motion";
import { ampmFormat, formatDuration } from "@/lib/utils";
import { Trip } from "@/types/report";

interface Props {
  trips: Trip[];
}

const TripItem = ({ trip }: { trip: Trip }) => {
  return (
    <div className="w-full border justify-between items-center flex p-2 subtle-regular rounded-md">
      <div className="flex w-[50px] justify-start">
        <span>{trip.status}</span>
      </div>
      <div className="flex flex-1 justify-end ">
        <span>{ampmFormat(trip.start)}</span>
      </div>
      <div className="flex flex-1 justify-end">
        <span>{ampmFormat(trip.end)}</span>
      </div>
      <div className="flex flex-1 justify-end">
        <span>{formatDuration(trip.duration)}</span>
      </div>
      <div className="flex flex-1 justify-end">
        <span>{trip.distance}</span>
      </div>
    </div>
  );
};

function TripReport({ trips }: Props) {
  return (
    <ExpandCollapseWrapper title="Trip Report">
      <motion.div
        className="w-full flex flex-col gap-1"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        layout
      >
        <div className="w-full justify-between items-center flex p-2 subtle-regular">
          <div className="flex w-[50px] justify-start">
            <span>Status</span>
          </div>
          <div className="flex flex-1 justify-end">
            <span>Start</span>
          </div>
          <div className="flex flex-1 justify-end">
            <span>End</span>
          </div>
          <div className="flex flex-1 justify-end">
            <span>Duration</span>
          </div>
          <div className="flex flex-1 justify-end">
            <span>Distance(Km)</span>
          </div>
        </div>
        {trips.map((trip, index) => (
          <TripItem key={index} trip={trip} />
        ))}
      </motion.div>
    </ExpandCollapseWrapper>
  );
}

export default TripReport;
