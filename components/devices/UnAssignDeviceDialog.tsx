"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Device } from "@/types/device";
import { DeviceAPI } from "@/lib/api";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  device: Device | null;
  onUpdated: (device: Device) => void;
}

export default function UnassignDeviceDialog({
  open,
  setOpen,
  device,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!device || !device.uid) return null;

  const handleUnassign = async () => {
    if (!device) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await DeviceAPI.unassign(device._id || device.id);
      onUpdated(updated);
      setOpen(false);
    } catch (err: any) {
      console.error("❌ Unassign failed", err);
      setError(err.response?.data?.msg || "Failed to unassign device");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unassign Device</DialogTitle>
        </DialogHeader>

        <p className="mb-4">
          Do you want to unassign{" "}
          <span className="font-semibold">
            {typeof device.uid === "object" && "name" in device.uid
              ? device.uid.name
              : "this user"}
          </span>{" "}
          from the device <span className="font-mono">{device.id}</span>?
        </p>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleUnassign}
            disabled={loading}
          >
            {loading ? "Unassigning..." : "Confirm Unassign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
