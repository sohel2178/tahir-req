"use client";

import {
  Play,
  Pause,
  FastForward,
  Gauge,
  Clock,
  Route,
  Calendar,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useTransform } from "framer-motion";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

type Props = {
  playing: boolean;
  onPlayToggle: () => void;
  speed: number;
  onSpeedChange: (v: number) => void;
  progress: number;
  onSeek: (v: number) => void;
  speedValue: number;
  distance: number;
  time?: string;
  currentDistance: number;
};

const SPEED_LEVELS = [1, 2, 4, 8, 16];

export default function BottomInfoBar({
  playing,
  onPlayToggle,
  speed,
  onSpeedChange,
  progress,
  onSeek,
  speedValue,
  distance,
  time,
  currentDistance,
}: Props) {
  const dateObj = time ? new Date(time) : null;

  const nextSpeed = () => {
    const idx = SPEED_LEVELS.indexOf(speed);
    onSpeedChange(SPEED_LEVELS[(idx + 1) % SPEED_LEVELS.length]);
  };

  const animatedSpeed = useAnimatedNumber(speedValue);
  const speedText = useTransform(animatedSpeed, (v) => v.toFixed(1));

  const animatedCurrentDistance = useAnimatedNumber(currentDistance / 1000);

  const currentDistanceText = useTransform(animatedCurrentDistance, (v) =>
    v.toFixed(2)
  );

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50
                 bg-white/90 backdrop-blur-xl
                 border-t shadow-[0_-8px_30px_rgba(0,0,0,0.08)]
                 px-4 py-4"
    >
      {/* 🔹 PROGRESS */}
      <motion.div layout>
        <Slider
          value={[progress]}
          max={100}
          step={1}
          onValueChange={(v) => onSeek(v[0])}
        />
      </motion.div>

      {/* 🔹 MAIN ROW */}
      <div className="mt-4 grid grid-cols-3 items-center">
        {/* 🗓 DATE / TIME */}
        <div className="space-y-1 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {dateObj
                ? dateObj.toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "--"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {dateObj
                ? dateObj.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "--"}
            </span>
          </div>
        </div>

        {/* ▶️ PLAY / SPEED */}
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ scale: playing ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              size="icon"
              onClick={onPlayToggle}
              className="h-12 w-12 rounded-full shadow-md"
            >
              <AnimatePresence mode="wait">
                {playing ? (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                  >
                    <Pause />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                  >
                    <Play />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          <Button
            size="icon"
            variant="outline"
            onClick={nextSpeed}
            className="h-10 w-10"
          >
            <FastForward />
          </Button>

          <motion.span
            key={speed}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-sm font-semibold"
          >
            {speed}×
          </motion.span>
        </div>

        {/* 🚗 SPEED / DISTANCE */}
        <div className="flex flex-col items-end gap-1 text-sm">
          <motion.div className="flex items-center gap-1 font-mono font-semibold">
            <Gauge className="h-4 w-4 text-primary" />
            <motion.span>{speedText}</motion.span>
            <span className="text-xs text-muted-foreground">km/h</span>
          </motion.div>

          <motion.div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Route className="h-4 w-4" />

            <motion.span>{currentDistanceText}</motion.span>
            <span className="opacity-60">/</span>
            <span>{(distance / 1000).toFixed(2)}</span>

            <span>km</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
