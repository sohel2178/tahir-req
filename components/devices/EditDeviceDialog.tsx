"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Device } from "@/types/device";
import { DeviceAPI, DeviceModelAPI, ReferenceAPI } from "@/lib/api";
import { VehicleType } from "@/types/device";
import { Reference } from "@/types/reference";
import { DeviceModel } from "@/types/deviceModel";

// ✅ Schema (same as create)
const deviceSchema = z.object({
  id: z.string().min(5, "IMEI must be at least 5 characters"),
  device_model: z.string().min(1, "Device model is required"),
  reference: z.string().min(1, "Reference is required"),
  registration_number: z.string().min(1, "Registration number is required"),
  vehicle_type: z.nativeEnum(VehicleType),
  vehicle_model: z.string().optional(),
  chasis_number: z.string().optional(),

  device_sim_number: z
    .string()
    .regex(
      /^01[3-9][0-9]{8}$/,
      "Invalid SIM number (must be 11-digit BD number)"
    ),

  center_number: z
    .string()
    .regex(
      /^01[3-9][0-9]{8}$/,
      "Invalid center number (must be 11-digit BD number)"
    )
    .optional()
    .or(z.literal("")),

  mileage: z.number().min(0).default(8).optional(),
  congestion_consumption: z.number().min(0).default(0.001).optional(),
  service_charge: z.number().min(0).default(0).optional(),
  speed_limit: z.number().min(10).default(80).optional(),
  max_temp: z.number().default(40).optional(),
  min_temp: z.number().default(20).optional(),
});

type DeviceInput = z.infer<typeof deviceSchema>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  device: Device | null;
  onUpdated: (device: Device) => void;
}

export default function EditDeviceDialog({
  open,
  setOpen,
  device,
  onUpdated,
}: Props) {
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeviceInput>({
    resolver: zodResolver(deviceSchema),
    defaultValues: device || {}, // ✅ load existing values
  });

  useEffect(() => {
    fetchDeviceModels();
    fetchReferences();
  }, []);

  useEffect(() => {
    if (device) {
      reset(device); // ✅ update form when device changes
    }
  }, [device, reset]);

  const fetchDeviceModels = async () => {
    try {
      const res = await DeviceModelAPI.list();
      setDeviceModels(res);
    } catch (err) {
      console.error("❌ Failed to fetch device models", err);
    }
  };

  const fetchReferences = async () => {
    try {
      const res = await ReferenceAPI.list();
      setReferences(res);
    } catch (err) {
      console.error("❌ Failed to fetch references", err);
    }
  };

  const onSubmit = async (data: DeviceInput) => {
    if (!device) return;
    try {
      const updated = await DeviceAPI.update(device._id!, data);
      onUpdated(updated);
      setOpen(false);
    } catch (err) {
      console.error("❌ Update device failed", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* IMEI */}
          <div>
            <Label htmlFor="id">Device IMEI</Label>
            <Input id="id" {...register("id")} disabled />{" "}
            {/* usually IMEI not editable */}
          </div>

          {/* Registration Number */}
          <div>
            <Label htmlFor="registration_number">Registration Number</Label>
            <Input
              id="registration_number"
              {...register("registration_number")}
            />
            {errors.registration_number && (
              <p className="text-red-500 text-sm">
                {errors.registration_number.message}
              </p>
            )}
          </div>

          {/* Chasis Number */}
          <div>
            <Label htmlFor="chasis_number">Chasis Number</Label>
            <Input id="chasis_number" {...register("chasis_number")} />
          </div>

          {/* Vehicle Model */}
          <div>
            <Label htmlFor="vehicle_model">Vehicle Model</Label>
            <Input id="vehicle_model" {...register("vehicle_model")} />
          </div>

          {/* Device Model */}
          <div>
            <Label htmlFor="device_model">Device Model</Label>
            <select
              id="device_model"
              {...register("device_model")}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select Device Model</option>
              {deviceModels.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reference */}
          <div>
            <Label htmlFor="reference">Reference</Label>
            <select
              id="reference"
              {...register("reference")}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select Reference</option>
              {references.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Type */}
          <div>
            <Label htmlFor="vehicle_type">Vehicle Type</Label>
            <select
              id="vehicle_type"
              {...register("vehicle_type", { valueAsNumber: true })}
              className="w-full border rounded-md px-3 py-2"
            >
              {Object.entries(VehicleType)
                .filter(([key]) => isNaN(Number(key)))
                .map(([key, value]) => (
                  <option key={value} value={value}>
                    {key.replace("_", " ")}
                  </option>
                ))}
            </select>
          </div>

          {/* Device SIM Number */}
          <div>
            <Label htmlFor="device_sim_number">Device SIM Number</Label>
            <Input id="device_sim_number" {...register("device_sim_number")} />
          </div>

          {/* Center Number */}
          <div>
            <Label htmlFor="center_number">Center Number</Label>
            <Input id="center_number" {...register("center_number")} />
          </div>

          {/* Numbers */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                type="number"
                id="mileage"
                {...register("mileage", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="service_charge">Service Charge</Label>
              <Input
                type="number"
                id="service_charge"
                {...register("service_charge", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="congestion_consumption">Cong. Cons.</Label>
              <Input
                type="number"
                step="0.001"
                id="congestion_consumption"
                {...register("congestion_consumption", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="speed_limit">Speed Limit</Label>
              <Input
                type="number"
                id="speed_limit"
                {...register("speed_limit", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="max_temp">Max Temp</Label>
              <Input
                type="number"
                id="max_temp"
                {...register("max_temp", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="min_temp">Min Temp</Label>
              <Input
                type="number"
                id="min_temp"
                {...register("min_temp", { valueAsNumber: true })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
