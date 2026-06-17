// "use client";

// import {
//   GoogleMap,
//   Marker,
//   Polyline,
//   useJsApiLoader,
//   TrafficLayer,
// } from "@react-google-maps/api";
// import { RedisGeo } from "@/types/device";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { interpolate, calculateBearing } from "@/lib/LatLngInterpolator";

// type Props = {
//   data: RedisGeo[];
// };

// const MAP_OPTIONS: google.maps.MapOptions = {
//   fullscreenControl: false,
//   mapTypeControl: false,
//   streetViewControl: false,
//   zoomControl: false,
//   disableDefaultUI: true, // ❌ remove all controls
// };

// /* ---------------- Utils ---------------- */

// /* ---------------- Component ---------------- */

// export default function LiveAnimatedMap({ data }: Props) {
//   /* ✅ HOOKS FIRST (MANDATORY) */
//   const mapRef = useRef<google.maps.Map | null>(null);
//   const rafRef = useRef<number | null>(null);

//   const [position, setPosition] = useState<google.maps.LatLngLiteral>({
//     lat: data[0]?.lat ?? 0,
//     lng: data[0]?.lng ?? 0,
//   });

//   const [rotation, setRotation] = useState(0);
//   const [basePath, setBasePath] = useState<google.maps.LatLngLiteral[]>([]);
//   const [animatedPoint, setAnimatedPoint] =
//     useState<google.maps.LatLngLiteral | null>(null);

//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
//   });
//   const onLoad = useCallback((map: google.maps.Map) => {
//     mapRef.current = map;
//   }, []);

//   /* ---------------- Animation Effect ---------------- */

//   useEffect(() => {
//     if (data.length < 2) return;

//     const prev = data[data.length - 2];
//     const curr = data[data.length - 1];

//     const from = { lat: prev.lat, lng: prev.lng };
//     const to = { lat: curr.lat, lng: curr.lng };

//     // 🔁 calculate bearing from coordinates
//     const bearing = calculateBearing(prev.lat, prev.lng, curr.lat, curr.lng);
//     setRotation(bearing);

//     let start: number | null = null;
//     const duration = 7000; // smooth live movement

//     const animate = (ts: number) => {
//       if (!start) start = ts;
//       const progress = Math.min((ts - start) / duration, 1);

//       const pos = interpolate(from, to, progress);

//       setPosition(pos);
//       setAnimatedPoint(pos); // 🔥 polyline follows marker
//       mapRef.current?.panTo(pos);

//       if (progress < 1) {
//         rafRef.current = requestAnimationFrame(animate);
//       } else {
//         setBasePath((p) => [...p, to]); // commit segment
//         setAnimatedPoint(null);
//       }
//     };

//     rafRef.current = requestAnimationFrame(animate);

//     return () => {
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     };
//   }, [data]);

//   /* ---------------- SAFE RETURNS ---------------- */

//   if (!isLoaded) {
//     return (
//       <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
//         Loading map…
//       </div>
//     );
//   }

//   if (data.length === 0) {
//     return (
//       <div className="w-full h-full bg-black/5 flex items-center justify-center">
//         <span className="text-sm text-muted-foreground">
//           Waiting for live GPS…
//         </span>
//       </div>
//     );
//   }

//   /* ---------------- MAP RENDER ---------------- */

//   return (
//     <GoogleMap
//       zoom={18}
//       center={position}
//       mapContainerStyle={{ width: "100%", height: "100%" }}
//       onLoad={onLoad}
//       options={MAP_OPTIONS}
//     >
//       <TrafficLayer />
//       {/* 🟢 Live Path */}
//       <Polyline
//         path={animatedPoint ? [...basePath, animatedPoint] : basePath}
//         options={{
//           strokeColor: "#2563eb",
//           strokeOpacity: 0.9,
//           strokeWeight: 10,
//         }}
//       />

//       {/* 🚗 Vehicle Marker (NEW DESIGN) */}
//       <Marker
//         position={position}
//         icon={{
//           path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z",
//           scale: 1,
//           rotation,
//           anchor: new google.maps.Point(25, 25),
//           fillColor: "black",
//           fillOpacity: 1,
//           strokeColor: "green",
//           strokeWeight: 2,
//         }}
//       />
//     </GoogleMap>
//   );
// }

"use client";

import {
  GoogleMap,
  Marker,
  Polyline,
  TrafficLayer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Device, RedisGeo } from "@/types/device";
import { useCallback, useEffect, useRef, useState } from "react";
import { interpolate, calculateBearing } from "@/lib/LatLngInterpolator";
import { useLiveGeo } from "@/hooks/useLiveGeo";
import { Checkbox } from "@/components/ui/checkbox";
type Props = {
  device?: Device | null;
};

const MAP_OPTIONS: google.maps.MapOptions = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  zoomControl: false,
  disableDefaultUI: true,
};

