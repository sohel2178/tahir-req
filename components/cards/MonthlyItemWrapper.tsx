"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

interface Props {
  children: React.ReactNode;
  day: number;
  distance: number;
  unit: string;
}

function MonthlyItemWrapper({ day, distance, unit, children }: Props) {
  const [visible, setSevible] = useState(false);
  return (
    <MotionConfig transition={{ duration: 0.3, type: "spring", damping: 20 }}>
      <motion.div
        className="w-full overflow-hidden  md:w-[300px] lg:w-[400px] xl:w-[450px]"
        layout
      >
        <Card className="w-full p-0">
          <CardHeader className="p-2">
            <CardTitle>
              <motion.div layout className="flex justify-between items-center">
                <div className="bg-primary-500 size-10 flex justify-center items-center rounded-full">
                  {day}
                </div>
                <div className="flex flex-1 justify-end items-center gap-2">
                  <span>
                    {(distance / 1000).toFixed(2)} {unit}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setSevible(!visible)}
                  >
                    {visible ? (
                      <ChevronUp className="text-2xl" />
                    ) : (
                      <ChevronDown className="text-2xl" />
                    )}
                  </Button>
                </div>
              </motion.div>
            </CardTitle>
          </CardHeader>
          {visible && (
            <CardContent>
              <AnimatePresence>{children}</AnimatePresence>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </MotionConfig>
  );
}

export default MonthlyItemWrapper;
