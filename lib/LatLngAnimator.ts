import { calculateBearing } from "./utils";
import { linearInterpolate } from "../lib/LatLngInterpolator";

export const animateMarker = (
  marker: google.maps.Marker,
  start: google.maps.LatLngLiteral,
  end: google.maps.LatLngLiteral,
  durationInMs = 1000,
  onComplete?: () => void
) => {
  const startTime = performance.now();

  const step = (now: number) => {
    const elapsed = now - startTime;
    let t = Math.min(1, elapsed / durationInMs);

    // Same as Android's LinearInterpolator
    const v = t;

    // Interpolate between start and end
    const pos = linearInterpolate(v, start, end);
    marker.setPosition(pos);

    // Rotation (bearing)
    const bearing = calculateBearing(start.lat, start.lng, end.lat, end.lng);
    (marker as any).setRotation?.(bearing); // if using custom symbol rotation
    // or adjust icon rotation if custom path:
    const icon = marker.getIcon() as google.maps.Icon;
    if (icon && typeof icon === "object") {
      (icon as any).rotation = bearing;
      marker.setIcon(icon);
    }

    if (t < 1) {
      requestAnimationFrame(step);
    } else if (onComplete) {
      onComplete();
    }
  };

  requestAnimationFrame(step);
};
