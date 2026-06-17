"use client";

import React from "react";

import { useMapStore } from "@/store/map";
import LiveAnimatedMap from "./AdminLiveAnimation";

function GoogleMapComponent() {
  const { selectedDevice } = useMapStore();
  return <LiveAnimatedMap device={selectedDevice} key={selectedDevice?.id} />;
}

export default GoogleMapComponent;
