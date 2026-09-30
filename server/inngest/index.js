import { Inngest } from "inngest";
import { db } from "../src/db/db.js";
import { attendance } from "../src/db/schema.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "employee-management-system" });

const autoCheckOut = inngest.createFunction(
  { id: "auto-checkout" },
  { event: "employee/auto-checkout" },
  async ({ event, step }) => {

 const {employeeId, attendanceId} = event.data;

//  wait for 9 hours to check out
await step.sleep("wait-for-checkout", new Date().getTime() + 9 * 60 * 60 * 1000);

// get attendance data
const attendanceData = await db.select().from(attendance).where(eq(attendance.id, attendanceId));

  },
);

// Create an empty array where we'll export future Inngest functions
export const functions = [];
