"use client";

import { GoogleMap, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import {
  calculateBearing,
  formatLocalTime,
  formatLocalTimeTimeOnly,
  getDistancefromLocations,
} from "../../lib/utils";
import { useMotionValue, animate } from "framer-motion";
import { Location } from "@/types/report";
import { animateMarker } from "../../lib/LatLngAnimator";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
  overflow: "hidden",
};

export default function MapPlayer({ data }: { data: Location[] }) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(1024); // ms
  const [bearing, setBearing] = useState(0);

  const markerRef = useRef<google.maps.Marker | null>(null);
  const startMarkerRef = useRef<google.maps.Marker | null>(null);
  const endMarkerRef = useRef<google.maps.Marker | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const bearingValue = useMotionValue(0);

  // ✅ Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // 🧭 Smooth bearing interpolation
  useEffect(() => {
    const controls = animate(bearingValue, bearing, { duration: 0.5 });
    return controls.stop;
  }, [bearing]);

  // 🎬 Smooth route playback
  useEffect(() => {
    if (!mapRef.current || !isPlaying) return;

    // Remove static start marker before animation begins
    if (index === 0 && markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    // Create marker if it doesn't exist
    if (!markerRef.current && mapRef.current) {
      const marker = new google.maps.Marker({
        position: data[index].geo,
        map: mapRef.current,
        icon: {
          rotation: 0,
          path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z",
          fillColor: "#2E6F40",
          fillOpacity: 0.9,
          strokeWeight: 2,
          strokeColor: "#2E6F40",
          anchor: new google.maps.Point(25, 25),
        },
      });
      markerRef.current = marker;
    }

    const nextIndex = index + 1;
    if (nextIndex >= data.length || !markerRef.current) return;

    const start = data[index].geo;
    const end = data[nextIndex].geo;

    animateMarker(markerRef.current, start, end, animationDuration, () => {
      // 🔁 continue until end
      setIndex(nextIndex);
    });
  }, [index, isPlaying, animationDuration]);

  // 🚗 Update marker rotation
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const point = data[index];
    const rotation = bearingValue.get();

    markerRef.current.setPosition(point.geo);
    // mapRef.current.panTo(point.geo);

    const icon = markerRef.current.getIcon() as google.maps.Icon;
    if (icon && typeof icon === "object") {
      (icon as any).rotation = rotation;
      markerRef.current.setIcon(icon);
    }

    // Pre-calculate next bearing
    if (data[index + 1]) {
      setBearing(
        calculateBearing(
          point.geo.lat,
          point.geo.lng,
          data[index + 1].geo.lat,
          data[index + 1].geo.lng
        )
      );
    }
  }, [index, bearingValue, data]);

  // 🗺️ Init map (no marker at load)
  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    // 🟢 Start marker (green)
    const startMarker = new google.maps.Marker({
      position: data[0].geo,
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#00C853",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#ffffff",
        scale: 8,
      },
      title: "Start Point",
    });
    startMarkerRef.current = startMarker;

    // 🔴 End marker (red)
    const endMarker = new google.maps.Marker({
      position: data[data.length - 1].geo,
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#D50000",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#ffffff",
        scale: 8,
      },
      title: "End Point",
    });
    endMarkerRef.current = endMarker;
  };

  if (!isLoaded)
    return <div className="p-6 text-center">🛰️ Loading map...</div>;

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={data[0].geo}
        zoom={15}
        onLoad={onLoad}
        options={{
          disableDefaultUI: true,
          mapTypeId: "roadmap",
        }}
      >
        <Polyline
          path={data.map((d) => ({ lat: d.geo.lat, lng: d.geo.lng }))}
          options={{
            strokeColor: "#007bff",
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />
      </GoogleMap>

      {/* 🎛️ Controls */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center bg-white/90 backdrop-blur-md px-5 py-3 rounded-full gap-4 shadow-lg">
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="bg-blue-500 text-white rounded-full px-4 py-2 font-semibold"
        >
          {isPlaying ? "⏸ Pause" : "▶️ Play"}
        </button>

        {/* 🏎️ Speed Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAnimationDuration((d) => Math.max(100, d / 2))}
            className="bg-green-500 text-white rounded-full px-3 py-1"
          >
            ⏩ Faster
          </button>
          <button
            onClick={() => setAnimationDuration((d) => Math.min(8000, d * 2))}
            className="bg-yellow-500 text-white rounded-full px-3 py-1"
          >
            🐢 Slower
          </button>
          <span className="text-sm text-gray-700 ml-1 font-semibold">
            {((1000 / animationDuration) * 1).toFixed(1)}x
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={data.length - 1}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
          className="w-64 accent-blue-500"
        />
      </div>

      {/* 🧭 Info */}

      <div className="absolute top-16 left-1/2 -translate-x-1/2">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-6 bg-white/80 backdrop-blur-md border border-gray-200/60 shadow-lg rounded-2xl px-6 py-4">
          {/* Speed */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v9l3 3"
                />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-gray-500 font-medium">Speed</span>
              <span className="text-base font-semibold text-gray-900">
                {data[index].geo.speed} km/h
              </span>
            </div>
          </div>

          {/* ACC */}
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-full ${data[index].geo.acc === "ON" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-gray-500 font-medium">ACC</span>
              <span
                className={`text-base font-semibold ${data[index].geo.acc === "ON" ? "text-green-600" : "text-red-600"}`}
              >
                {data[index].geo.acc}
              </span>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-gray-500 font-medium">Time</span>
              <span className="text-base font-semibold text-gray-900">
                {formatLocalTimeTimeOnly(data[index].devicetime)}
              </span>
            </div>
          </div>

          {/* Distance */}
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A2 2 0 013 15.382V8.618a2 2 0 01.553-1.894L9 4m6 16l5.447-2.724A2 2 0 0021 15.382V8.618a2 2 0 00-.553-1.894L15 4m0 0l-6 16"
                />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-gray-500 font-medium">
                Distance
              </span>
              <span className="text-base font-semibold text-gray-900">
                {(
                  getDistancefromLocations(data.slice(0, index + 1)) / 1000
                ).toFixed(2)}{" "}
                km
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
