import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { checkout , getTicketById, myTickets  } from "../controllers/toTicketController.js";

const router = express.Router();

// Checkout seats & create tickets
router.post("/checkout", protect ,checkout);
router.get("/tickets", protect, myTickets);
router.get("/tickets/:id", protect, getTicketById);

export default router;
