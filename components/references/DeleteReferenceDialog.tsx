"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Reference } from "@/types/reference";
import { ReferenceAPI } from "@/lib/api";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  reference: Reference | null;
  onDeleted: (id: string) => void;
}

export default function DeleteReferenceDialog({
  open,
  setOpen,
  reference,
  onDeleted,
}: Props) {
  const handleDelete = async () => {
    if (!reference) return;
    try {
      await ReferenceAPI.remove(reference.id);
      onDeleted(reference.id);
      setOpen(false);
    } catch (err) {
      console.error("❌ Delete reference failed", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Reference</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete <b>{reference?.name}</b>?
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
