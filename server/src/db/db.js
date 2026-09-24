import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const db = drizzle({ client: pool });

export async function connectDB() {
  try {
    const connection = await pool.promise().getConnection();
    console.log("Database is connected");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

export default db;
