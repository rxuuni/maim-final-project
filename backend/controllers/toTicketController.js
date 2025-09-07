import Event from "../models/Event.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

export const myTickets = async (req, res) => {
  const tickets = await Ticket.find({ user: req.user.id }).populate("event");
  res.json(tickets);
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("event");


    res.json(ticket);
}
catch (error) {
    res.status(500).json({ message: error.message });
}

}

export const checkout = async (req, res) => {
  try {
    const { eventId, selectedSeats, action , totalPrice , userId , } = req.body;

    
    // const userId = req.user._id;
    console.log("Authenticated userId:", userId);
    console.log("Request body:", req.body); 
    
    // تحقق من البيانات المطلوبة
    if (!userId || !eventId || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({ msg: "Missing required data: userId, eventId, or selectedSeats" });
    }

    // تحقق من وجود المستخدم
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // تحقق من وجود الحدث
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    // التحقق من المقاعد المباعه مسبقًا
    const invalidSeats = [];
    selectedSeats.forEach((seatKey) => {
      const [row, col] = seatKey.split("-").map(Number);
      if (event.seatMap[row][col] === 2) invalidSeats.push(seatKey);
    });

    if (invalidSeats.length > 0) {
      return res.status(400).json({ msg: `Seats already bought: ${invalidSeats.join(", ")}` });
    }

    // تحديث حالة المقاعد
    selectedSeats.forEach((seatKey) => {
      const [row, col] = seatKey.split("-").map(Number);
      if (action === "reserve") event.seatMap[row][col] = 1; // محجوز
      else if (action === "buy") {
        event.seatMap[row][col] = 2; // مباع
        event.availableSeats -= 1;
      } else event.seatMap[row][col] = 0; // إلغاء
    });

    await event.save();

    // إنشاء التذاكر فقط في حالة الشراء
    
    if (action === "buy") {
      const tickets =  {
        user: userId,
        event: eventId,
        seatNumber: selectedSeats.length,
        pricePaid: totalPrice,
        selectedSeats:selectedSeats,
        action
      };
        console.log(selectedSeats)
        
        const savedTickets =  await Ticket.create(tickets);
        
        res.json({ 
            success: true,
            message: action === "buy" ? "Tickets purchased successfully" : "Seats reserved successfully",
            tickets: savedTickets
        });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
