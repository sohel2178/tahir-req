"use client";

import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Location } from "@/types/report";
import { useCallback, useEffect, useRef, useState } from "react";
import { calculateBearing, interpolate } from "@/lib/LatLngInterpolator";

type Props = {
  data: Location[];
  index: number;
};

const MAP_OPTIONS: google.maps.MapOptions = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  zoomControl: false,
};

/* ---------------- Component ---------------- */

export default function AnimatedMarkerMap({ data, index }: Props) {
  if (data.length < 2) return null;

  const current = data[index];
  const next = data[index + 1];

  const mapRef = useRef<google.maps.Map | null>(null);
  const rafRef = useRef<number | null>(null);

  const [position, setPosition] = useState<google.maps.LatLngLiteral>({
    lat: current.geo.lat,
    lng: current.geo.lng,
  });

  const [animatedPath, setAnimatedPath] = useState<google.maps.LatLngLiteral[]>(
    []
  );

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  /* -------- Reset path on new data -------- */
  useEffect(() => {
    setAnimatedPath([{ lat: data[0].geo.lat, lng: data[0].geo.lng }]);
  }, [data]);

  /* -------- Marker + Polyline animation -------- */
  useEffect(() => {
    if (!next) return;

    const from = {
      lat: current.geo.lat,
      lng: current.geo.lng,
    };

    const to = {
      lat: next.geo.lat,
      lng: next.geo.lng,
    };

    let start: number | null = null;
    const duration = 600;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);

      const interpolated = interpolate(from, to, progress);

      setPosition(interpolated);
      mapRef.current?.panTo(interpolated);

      // grow blue polyline with marker
      setAnimatedPath((prev) => {
        const base = data
          .slice(0, index)
          .map((d) => ({ lat: d.geo.lat, lng: d.geo.lng }));
        return [...base, interpolated];
      });

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [index]);

  if (!isLoaded) return null;

  const rotation = next
    ? calculateBearing(
        current.geo.lat,
        current.geo.lng,
        next.geo.lat,
        next.geo.lng
      )
    : 0;

  /* -------- Static Full Route (GRAY) -------- */
  const fullPath = data.map((d) => ({
    lat: d.geo.lat,
    lng: d.geo.lng,
  }));

  const startPoint = fullPath[0];
  const endPoint = fullPath[fullPath.length - 1];

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      zoom={18}
      center={position}
      onLoad={onLoad}
      options={MAP_OPTIONS}
    >
      {/* 🛣️ Full Route (GRAY background) */}
      <Polyline
        path={fullPath}
        options={{
          strokeColor: "#555555", // gray-400
          strokeOpacity: 0.6,
          strokeWeight: 4,
        }}
      />

      {/* 🟦 Traveled Route (BLUE foreground) */}
      <Polyline
        path={animatedPath}
        options={{
          strokeColor: "#2563eb",
          strokeOpacity: 0.95,
          strokeWeight: 4,
        }}
      />

      {/* 🟢 Start Marker */}
      <Marker
        position={startPoint}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: "#16a34a",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        }}
      />

      {/* 🔴 End Marker */}
      <Marker
        position={endPoint}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: "#dc2626",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        }}
      />

      {/* 🚗 Vehicle Marker (UNCHANGED) */}
      <Marker
        position={position}
        icon={{
          path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z",
          scale: 1,
          rotation,
          anchor: new google.maps.Point(25, 25),
          fillColor: "black",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "green",
        }}
      />
    </GoogleMap>
  );
}
