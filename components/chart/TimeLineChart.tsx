"use client";

import React from "react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "../ui/card";
import { minToString } from "@/lib/utils";
import { SpeedTimeline } from "@/types/report";

interface CustomTooltipProps extends TooltipProps<number, string> {
  label?: string | number;
  payload?: { value: number }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="font-bold">Time: {minToString(label as number)}</p>
        <p>Speed: {payload[0].value} km/hr</p>
      </div>
    );
  }
  return null;
};

function TimeLineChart({ data }: { data: SpeedTimeline[] }) {
  return (
    <Card className="p-2 w-full">
      <h2 className="text-center text-lg font-bold mb-2">Speed Timeline</h2>

      <CardContent className="h-[300px] lg:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -20 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7000" stopOpacity={1} />
                <stop offset="100%" stopColor="#e2995f" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="url(#barGradient)"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              dot={{ r: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default TimeLineChart;
