"use client";

import * as React from "react";
import { CalendarArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DailyDateSelector({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (date: Date) => void;
}) {
  const [open, setOpen] = React.useState(false);
  //   const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="flex justify-center items-center font-normal"
        >
          <CalendarArrowDown size={16} className=" text-[#16364d] opacity-80" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0 z-[9999] mx-4 my-1"
        align="start"
        sideOffset={4}
      >
        {/* <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          /> */}

        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => d && (setDate(d), setOpen(false))}
          className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
          buttonVariant="ghost"
        />
      </PopoverContent>
    </Popover>
  );
}