export default function LiveAnimatedMap({ device }: Props) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const rafRef = useRef<number | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const autoPanRef = useRef(true);

  const data = useLiveGeo(device?.id ?? "", device?.geo);

  const pendingGeos = useRef<RedisGeo[]>([]);
  const isAnimating = useRef(false);
  const lastGeo = useRef<RedisGeo | null>(null);

  const [autoPan, setAutoPan] = useState(true);

  const [position, setPosition] = useState<google.maps.LatLngLiteral>({
    lat: data.length
      ? Number(data[data.length - 1].lat)
      : device?.geo?.lat
        ? Number(device.geo.lat)
        : 0,
    lng: data.length
      ? Number(data[data.length - 1].lng)
      : device?.geo?.lng
        ? Number(device.geo.lng)
        : 0,
  });

  const [rotation, setRotation] = useState(0);

  const [basePath, setBasePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [animatedPoint, setAnimatedPoint] =
    useState<google.maps.LatLngLiteral | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    if (position) {
      map.setCenter(position);
    }
  }, []);

  useEffect(() => {
    autoPanRef.current = autoPan;
  }, [autoPan]);

  /* RESET WHEN DEVICE CHANGES */

  useEffect(() => {
    if (!data.length) return;

    const geo = data[data.length - 1];

    const start = {
      lat: Number(geo.lat),
      lng: Number(geo.lng),
    };

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    pendingGeos.current = [];
    isAnimating.current = false;
    lastGeo.current = geo;

    setPosition(start);
    setBasePath([start]);
    setAnimatedPoint(null);
    setRotation(0);

    mapRef.current?.panTo(start);
  }, [device]);

  /* INSERT SORTED (ANDROID STYLE) */

  const insertGeoSortedByTime = (geo: RedisGeo) => {
    const newTime = new Date(geo.devicetime ?? 0).getTime();

    let index = 0;

    while (index < pendingGeos.current.length) {
      const existingTime = new Date(
        pendingGeos.current[index].devicetime ?? 0,
      ).getTime();

      if (newTime < existingTime) break;

      index++;
    }

    pendingGeos.current.splice(index, 0, geo);
  };

  /* PLAY NEXT GEO */

  const playNext = () => {
    if (pendingGeos.current.length === 0) return;

    const next = pendingGeos.current.shift();
    if (next) move(next);
  };

  /* MOVE (ANDROID STYLE) */

  const move = (geo: RedisGeo) => {
    // if (!lastGeo.current) {
    //   lastGeo.current = geo;
    //   return;
    // }

    if (!lastGeo.current) {
      const pos = {
        lat: Number(geo.lat),
        lng: Number(geo.lng),
      };

      lastGeo.current = geo;

      setPosition(pos);
      setBasePath([pos]);
      mapRef.current?.setCenter(pos);

      return;
    }

    const from = {
      lat: Number(lastGeo.current.lat),
      lng: Number(lastGeo.current.lng),
    };

    const to = {
      lat: Number(geo.lat),
      lng: Number(geo.lng),
    };

    const bearing = calculateBearing(from.lat, from.lng, to.lat, to.lng);
    setRotation(bearing);

    const BASE_DURATION = 10000;

    const pending = pendingGeos.current.length;

    const duration = Math.floor(
      pending > 0 ? BASE_DURATION / (pending + 1) : BASE_DURATION,
    );

    // console.log("Duration", duration, "ms for pending geos:", pending);

    let start: number | null = null;

    isAnimating.current = true;

    const animate = (ts: number) => {
      if (!start) start = ts;

      const progress = Math.min((ts - start) / duration, 1);

      const pos = interpolate(from, to, progress);

      // markerRef.current?.setPosition(pos);

      setPosition(pos);
      setAnimatedPoint(pos);

      if (autoPanRef.current && mapRef.current) {
        mapRef.current.setCenter(pos);
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        lastGeo.current = geo;

        setBasePath((p) => [...p, to]);
        setAnimatedPoint(null);

        isAnimating.current = false;

        playNext();
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  /* HANDLE NEW GPS PACKETS */

  useEffect(() => {
    if (!data.length) return;

    console.log("New GPS packet received. Total packets:", data.length);

    const geo = data[data.length - 1];

    if (!geo?.lat || !geo?.lng) return;

    if (isAnimating.current) {
      insertGeoSortedByTime(geo);
    } else {
      move(geo);
    }
  }, [data.length]);

  if (!isLoaded) return <div>Loading map…</div>;

  if (!data.length) return <div>Waiting for GPS…</div>;

  return (
    <GoogleMap
      zoom={18}
      mapContainerStyle={{ width: "100%", height: "100%" }}
      onLoad={onLoad}
      onDragStart={() => setAutoPan(false)}
      options={MAP_OPTIONS}
    >
      <TrafficLayer />

      <Polyline
        path={animatedPoint ? [...basePath, animatedPoint] : basePath}
        options={{
          strokeColor: "#2563eb",
          strokeOpacity: 0.9,
          strokeWeight: 10,
        }}
      />

      <Marker
        position={position}
        onLoad={(marker) => (markerRef.current = marker)}
        icon={{
          path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z",
          scale: 1,
          rotation,
          anchor: new google.maps.Point(25, 25),
          fillColor: "black",
          fillOpacity: 1,
          strokeColor: lastGeo.current?.acc === "ON" ? "green" : "red",
          strokeWeight: 2,
        }}
      />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white p-2 rounded shadow">
        <Checkbox
          checked={autoPan}
          onCheckedChange={(v) => setAutoPan(Boolean(v))}
        />
        <span className="text-sm">Auto Pan</span>
      </div>
    </GoogleMap>
  );
}
