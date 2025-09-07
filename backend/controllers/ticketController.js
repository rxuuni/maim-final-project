import QRCode from "qrcode";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";

export const bookTicket = async (req, res) => {
  const { eventId, seatNumber } = req.body;
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: "Event not found" });
  const seat = event.seats.find(s => s.number === seatNumber);
  if (!seat) return res.status(400).json({ message: "Seat not found" });
  if (seat.isBooked) return res.status(400).json({ message: "Seat already booked" });
  seat.isBooked = true;
  seat.bookedBy = req.user.id;
  await event.save();
  const payload = { user: req.user.id, event: event._id, seatNumber };
  const qrData = await QRCode.toDataURL(JSON.stringify(payload));
  const ticket = await Ticket.create({ user: req.user.id, event: event._id, seatNumber, pricePaid: event.price, qrData });
  res.status(201).json(ticket);
};



export const checkIn = async (req, res) => {
  const { ticketId } = req.params;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  ticket.status = "checked-in";
  await ticket.save();
  res.json(ticket);
};
