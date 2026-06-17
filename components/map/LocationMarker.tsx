// "use client";

// import { Marker } from "@react-google-maps/api";
// import React, { useEffect, useRef, useState } from "react";
// import { getGreatCircleBearing } from "geolib";
// import { database, ref, onChildChanged } from "@/lib/firebase-client";

// import VehiclePoliline from "./VehiclePoliline";
// import VehicleInfo from "../motion/VehicleInfo";
// import { defaultGeo, Device, RedisGeo } from "@/types/device";

// interface Props {
//   device: Device;
//   mapRef: React.MutableRefObject<google.maps.Map | null>;
// }

// function LocationMarker({ device, mapRef }: Props) {
//   const [geo, setGeo] = useState<RedisGeo>(device.geo ?? defaultGeo);
//   const [rotation, setRotation] = useState(0);
//   const [locations, setLocations] = useState<RedisGeo[]>([]);

//   const previousGeoRef = useRef<RedisGeo | null>(null);

//   // 🚀 Pan map when device changes
//   useEffect(() => {
//     if (!mapRef.current || !device?.geo) return;

//     mapRef.current.panTo({
//       lat: device.geo.lat,
//       lng: device.geo.lng,
//     });

//     setGeo(device.geo);
//     previousGeoRef.current = device.geo;
//     setLocations([]);
//   }, [device.id]);

//   useEffect(() => {
//     const deviceRef = ref(database, `devices/${device.id}`);

//     const animate = (newGeo: RedisGeo) => {
//       const oldGeo = previousGeoRef.current ?? device.geo ?? defaultGeo;

//       let step = 20;

//       const deltaLat = (newGeo.lat - oldGeo.lat) / step;
//       const deltaLng = (newGeo.lng - oldGeo.lng) / step;

//       const bearing = getGreatCircleBearing(
//         { latitude: oldGeo.lat, longitude: oldGeo.lng },
//         { latitude: newGeo.lat, longitude: newGeo.lng },
//       );

//       setRotation(bearing);

//       const anim = () => {
//         if (step > 0) {
//           setGeo({
//             lat: oldGeo.lat + (21 - step) * deltaLat,
//             lng: oldGeo.lng + (21 - step) * deltaLng,
//           });

//           requestAnimationFrame(anim);
//           step--;
//         } else {
//           previousGeoRef.current = newGeo;

//           // 🚀 Pan map smoothly when new GPS arrives
//           if (mapRef.current) {
//             mapRef.current.panTo({
//               lat: newGeo.lat,
//               lng: newGeo.lng,
//             });
//           }

//           setGeo((old) => ({
//             ...old,
//             ...newGeo,
//           }));
//         }
//       };

//       requestAnimationFrame(anim);
//     };

//     const unsubscribe = onChildChanged(deviceRef, (snapshot) => {
//       const data = snapshot.val();

//       animate(data);

//       setLocations((old) => [...old, data].slice(-30));
//     });

//     return () => unsubscribe();
//   }, [device.id]);

//   return (
//     <>
//       <Marker
//         position={{ lat: geo.lat, lng: geo.lng }}
//         clickable
//         icon={{
//           path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z",
//           fillColor: "black",
//           fillOpacity: 0.9,
//           strokeColor: geo.acc === "ON" ? "green" : "red",
//           strokeWeight: 2,
//           rotation: rotation,
//           anchor: new google.maps.Point(25, 25),
//         }}
//       />

//       <VehiclePoliline locations={locations} />

//       <VehicleInfo title="Vehicle Info" geo={geo} device={device} />
//     </>
//   );
// }

// export default LocationMarker;

"use client";

import { Marker } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import { getGreatCircleBearing } from "geolib";
import { database, ref, onChildChanged } from "@/lib/firebase-client";

import VehiclePoliline from "./VehiclePoliline";
import VehicleInfo from "../motion/VehicleInfo";
import { defaultGeo, Device, RedisGeo } from "@/types/device";

interface Props {
  device: Device;
  mapRef: React.RefObject<google.maps.Map | null>;
}

