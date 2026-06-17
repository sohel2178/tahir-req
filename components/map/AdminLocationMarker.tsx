"use client";

import { useEffect, useRef } from "react";

import { Device, RedisGeo } from "@/types/device";

interface Props {
  device: Device | null;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

export default function AdminLocationMarker({ device, mapRef }: Props) {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  const lastPosition = useRef<google.maps.LatLng | null>(null);
  const pendingGeos = useRef<RedisGeo[]>([]);
  const isAnimating = useRef(false);
  const pathPoints = useRef<google.maps.LatLng[]>([]);

  const ANIMATION_DURATION = 10000;

  const interpolate = (
    from: google.maps.LatLng,
    to: google.maps.LatLng,
    t: number,
  ) => {
    const lat = from.lat() + (to.lat() - from.lat()) * t;
    const lng = from.lng() + (to.lng() - from.lng()) * t;
    return new google.maps.LatLng(lat, lng);
  };

  const bearing = (from: google.maps.LatLng, to: google.maps.LatLng) => {
    const lat1 = (from.lat() * Math.PI) / 180;
    const lat2 = (to.lat() * Math.PI) / 180;
    const dLng = ((to.lng() - from.lng()) * Math.PI) / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  };

  const animateMarker = (
    from: google.maps.LatLng | null,
    to: google.maps.LatLng,
  ) => {
    if (!mapRef.current) return;

    if (!from) {
      markerRef.current = new google.maps.Marker({
        position: to,
        map: mapRef.current,
        icon: "/car.png",
        anchorPoint: new google.maps.Point(16, 16),
      });

      mapRef.current.setCenter(to);

      pathPoints.current.push(to);
      polylineRef.current?.setPath(pathPoints.current);

      lastPosition.current = to;
      playNext();
      return;
    }

    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      const t = Math.min(elapsed / ANIMATION_DURATION, 1);

      const pos = interpolate(from, to, t);

      markerRef.current?.setPosition(pos);
      markerRef.current?.setIcon({
        url: "/car.png",
        rotation: bearing(from, to),
        scaledSize: new google.maps.Size(40, 40),
      });

      const temp = [...pathPoints.current, pos];
      polylineRef.current?.setPath(temp);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        pathPoints.current.push(to);
        polylineRef.current?.setPath(pathPoints.current);
        lastPosition.current = to;
        playNext();
      }
    };

    requestAnimationFrame(animate);
  };

  const playNext = () => {
    isAnimating.current = false;

    if (pendingGeos.current.length > 0) {
      const next = pendingGeos.current.shift();
      if (next) move(next);
    }
  };

  const move = (geo: RedisGeo) => {
    const to = new google.maps.LatLng(geo.lat, geo.lng);
    const from = lastPosition.current;

    isAnimating.current = true;
    animateMarker(from, to);
  };

  useEffect(() => {
    if (!mapRef.current) return;

    polylineRef.current = new google.maps.Polyline({
      map: mapRef.current,
      strokeColor: "#2563eb",
      strokeWeight: 6,
    });

    return () => {
      markerRef.current?.setMap(null);
      polylineRef.current?.setMap(null);
    };
  }, []);

  useEffect(() => {
    if (!device?.geo) return;

    if (isAnimating.current) {
      pendingGeos.current.push(device.geo);
    } else {
      move(device.geo);
    }
  }, [device?.geo]);

  return null;
}
