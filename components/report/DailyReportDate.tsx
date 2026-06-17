// 'use client';

// import React, { useState } from 'react';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { Button } from '@/components/ui/button';
// import { format } from 'date-fns';

// import { DayPicker } from 'react-day-picker';
// // import 'react-day-picker/dist/style.css';
// import 'react-day-picker/style.css';

// interface Props {
//   date: Date;
//   setDate: (date: Date) => void;
// }

// function DailyReportDate({ date, setDate }: Props) {
//   const [open, setOpen] = useState(false);
//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button variant="outline" onClick={() => setOpen((prev) => !prev)}>
//           {date ? format(date, 'PPP') : 'Select Date'}
//         </Button>
//       </PopoverTrigger>

//       <PopoverContent
//         className="w-auto p-4 background-light900_dark200 light-border"
//         align="end"
//       >
//         <DayPicker
//           mode="single"
//           selected={date}
//           onSelect={(selectedDate) => {
//             if (selectedDate) {
//               setDate(selectedDate); // Update state with selected date
//               setOpen(false); // Close Popover
//             }
//           }}
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }

// export default DailyReportDate;

"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  date: Date | undefined;
  setDate: (date: Date) => void;
}

export default function DailyReportDate({ date, setDate }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          onClick={() => setOpen((prev) => !prev)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Select Date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
              setOpen(false);
            }
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