function LocationMarker({ device, mapRef }: Props) {
  const [geo, setGeo] = useState<RedisGeo>(device.geo ?? defaultGeo);
  const [rotation, setRotation] = useState(0);
  const [locations, setLocations] = useState<RedisGeo[]>([]);

  const previousGeoRef = useRef<RedisGeo | null>(null);

  const parseGeo = (g: RedisGeo) => {
    const lat = Number(g.lat);
    const lng = Number(g.lng);

    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return null;

    return { ...g, lat, lng };
  };

  // 🚀 When device changes
  useEffect(() => {
    if (!mapRef.current || !device?.geo) return;

    const parsed = parseGeo(device.geo);
    if (!parsed) return;

    mapRef.current.panTo({
      lat: parsed.lat,
      lng: parsed.lng,
    });

    setGeo(parsed);
    previousGeoRef.current = parsed;
    setLocations([]);
  }, [device.id]);

  useEffect(() => {
    const deviceRef = ref(database, `devices/${device.id}`);

    const animate = (newGeoRaw: RedisGeo) => {
      const newGeo = parseGeo(newGeoRaw);
      if (!newGeo) return;

      const oldGeo =
        previousGeoRef.current ??
        (device.geo ? parseGeo(device.geo) : null) ??
        defaultGeo;

      let step = 40;

      const deltaLat = (newGeo.lat - oldGeo.lat) / step;
      const deltaLng = (newGeo.lng - oldGeo.lng) / step;

      const bearing = getGreatCircleBearing(
        { latitude: oldGeo.lat, longitude: oldGeo.lng },
        { latitude: newGeo.lat, longitude: newGeo.lng },
      );

      setRotation(bearing);

      const anim = () => {
        if (step > 0) {
          setGeo({
            ...newGeo,
            lat: oldGeo.lat + (41 - step) * deltaLat,
            lng: oldGeo.lng + (41 - step) * deltaLng,
          });

          step--;
          requestAnimationFrame(anim);
        } else {
          previousGeoRef.current = newGeo;

          if (mapRef.current) {
            mapRef.current.panTo({
              lat: newGeo.lat,
              lng: newGeo.lng,
            });
          }

          setGeo(newGeo);
        }
      };

      requestAnimationFrame(anim);
    };

    const unsubscribe = onChildChanged(deviceRef, (snapshot) => {
      const data = snapshot.val();

      animate(data);

      setLocations((old) => {
        const updated = [...old, data];
        if (updated.length > 30) updated.shift();
        return updated;
      });
    });

    return () => unsubscribe();
  }, [device.id]);

  const lat = Number(geo.lat);
  const lng = Number(geo.lng);

  if (isNaN(lat) || isNaN(lng)) return null;

  return (
    <>
      <Marker
        position={{ lat, lng }}
        clickable
        icon={{
          path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z",
          fillColor: "black",
          fillOpacity: 0.9,
          strokeColor: geo.acc === "ON" ? "green" : "red",
          strokeWeight: 2,
          rotation: rotation,
          anchor: new google.maps.Point(25, 25),
        }}
      />

      <VehiclePoliline locations={locations} />

      <VehicleInfo title="Vehicle Info" geo={geo} device={device} />
    </>
  );
}

export default LocationMarker;

// "use client";

// import { useEffect, useRef } from "react";

// import { Device, RedisGeo } from "@/types/device";

// interface Props {
//   device: Device | null;
//   mapRef: React.MutableRefObject<google.maps.Map | null>;
// }

// export default function AdminLocationMarker({ device, mapRef }: Props) {
//   const markerRef = useRef<google.maps.Marker | null>(null);
//   const polylineRef = useRef<google.maps.Polyline | null>(null);

//   const lastPosition = useRef<google.maps.LatLng | null>(null);
//   const pendingGeos = useRef<RedisGeo[]>([]);
//   const isAnimating = useRef(false);
//   const pathPoints = useRef<google.maps.LatLng[]>([]);

//   const ANIMATION_DURATION = 10000;

//   const interpolate = (
//     from: google.maps.LatLng,
//     to: google.maps.LatLng,
//     t: number,
//   ) => {
//     const lat = from.lat() + (to.lat() - from.lat()) * t;
//     const lng = from.lng() + (to.lng() - from.lng()) * t;
//     return new google.maps.LatLng(lat, lng);
//   };

//   const bearing = (from: google.maps.LatLng, to: google.maps.LatLng) => {
//     const lat1 = (from.lat() * Math.PI) / 180;
//     const lat2 = (to.lat() * Math.PI) / 180;
//     const dLng = ((to.lng() - from.lng()) * Math.PI) / 180;

//     const y = Math.sin(dLng) * Math.cos(lat2);
//     const x =
//       Math.cos(lat1) * Math.sin(lat2) -
//       Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

//     return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
//   };

//   const animateMarker = (
//     from: google.maps.LatLng | null,
//     to: google.maps.LatLng,
//   ) => {
//     if (!mapRef.current) return;

//     if (!from) {
//       markerRef.current = new google.maps.Marker({
//         position: to,
//         map: mapRef.current,
//         icon: "/car.png",
//         anchorPoint: new google.maps.Point(16, 16),
//       });

//       mapRef.current.setCenter(to);

//       pathPoints.current.push(to);
//       polylineRef.current?.setPath(pathPoints.current);

//       lastPosition.current = to;
//       playNext();
//       return;
//     }

//     const start = performance.now();

//     const animate = (time: number) => {
//       const elapsed = time - start;
//       const t = Math.min(elapsed / ANIMATION_DURATION, 1);

//       const pos = interpolate(from, to, t);

//       markerRef.current?.setPosition(pos);
//       markerRef.current?.setIcon({
//         url: "/car.png",
//         rotation: bearing(from, to),
//         scaledSize: new google.maps.Size(40, 40),
//       });

//       const temp = [...pathPoints.current, pos];
//       polylineRef.current?.setPath(temp);

//       if (t < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         pathPoints.current.push(to);
//         polylineRef.current?.setPath(pathPoints.current);
//         lastPosition.current = to;
//         playNext();
//       }
//     };

//     requestAnimationFrame(animate);
//   };

//   const playNext = () => {
//     isAnimating.current = false;

//     if (pendingGeos.current.length > 0) {
//       const next = pendingGeos.current.shift();
//       if (next) move(next);
//     }
//   };

//   const move = (geo: RedisGeo) => {
//     const to = new google.maps.LatLng(geo.lat, geo.lng);
//     const from = lastPosition.current;

//     isAnimating.current = true;
//     animateMarker(from, to);
//   };

//   useEffect(() => {
//     if (!mapRef.current) return;

//     polylineRef.current = new google.maps.Polyline({
//       map: mapRef.current,
//       strokeColor: "#2563eb",
//       strokeWeight: 6,
//     });

//     return () => {
//       markerRef.current?.setMap(null);
//       polylineRef.current?.setMap(null);
//     };
//   }, []);

//   useEffect(() => {
//     if (!device?.geo) return;

//     if (isAnimating.current) {
//       pendingGeos.current.push(device.geo);
//     } else {
//       move(device.geo);
//     }
//   }, [device?.geo]);

//   return null;
// }
