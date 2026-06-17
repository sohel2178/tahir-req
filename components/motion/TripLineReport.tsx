"use client";

import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Trip } from "@/types/report";

interface Props {
  trips: Trip[];
}

function TripLineReport({ trips }: Props) {
  const modifiedTrip = [...trips];

  const total = trips.reduce((acc, trip) => acc + trip.duration, 0);

  if (total < 86400) {
    modifiedTrip.push({
      status: "OFF",
      duration: 86400 - total,
      start: "",
      end: "",
      distance: 0,
    });
  }
  const TripLine = ({ trip }: { trip: Trip }) => {
    const width = Math.ceil(trip.duration / 864) + "%";
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div
            className="h-full cursor-pointer"
            style={{
              width: width,
              backgroundColor: trip.status === "OFF" ? "red" : "green",
            }}
          ></div>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 background-light900_dark200 light-border"
          align="end"
        >
          <div className="flex justify-center items-center p-4">
            <p>{`start at ${trip.start} and end at ${trip.end} distance travel in that time is ${trip.distance}`}</p>
          </div>
        </PopoverContent>
      </Popover>
    );
  };
  return (
    <div className="w-full flex bg-gray-600 h-[40px] p-[1px] max-sm:hidden">
      {modifiedTrip.map((x, i) => (
        <TripLine key={i} trip={x} />
      ))}
    </div>
  );
}

export default TripLineReport;
