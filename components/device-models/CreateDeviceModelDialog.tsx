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
import { Input } from "@/components/ui/input";
import { DeviceModel } from "@/types/deviceModel";
import { DeviceModelAPI } from "@/lib/api";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreated: (model: DeviceModel) => void;
}

export default function CreateDeviceModelDialog({
  open,
  setOpen,
  onCreated,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    supplier_name: "",
    supplier_contact: "",
  });

  const handleCreate = async () => {
    try {
      const newModel = await DeviceModelAPI.create(form);
      onCreated(newModel);
      setForm({ name: "", supplier_name: "", supplier_contact: "" });
      setOpen(false);
    } catch (err) {
      console.error("❌ Create failed", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Device Model</DialogTitle>
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
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
