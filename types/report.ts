export interface Trip {
  status: "ON" | "OFF";
  start: string;
  end: string;
  duration: number;
  distance: number;
  congestion_time?: number;
}

export interface Hourly {
  _id: number;
  start: string;
  end: string;
  distance: number;
}

export interface Location {
  _id: string; // or ObjectId if you're using mongoose types
  servertime: string; // ISODate stored as string
  id: string;
  devicetime: string;
  date: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  geo: {
    lat: number;
    lng: number;
    speed: number;
    acc: "ON" | "OFF";
    milage?: number;
  };
}

export interface DailyReport {
  trip_report?: Trip[];
  hourly_report?: Hourly[];
  actual_distance?: number;
  total_distance?: number;
  running_time?: number;
  congestion_time?: number;
}

export interface DailyTravelReport {
  count?: number;
  distance?: number;
  data?: Location[];
}

export interface MonthlyPaymentRequest {
  month: number; // 0-11
  year: number; // 2023
}

export interface MonthlyReportRequest extends MonthlyPaymentRequest {
  device_id: string;
  device_type: number;
}

export interface DailyReportRequest extends MonthlyReportRequest {
  day: number; // 1-31
}

interface MonthlyId {
  day: number;
  month: number;
  year: number;
}

export interface SpeedFrequency {
  _id: number;
  count: number;
  avg: number;
}

export interface SpeedTimeline {
  max: number;
  min: number;
  avg: number;
  time: number;
}

export interface MonthlyItem {
  _id: MonthlyId;
  total_time: number;
  running_time: number;
  congestion_time: number;
  idle_time: number;
  duration: number;
  distance: number;
  count: number;
  start_time: Date | null;
  end_time: Date | null;
}

export interface DailySpeedReport {
  info?: {
    _id: string;
    max: number;
    min: number;
    avg: number;
  };
  frequency?: SpeedFrequency[];
  data?: SpeedTimeline[];
}

export interface RangeReportRequest {
  device_id: string;
  device_type: number;
  start_time: string; // ISO string
  end_time: string; // ISO string
}

export interface RangeTravelResponse {
  count?: number;
  distance?: number;
  data?: Location[];
}
