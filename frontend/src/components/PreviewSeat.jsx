import React from "react";

export function PreviewSeat({ seatData = [] }) {
  const getSeatColor = (seatType) => {
    switch (seatType) {
      case 0:
        return "bg-gray-300"; // Available
      case 1:
        return "bg-purple-400"; // Reserved
      case 2:
        return "bg-purple-600"; // Paid
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Seat Preview</h3>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-600 rounded-sm"></div>
          <span>Paid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-400 rounded-sm"></div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
          <span>Available</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col items-center gap-1 mb-4">
        {seatData.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((seat, seatIndex) => (
              <div
                key={`${rowIndex}-${seatIndex}`}
                className={`w-8 h-8 rounded ${getSeatColor(
                  seat
                )} border border-gray-400`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Stage */}
      <div className="bg-gray-800 text-white text-center py-2 rounded text-sm font-medium">
        STAGE
      </div>
    </div>
  );
}
