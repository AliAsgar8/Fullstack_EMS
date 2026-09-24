import { Router } from "express";
import {
  login,
  getSession,
  changePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.get("/session", protect, getSession);
router.post("/change-password", protect, changePassword);

export default router;
