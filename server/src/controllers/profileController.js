import { eq } from "drizzle-orm";
import db from "../db/db.js";
import { users, employees } from "../db/schema.js";

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.session.id;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.userId, userId));

    if (!employee) {
      return res.status(200).json({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.role === "admin" ? "Admin" : "",
        lastName: "",
      });
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: employee.firstName,
      lastName: employee.lastName,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      bio: employee.bio,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.session.id;

    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.userId, userId));

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    if (employee.isDeleted) {
      return res.status(401).json({
        success: false,
        message: "User is deleted",
      });
    }

    await db
      .update(employees)
      .set({
        bio: req.body.bio ?? employee.bio,
        phone: req.body.phone ?? employee.phone,
      })
      .where(eq(employees.userId, userId));

    return res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
