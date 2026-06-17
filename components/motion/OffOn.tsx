"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  state: "OFF" | "ON";
}

function OffOn({ state }: Props) {
  return (
    <div
      className={cn(
        "flex items-center w-10 h-6 p-1 rounded-full",
        state === "ON"
          ? "bg-green-400 justify-end"
          : "bg-gray-300 justify-start"
      )}
    >
      <div className="size-4 rounded-full bg-white"></div>
    </div>
  );
}

export default OffOn;
