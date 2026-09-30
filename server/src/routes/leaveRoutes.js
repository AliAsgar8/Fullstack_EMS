import { Router } from "express";
import {
  createLeave,
  getLeave,
  updateLeave,
} from "../controllers/leaveController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createLeave);
router.get("/", protect, getLeave);
router.put("/:id", protect, isAdmin, updateLeave);

export default router;
