import { eq, and } from "drizzle-orm";
import db from "../db/db.js";
import { employees } from "../db/schema.js";
import { DEPARTMENTS } from "../../constants/departments.js";

// GET /api/employees
export async function getAllEmployees(req, res) {
  try {
    const data = await db
      .select()
      .from(employees)
      .where(eq(employees.isDeleted, false));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// GET /api/employees/:id
export async function getEmployeeById(req, res) {
  try {
    const id = Number(req.params.id);

    const [employee] = await db
      .select()
      .from(employees)
      .where(and(eq(employees.id, id), eq(employees.isDeleted, false)));

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// POST /api/employees
export async function createEmployee(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      basicSalary,
      allowance,
      deductions,
      employeeStatus,
      joinDate,
      bio,
      department,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !position ||
      !joinDate ||
      !department
    ) {
      return res.status(400).json({
        success: false,
        message:
          "firstName, lastName, email, phone, position, joinDate, and department are required",
      });
    }

    if (!DEPARTMENTS.includes(department)) {
      return res.status(400).json({
        success: false,
        message: `Invalid department. Allowed: ${DEPARTMENTS.join(", ")}`,
      });
    }

    await db.insert(employees).values({
      firstName,
      lastName,
      email,
      phone,
      position,
      basicSalary: Number(basicSalary) || 0,
      allowance: Number(allowance) || 0,
      deductions: Number(deductions) || 0,
      employeeStatus: employeeStatus || "active",
      joinDate,
      bio: bio || "",
      department,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// PUT /api/employees/:id
export async function updateEmployee(req, res) {
  try {
    const id = Number(req.params.id);

    const [existing] = await db
      .select()
      .from(employees)
      .where(and(eq(employees.id, id), eq(employees.isDeleted, false)));

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      basicSalary,
      allowance,
      deductions,
      employeeStatus,
      joinDate,
      bio,
      department,
    } = req.body;

    if (department && !DEPARTMENTS.includes(department)) {
      return res.status(400).json({
        success: false,
        message: `Invalid department. Allowed: ${DEPARTMENTS.join(", ")}`,
      });
    }

    await db
      .update(employees)
      .set({
        firstName: firstName ?? existing.firstName,
        lastName: lastName ?? existing.lastName,
        email: email ?? existing.email,
        phone: phone ?? existing.phone,
        position: position ?? existing.position,
        basicSalary:
          basicSalary !== undefined
            ? Number(basicSalary)
            : existing.basicSalary,
        allowance:
          allowance !== undefined ? Number(allowance) : existing.allowance,
        deductions:
          deductions !== undefined ? Number(deductions) : existing.deductions,
        employeeStatus: employeeStatus ?? existing.employeeStatus,
        joinDate: joinDate ?? existing.joinDate,
        bio: bio ?? existing.bio,
        department: department ?? existing.department,
      })
      .where(eq(employees.id, id));

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// DELETE /api/employees/:id  (soft delete)
export async function deleteEmployee(req, res) {
  try {
    const id = Number(req.params.id);

    const [existing] = await db
      .select()
      .from(employees)
      .where(and(eq(employees.id, id), eq(employees.isDeleted, false)));

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await db
      .update(employees)
      .set({ isDeleted: true })
      .where(eq(employees.id, id));

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
