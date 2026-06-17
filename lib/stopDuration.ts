import { Device, RedisGeo } from "@/types/device";

/**
 * Parse ISO UTC time safely
 */
function parseUTCTime(time?: string): Date | null {
  if (!time) return null;

  const date = new Date(time);
  if (isNaN(date.getTime())) return null;

  return date;
}

/**
 * Equivalent of MyUtil.isRunning()
 * Running if last active/update time <= 30 seconds ago
 */
export function isRunning(device?: Device | null): boolean {
  if (!device?.geo) return false;

  const time = device.geo.active_time || device.geo.update_time;

  const eventDate = parseUTCTime(time);
  if (!eventDate) return false;

  const diffSeconds = (Date.now() - eventDate.getTime()) / 1000;

  return diffSeconds <= 30;
}

export function isRunningByGeo(geo?: RedisGeo | null): boolean {
  if (!geo) return false;

  const time = geo.active_time || geo.update_time;

  const eventDate = parseUTCTime(time);
  if (!eventDate) return false;

  const diffSeconds = (Date.now() - eventDate.getTime()) / 1000;

  return diffSeconds <= 30;
}

/**
 * Equivalent of MyUtil.stopDuration()
 * Returns [hours, minutes, seconds]
 */
export function getStopDuration(
  device?: Device | null
): [number, number, number] {
  if (!device?.geo) return [0, 0, 0];

  const time = device.geo.active_time || device.geo.update_time;

  const eventDate = parseUTCTime(time);
  if (!eventDate) return [0, 0, 0];

  const diffSeconds = (Date.now() - eventDate.getTime()) / 1000;

  // Running → no stop duration
  if (diffSeconds <= 30) {
    return [0, 0, 0];
  }

  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = Math.floor(diffSeconds % 60);

  return [hours, minutes, seconds];
}

export function getStopDurationByGeo(
  geo?: RedisGeo | null
): [number, number, number] {
  if (!geo) return [0, 0, 0];

  const time = geo.active_time || geo.update_time;
  const eventDate = parseUTCTime(time);
  if (!eventDate) return [0, 0, 0];

  const diffSeconds = (Date.now() - eventDate.getTime()) / 1000;

  // Running → no stop duration
  if (diffSeconds <= 30) {
    return [0, 0, 0];
  }

  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = Math.floor(diffSeconds % 60);

  return [hours, minutes, seconds];
}

export function formatStopDuration(h: number, m: number, s: number): string {
  return `${h} HRS ${m} MINS ${s} SECS`;
}
