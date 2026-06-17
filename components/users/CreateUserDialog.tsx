"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { User } from "@/types/user";
import { UserAPI } from "@/lib/api";
import { Role } from "@/types/user";

interface CreateUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onUserCreated: (user: User) => void; // return created user
}

export default function CreateUserDialog({
  open,
  setOpen,
  onUserCreated,
}: CreateUserDialogProps) {
  const { token, user: loggedUser } = useAuthStore();
  const [form, setForm] = useState<{
    email: string;
    name: string;
    role: Role; // 👈 restricts to "admin" | "manager" | "user"
    password: string;
  }>({
    email: "",
    name: "",
    role: "user",
    password: "",
  });

  const handleCreate = async () => {
    try {
      const newUser = await UserAPI.create(form);
      onUserCreated(newUser);
      setOpen(false);
    } catch (err) {
      console.error("❌ Create failed", err);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* Role selection */}
          {loggedUser?.role === "admin" ? (
            <select
              className="w-full border rounded-md px-3 py-2"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as Role })
              }
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          ) : (
            <Input value="user" disabled className="w-full" />
          )}

          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
