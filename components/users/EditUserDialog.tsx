"use client";

import { useState, useEffect } from "react";
import { Role, User } from "@/types/user";
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
import { UserAPI } from "@/lib/api";

interface EditUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User | null;
  onUserUpdated: (user: User) => void;
}

export default function EditUserDialog({
  open,
  setOpen,
  user,
  onUserUpdated,
}: EditUserDialogProps) {
  const { token, user: loggedUser } = useAuthStore();
  const [form, setForm] = useState<{
    email: string;
    name: string;
    role: Role; // 👈 restricts to "admin" | "manager" | "user"
  }>({
    email: "",
    name: "",
    role: "user",
  });

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email,
        name: user.name,
        role: user.role,
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;
    const updated = await UserAPI.update(user.id, form);
    onUserUpdated(updated);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
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
