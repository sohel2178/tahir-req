"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DeviceModel } from "@/types/deviceModel";
import { DeviceModelAPI } from "@/lib/api";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  model: DeviceModel | null;
  onDeleted: (id: string) => void;
}

export default function DeleteDeviceModelDialog({
  open,
  setOpen,
  model,
  onDeleted,
}: Props) {
  const handleDelete = async () => {
    if (!model) return;
    try {
      await DeviceModelAPI.remove(model.id);
      onDeleted(model.id);
      setOpen(false);
    } catch (err) {
      console.error("❌ Delete failed", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Device Model</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete <b>{model?.name}</b> from your device
          models?
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
