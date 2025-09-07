import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { bookTicket, myTickets, checkIn } from "../controllers/ticketController.js";
const router = Router();

router.post("/book", protect, bookTicket);
router.get("/mine", protect, myTickets);
router.post("/checkin/:ticketId", protect, checkIn);

export default router;
