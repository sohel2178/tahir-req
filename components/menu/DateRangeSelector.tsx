"use client";

import * as React from "react";
import { CalendarArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date, end: Date) => void;
};

type Step = "start-date" | "start-time" | "end-date" | "end-time";

function TimePicker({
  date,
  onChange,
  onComplete,
}: {
  date: Date;
  onChange: (date: Date) => void;
  onComplete: () => void;
}) {
  const toTimeValue = (d: Date) => d.toTimeString().slice(0, 8);

  const onTimeChange = (value: string) => {
    if (value.length < 5) return; // ⛔ ignore partial typing

    const [h, m, s = "0"] = value.split(":");

    const updated = new Date(date);
    updated.setHours(+h);
    updated.setMinutes(+m);
    updated.setSeconds(+s);

    onChange(updated);
  };

  return (
    <Input
      type="time"
      step="1"
      value={toTimeValue(date)}
      onChange={(e) => onTimeChange(e.target.value)}
      onBlur={onComplete} // ✅ USER FINISHED
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onComplete(); // ✅ keyboard submit
        }
      }}
      className="bg-background appearance-none
        [&::-webkit-calendar-picker-indicator]:hidden
        [&::-webkit-calendar-picker-indicator]:appearance-none"
    />
  );
}

export function DateRangeSelector({ startDate, endDate, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<Step>("start-date");

  const [tempStart, setTempStart] = React.useState<Date | null>(startDate);
  const [tempEnd, setTempEnd] = React.useState<Date | null>(endDate);

  const close = () => {
    setOpen(false);
    setStep("start-date");
  };

  const confirm = () => {
    if (!tempStart || !tempEnd) return;
    if (tempEnd < tempStart) {
      alert("End time must be after start time ⏰");
      return;
    }
    onChange(tempStart, tempEnd);
    close();
  };

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

      <PopoverContent className="w-[320px] p-3 space-y-3 z-[9999]">
        {/* STEP TITLE */}
        <div className="text-sm font-medium text-center">
          {step === "start-date" && "Select Start Date"}
          {step === "start-time" && "Select Start Time"}
          {step === "end-date" && "Select End Date"}
          {step === "end-time" && "Select End Time"}
        </div>

        {/* START DATE */}
        {step === "start-date" && (
          <Calendar
            mode="single"
            selected={tempStart ?? undefined}
            onSelect={(d) => {
              if (!d) return;
              setTempStart(d);
              setStep("start-time");
            }}
          />
        )}

        {/* START TIME */}
        {step === "start-time" && tempStart && (
          <TimePicker
            date={tempStart}
            onChange={setTempStart}
            onComplete={() => setStep("end-date")}
          />
        )}

        {/* END DATE */}
        {step === "end-date" && (
          <Calendar
            mode="single"
            selected={tempEnd ?? undefined}
            fromDate={tempStart ?? undefined}
            onSelect={(d) => {
              if (!d) return;
              setTempEnd(d);
              setStep("end-time");
            }}
          />
        )}

        {/* END TIME */}
        {step === "end-time" && tempEnd && (
          <TimePicker
            date={tempEnd}
            onChange={setTempEnd}
            onComplete={confirm}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
