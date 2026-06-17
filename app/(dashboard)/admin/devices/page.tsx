"use client";

import { useEffect, useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Device } from "@/types/device";
import { useAuthStore } from "@/store/auth";

import CreateDeviceDialog from "@/components/devices/CreateDeviceDialog";
import EditDeviceDialog from "@/components/devices/EditDeviceDialog";
import DeleteDeviceDialog from "@/components/devices/DeleteDeviceDialog";
import AssignDeviceDialog from "@/components/devices/AssignDeviceDialog";
import UnassignDeviceDialog from "@/components/devices/UnAssignDeviceDialog";

import { getUserEmail } from "@/lib/utils";
import { Pencil, UserPlus, UserX, Trash, MapPin } from "lucide-react";
import ReportsMenu from "@/components/devices/ReportMenu";
import { DeviceAPI } from "@/lib/api";
import DeviceStatus from "@/components/devices/DeviceStatus";
import Link from "next/link";

export default function DevicesPage() {
  const { user } = useAuthStore();

  const [devices, setDevices] = useState<Device[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [unassignOpen, setUnassignOpen] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const totalPages = Math.ceil(total / limit);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);

      const res = await DeviceAPI.adminDevices(page, limit, search);

      setDevices(res.data);
      setTotal(res.pagination.total);
    } catch (err) {
      console.error("Failed to load devices", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchInput]);

  const handleCreated = () => fetchDevices();
  const handleUpdated = () => fetchDevices();
  const handleDeleted = () => fetchDevices();

  return (
    <div className="flex h-screen flex-col p-4 gap-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <h1 className="text-2xl font-bold">📡 Devices ({total})</h1>

        <div className="flex gap-3">
          <input
            placeholder="Search devices..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border rounded-md px-3 py-2 w-62.5"
          />

          {(user?.role === "admin" || user?.role === "manager") && (
            <Button onClick={() => setCreateOpen(true)}>+ Create</Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden flex flex-col flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device ID</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Reg Number</TableHead>
              <TableHead>SIM</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead className="text-left">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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

            {devices.map((device) => (
              <TableRow key={device._id}>
                <TableCell>{device.id}</TableCell>

                <TableCell>{device.device_model}</TableCell>

                <TableCell>{device.registration_number}</TableCell>

                <TableCell>{device.device_sim_number}</TableCell>

                <TableCell>
                  {device.uid
                    ? `✅ ${getUserEmail(device.uid)}`
                    : "❌ Unassigned"}
                </TableCell>

                <TableCell>
                  {device.geo ? (
                    <DeviceStatus geo={device.geo} />
                  ) : (
                    "❌ Not Reporting"
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/devices/${device.id}/live-tracking`}
                      className="flex items-center justify-center"
                    >
                      {device.geo && (
                        <MapPin className="h-4 w-4 text-blue-500" />
                      )}
                    </Link>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedDevice(device);
                        device.uid
                          ? setUnassignOpen(true)
                          : setAssignOpen(true);
                      }}
                    >
                      {device.uid ? (
                        <UserX className="h-4 w-4 text-red-500" />
                      ) : (
                        <UserPlus className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedDevice(device);
                        setEditOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedDevice(device);
                        setDeleteOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>

                    {device._id && <ReportsMenu deviceId={device.id} />}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span>Rows:</span>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>

          <span>
            Page {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Dialogs */}

      <CreateDeviceDialog
        open={createOpen}
        setOpen={setCreateOpen}
        onCreated={handleCreated}
      />

      <EditDeviceDialog
        open={editOpen}
        setOpen={setEditOpen}
        device={selectedDevice}
        onUpdated={handleUpdated}
      />

      <DeleteDeviceDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        device={selectedDevice}
        onDeleted={handleDeleted}
      />

      <AssignDeviceDialog
        open={assignOpen}
        setOpen={setAssignOpen}
        device={selectedDevice}
        onUpdated={handleUpdated}
      />

      <UnassignDeviceDialog
        open={unassignOpen}
        setOpen={setUnassignOpen}
        device={selectedDevice}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
