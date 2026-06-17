"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Props = {
  data: { hour: string; distance: number }[];
};

export const HourlyDistanceChart = ({ data }: Props) => {
  return (
    <div className="w-full h-full bg-white  p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={18}>
          <defs>
            <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f4d6b" />
              <stop offset="100%" stopColor="#16364d" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 10 }}
            label={{ value: "Hour", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            label={{
              value: "KM",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip formatter={(value: number) => [`${value} km`, "Distance"]} />
          <Bar dataKey="distance" radius={[4, 4, 0, 0]} fill="url(#colorKm)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
