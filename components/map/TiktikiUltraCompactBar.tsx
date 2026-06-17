"use client";

import { Play, FastForward, Gauge, Clock, Route } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TiktikiUltraCompactBar() {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur",
        "border-t px-2 py-1"
      )}
    >
      <div className="flex items-center gap-2">
        {/* TIME */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
          <Clock className="h-3.5 w-3.5" />
          <span>10:32</span>
        </div>

        {/* SLIDER */}
        <Slider defaultValue={[40]} max={100} step={1} className="flex-1" />

        {/* CONTROLS */}
        <Button size="icon" variant="ghost" className="h-7 w-7">
          <FastForward className="h-4 w-4 rotate-180" />
        </Button>

        <Button size="icon" variant="ghost" className="h-7 w-7">
          <Play className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="ghost" className="h-7 w-7">
          <FastForward className="h-4 w-4" />
        </Button>

        {/* DISTANCE */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
          <span>2.4</span>
          <Route className="h-3.5 w-3.5" />
        </div>

        {/* SPEED */}
        <div className="flex items-center gap-1 font-mono font-bold text-sm whitespace-nowrap">
          <Gauge className="h-4 w-4 text-primary" />
          <span>0.0</span>
        </div>
      </div>
    </div>
  );
}
