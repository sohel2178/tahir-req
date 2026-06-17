import React from "react";

interface Props {
  title: string;
  value?: number | string;
  unit?: string;
}

function DailyReportInfoCard({ title, value, unit }: Props) {
  return (
    <div
      className="light-border
    rounded-lg shadow-lg p-2 transition duration-300 flex flex-col items-center gap-2 subtle-regular"
    >
      <span className="font-bold">{title}</span>
      <span>
        <span className="font-bold text-orange-500">{value}</span>
        {unit && <span> {unit}</span>}
      </span>
    </div>
  );
}

export default DailyReportInfoCard;
