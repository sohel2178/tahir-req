export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=18&format=jsonv2`,
      {
        headers: {
          // REQUIRED by Nominatim usage policy
          "User-Agent": "TiktikiGPS/1.0 (support@tiktiki.com)",
        },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.display_name ?? null;
  } catch (err) {
    console.error("Reverse geocode failed", err);
    return null;
  }
}
