import * as XLSX from "xlsx";
import { MonthlyItem } from "@/types/report";
import { Device } from "@/types/device";
import dateformat from "dateformat";
import {
  formatDuration,
  getFuelConsumption,
  getMonthlyDataInfo,
} from "@/lib/utils";

const headerStyle = {
  font: { bold: true, color: { rgb: "FFFFFF" } },
  fill: { fgColor: { rgb: "16364D" } }, // dark blue
  alignment: { horizontal: "center", vertical: "center" },
};

const totalStyle = {
  font: { bold: true, color: { rgb: "FFFFFF" } },
  fill: { fgColor: { rgb: "2E86C1" } }, // blue
  alignment: { horizontal: "right" },
};

const cellCenter = {
  alignment: { horizontal: "center" },
};

const createDateString = (day: number, month: number, year: number) => {
  const d = day < 10 ? `0${day}` : day;
  const m = month + 1 < 10 ? `0${month + 1}` : month + 1;
  return `${d}-${m}-${year}`;
};

export function generateMonthlyExcel(
  device: Device,
  items: MonthlyItem[],
  monthYear: string
) {
  const info = getMonthlyDataInfo(items);

  const data: any[][] = [
    ["Monthly Report"],
    [],
    ["Device ID", device.id],
    ["Registration", device.registration_number],
    ["Report Month", monthYear],
    [],
    [
      "Date",
      "Start Time",
      "End Time",
      "Running Time",
      "Jam Time",
      "Idle Time",
      "Distance (KM)",
      "Fuel (L)",
    ],
  ];

  items.forEach((item) => {
    data.push([
      createDateString(item._id.day, item._id.month, item._id.year),
      item.start_time ? dateformat(item.start_time, "hh:MM TT") : "-",
      item.end_time ? dateformat(item.end_time, "hh:MM TT") : "-",
      item.duration ? formatDuration(item.duration) : "0 min",
      item.congestion_time ? formatDuration(item.congestion_time) : "0 min",
      item.idle_time ? formatDuration(item.idle_time) : "0 min",
      Number((item.distance / 1000).toFixed(2)),
      Number(
        getFuelConsumption(
          item.distance,
          device.mileage ?? 8,
          device.congestion_consumption,
          item.congestion_time
        ).toFixed(2)
      ),
    ]);
  });

  // TOTAL row
  const totalRowIndex = data.length + 1;
  data.push([]);
  data.push([
    "TOTAL",
    "",
    "",
    "",
    "",
    "",
    Number((info.totalDistance / 1000).toFixed(2)),
    Number(
      getFuelConsumption(
        info.totalDistance,
        device.mileage ?? 8,
        device.congestion_consumption,
        info.totalCongestionTime
      ).toFixed(2)
    ),
  ]);

  const ws = XLSX.utils.aoa_to_sheet(data);

  // 🔹 Column widths
  ws["!cols"] = [
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 14 },
    { wch: 12 },
  ];

  // 🔹 Merge title
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];

  // 🔹 Freeze header row
  ws["!freeze"] = { ySplit: 7 };

  // 🔹 Auto filter
  ws["!autofilter"] = { ref: "A7:H7" };

  // 🔹 Apply header styles
  for (let c = 0; c < 8; c++) {
    const cell = ws[XLSX.utils.encode_cell({ r: 6, c })];
    if (cell) cell.s = headerStyle;
  }

  // 🔹 Apply body alignment
  for (let r = 7; r < data.length; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      if (cell && !cell.s) cell.s = cellCenter;
    }
  }

  // 🔹 Apply TOTAL row style
  const totalRow = data.length - 1;
  for (let c = 0; c < 8; c++) {
    const cell = ws[XLSX.utils.encode_cell({ r: totalRow, c })];
    if (cell) cell.s = totalStyle;
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Monthly Report");

  XLSX.writeFile(
    wb,
    `Monthly_Report_${device.registration_number}_${monthYear}.xlsx`
  );
}
