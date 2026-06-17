"use client";

import { create } from "zustand";
import { Device } from "@/types/device";

interface MapState {
  selectedDevice: Device | null;
  setSelectedDevice: (device: Device) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedDevice: null,
  setSelectedDevice: (device) => set({ selectedDevice: device }),
}));
