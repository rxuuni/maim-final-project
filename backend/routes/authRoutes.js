import { Router } from "express";
import { register, login, me, getallUsers, getUserById } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.get("/users", protect, getallUsers);
router.get("/users/:id", protect, getUserById);

export default router;


