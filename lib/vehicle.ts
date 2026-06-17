import { VehicleType, VehicleTypeLabels } from "@/types/device";

export function getVehicleTypeLabel(type?: number): string {
  if (!type) return VehicleTypeLabels[VehicleType.OTHERS];

  if (type in VehicleTypeLabels) {
    return VehicleTypeLabels[type as VehicleType];
  }

  return VehicleTypeLabels[VehicleType.OTHERS];
}

export function getVehicleIcon(type?: number) {
  switch (type) {
    case VehicleType.CAR:
      return "/vehicles/car_front.png";
    case VehicleType.BIKE:
      return "/vehicles/bike_front.png";
    case VehicleType.MICRO_BUS:
      return "/vehicles/microbus_front.png";
    case VehicleType.BUS:
      return "/vehicles/bus_front.png";
    case VehicleType.TRUCK:
      return "/vehicles/truck_front.png";
    case VehicleType.CNG:
      return "/vehicles/cng_front.png";
    case VehicleType.SHIP:
      return "/vehicles/ship_front.png";
    case VehicleType.EXCAVATOR:
      return "/vehicles/excavator_front.png";
    default:
      return "/vehicles/car_front.png";
  }
}
