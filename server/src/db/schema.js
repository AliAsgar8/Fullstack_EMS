import { int, mysqlEnum, varchar, timestamp, date, boolean } from "drizzle-orm/mysql-core/columns";
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
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  basicSalary: int("basic_salary").default(0),
  allowance: int("allowance").default(0),
  deductions: int("deductions").default(0),
  employeeStatus: mysqlEnum("employee_status", ["active", "inactive"]).notNull().default("active"),
  joinDate: date("join_date").notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  bio: varchar("bio", { length: 255 }).default(""),
  department: mysqlEnum("department", DEPARTMENTS).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
  