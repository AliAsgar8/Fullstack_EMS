import { eq, and, isNull, desc } from "drizzle-orm";
import db from "../db/db.js";
import { employees, attendance } from "../db/schema.js";
import { inngest } from "../../inngest/index.js";

function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function getDayType(workingHours) {
  if (workingHours >= 8) return "Full Day";
  if (workingHours >= 6) return "Three Quarter Day";
  if (workingHours >= 4) return "Half Day";
  if (workingHours > 0) return "Short Day";
  return "null";
}

async function findEmployeeByUserId(userId) {
  const [employee] = await db
    .select()
    .from(employees)
    .where(
      and(eq(employees.userId, userId), eq(employees.isDeleted, false)),
    );
  return employee;
}

// POST /api/attendance/clock
export const clockInOut = async (req, res) => {
  try {
    const userId = req.session.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const employee = await findEmployeeByUserId(userId);

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const today = todayDateString();

    const [openRecord] = await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.employeeId, employee.id),
          eq(attendance.date, today),
          isNull(attendance.checkOut),
        ),
      );

    // Clock OUT
    if (openRecord) {
      const checkOut = new Date();
      const checkIn = new Date(openRecord.checkIn);
      const workingHours = Number(
        ((checkOut - checkIn) / (1000 * 60 * 60)).toFixed(2),
      );
      const dayType = getDayType(workingHours);

      await db
        .update(attendance)
        .set({
          checkOut,
          workingHours: Math.round(workingHours),
          dayType,
          status: "present",
        })
        .where(eq(attendance.id, openRecord.id));

      return res.status(200).json({
        success: true,
        action: "clock-out",
        message: "Clocked out successfully",
        data: {
          checkIn: openRecord.checkIn,
          checkOut,
          workingHours: Math.round(workingHours),
          dayType,
        },
      });
    }

    // Clock IN
    const [created] = await db
      .insert(attendance)
      .values({
        employeeId: employee.id,
        date: today,
        checkIn: new Date(),
        status: "present",
      })
      .$returningId();

    // Start auto check-out reminder workflow
    if (created?.id) {
      await inngest.send({
        name: "employee/auto-checkout",
        data: {
          employeeId: employee.id,
          attendanceId: created.id,
        },
      });
    }

    return res.status(201).json({
      success: true,
      action: "clock-in",
      message: "Clocked in successfully",
      attendanceId: created?.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/attendance
export const getAttendance = async (req, res) => {
  try {
    const userId = req.session.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const employee = await findEmployeeByUserId(userId);

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const data = await db
      .select()
      .from(attendance)
      .where(eq(attendance.employeeId, employee.id))
      .orderBy(desc(attendance.date));

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
