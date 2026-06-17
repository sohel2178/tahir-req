import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import OffOn from "./OffOn";
import { formatLocalTime, getStopDuration } from "@/lib/utils";

import { getDistance } from "geolib";
import Speed from "./Speed";
import { Device, RedisGeo } from "@/types/device";

const plurl =
  "https://eu1.locationiq.com/v1/reverse.php?key=pk.5bb41df99bb77e1a059a77cfd4a61d15";

interface Props {
  title: string;
  geo: RedisGeo;
  device: Device;
}

function VehicleInfo({ title, geo, device }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState("");

  const addressRef = useRef<RedisGeo>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (isOpen) {
        const url =
          plurl + "&lat=" + geo.lat + "&lon=" + geo.lng + "&format=json";

        // console.log('Open');

        if (addressRef.current) {
          //   console.log('Address Ref', addressRef.current);

          // geo.lat

          const distance = getDistance(
            { lat: addressRef.current.lat, lng: addressRef.current.lng },
            { lat: geo.lat, lng: geo.lng }
          );

          //   console.log(distance, 'Distance');

          if (distance < 100) return;
        }

        // console.log('Called ');

        fetch(url)
          .then((response) => {
            response
              .json()
              .then((data) => {
                addressRef.current = { ...geo };
                setAddress(data.display_name);
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [geo, isOpen]);

  return (
    <motion.div
      initial={{ y: "80%" }} // Start off-screen
      animate={{ y: isOpen ? 0 : "80%" }} // Slide up when open
      exit={{ y: "80%" }} // Slide down when closed
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="w-full bg-white shadow-sm flex flex-col h-[50%] absolute right-0 bottom-0 md:w-1/2 lg:w-1/3 xl:w-1/4"
    >
      <div className="flex justify-between items-center px-6 py-4 h-[20%]">
        <p className="semi-bold ">{title}</p>
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <ChevronDown className="text-2xl" />
          ) : (
            <ChevronUp className="text-2xl" />
          )}
        </Button>
      </div>

      <div
        className="w-full mx-5 bg-orange-200 h-[1px]"
        style={{ width: "calc(100% - 2rem)" }}
      ></div>
      {/* <div className="w-full mx-5 bg-orange-200 h-0.5"></div> */}

      <div className="flex flex-1">
        <div className="flex w-full flex-col p-4 space-y-1 subtle-regular">
          <div className="flex justify-between items-center">
            <p className="uppercase">id</p>
            <p className="uppercase">{device.id}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="uppercase">registration number</p>
            <p className="uppercase">{device.registration_number}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="uppercase">speed</p>
            <div className="flex gap-3 items-center ">
              <div className="flex justify-center p-2 bg-gray-900 text-white items-center size-10 dark:bg-white dark:text-gray-800 rounded-full">
                <Speed speed={geo.speed ? geo.speed : 0} />
              </div>
              <p className="uppercase">kmph</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="uppercase">acc</p>
            <OffOn state={geo.acc || "OFF"} />
          </div>

          <div className="flex justify-between items-center">
            <span className="uppercase">Relay</span>
            <OffOn state={geo.fuel_line || "OFF"} />
          </div>

          <div className="flex justify-between items-center">
            <span className="uppercase">Charging</span>
            <OffOn state={geo.charging || "OFF"} />
          </div>

          <div className="flex justify-between items-center">
            <p className="uppercase">number os sattelite</p>
            <p className="uppercase">{geo.number_of_satellite}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="uppercase">voltage level</p>
            <p className="uppercase">{geo.voltage_level}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="uppercase">last update</p>
            <p className="uppercase">{formatLocalTime(geo.update_time)}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="uppercase">stop duration</p>
            <p className="uppercase">{getStopDuration(geo)}</p>
          </div>

          <div className="w-full bg-orange-200 h-[1px]"></div>

          <div className="flex justify-between gap-4">
            <p className="uppercase">address</p>

            <div className="grow">
              <p className="text-right">{address}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default VehicleInfo;
