import Event from "../models/Event.js";

export const listEvents = async (req, res) => {
  const { status, q } = req.query;
  const filter = {};
  const now = new Date();
  if (status === "upcoming") filter.date = { $gt: now };
  if (status === "active") filter.date = { $lte: now };
  if (status === "closed") filter.date = { $lt: now };
  if (q) filter.title = { $regex: q, $options: "i" };
  const events = await Event.find(filter).sort({ date: 1 });
  res.json(events);
};

export const getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
};

export const createEvent = async (req, res) => {
  const body  = req.body;
  console.log(body)
  // const seats = Array.from({ length: seatsTotal || 0 }, (_, i) => ({ number: `S${i+1}` }));
  const event = await Event.create(body)
  res.status(201).json(event);
};

export const updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
};

export const deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

