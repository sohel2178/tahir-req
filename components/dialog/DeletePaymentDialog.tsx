"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PaymentAPI } from "@/lib/api";

interface DeletePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId?: string;
  onDeleted?: () => void; // callback to refresh parent list
}

export default function DeletePaymentDialog({
  open,
  onOpenChange,
  paymentId,
  onDeleted,
}: DeletePaymentDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!paymentId) return;
    setLoading(true);
    try {
      await PaymentAPI.delete_payment(paymentId);
      onDeleted?.(); // trigger refresh in parent
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to delete payment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Payment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this payment record? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
