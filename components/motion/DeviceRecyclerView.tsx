"use client";

import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Device } from "@/types/device";

interface RecyclerViewProps {
  items: Device[];
  selectedDevice: Device | null;
  pathname: string;
}

function DeviceRecyclerView({
  items,
  selectedDevice,
  pathname,
}: RecyclerViewProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 6,
  });

  const oldId = selectedDevice?.id ? String(selectedDevice.id) : null;

  return (
    <div ref={parentRef} className="w-full h-full overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const device = items[virtualRow.index];

          const newId = String(device.id);

          const newPathname =
            oldId && pathname.includes(oldId)
              ? pathname.replace(oldId, newId)
              : `/admin/devices/${newId}/live-tracking`;

          const isSelected = selectedDevice?.id === device.id;

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={(el) => {
                if (el) rowVirtualizer.measureElement(el);
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="flex w-full p-1"
            >
              <Link href={newPathname} className="w-full">
                <div
                  className={cn(
                    "flex border rounded-md w-full flex-col px-4 py-2 cursor-pointer transition-colors",
                    isSelected
                      ? "bg-primary-500 border-primary-500 text-gray-900 scale-[1.02]"
                      : "background-light900_dark200 hover:bg-green-100 text-gray-500 dark:text-gray-100",
                  )}
                >
                  <span className="font-medium">
                    {device.registration_number || "Unknown Vehicle"}
                  </span>

                  <span
                    className={cn(
                      "text-xs",
                      isSelected ? "text-gray-900" : "text-gray-500",
                    )}
                  >
                    {device.id}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DeviceRecyclerView;
