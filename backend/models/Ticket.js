import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  seatNumber: String,
  selectedSeats: [String],
  pricePaid: Number,

  action : { type: String, enum: ["buy", "reserve"], required: true }
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
