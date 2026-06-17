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
import { Reference } from "@/types/reference";
import { ReferenceAPI } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  reference: Reference | null;
  onUpdated: (reference: Reference) => void;
}

export default function EditReferenceDialog({
  open,
  setOpen,
  reference,
  onUpdated,
}: Props) {
  const [form, setForm] = useState<{
    name: string;
    username: string;
    contact: string;
    address: string;
    password?: string; // 👈 optional
  }>({
    name: "",
    username: "",
    contact: "",
    address: "",
    password: "", // default blank
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (reference) {
      setForm({
        name: reference.name,
        username: reference.username,
        contact: reference.contact,
        address: reference.address,
        password: "", // password not prefilled
      });
    }
  }, [reference]);

  const handleUpdate = async () => {
    if (!reference) return;
    try {
      const { password, ...rest } = form;
      const payload =
        password && password.trim() !== "" ? { ...rest, password } : rest;

      const updated = await ReferenceAPI.update(reference.id, payload);
      onUpdated(updated);
      setOpen(false);
    } catch (err) {
      console.error("❌ Update reference failed", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Reference</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            placeholder="Contact"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
          <Input
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password (leave empty to keep current)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
