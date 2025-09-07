import React, { createContext, useContext, useState } from "react";

const SeatContext = createContext();

export const SeatProvider = ({ children, initialSeatData = [] }) => {
  const [seats, setSeats] = useState(initialSeatData); // 2D array
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [clickCounts, setClickCounts] = useState({});
  const [action, setAction] = useState("reserve"); // default = Reserve

  const handleSeatClick = (rowIndex, seatIndex) => {
    const seatKey = `${rowIndex}-${seatIndex}`;

    // Block if already bought (2)
    if (seats[rowIndex][seatIndex] === 2 && action !== "cancel") {
      console.log("This seat is already bought and cannot be changed.");
      return;
    }

    // Update seat map
    setSeats((prevSeats) =>
      prevSeats.map((row, rIdx) =>
        row.map((seat, sIdx) => {
          if (rIdx === rowIndex && sIdx === seatIndex) {
            if (action === "reserve") return 1;
            if (action === "buy") return 2;
            if (action === "cancel") return 0;
          }
          return seat;
        })
      )
    );

    // Update selectedSeats
    setClickCounts((prevCounts) => {
      const updatedCounts = { ...prevCounts };

      setSelectedSeats((prevSelected) => {
        let updatedSelected = [...prevSelected];

        if (action === "reserve" || action === "buy") {
          if (!updatedSelected.includes(seatKey)) updatedSelected.push(seatKey);
        } else if (action === "cancel") {
          updatedSelected = updatedSelected.filter((s) => s !== seatKey);
          updatedCounts[seatKey] = 0;
        }

        console.log("Selected seats:", updatedSelected);
        return updatedSelected;
      });

      return updatedCounts;
    });
  };

  return (
    <SeatContext.Provider
      value={{ seats, setSeats, selectedSeats, setSelectedSeats, handleSeatClick, action, setAction }}
    >
      {children}
    </SeatContext.Provider>
  );
};

export const useSeat = () => useContext(SeatContext);
export default SeatContext;
