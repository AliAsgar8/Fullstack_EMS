import { eq, and, count, desc, sql } from "drizzle-orm";
import db from "../db/db.js";
import {
  employees,
  attendance,
  leaves,
  payslips,
} from "../db/schema.js";
import { DEPARTMENTS } from "../../constants/departments.js";

async function findEmployeeByUserId(userId) {
  const [employee] = await db
    .select()
    .from(employees)
    .where(
      and(eq(employees.userId, userId), eq(employees.isDeleted, false)),
    );
  return employee;
}

function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonthYear() {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

// GET /api/dashboard
export async function getDashboard(req, res) {
  try {
    const { id: userId, role } = req.session;

    // ---------- ADMIN ----------
    if (role === "admin") {
      const today = todayDateString();

      const [[empCount], [attCount], [leaveCount]] = await Promise.all([
        db
          .select({ total: count() })
          .from(employees)
          .where(eq(employees.isDeleted, false)),

        db
          .select({ total: count() })
          .from(attendance)
          .where(eq(attendance.date, today)),

        db
          .select({ total: count() })
          .from(leaves)
          .where(eq(leaves.status, "PENDING")),
      ]);

      return res.status(200).json({
        success: true,
        role: "admin",
        totalEmployees: empCount.total,
        totalDepartments: DEPARTMENTS.length,
        todayAttendance: attCount.total,
        pendingLeaves: leaveCount.total,
      });
    }

    // ---------- EMPLOYEE ----------
    if (role === "employee") {
      const employee = await findEmployeeByUserId(userId);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee profile not found",
        });
      }

      const { month, year } = currentMonthYear();
      const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
      const nextMonth =
        month === 12
          ? `${year + 1}-01-01`
          : `${year}-${String(month + 1).padStart(2, "0")}-01`;

      const [[monthAtt], [pendingLeave], [latestPayslip]] =
        await Promise.all([
          db
            .select({ total: count() })
            .from(attendance)
            .where(
              and(
                eq(attendance.employeeId, employee.id),
                sql`${attendance.date} >= ${monthStart}`,
                sql`${attendance.date} < ${nextMonth}`,
              ),
            ),

          db
            .select({ total: count() })
            .from(leaves)
            .where(
              and(
                eq(leaves.employeeId, employee.id),
                eq(leaves.status, "PENDING"),
              ),
            ),

          db
            .select()
            .from(payslips)
            .where(eq(payslips.employeeId, employee.id))
            .orderBy(desc(payslips.year), desc(payslips.month))
            .limit(1),
        ]);

      return res.status(200).json({
        success: true,
        role: "employee",
        currentMonthAttendance: monthAtt.total,
        pendingLeaves: pendingLeave.total,
        latestPayslip: latestPayslip
          ? { netSalary: latestPayslip.netSalary }
          : null,
        employee: {
          firstName: employee.firstName,
          lastName: employee.lastName,
          position: employee.position,
          department: employee.department,
        },
      });
    }

    return res.status(403).json({
      success: false,
      message: "Unauthorized role",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
