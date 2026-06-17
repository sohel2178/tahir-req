"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Device } from "@/types/device";
import { DeviceAPI, UserAPI } from "@/lib/api";
import { User } from "@/types/user";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  device: Device | null;
  onUpdated: (device: Device) => void;
}

export default function AssignDeviceDialog({
  open,
  setOpen,
  device,
  onUpdated,
}: Props) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignedUserId, setAssignedUserId] = useState<string | null>(null);

  // console.log(device, "device in assign dialog");

  const handleSearch = async () => {
    if (!search) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      const result = await UserAPI.search(search);
      setUsers(result);
    } catch (err) {
      console.error("❌ User search failed", err);
    }
    setLoading(false);
  };

  const handleAssign = async (userId: string) => {
    if (!device) return;
    try {
      const updated = await DeviceAPI.assign(device._id || device.id, userId);
      setAssignedUserId(userId);
      onUpdated(updated);
    } catch (err) {
      console.error("❌ Assign failed", err);
    }
  };

  // ✅ hooks always run regardless of device
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) {
        handleSearch();
      } else {
        setUsers([]);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleClear = () => {
    setSearch("");
    setUsers([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Device</DialogTitle>
        </DialogHeader>

        {/* only render if device exists */}
        {device ? (
          <>
            {/* Search input */}
            <div className="relative mb-4">
              <Input
                placeholder="Search user by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <X
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-800"
                  onClick={handleClear}
                />
              )}
            </div>

            {/* User results */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between border rounded p-2"
                >
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>

                  {assignedUserId ===
                  (typeof device.uid === "string"
                    ? device.uid
                    : device.uid?.id) ? (
                    <Button disabled variant="secondary">
                      ✅ Assigned
                    </Button>
                  ) : (
                    <Button onClick={() => handleAssign(u.id)}>Assign</Button>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">No device selected</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
