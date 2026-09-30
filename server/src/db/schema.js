import {
  int,
  mysqlEnum,
  varchar,
  timestamp,
  date,
  boolean,
} from "drizzle-orm/mysql-core/columns";
import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { DEPARTMENTS } from "../../constants/departments.js";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["admin", "employee"]).notNull().default("employee"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const employees = mysqlTable("employees", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  basicSalary: int("basic_salary").default(0),
  allowance: int("allowance").default(0),
  deductions: int("deductions").default(0),
  employeeStatus: mysqlEnum("employee_status", ["active", "inactive"])
    .notNull()
    .default("active"),
  joinDate: date("join_date").notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  bio: varchar("bio", { length: 255 }).default(""),
  department: mysqlEnum("department", DEPARTMENTS).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const attendance = mysqlTable("attendance", {
  id: int("id").primaryKey().autoincrement(),
  employeeId: int("employee_id")
    .notNull()
    .references(() => employees.id),
  date: date("date").notNull(),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out"),
  workingHours: int("working_hours").notNull().default(0),
  dayType: mysqlEnum("day_type", [
    "Full Day",
    "Three Quarter Day",
    "Half Day",
    "Short Day",
    "null",
  ])
    .notNull()
    .default("null"),
  status: mysqlEnum("status", ["present", "absent", "late"])
    .notNull()
    .default("present"),
});

export const leaves = mysqlTable("leaves", {
  id: int("id").primaryKey().autoincrement(),
  employeeId: int("employee_id")
    .notNull()
    .references(() => employees.id),
  type: mysqlEnum("type", ["SICK", "CASUAL", "ANNUAL"]).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: varchar("reason", { length: 500 }).notNull(),
  status: mysqlEnum("status", ["PENDING", "APPROVED", "REJECTED"])
    .notNull()
    .default("PENDING"),
});

export const payslips = mysqlTable("payslips", {
  id: int("id").primaryKey().autoincrement(),
  employeeId: int("employee_id")
    .notNull()
    .references(() => employees.id),
  month: int("month").notNull(),
  year: int("year").notNull(),
  basicSalary: int("basic_salary").notNull().default(0),
  allowances: int("allowances").notNull().default(0),
  deductions: int("deductions").notNull().default(0),
  netSalary: int("net_salary").notNull().default(0),
});
