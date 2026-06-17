"use client";

import React, { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Device } from "@/types/device";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMapStore } from "@/store/map";
import { DeviceAPI } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

interface RecyclerViewProps {
  items: Device[];
  selectedDevice: Device;
}

const RecyclerView: React.FC<RecyclerViewProps> = ({
  items,
  selectedDevice,
}) => {
  const pathname = usePathname();
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualizer setup
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // each row height in px
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[400px] w-full overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
          width: "100%",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];
          return (
            <div
              key={item._id}
              ref={(el) => {
                if (el) rowVirtualizer.measureElement(el);
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
                height: `${virtualRow.size}px`,
              }}
              className="flex w-full p-1 background-light900_dark200"
            >
              <Link
                href={pathname.replace(selectedDevice.id!, item.id!)}
                className="w-full"
              >
                <div
                  className={cn(
                    "flex border rounded-md w-full h-full flex-col px-4 cursor-pointer",
                    item.id === selectedDevice.id
                      ? "bg-primary-500"
                      : "background-light900_dark200",
                  )}
                >
                  <span>{item.registration_number}</span>
                  <span className="subtle-regular">{item.id}</span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function DevicePopOver() {
  const { selectedDevice } = useMapStore();
  const [devices, setDevices] = useState<Device[]>([]);
  const [search, setSearch] = useState("");
  const { user } = useAuthStore();

  const PAGE = 1;
  const LIMIT = 10;

  const fetchDevices = async (searchText: string = "") => {
    let res;
    try {
      // res = await DeviceAPI.adminDevices(PAGE, LIMIT, searchText);
      if (user?.role === "manager") {
        res = await DeviceAPI.managerDevices(PAGE, LIMIT, searchText);
      } else {
        res = await DeviceAPI.adminDevices(PAGE, LIMIT, searchText);
      }
      setDevices(res?.data || []);
    } catch (err) {
      console.error("Failed to load devices", err);
    }
  };

  // initial load
  useEffect(() => {
    fetchDevices("");
  }, []);

  // search trigger
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchDevices(search);
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {selectedDevice?.registration_number || "Select Device"}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="bg-white dark:bg-gray-800 light-border w-[300px]"
      >
        <div className="flex w-full flex-col gap-2">
          <input
            type="text"
            placeholder="Search device..."
            className="border rounded-md px-3 py-2 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <RecyclerView
            items={devices}
            selectedDevice={selectedDevice as Device}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DevicePopOver;
