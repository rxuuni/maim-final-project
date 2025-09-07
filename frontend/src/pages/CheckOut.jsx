import React, { useEffect, useState } from "react";
import Payment from "../components/Payment";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { getEventbyId } from "./EventDetails";
import { useSeat } from "../context/SeatContext";

function CheckOut() {
  const { user , token } = useAuth();
  const [event, setEvent] = useState();
  const [checkoutResult, setCheckoutResult] = useState(null);
  const { id } = useParams();
  const { selectedSeats, seats, setSeats } = useSeat(); // أضف setSeats لتحديث الـ seatMap

  // جلب بيانات الحدث
  useEffect(() => {
    async function fetchEvent(eventId) {
      const data = await getEventbyId(eventId);
      setEvent(data);
    }
    fetchEvent(id);
  }, [id]);

  // دالة الدفع أو الحجز
  const totalPrice = (event?.ticketPrice || 0) * selectedSeats.length;
  const handleCheckout = async (action ) => {
  
    if (!selectedSeats || selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }
    
  console.log(user)

    try {
      const res = await fetch("http://localhost:5000/api/tickets/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json","Authorization":`Bearer ${token}` },
        body: JSON.stringify({
          totalPrice,
          userId: user.id,
          
          eventId: id,
          selectedSeats,
          action, // "buy" أو "reserve"
        }),
      });


      
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      setCheckoutResult(data);

    
      if (data.success && data.updatedSeatMap) {
        setSeats(data.updatedSeatMap);
      }

      

      console.log("Checkout response:", data);
    } catch (err) {
     
      console.error(err);
    }
  };

  return (
    <div>
      <Payment
        event={event}
        eventId={id}
        selectedSeat={selectedSeats}
        totalPrice={totalPrice}
        user={user}
        onCheckout={handleCheckout}
        checkoutResult={checkoutResult}
      />
    </div>
  );
}

export default CheckOut;
