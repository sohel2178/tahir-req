import { RedisGeo } from "@/types/device";
import { MonthlyItem } from "@/types/report";
import { User } from "@/types/user";
import { Location } from "@/types/report";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserEmail = (uid: string | User | null | undefined) => {
  if (uid && typeof uid === "object" && "email" in uid) {
    return uid.email;
  }
  return "this user";
};

export const formatLocalTime = (utcString?: string): string => {
  if (!utcString) return "Invalid Date"; // Handle undefined case gracefully
  return new Date(utcString).toLocaleString();
};

export const formatLocalTimeTimeOnly = (utcString?: string): string => {
  if (!utcString) return "Invalid Date"; // Handle undefined case gracefully
  return new Date(utcString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

const getDistanceFromLatLonInMeter = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c * 1000; // Distance in km
  return d;
};

const getDiatance = (loc1: Location, loc2: Location) => {
  return getDistanceFromLatLonInMeter(
    loc1.geo.lat,
    loc1.geo.lng,
    loc2.geo.lat,
    loc2.geo.lng,
  );
};

export const getDistancefromLocations = (datas: Location[]) => {
  if (datas.length < 2) return 0;

  let distance = 0;

  for (let i = 1; i < datas.length; i++) {
    const dist = getDiatance(datas[i - 1], datas[i]);
    distance += dist;
  }

  return distance;
};

const stop_duration = (dateStr: string): string => {
  const updateTime = new Date(dateStr);
  const currentDate = new Date();
  const diff = Math.floor(
    (currentDate.getTime() - updateTime.getTime()) / 1000,
  );

  let min: number = 0;
  let sec: number = 0;
  let hr: number = 0;
  let day: number = 0;

  if (diff <= 30) {
    return "RUNNING";
  } else if (diff > 30 && diff < 60) {
    return diff + " seconds ago";
  } else if (diff > 60 && diff < 3600) {
    min = Math.floor(diff / 60);
    sec = diff % 60;
    return min + " min " + sec + " secs ago";
  } else if (diff > 3600 && diff < 3600 * 24) {
    hr = Math.floor(diff / 3600);
    const rem = diff % 3600;
    min = Math.floor(rem / 60);
    sec = rem % 60;
    return hr + " hrs " + min + " min " + sec + " secs ago";
  } else {
    day = Math.floor(diff / (3600 * 24));
    const hrRem = diff % (3600 * 24);
    hr = Math.floor(hrRem / 3600);
    const rem = hrRem % 3600;
    min = Math.floor(rem / 60);
    sec = rem % 60;
    return day + " days " + hr + " hrs " + min + " min " + sec + " secs ago";
  }

  // return diff
};

export const getStopDuration = (geo: RedisGeo): string => {
  const time = () => {
    if (geo.active_time) {
      return geo.active_time;
    } else {
      return geo.update_time;
    }
  };

  const t = time();

  return t ? stop_duration(t) : "undefined";
};

export const ampmFormat = (time: string): string => {
  const array = time.split(":");
  let hr = Number(array[0]);
  const min = Number(array[1]);

  const suffix = hr >= 12 ? "PM" : "AM";
  hr = hr <= 12 ? hr : hr - 12;

  return `${hr.toString().padStart(2, "0")}:${min
    .toString()
    .padStart(2, "0")} ${suffix}`;
};

export const getFuelConsumption = (
  distanceInMeter: number,
  mileage: number,
  congestion_consumption?: number,
  congestion_time?: number,
) => {
  const distConsumtion = distanceInMeter / 1000 / mileage;

  let congCons = 0;

  if (congestion_time && congestion_consumption) {
    congCons = (congestion_time * congestion_consumption) / 3600;
  }

  // console.log(distConsumtion);
  // console.log(congCons);

  return Number((congCons + distConsumtion).toFixed(2));
};

export const formatDuration = (time: number): string => {
  const hr = Math.floor(time / 3600);
  const rem = time % 3600;
  const min = Math.floor(rem / 60);

  return (
    String(hr).padStart(2, "0") +
    " hrs " +
    String(min).padStart(2, "0") +
    " mins"
  );
};

export const getOrdinalSuffix = (n: number): string => {
  if (n <= 0) return `${n}`; // Handle non-positive numbers gracefully

  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = n % 100;

  const suffix =
    remainder >= 11 && remainder <= 13 ? "th" : suffixes[n % 10] || "th";

  return `${n}${suffix}`;
};

export const formatMonthlyDate = (date: Date): string => {
  return new Date(date)
    .toLocaleString("en-US", { month: "short", year: "numeric" })
    .replace(" ", "-");
};

export const getMonthlyDataInfo = (monthlydata: MonthlyItem[]) => {
  const totalDistance = monthlydata.reduce((acc, x) => acc + x.distance, 0);
  const totalRunningTime = monthlydata.reduce((acc, x) => acc + x.duration, 0);

  const totalCongestionTime = monthlydata.reduce(
    (acc, x) => acc + x.congestion_time,
    0,
  );

  return { totalDistance, totalRunningTime, totalCongestionTime };
};

export function minToString(timeInMin: number): string {
  const pad = (num: number): string => num.toString().padStart(2, "0");

  let hour = Math.floor(timeInMin / 60);
  const min = timeInMin % 60;

  const suffix = hour < 12 ? " AM" : " PM";

  hour = hour % 12;
  if (hour === 0) {
    hour = 12;
  }

  return `${pad(hour)}:${pad(min)}${suffix}`;
}

export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.cos(toRad(lon2 - lon1));
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (d: number) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDateTime(dateStr?: string) {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr);

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}
