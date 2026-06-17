import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
} from "recharts";
import { SpeedFrequency } from "@/types/report";

// const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
//   active,
//   payload,
//   label,
// }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white p-2 border rounded shadow">
//         <p className="font-bold">Speed: {label} km/hr</p>
//         <p>Count: {payload[0].value}</p>
//       </div>
//     );
//   }
//   return null;
// };

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
        <p className="font-bold">Speed: {label} km/hr</p>
        <p>Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function FrequencyChart({ data }: { data: SpeedFrequency[] }) {
  return (
    <Card className="p-2 w-full">
      <h2 className="text-center text-lg font-bold mb-2">Speed Frequency</h2>
      <CardContent className="h-[300px] lg:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7000" stopOpacity={1} />
                <stop offset="100%" stopColor="#e2995f" stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="url(#barGradient)" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
