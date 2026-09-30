import { eq, and, desc } from "drizzle-orm";
import db from "../db/db.js";
import { employees, leaves } from "../db/schema.js";

const LEAVE_TYPES = ["SICK", "CASUAL", "ANNUAL"];
const LEAVE_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

async function findEmployeeByUserId(userId) {
  const [employee] = await db
    .select()
    .from(employees)
    .where(
      and(eq(employees.userId, userId), eq(employees.isDeleted, false)),
    );
  return employee;
}

// POST /api/leave — create leave (employee)
export async function createLeave(req, res) {
  try {
    const userId = req.session.id;
    const { type, startDate, endDate, reason } = req.body;

    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "type, startDate, endDate, and reason are required",
      });
    }

    if (!LEAVE_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid type. Allowed: ${LEAVE_TYPES.join(", ")}`,
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: "endDate cannot be before startDate",
      });
    }

    const employee = await findEmployeeByUserId(userId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    await db.insert(leaves).values({
      employeeId: employee.id,
      type,
      startDate,
      endDate,
      reason,
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "Leave created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// GET /api/leave — get leaves
// admin → all leaves | employee → own leaves
export async function getLeave(req, res) {
  try {
    const userId = req.session.id;
    const role = req.session.role;

    if (role === "admin") {
      const data = await db
        .select({
          id: leaves.id,
          employeeId: leaves.employeeId,
          type: leaves.type,
          startDate: leaves.startDate,
          endDate: leaves.endDate,
          reason: leaves.reason,
          status: leaves.status,
          createdAt: leaves.createdAt,
          updatedAt: leaves.updatedAt,
          firstName: employees.firstName,
          lastName: employees.lastName,
          email: employees.email,
          department: employees.department,
        })
        .from(leaves)
        .leftJoin(employees, eq(leaves.employeeId, employees.id))
        .orderBy(desc(leaves.createdAt));

      return res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
    }

    const employee = await findEmployeeByUserId(userId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const data = await db
      .select()
      .from(leaves)
      .where(eq(leaves.employeeId, employee.id))
      .orderBy(desc(leaves.createdAt));

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// PUT /api/leave/:id — update leave (admin: status APPROVED/REJECTED)
export async function updateLeave(req, res) {
  try {
    const id = Number(req.params.id);
    const { status, type, startDate, endDate, reason } = req.body;
    const role = req.session.role;

    const [leave] = await db.select().from(leaves).where(eq(leaves.id, id));

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    // Admin updates status (approve / reject)
    if (role === "admin") {
      if (!status || !LEAVE_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `status is required. Allowed: ${LEAVE_STATUSES.join(", ")}`,
        });
      }

      await db.update(leaves).set({ status }).where(eq(leaves.id, id));

      return res.status(200).json({
        success: true,
        message: `Leave updated to ${status}`,
      });
    }

    // Employee can update only their own PENDING leave details
    const employee = await findEmployeeByUserId(req.session.id);
    if (!employee || leave.employeeId !== employee.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own leave",
      });
    }

    if (leave.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only PENDING leave can be updated",
      });
    }

    if (type && !LEAVE_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid type. Allowed: ${LEAVE_TYPES.join(", ")}`,
      });
    }

    await db
      .update(leaves)
      .set({
        type: type ?? leave.type,
        startDate: startDate ?? leave.startDate,
        endDate: endDate ?? leave.endDate,
        reason: reason ?? leave.reason,
      })
      .where(eq(leaves.id, id));

    return res.status(200).json({
      success: true,
      message: "Leave updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
