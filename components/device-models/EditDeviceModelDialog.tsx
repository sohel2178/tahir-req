"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DeviceModel } from "@/types/deviceModel";
import { DeviceModelAPI } from "@/lib/api";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  model: DeviceModel | null;
  onUpdated: (model: DeviceModel) => void;
}

export default function EditDeviceModelDialog({
  open,
  setOpen,
  model,
  onUpdated,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    supplier_name: "",
    supplier_contact: "",
  });

  useEffect(() => {
    if (model) {
      setForm({
        name: model.name,
        supplier_name: model.supplier_name,
        supplier_contact: model.supplier_contact,
      });
    }
  }, [model]);

  const handleUpdate = async () => {
    if (!model) return;
    try {
      const updated = await DeviceModelAPI.update(model.id, form);
      onUpdated(updated);
      setOpen(false);
    } catch (err) {
      console.error("❌ Update failed", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Device Model</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Supplier Name"
            value={form.supplier_name}
            onChange={(e) =>
              setForm({ ...form, supplier_name: e.target.value })
            }
          />
          <Input
            placeholder="Supplier Contact"
            value={form.supplier_contact}
            onChange={(e) =>
              setForm({ ...form, supplier_contact: e.target.value })
            }
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
