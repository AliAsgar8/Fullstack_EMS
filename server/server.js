import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import multer from "multer";
import { connectDB } from "./src/db/db.js";
import employeeRoutes from "./src/routes/employeeRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import leaveRoutes from "./src/routes/leaveRoutes.js";
import payslipRoutes from "./src/routes/payslipRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";

const app = express();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(multer().none());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World Connected to Database");
});

app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/payslip", payslipRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});

export default app;
