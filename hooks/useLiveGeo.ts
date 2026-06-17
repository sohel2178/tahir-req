// import { useEffect, useRef, useState } from "react";
// import { onChildChanged, ref } from "firebase/database";
// import { database } from "@/lib/firebase-client";
// import { RedisGeo } from "@/types/device";

// export function useLiveGeo(deviceId: string, initialGeo?: RedisGeo | null) {
//   const [history, setHistory] = useState<RedisGeo[]>([]);
//   const lastRef = useRef<RedisGeo | null>(null);

//   /* 🔥 SEED from backend immediately */
//   useEffect(() => {
//     if (!initialGeo?.lat || !initialGeo?.lng) return;

//     setHistory([initialGeo, initialGeo]);
//     lastRef.current = initialGeo;
//   }, [initialGeo?.lat, initialGeo?.lng]);

//   /* 🔴 Firebase updates */
//   useEffect(() => {
//     if (!deviceId) return;

//     const deviceRef = ref(database, `devices/${deviceId}`);

//     const unsubscribe = onChildChanged(deviceRef, (snapshot) => {
//       const geo: RedisGeo = snapshot.val();
//       if (!geo?.lat || !geo?.lng) return;

//       // 🚫 ignore duplicate point
//       if (
//         lastRef.current &&
//         lastRef.current.lat === geo.lat &&
//         lastRef.current.lng === geo.lng
//       ) {
//         return;
//       }

//       lastRef.current = geo;

//       setHistory((prev) => {
//         const next = [...prev, geo];
//         return next.length > 300 ? next.slice(-300) : next;
//       });
//     });

//     return () => unsubscribe();
//   }, [deviceId]);

//   // console.log("🔴 Live geo history points:", history.length);

//   return history;
// }

import { useEffect, useRef, useState } from "react";
import { onChildChanged, ref } from "firebase/database";
import { database } from "@/lib/firebase-client";
import { RedisGeo } from "@/types/device";

export function useLiveGeo(deviceId: string, initialGeo?: RedisGeo | null) {
  const [history, setHistory] = useState<RedisGeo[]>([]);
  const lastRef = useRef<RedisGeo | null>(null);

  /* RESET WHEN DEVICE CHANGES */

  useEffect(() => {
    if (!deviceId) return;

    console.log("🔄 Device switched. Clearing history.");

    setHistory([]);
    lastRef.current = null;
  }, [deviceId]);

  /* SEED INITIAL POSITION */

  useEffect(() => {
    if (!initialGeo?.lat || !initialGeo?.lng) return;

    setHistory([initialGeo, initialGeo]);
    lastRef.current = initialGeo;
  }, [initialGeo?.lat, initialGeo?.lng]);

  /* FIREBASE LISTENER */

  useEffect(() => {
    if (!deviceId) return;

    const deviceRef = ref(database, `devices/${deviceId}`);

    const unsubscribe = onChildChanged(deviceRef, (snapshot) => {
      const geo: RedisGeo = snapshot.val();

      if (!geo?.lat || !geo?.lng) return;

      // console.log("🔴 New geo update received:", geo);

      // ignore duplicate
      if (
        lastRef.current &&
        lastRef.current.lat === geo.lat &&
        lastRef.current.lng === geo.lng
      ) {
        return;
      }

      lastRef.current = geo;

      setHistory((prev) => {
        const next = [...prev, geo];
        return next.length > 100 ? next.slice(-100) : next;
      });
    });

    return () => unsubscribe();
  }, [deviceId]);

  return history;
}
