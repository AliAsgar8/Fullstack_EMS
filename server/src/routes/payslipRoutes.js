import { Router } from "express";
import {
  createPayslip,
  getPayslip,
  getPayslipById,
} from "../controllers/payslipController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, isAdmin, createPayslip);
router.get("/", protect, getPayslip);
router.get("/:id", protect, getPayslipById);

export default router;
