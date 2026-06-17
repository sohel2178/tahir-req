"use client";

import * as XLSX from "xlsx";

import ClientSearch from "@/components/motion/ClientSearch";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeviceAPI } from "@/lib/api";
import { Device } from "@/types/device";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function UnAssignPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  const [tableDevices, setTableDevices] = useState<Device[]>([...devices]);
  const [isScrolled, setIsScrolled] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tableDevices.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  useEffect(() => {
    fetchUnAssignDevices();
  }, []);

  useEffect(() => {
    setTableDevices(devices);
  }, [devices]);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    const handleScroll = () => setIsScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchUnAssignDevices = async () => {
    try {
      setLoading(true);
      const data = await DeviceAPI.adminUnAssignDevices();
      setDevices(data);
    } catch (err) {
      console.error("❌ Failed to fetch devices", err);
    } finally {
      setLoading(false);
    }
  };

  const onDownloadClick = () => {
    if (tableDevices.length === 0) {
      alert("No devices available to download!");
      return;
    }

    // Format data for Excel export
    const exportData = tableDevices.map((device) => ({
      "Device ID": device.id,
      Registration: device.registration_number,
      Model: device.device_model,
      "Customer Number": device.center_number,
      "Sim Number": device.device_sim_number,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // ✅ FIX: Explicitly cast keys to keyof typeof exportData[0]
    const colWidths = Object.keys(exportData[0]).map((key) => {
      const typedKey = key as keyof (typeof exportData)[0];
      const maxLength = Math.max(
        key.length,
        ...exportData.map((row) =>
          row[typedKey] ? row[typedKey]!.toString().length : 0,
        ),
      );
      return { wch: maxLength + 2 }; // add padding
    });

    worksheet["!cols"] = colWidths;

    // Create workbook and export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UnAssign Devices");

    XLSX.writeFile(workbook, "unassign_devices.xlsx");
  };
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
          👥 UnAssign Devices ({tableDevices.length})
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button onClick={onDownloadClick} variant="outline">
            <Download className="text-xl sm:text-2xl" />
          </Button>
          <ClientSearch
            callback={setTableDevices}
            data={devices}
            fields={[
              "id",
              "registration_number",
              "device_sim_number",
              "center_number",
            ]}
            imgSrc="/icons/search.svg"
            placeholder="Search devices.."
            otherClasses="w-full sm:w-[300px] lg:w-[400px]"
          />

          {/* <Button onClick={onDownloadClick} variant="outline">
            <Download className="text-xl sm:text-2xl" />
          </Button> */}
        </div>

        {/* <div className="flex justify-between items-center mx-6">
          <Button onClick={onDownloadClick} variant="outline">
            <Download className="text-xl sm:text-2xl" />
          </Button>
        </div> */}
      </div>

      {/* Desktop Table */}
      <div className="border rounded-lg overflow-hidden flex flex-col flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device ID</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Reg Number</TableHead>
              <TableHead>SIM</TableHead>
              <TableHead>Center Number</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading devices...
                </TableCell>
              </TableRow>
            )}

            {!loading && devices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No devices found
                </TableCell>
              </TableRow>
            )}

            {tableDevices.map((device) => (
              <TableRow key={device._id}>
                <TableCell>{device.id}</TableCell>

                <TableCell>{device.device_model}</TableCell>

                <TableCell>{device.registration_number}</TableCell>

                <TableCell>{device.device_sim_number}</TableCell>
                <TableCell>{device.center_number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
