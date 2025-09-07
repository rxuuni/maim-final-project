import { Router } from "express";
import { listEvents, getEvent, createEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/", listEvents);
router.get("/:id", getEvent);
router.post("/", protect, requireAdmin, createEvent);
router.put("/:id", protect, requireAdmin, updateEvent);
router.delete("/:id", protect, requireAdmin, deleteEvent);




export default router;
