import { User } from "./user";

export enum VehicleType {
  CAR = 1,
  BIKE = 2,
  MICRO_BUS = 3,
  BUS = 4,
  TRUCK = 5,
  CNG = 6,
  SHIP = 7,
  EXCAVATOR = 8,
  OTHERS = 99,
}

export enum VehicleTypeString {
  CAR = "Car",
  BIKE = "Bike",
  MICRO_BUS = "Micro-bus",
  BUS = "Bus",
  TRUCK = "Truck",
  CNG = "CNG",
  SHIP = "Ship",
  EXCAVATOR = "Excavator",
  OTHERS = "Others",
}

export const VehicleTypeLabels: Record<VehicleType, string> = {
  [VehicleType.CAR]: "Car",
  [VehicleType.BIKE]: "Bike",
  [VehicleType.MICRO_BUS]: "Micro Bus",
  [VehicleType.BUS]: "Bus",
  [VehicleType.TRUCK]: "Truck",
  [VehicleType.CNG]: "CNG",
  [VehicleType.SHIP]: "Ship",
  [VehicleType.EXCAVATOR]: "Excavator",
  [VehicleType.OTHERS]: "Others",
};

export interface RedisGeo {
  lat: number;
  lng: number;
  speed?: number;
  acc?: "OFF" | "ON";
  milage?: number;
  fuel_line?: "OFF" | "ON";
  charging?: "OFF" | "ON";
  voltage_level?: string;
  update_time?: string;
  latest_time?: string;
  active_time?: string;
  devicetime?: string;
  bearing?: number;
  external_voltage?: number;
  number_of_satellite?: number;
  gsm_signal_strength?: number;
  pto_io_status?: string;
  over_speed?: boolean;
  temperature?: number;
}

export interface Device {
  _id?: string;
  id: string;
  device_model: string;
  vehicle_model?: string;
  chasis_number?: string;
  reference?: string;
  driver_name?: string;
  driver_phone?: string;
  driver_photo?: string;
  registration_number: string;
  vehicle_type?: number;
  mileage?: number;
  congestion_consumption?: number;
  service_charge?: number;
  device_sim_number: string;
  center_number?: string;
  is_inactive?: boolean;
  speed_limit?: number;
  max_temp?: number;
  min_temp?: number;
  assign_date?: string;
  unassign_date?: string;
  update_time?: string;
  createdBy: string;
  uid?: User | string | null; // assigned user later
  geo?: RedisGeo | null;
}

// vehicle

export const defaultGeo: RedisGeo = {
  fuel_line: "OFF",
  acc: "OFF",
  charging: "OFF",
  voltage_level: "",
  update_time: "",
  bearing: 0,
  lat: 23.55,
  lng: 90.12,
  speed: 0,
  number_of_satellite: 0,
  latest_time: "",
  milage: 0,
  active_time: "",
};
