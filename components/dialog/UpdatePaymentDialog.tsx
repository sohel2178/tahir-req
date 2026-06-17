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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useState } from "react";
import { Payment } from "@/types/payment";
import { PaymentAPI } from "@/lib/api";

interface UpdatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
  onUpdated?: () => void; // callback to refresh parent list
}

export default function UpdatePaymentDialog({
  open,
  onOpenChange,
  payment,
  onUpdated,
}: UpdatePaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("bKASH");

  if (!payment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await PaymentAPI.update_payment(payment._id, {
        payment_status: true,
        payment_method: method,
      });
      onUpdated?.(); // refresh parent data
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to update payment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Retail Collection</DialogTitle>
          <DialogDescription>
            To paid the amount of retail collection press submit. Otherwise
            cancel the dialog.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Select Payment Method</Label>
            <RadioGroup
              value={method}
              onValueChange={setMethod}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bKASH" id="bKash" />
                <Label htmlFor="bKash">bKASH</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Cash" id="cash" />
                <Label htmlFor="cash">Cash</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Nagad" id="nagad" />
                <Label htmlFor="nagad">Nagad</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Rocket" id="rocket" />
                <Label htmlFor="rocket">Rocket</Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
