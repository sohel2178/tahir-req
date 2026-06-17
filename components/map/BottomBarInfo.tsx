"use client";
import { Play, FastForward, Gauge, Clock, Route } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
export default function BottomInfoBar() {
  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-t-xl px-3 py-2 shadow-lg">
      {" "}
      {/* TOP ROW */}{" "}
      <div className="flex items-center gap-2">
        {" "}
        {/* Slider */}{" "}
        <Slider defaultValue={[30]} max={100} step={1} className="flex-1" />{" "}
        {/* Controls */}{" "}
        <Button size="icon" variant="outline" className="h-8 w-8">
          {" "}
          <FastForward className="h-4 w-4 rotate-180" />{" "}
        </Button>{" "}
        <Button size="icon" variant="outline" className="h-8 w-8">
          {" "}
          <Play className="h-4 w-4" />{" "}
        </Button>{" "}
        <Button size="icon" variant="outline" className="h-8 w-8">
          {" "}
          <FastForward className="h-4 w-4" />{" "}
        </Button>{" "}
      </div>{" "}
      {/* INFO ROW */}{" "}
      <div className="mt-2 grid grid-cols-3 items-center text-xs">
        {" "}
        {/* TIME */}{" "}
        <div className="flex items-center gap-1 text-muted-foreground">
          {" "}
          <Clock className="h-4 w-4" /> <span>10:32 AM</span>{" "}
        </div>{" "}
        {/* SPEED */}{" "}
        <div className="flex items-center justify-center gap-1 font-mono font-semibold">
          {" "}
          <Gauge className="h-4 w-4 text-primary" /> <span>0.00</span>{" "}
          <span className="text-muted-foreground">KM/H</span>{" "}
        </div>{" "}
        {/* DISTANCE */}{" "}
        <div className="flex items-center justify-end gap-1 text-muted-foreground">
          {" "}
          <span>2.45 KM</span> <Route className="h-4 w-4" />{" "}
        </div>{" "}
      </div>{" "}
    </Card>
  );
}
