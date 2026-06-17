"use client";

import React from "react";
import { Polyline } from "@react-google-maps/api";
import { RedisGeo } from "@/types/device";

interface MyPolylineProps {
  locations: RedisGeo[];
}

const VehiclePoliline: React.FC<MyPolylineProps> = ({ locations }) => {
  const options = {
    strokeColor: "#000000",
    strokeOpacity: 0.8,
    strokeWeight: 10,
    fillColor: "#16364d",
    fillOpacity: 0.3,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1,
  };
  const getPath = (): RedisGeo[] => {
    return locations.map((x) => ({ lat: x.lat, lng: x.lng }));
  };

  return <Polyline path={getPath()} options={options} />;
};

export default VehiclePoliline;
