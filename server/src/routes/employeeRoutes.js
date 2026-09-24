import { Router } from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/",protect, isAdmin, getAllEmployees);
router.get("/:id",protect, isAdmin, getEmployeeById);
router.post("/",protect, isAdmin, createEmployee);
router.put("/:id",protect, isAdmin, updateEmployee);
router.delete("/:id",protect, isAdmin, deleteEmployee);

export default router;
