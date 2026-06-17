export interface LatLng {
  lat: number;
  lng: number;
}

// ✅ Linear interpolation
export const linearInterpolate = (
  fraction: number,
  a: LatLng,
  b: LatLng
): LatLng => {
  const lat = (b.lat - a.lat) * fraction + a.lat;
  const lng = (b.lng - a.lng) * fraction + a.lng;
  return { lat, lng };
};

// ✅ Spherical interpolation (for long distances)
export const sphericalInterpolate = (
  fraction: number,
  a: LatLng,
  b: LatLng
): LatLng => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const fromLat = toRad(a.lat);
  const fromLng = toRad(a.lng);
  const toLat = toRad(b.lat);
  const toLng = toRad(b.lng);

  const cosFromLat = Math.cos(fromLat);
  const cosToLat = Math.cos(toLat);

  const angle =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((fromLat - toLat) / 2), 2) +
          cosFromLat * cosToLat * Math.pow(Math.sin((fromLng - toLng) / 2), 2)
      )
    );

  const sinAngle = Math.sin(angle);
  if (sinAngle < 1e-6) return a;

  const aCoeff = Math.sin((1 - fraction) * angle) / sinAngle;
  const bCoeff = Math.sin(fraction * angle) / sinAngle;

  const x =
    aCoeff * cosFromLat * Math.cos(fromLng) +
    bCoeff * cosToLat * Math.cos(toLng);
  const y =
    aCoeff * cosFromLat * Math.sin(fromLng) +
    bCoeff * cosToLat * Math.sin(toLng);
  const z = aCoeff * Math.sin(fromLat) + bCoeff * Math.sin(toLat);

  const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
  const lng = Math.atan2(y, x);
  return { lat: toDeg(lat), lng: toDeg(lng) };
};

export function interpolate(
  from: google.maps.LatLngLiteral,
  to: google.maps.LatLngLiteral,
  p: number
): google.maps.LatLngLiteral {
  return {
    lat: from.lat + (to.lat - from.lat) * p,
    lng: from.lng + (to.lng - from.lng) * p,
  };
}

export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const y = Math.sin(toRad(lng2 - lng1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.cos(toRad(lng2 - lng1));

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}
