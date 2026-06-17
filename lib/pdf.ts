import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MonthlyItem } from "@/types/report";
import { Device } from "@/types/device";
import dateformat from "dateformat";
import {
  formatDuration,
  getFuelConsumption,
  getMonthlyDataInfo,
} from "@/lib/utils";

const createDateString = (day: number, month: number, year: number) => {
  const d = day < 10 ? `0${day}` : day;
  const m = month + 1 < 10 ? `0${month + 1}` : month + 1; // month is 0-indexed
  return `${d}-${m}-${year}`;
};

export function generateMonthlyPdf(
  device: Device,
  items: MonthlyItem[],
  monthYear: string
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const info = getMonthlyDataInfo(items);

  // 🔹 Title
  const pageWidth = doc.internal.pageSize.getWidth();

  // 🔹 Title (perfectly centered)
  doc.setFontSize(16);
  doc.text("Monthly Report", pageWidth / 2, 15, { align: "center" });

  // 🔹 Device Info
  doc.setFontSize(10);
  doc.text(`Device ID: ${device.id}`, 14, 25);
  doc.text(`Registration: ${device.registration_number}`, 14, 31);
  doc.text(`Report Month: ${monthYear}`, 14, 37);

  // 🔹 Table Head
  const head = [
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

  // 🔹 Table Body
  const body = items.map((item) => [
    createDateString(item._id.day, item._id.month, item._id.year),
    item.start_time ? dateformat(item.start_time, "hh:MM TT") : "-",
    item.end_time ? dateformat(item.end_time, "hh:MM TT") : "-",
    item.duration ? formatDuration(item.duration) : "0 min",
    item.congestion_time ? formatDuration(item.congestion_time) : "0 min",
    item.idle_time ? formatDuration(item.idle_time) : "0 min",
    (item.distance / 1000).toFixed(2),
    getFuelConsumption(
      item.distance,
      device.mileage ? device.mileage : 8,
      device.congestion_consumption,
      item.congestion_time
    ).toFixed(2),
  ]);

  autoTable(doc, {
    startY: 45,
    head,
    body,
    styles: {
      fontSize: 9,
      halign: "center",
    },
    headStyles: {
      fillColor: [22, 54, 77], // #16364d
      textColor: 255,
    },
    theme: "grid",
  });

  autoTable(doc, {
    startY: 45,
    head,
    body,
    foot: [
      [
        "TOTAL",
        "",
        "",
        "",
        "",
        "",
        (info.totalDistance / 1000).toFixed(2),
        getFuelConsumption(
          info.totalDistance,
          device.mileage ? device.mileage : 8,
          device.congestion_consumption,
          info.totalCongestionTime
        ).toFixed(2),
      ],
    ],
    styles: {
      fontSize: 9,
      halign: "center",
    },
    headStyles: {
      fillColor: [22, 54, 77],
      textColor: 255,
      fontStyle: "bold",
    },
    footStyles: {
      fillColor: [41, 128, 185], // blue-ish footer like screenshot
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { halign: "center" },
      6: { halign: "right" },
      7: { halign: "right" },
    },
    theme: "grid",
  });

  // 🔹 Download
  doc.save(`Monthly_Report_${device.registration_number}_${monthYear}.pdf`);
}
