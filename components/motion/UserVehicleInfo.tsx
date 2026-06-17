import { RedisGeo } from "@/types/device";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import VehicleInfo from "@/components/map/VehicleInfo";

export default function UserVehicleInfo({ geo }: { geo: RedisGeo }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ height: open ? "70%" : "56px" }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-2xl shadow-xl overflow-hidden"
    >
      {/* Handle */}
      <div
        className="h-14 flex items-center justify-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown /> : <ChevronUp />}
      </div>

      {/* Content */}
      {open && (
        <div className="px-4 pb-6 overflow-y-auto h-full">
          <VehicleInfo geo={geo} />
        </div>
      )}
    </motion.div>
  );
}
