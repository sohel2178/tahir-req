import React from "react";

interface Props {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
}

const RangeDateTimePicker: React.FC<Props> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  return (
    <div className="flex flex-col bg-white/80 backdrop-blur-md px-3 py-2 rounded-md shadow-md gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-700">Start:</label>
        <input
          type="datetime-local"
          value={
            startDate
              ? new Date(
                  startDate.getTime() - startDate.getTimezoneOffset() * 60000 // ✅ shift to local (BD)
                )
                  .toISOString()
                  .slice(0, 16)
              : ""
          }
          onChange={(e) => setStartDate(new Date(e.target.value))}
          className="border rounded-md px-2 py-1 text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-700">End:</label>
        <input
          type="datetime-local"
          value={
            endDate
              ? new Date(
                  endDate.getTime() - endDate.getTimezoneOffset() * 60000 // ✅ convert to BD display
                )
                  .toISOString()
                  .slice(0, 16)
              : ""
          }
          onChange={(e) => setEndDate(new Date(e.target.value))}
          className="border rounded-md px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
};

export default RangeDateTimePicker;
