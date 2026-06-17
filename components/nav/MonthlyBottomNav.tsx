"use client";

import { ClipboardPlus, ChartNoAxesCombined, Route } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Trip Report", icon: Route },
  { label: "Hourly Report", icon: ClipboardPlus },
  { label: "Chart", icon: ChartNoAxesCombined },
];

export function MonthlyBottomBottomNav({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      {nav.map((n) => {
        const active = activeIndex === nav.indexOf(n);
        const Icon = n.icon;
        return (
          <div
            key={n.label}
            className={cn(
              "flex flex-col items-center text-xs",
              active ? "text-[#16364d] font-semibold" : "text-gray-400"
            )}
            onClick={() => setActiveIndex(nav.indexOf(n))}
          >
            <Icon className={cn("h-5 w-5 mb-1", active && "text-[#16364d]")} />
            {n.label}
          </div>
        );
      })}
    </nav>
  );
}
