import React, { useState } from "react";
import { CreditCard, Smartphone, Banknote, CheckCircle } from "lucide-react";

export default function Payment({ event, selectedSeat, user, onCheckout }) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    if (!user || !selectedSeat || selectedSeat.length === 0) {
      alert("Missing user or seats data!");
      return;
    }

    setIsProcessing(true);

    try {
      await onCheckout("buy");
      setSuccess(true);
    } catch (err) {
      alert("Payment failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center mt-20 max-w-md mx-auto">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-black">Payment Successful!</h2>
        <p className="text-gray-700 mt-2">
          Your ticket has been booked successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto mt-20">
      {/* Event Details */}
      <h2 className="text-2xl font-extrabold text-black mb-6">Checkout</h2>
      {event && (
        <div className="mb-6 space-y-2">
          <p className="text-gray-800">
            <span className="font-semibold">Event:</span> {event.name}
          </p>
          <p className="text-gray-800">
            <span className="font-semibold">Seats:</span>{" "}
            {Array.isArray(selectedSeat)
              ? selectedSeat.join(", ")
              : selectedSeat}
          </p>
          <p className="text-gray-800 font-bold">
            <span className="font-semibold">Total:</span>{" "}
            {(event.ticketPrice || 0) *
              (Array.isArray(selectedSeat) ? selectedSeat.length : 1)}{" "}
            SAR
          </p>
        </div>
      )}

      {/* Payment Methods */}
      <h3 className="text-lg font-bold text-black mb-4">
        Choose Payment Method
      </h3>
      <div className="grid gap-3 mb-6">
        <button
          onClick={() => setPaymentMethod("card")}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 font-medium transition ${
            paymentMethod === "card"
              ? "border-black bg-gray-100"
              : "border-gray-300 hover:border-black"
          }`}
        >
          <CreditCard className="w-5 h-5 text-black" />
          Credit / Debit Card
        </button>
        <button
          onClick={() => setPaymentMethod("applepay")}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 font-medium transition ${
            paymentMethod === "applepay"
              ? "border-black bg-gray-100"
              : "border-gray-300 hover:border-black"
          }`}
        >
          <Smartphone className="w-5 h-5 text-black" />
          Apple Pay
        </button>
        <button
          onClick={() => setPaymentMethod("mada")}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 font-medium transition ${
            paymentMethod === "mada"
              ? "border-black bg-gray-100"
              : "border-gray-300 hover:border-black"
          }`}
        >
          <Banknote className="w-5 h-5 text-black" />
          Mada
        </button>
      </div>

      {/* Pay Now */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-black text-white py-3 rounded-xl font-bold tracking-wide hover:bg-gray-900 transition disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
