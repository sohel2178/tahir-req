"use client";

import { Marker } from "@react-google-maps/api";

import React, { useEffect, useRef, useState } from "react";
import { getGreatCircleBearing } from "geolib";
import { database, ref, onChildChanged } from "@/lib/firebase-client";
import VehiclePoliline from "./VehiclePoliline";
import { defaultGeo, Device, RedisGeo } from "@/types/device";
import UserVehicleInfo from "../motion/UserVehicleInfo";
import SpeedBadge from "../motion/SpeedBadge";

function LocationMarker({ device, mapRef }: { device: Device; mapRef?: any }) {
  const [geo, setGeo] = useState<RedisGeo>(device.geo ?? defaultGeo);
  const [rotation, setRotation] = useState(0);
  const [locations, setLocations] = useState<RedisGeo[]>([]);

  const myRef = useRef<RedisGeo>(null);

  //   console.log(device, "Device in location marker");

  useEffect(() => {
    // const ref = firebase.singleDeviceRef(device.id);

    const update = (nn: RedisGeo) => {
      setGeo(nn);
    };

    const animate = (newGeo: RedisGeo): void => {
      const oldGeo: RedisGeo = myRef.current
        ? { ...myRef.current }
        : { ...geo };

      const duration = 2500; // 3 seconds
      const startTime = performance.now();

      const startSpeed = oldGeo.speed ?? 0;
      const endSpeed = newGeo.speed ?? 0;

      const startMilage = oldGeo.milage ?? 0;
      const endMilage = newGeo.milage ?? 0;

      const rotation = getGreatCircleBearing(
        { latitude: oldGeo.lat, longitude: oldGeo.lng },
        { latitude: newGeo.lat, longitude: newGeo.lng }
      );
      setRotation(rotation);

      const animateFrame = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // 0 → 1

        // 📍 Position interpolation
        const lat = oldGeo.lat + (newGeo.lat - oldGeo.lat) * progress;
        const lng = oldGeo.lng + (newGeo.lng - oldGeo.lng) * progress;

        // 🚀 Speed interpolation
        const speed = startSpeed + (endSpeed - startSpeed) * progress;

        const milage = startMilage + (endMilage - startMilage) * progress;

        setGeo({
          lat,
          lng,
          acc: newGeo.acc,
          fuel_line: newGeo.fuel_line,
          charging: newGeo.charging,
          pto_io_status: newGeo.pto_io_status,
          update_time: newGeo.update_time,
          over_speed: newGeo.over_speed,
          temperature: newGeo.temperature,
          number_of_satellite: newGeo.number_of_satellite,
          voltage_level: newGeo.voltage_level,
          external_voltage: newGeo.external_voltage,
          gsm_signal_strength: newGeo.gsm_signal_strength,
          speed: Math.round(speed), // 👈 smooth number update
          milage: Math.round(milage),
        });

        if (progress < 1) {
          requestAnimationFrame(animateFrame);
        } else {
          // ✅ Final hard sync
          myRef.current = { ...newGeo };

          mapRef?.current?.panTo({ lat: newGeo.lat, lng: newGeo.lng });

          setGeo((old) => ({
            ...old,
            acc: newGeo.acc,
            update_time: newGeo.update_time,
            speed: newGeo.speed,
            fuel_line: newGeo.fuel_line,
            charging: newGeo.charging,
            pto_io_status: newGeo.pto_io_status,
            over_speed: newGeo.over_speed,
            temperature: newGeo.temperature,
            number_of_satellite: newGeo.number_of_satellite,
            voltage_level: newGeo.voltage_level,
            external_voltage: newGeo.external_voltage,
            gsm_signal_strength: newGeo.gsm_signal_strength,
            milage: newGeo.milage,
          }));
        }
      };

      requestAnimationFrame(animateFrame);
    };

    const deviceRef = ref(database, `devices/${device.id}`);

    const unsubs = onChildChanged(deviceRef, (snapshot) => {
      const data = snapshot.val();

      // console.log(data, "Updated data");
      animate(data);
      setLocations((old) => [...old, data].slice(-50));
    });

    return () => unsubs();
  }, [device.id, geo]);
  return (
    <div>
      <Marker
        position={{ lat: geo.lat, lng: geo.lng }}
        clickable={true}
        // onClick={() => setVisible(true)}
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

      <UserVehicleInfo geo={geo} />

      <div className="fixed top-16  right-0 z-40">
        <SpeedBadge title="Speed (k/h)" speed={Number(geo.speed) || 0} />
      </div>

      <div className="fixed top-16  left-0 z-40">
        <SpeedBadge
          title="Distance (km)"
          speed={Number(geo.milage) / 1000 || 0}
          isLeft={true}
        />
      </div>
    </div>
  );
}

export default LocationMarker;
