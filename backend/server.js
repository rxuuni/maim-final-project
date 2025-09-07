import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import toTicketRoutes from "./routes/toTicketRoutes.js";
import analyticsRouter from './routes/analyticsRoute.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", toTicketRoutes);
app.use("/api/analytics" , analyticsRouter);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
}).catch(err => {
  console.error("DB connection failed:", err.message);
  process.exit(1);
});
