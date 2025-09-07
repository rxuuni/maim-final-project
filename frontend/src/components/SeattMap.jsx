import React, { useEffect } from "react";
import { useSeat } from "../context/SeatContext";

export default function SeattMap({ seatData = [] }) {
  const { seats, setSeats, handleSeatClick, selectedSeats, action, setAction } = useSeat();

  useEffect(() => {
    setSeats(seatData);
  }, [seatData]);

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
      <h3 className="text-lg font-semibold mb-4">Manage Seat Map</h3>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setAction("reserve")}
          className={`px-3 py-1 rounded ${action === "reserve" ? "bg-purple-400 text-white" : "bg-gray-200"}`}
        >
          Reserve
        </button>
        <button
          onClick={() => setAction("buy")}
          className={`px-3 py-1 rounded ${action === "buy" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
        >
          Buy
        </button>
        <button
          onClick={() => setAction("cancel")}
          className={`px-3 py-1 rounded ${action === "cancel" ? "bg-red-500 text-white" : "bg-gray-200"}`}
        >
          Cancel
        </button>
      </div>

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
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((seat, seatIndex) => {
              const seatKey = `${rowIndex}-${seatIndex}`;
              const isSelected = selectedSeats.includes(seatKey);
              return (
                <div
                  key={seatKey}
                  onClick={() => handleSeatClick(rowIndex, seatIndex)}
                  className={`w-8 h-8 rounded border border-gray-400 cursor-pointer 
                    ${getSeatColor(seat)} ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Selected Seats */}
      <div className="mb-4 text-sm">
        <h4 className="font-medium mb-1">Selected Seats:</h4>
        {selectedSeats.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <span
                key={seat}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
              >
                {seat}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No seats selected</p>
        )}
      </div>

      {/* Stage */}
      <div className="bg-gray-800 text-white text-center py-2 rounded text-sm font-medium">
        STAGE
      </div>
    </div>
  );
}
