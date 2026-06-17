import { create } from "zustand";
import { Device } from "@/types/device";

interface DeviceState {
  devices: Device[];
  setDevices: (devices: Device[]) => void;
  addDevice: (device: Device) => void;
  updateDevice: (device: Device) => void;
  removeDevice: (id: string) => void;
  getDeviceById: (id: string) => Device | undefined;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  devices: [],
  setDevices: (devices) => set({ devices }),
  addDevice: (device) =>
    set((state) => ({ devices: [...state.devices, device] })),
  updateDevice: (device) =>
    set((state) => ({
      devices: state.devices.map((d) => (d.id === device.id ? device : d)),
    })),
  removeDevice: (id) =>
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== id),
    })),
  getDeviceById: (id) => get().devices.find((d) => d.id === id || d._id === id),
}));
