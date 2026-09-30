import { Router } from "express";
import {
  clockInOut,
  getAttendance,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, getAttendance);
router.post("/clock", protect, clockInOut);

export default router;
