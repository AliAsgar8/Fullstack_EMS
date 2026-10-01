import { Inngest } from "inngest";
import { and, eq, gte, lte } from "drizzle-orm";
import db from "../src/db/db.js";
import { attendance, employees, leaves } from "../src/db/schema.js";
import { sendEmail } from "../src/db/nodemailer.js";
import {
  absentReminderTemplate,
  checkoutReminderTemplate,
  leavePendingReminderTemplate,
} from "../src/utils/emailTemplates.js";

export const inngest = new Inngest({ id: "employee-management-system" });

const autoCheckOut = inngest.createFunction(
  {
    id: "auto-checkout",
    triggers: [{ event: "employee/auto-checkout" }],
  },
  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    // Wait 9 hours after clock-in
    await step.sleepUntil(
      "wait-for-checkout",
      new Date(Date.now() + 9 * 60 * 60 * 1000),
    );

    const [attendanceRecord] = await db
      .select()
      .from(attendance)
      .where(eq(attendance.id, attendanceId));

    if (!attendanceRecord?.checkOut) {
      const [employee] = await db
        .select()
        .from(employees)
        .where(eq(employees.id, employeeId));

      if (employee?.email) {
        await step.run("send-checkout-reminder-email", async () => {
          await sendEmail({
            to: employee.email,
            subject: "Reminder to check out",
            body: checkoutReminderTemplate({
              employee,
              checkIn: attendanceRecord.checkIn,
            }),
          });
        });
      }

      // Wait 1 more hour
      await step.sleepUntil(
        "wait-for-1-hour",
        new Date(Date.now() + 1 * 60 * 60 * 1000),
      );

      const [latestAttendance] = await db
        .select()
        .from(attendance)
        .where(eq(attendance.id, attendanceId));

      if (!latestAttendance?.checkOut) {
        const checkInTime = new Date(latestAttendance.checkIn).getTime();
        const checkOut = new Date(checkInTime + 4 * 60 * 60 * 1000);

        await db
          .update(attendance)
          .set({
            checkOut,
            workingHours: 4,
            dayType: "Half Day",
            status: "late",
          })
          .where(eq(attendance.id, attendanceId));
      }
    }
  },
);

// Send email to admin if leave is still PENDING after 24 hours
const leaveApplicationReminder = inngest.createFunction(
  {
    id: "leave-application-reminder",
    triggers: [{ event: "leave/pending" }],
  },
  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;

    await step.sleepUntil(
      "wait-for-the-24-hours",
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    );

    const [leaveApplication] = await db
      .select()
      .from(leaves)
      .where(eq(leaves.id, leaveApplicationId));

    if (leaveApplication?.status === "PENDING") {
      const [employee] = await db
        .select()
        .from(employees)
        .where(eq(employees.id, leaveApplication.employeeId));

      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await step.run("send-leave-pending-email", async () => {
          await sendEmail({
            to: adminEmail,
            subject: "Leave Application Reminder",
            body: leavePendingReminderTemplate({
              employee,
              leaveApplication,
            }),
          });
        });
      }
    }
  },
);

// Cron: Check attendance at 11:30 AM IST (06:00 UTC) and email absent employees
const attendanceReminderCron = inngest.createFunction(
  {
    id: "attendance-reminder-cron",
    triggers: [{ cron: "0 6 * * *" }], // 06:00 UTC = 11:30 AM IST
  },
  async ({ step }) => {
    const today = await step.run("get-today-date", async () => {
      const todayIst = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      return {
        date: todayIst,
        startUTC: new Date(`${todayIst}T00:00:00+05:30`).toISOString(),
        endUTC: new Date(`${todayIst}T23:59:59+05:30`).toISOString(),
      };
    });

    const activeEmployees = await step.run("get-active-employees", async () => {
      const rows = await db
        .select({
          id: employees.id,
          firstName: employees.firstName,
          lastName: employees.lastName,
          email: employees.email,
          department: employees.department,
        })
        .from(employees)
        .where(
          and(
            eq(employees.isDeleted, false),
            eq(employees.employeeStatus, "active"),
          ),
        );

      return rows.map((e) => ({
        id: String(e.id),
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        department: e.department,
      }));
    });

    const onLeaveIds = await step.run("get-on-leave-ids", async () => {
      const rows = await db
        .select({ employeeId: leaves.employeeId })
        .from(leaves)
        .where(
          and(
            eq(leaves.status, "APPROVED"),
            lte(leaves.startDate, today.date),
            gte(leaves.endDate, today.date),
          ),
        );

      return rows.map((l) => String(l.employeeId));
    });

    const checkedInIds = await step.run("get-checked-in-ids", async () => {
      const rows = await db
        .select({ employeeId: attendance.employeeId })
        .from(attendance)
        .where(eq(attendance.date, today.date));

      return rows.map((a) => String(a.employeeId));
    });

    const absentEmployees = activeEmployees.filter(
      (emp) =>
        !onLeaveIds.includes(emp.id) && !checkedInIds.includes(emp.id),
    );

    if (absentEmployees.length > 0) {
      await step.run("send-reminder-emails", async () => {
        for (const emp of absentEmployees) {
          if (!emp.email) continue;

          await sendEmail({
            to: emp.email,
            subject: "Attendance Reminder — Please Check In",
            body: absentReminderTemplate({ employee: emp }),
          });
        }

        return { sent: absentEmployees.length };
      });
    }

    return {
      date: today.date,
      active: activeEmployees.length,
      onLeave: onLeaveIds.length,
      checkedIn: checkedInIds.length,
      absent: absentEmployees.length,
    };
  },
);

export const functions = [
  autoCheckOut,
  leaveApplicationReminder,
  attendanceReminderCron,
];
