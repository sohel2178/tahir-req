"use client";

import { cn } from "@/lib/utils";

type SignalStrengthProps = {
  /** Allowed: 0, 25, 50, 75, 100 */
  value: 0 | 25 | 50 | 75 | 100;
  size?: "sm" | "md";
};

export function SignalStrength({ value, size = "md" }: SignalStrengthProps) {
  const totalBars = 5;

  // Android-equivalent logic
  let activeBars = 0;
  if (value === 0) activeBars = 0;
  else if (value === 100) activeBars = 5;
  else activeBars = value / 25 + 1; // 25→1, 50→2, 75→3

  const barHeights = size === "sm" ? [4, 6, 8, 10, 12] : [6, 10, 14, 18, 22];

  return (
    <div className="flex items-end gap-1">
      {Array.from({ length: totalBars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-sm transition-colors",
            i < activeBars ? "bg-green-500" : "bg-gray-300"
          )}
          style={{ height: barHeights[i] }}
        />
      ))}
    </div>
  );
}
