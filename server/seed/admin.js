import "dotenv/config";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import { users } from "../src/db/schema.js";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const db = drizzle({ client: pool });

const ADMIN_EMAIL = "admin@ems.com";
const ADMIN_PASSWORD = "password123";

async function seedAdmin() {
  try {
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, ADMIN_EMAIL));

    if (existing) {
      console.log("Admin already exists:", ADMIN_EMAIL);
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await db.insert(users).values({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin login created successfully");
    console.log("Email:", ADMIN_EMAIL);
    console.log("Password:", ADMIN_PASSWORD);
    console.log("Role: admin");
  } catch (error) {
    console.error("Seed failed:", error.message);
  } finally {
    pool.end();
  }
}

seedAdmin();
