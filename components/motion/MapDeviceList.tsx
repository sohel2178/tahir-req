// "use client";

// import React, { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { motion } from "framer-motion";
// import { usePathname } from "next/navigation";

// import { Device } from "@/types/device";
// import DeviceRecyclerView from "./DeviceRecyclerView";
// import { DeviceAPI } from "@/lib/api";

// interface Props {
//   device: Device;
// }

// const MapDeviceList = ({ device }: Props) => {
//   const pathname = usePathname();

//   const [state, setState] = useState<{
//     isOpen: boolean;
//     renderDevices: Device[];
//   }>({
//     isOpen: false,
//     renderDevices: [],
//   });

//   const [search, setSearch] = useState("");

//   const page = 1;
//   const limit = 10;

//   const fetchDevices = async (searchText = "") => {
//     try {
//       const res = await DeviceAPI.adminDevices(page, limit, searchText);

//       setState((old) => ({
//         ...old,
//         renderDevices: res.data,
//       }));
//     } catch (err) {
//       console.error("Failed to load devices", err);
//     }
//   };

//   // initial load
//   useEffect(() => {
//     fetchDevices("");
//   }, []);

//   // search debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchDevices(search);
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [search]);

//   return (
//     <motion.div
//       initial={{ y: "80%" }}
//       animate={{ y: state.isOpen ? 0 : "80%" }}
//       exit={{ y: "80%" }}
//       transition={{ type: "spring", stiffness: 100, damping: 15 }}
//       className="max-sm:hidden bg-white shadow-sm flex flex-col h-[50%] absolute left-0 bottom-0 md:w-1/2 lg:w-1/3 xl:w-1/4"
//     >
//       <div className="flex gap-2 items-center px-6 py-4 h-[20%]">
//         <input
//           type="text"
//           placeholder="Search device..."
//           className="border rounded-md px-3 py-2 w-full"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <Button
//           variant="outline"
//           onClick={() =>
//             setState((old) => ({
//               ...old,
//               isOpen: !old.isOpen,
//             }))
//           }
//         >
//           {state.isOpen ? (
//             <ChevronDown className="text-2xl" />
//           ) : (
//             <ChevronUp className="text-2xl" />
//           )}
//         </Button>
//       </div>

//       <div
//         className="w-full mx-5 bg-green-200 h-[1px]"
//         style={{ width: "calc(100% - 2rem)" }}
//       />

//       <div className="flex-1 overflow-y-auto">
//         <DeviceRecyclerView
//           items={state.renderDevices}
//           selectedDevice={device}
//           pathname={pathname}
//         />
//       </div>
//     </motion.div>
//   );
// };

// export default MapDeviceList;

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { Device } from "@/types/device";
import { DeviceAPI } from "@/lib/api";
import { useMapStore } from "@/store/map";

import DeviceRecyclerView from "./DeviceRecyclerView";
import { useAuthStore } from "@/store/auth";

const MapDeviceList = () => {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const { selectedDevice } = useMapStore();

  const [isOpen, setIsOpen] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [search, setSearch] = useState("");

  const page = 1;
  const limit = 10;

  const fetchDevices = async (searchText = "") => {
    try {
      let res;

      if (user?.role === "manager") {
        res = await DeviceAPI.managerDevices(page, limit, searchText);
      } else {
        res = await DeviceAPI.adminDevices(page, limit, searchText);
      }

      setDevices(res.data);
    } catch (err) {
      console.error("Failed to load devices", err);
    }
  };

  // initial load
  useEffect(() => {
    fetchDevices("");
  }, []);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDevices(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <motion.div
      initial={{ y: "80%" }}
      animate={{ y: isOpen ? 0 : "80%" }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="max-sm:hidden bg-white shadow-lg flex flex-col h-[45%] absolute left-0 bottom-0 w-full"
    >
      {/* Search + Toggle */}
      <div className="flex gap-2 items-center px-6 py-4">
        <input
          type="text"
          placeholder="Search device..."
          className="border rounded-md px-3 py-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button variant="outline" onClick={() => setIsOpen((v) => !v)}>
          {isOpen ? (
            <ChevronDown className="text-2xl" />
          ) : (
            <ChevronUp className="text-2xl" />
          )}
        </Button>
      </div>

      {/* divider */}
      <div
        className="w-full mx-5 bg-green-200 h-[1px]"
        style={{ width: "calc(100% - 2rem)" }}
      />

      {/* device list */}
      <div className="flex-1 overflow-y-auto">
        <DeviceRecyclerView
          items={devices}
          selectedDevice={selectedDevice}
          pathname={pathname}
        />
      </div>
    </motion.div>
  );
};

export default MapDeviceList;
