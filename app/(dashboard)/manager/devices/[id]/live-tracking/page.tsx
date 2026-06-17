// "use client";

// import { useParams } from "next/navigation";
// import GoogleMapComponent from "@/components/map/GoogleMapComponent";
// import { DeviceAPI } from "@/lib/api";
// import { useEffect, useState } from "react";
// import { Device } from "@/types/device";

// export default function LiveTrackingPage() {
//   const { id } = useParams<{ id: string }>();
//   const [device, setDevice] = useState<Device | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     const fetchDevice = async () => {
//       try {
//         const data = await DeviceAPI.getCurrentDevice(id);
//         setDevice(data);
//       } catch (err) {
//         console.error("❌ Failed to fetch device", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDevice();
//   }, [id]);

//   if (!device) {
//     return <p>Device not found in store</p>;
//   }

//   return (
//     <div className="h-full w-full ">
//       {device.geo ? (
//         <GoogleMapComponent device={device} />
//       ) : (
//         <p className="text-center mt-10">
//           No location data available for this device.
//         </p>
//       )}
//     </div>
//   );
// }

"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { DeviceAPI } from "@/lib/api";
import { useMapStore } from "@/store/map";

export default function LiveTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { setSelectedDevice } = useMapStore();

  useEffect(() => {
    if (!id) return;

    const fetchDevice = async () => {
      const device = await DeviceAPI.getCurrentDevice(id);
      setSelectedDevice(device);
    };

    fetchDevice();
  }, [id]);

  return null;
}
