"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { PaymentAPI } from "@/lib/api";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void; // callback for refreshing parent data
}

export default function PaymentDialog({
  open,
  onOpenChange,
  onCreated,
}: PaymentDialogProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    device_id: "",
    registration_number: "",
    customer_email: "",
    customer_number: "",
    service_charge: "",
    payment_method: "bKASH",
    year: new Date().getFullYear().toString(),
    month: new Date().getMonth().toString(), // ✅ 0-based (Jan = 0)
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        device_id: form.device_id.trim(),
        registration_number: form.registration_number.trim(),
        customer_email: form.customer_email.trim(),
        customer_number: form.customer_number.trim(),
        service_charge: parseFloat(form.service_charge),
        payment_method: form.payment_method,
        year: parseInt(form.year),
        month: parseInt(form.month), // 0–11
      };

      await PaymentAPI.add_payment(payload);
      console.log("✅ Payment created successfully!");
      onCreated?.();
      onOpenChange(false);

      // reset form
      setForm({
        device_id: "",
        registration_number: "",
        customer_email: "",
        customer_number: "",
        service_charge: "",
        payment_method: "bKASH",
        year: new Date().getFullYear().toString(),
        month: new Date().getMonth().toString(),
      });
    } catch (err) {
      console.error("❌ Failed to create payment:", err);
      alert("Failed to create payment. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogDescription>
            To add a new retail collection, fill up the form and press submit.
            Otherwise cancel the dialog.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="deviceId">Device ID *</Label>
            <Input
              id="deviceId"
              className="mt-2"
              value={form.device_id}
              onChange={(e) => handleChange("device_id", e.target.value)}
              placeholder="Enter Device ID"
              required
            />
          </div>

          <div>
            <Label htmlFor="regNo">Registration Number *</Label>
            <Input
              id="regNo"
              className="mt-2"
              value={form.registration_number}
              onChange={(e) =>
                handleChange("registration_number", e.target.value)
              }
              placeholder="Enter Registration No"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Customer Email *</Label>
            <Input
              id="email"
              type="email"
              className="mt-2"
              value={form.customer_email}
              onChange={(e) => handleChange("customer_email", e.target.value)}
              placeholder="Enter Email"
              required
            />
          </div>

          <div>
            <Label htmlFor="number">Customer Number *</Label>
            <Input
              id="number"
              className="mt-2"
              value={form.customer_number}
              onChange={(e) => handleChange("customer_number", e.target.value)}
              placeholder="Enter Customer Phone"
              required
            />
          </div>

          <div>
            <Label htmlFor="charge">Service Charge *</Label>
            <Input
              id="charge"
              type="number"
              min="0"
              className="mt-2"
              value={form.service_charge}
              onChange={(e) => handleChange("service_charge", e.target.value)}
              placeholder="0"
              required
            />
          </div>

          <div>
            <Label>Select Payment Method</Label>
            <Select
              value={form.payment_method}
              onValueChange={(val) => handleChange("payment_method", val)}
            >
              <SelectTrigger className="w-[200px] mt-2">
                <SelectValue placeholder="Choose method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="bKASH">bKASH</SelectItem>
                <SelectItem value="Nagad">Nagad</SelectItem>
                <SelectItem value="Rocket">Rocket</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Select Year</Label>
              <Select
                value={form.year}
                onValueChange={(val) => handleChange("year", val)}
              >
                <SelectTrigger className="w-[140px] mt-2">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => 2023 + i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label>Select Month</Label>
              <Select
                value={form.month}
                onValueChange={(val) => handleChange("month", val)}
              >
                <SelectTrigger className="w-[140px] mt-2">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].map((m, i) => (
                    <SelectItem key={m} value={i.toString()}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
