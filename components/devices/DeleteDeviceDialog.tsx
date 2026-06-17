"use client";

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
  onDeleted: (id: string) => void;
}

export default function DeleteDeviceDialog({
  open,
  setOpen,
  device,
  onDeleted,
}: Props) {
  const handleDelete = async () => {
    if (!device) return;
    try {
      await DeviceAPI.remove(device._id || device.id);
      onDeleted(device.id);
      setOpen(false);
    } catch (err) {
      console.error("❌ Delete device failed", err);
    }
  };

  if (!device) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Device</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete device <b>{device.id}</b> (
          {device.device_model})?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
