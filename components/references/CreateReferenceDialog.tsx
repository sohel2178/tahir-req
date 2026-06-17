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
import { Reference } from "@/types/reference";
import { ReferenceAPI } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreated: (reference: Reference) => void;
}

export default function CreateReferenceDialog({
  open,
  setOpen,
  onCreated,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    contact: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleCreate = async () => {
    try {
      const newRef = await ReferenceAPI.create(form);
      onCreated(newRef);
      setForm({
        name: "",
        username: "",
        password: "",
        contact: "",
        address: "",
      });
      setOpen(false);
    } catch (err) {
      console.error("❌ Create reference failed", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Reference</DialogTitle>
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
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
