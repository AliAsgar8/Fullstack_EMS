import { eq, and, desc } from "drizzle-orm";
import db from "../db/db.js";
import { employees, payslips } from "../db/schema.js";

async function findEmployeeByUserId(userId) {
  const [employee] = await db
    .select()
    .from(employees)
    .where(
      and(eq(employees.userId, userId), eq(employees.isDeleted, false)),
    );
  return employee;
}

// POST /api/payslip — admin creates payslip
export async function createPayslip(req, res) {
  try {
    const {
      employeeId,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
    } = req.body;

    if (!employeeId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "employeeId, month, and year are required",
      });
    }

    const monthNum = Number(month);
    const yearNum = Number(year);

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: "month must be between 1 and 12",
      });
    }

    const [employee] = await db
      .select()
      .from(employees)
      .where(
        and(
          eq(employees.id, Number(employeeId)),
          eq(employees.isDeleted, false),
        ),
      );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const basic =
      basicSalary !== undefined
        ? Number(basicSalary)
        : Number(employee.basicSalary) || 0;
    const allow =
      allowances !== undefined
        ? Number(allowances)
        : Number(employee.allowance) || 0;
    const deduct =
      deductions !== undefined
        ? Number(deductions)
        : Number(employee.deductions) || 0;
    const netSalary = basic + allow - deduct;

    await db.insert(payslips).values({
      employeeId: Number(employeeId),
      month: monthNum,
      year: yearNum,
      basicSalary: basic,
      allowances: allow,
      deductions: deduct,
      netSalary,
    });

    return res.status(201).json({
      success: true,
      message: "Payslip created successfully",
      data: {
        employeeId: Number(employeeId),
        month: monthNum,
        year: yearNum,
        basicSalary: basic,
        allowances: allow,
        deductions: deduct,
        netSalary,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// GET /api/payslip — admin: all | employee: own
export async function getPayslip(req, res) {
  try {
    const userId = req.session.id;
    const role = req.session.role;

    if (role === "admin") {
      const data = await db
        .select({
          id: payslips.id,
          employeeId: payslips.employeeId,
          month: payslips.month,
          year: payslips.year,
          basicSalary: payslips.basicSalary,
          allowances: payslips.allowances,
          deductions: payslips.deductions,
          netSalary: payslips.netSalary,
          firstName: employees.firstName,
          lastName: employees.lastName,
          email: employees.email,
          department: employees.department,
        })
        .from(payslips)
        .leftJoin(employees, eq(payslips.employeeId, employees.id))
        .orderBy(desc(payslips.year), desc(payslips.month));

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
      .from(payslips)
      .where(eq(payslips.employeeId, employee.id))
      .orderBy(desc(payslips.year), desc(payslips.month));

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// GET /api/payslip/:id
export async function getPayslipById(req, res) {
  try {
    const id = Number(req.params.id);
    const userId = req.session.id;
    const role = req.session.role;

    const [payslip] = await db
      .select({
        id: payslips.id,
        employeeId: payslips.employeeId,
        month: payslips.month,
        year: payslips.year,
        basicSalary: payslips.basicSalary,
        allowances: payslips.allowances,
        deductions: payslips.deductions,
        netSalary: payslips.netSalary,
        firstName: employees.firstName,
        lastName: employees.lastName,
        email: employees.email,
        department: employees.department,
        position: employees.position,
      })
      .from(payslips)
      .leftJoin(employees, eq(payslips.employeeId, employees.id))
      .where(eq(payslips.id, id));

    if (!payslip) {
      return res.status(404).json({
        success: false,
        message: "Payslip not found",
      });
    }

    if (role !== "admin") {
      const employee = await findEmployeeByUserId(userId);
      if (!employee || payslip.employeeId !== employee.id) {
        return res.status(403).json({
          success: false,
          message: "You can only view your own payslip",
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: payslip,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
