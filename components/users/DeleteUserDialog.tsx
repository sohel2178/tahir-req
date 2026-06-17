"use client";

import { User } from "@/types/user";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserAPI } from "@/lib/api";

interface DeleteUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User | null;
  onUserDeleted: (id: string) => void;
}

export default function DeleteUserDialog({
  open,
  setOpen,
  user,
  onUserDeleted,
}: DeleteUserDialogProps) {
  const { token } = useAuthStore();

  const handleDelete = async () => {
    if (!user) return;
    await UserAPI.remove(user.id);
    onUserDeleted(user.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete <b>{user?.email}</b>?
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
