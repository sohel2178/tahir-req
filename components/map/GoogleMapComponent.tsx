"use client";

import {
  GoogleMap,
  TrafficLayer,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useRef } from "react";

import LocationMarker from "./LocationMarker";
// import MapDeviceList from "../motion/MapDeviceList";
import { Device } from "@/types/device";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

interface Props {
  device: Device;
}

function GoogleMapComponent({ device }: Props) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // 🗺️ Init map (no marker at load)
  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={{
        lat: device.geo?.lat ?? 23.8103, // fallback lat
        lng: device.geo?.lng ?? 90.4125, // fallback lng
      }}
      zoom={14}
    >
      <LocationMarker device={device} />

      <TrafficLayer />
    </GoogleMap>
  );
}

export default GoogleMapComponent;
