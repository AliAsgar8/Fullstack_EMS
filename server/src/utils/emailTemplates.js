function formatTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Attendance check-out reminder
export function checkoutReminderTemplate({ employee, checkIn }) {
  return `
    <div style="max-width: 600px; font-family: Arial, sans-serif;">
      <h2>Hi ${employee.firstName}, 👋</h2>
      <p style="font-size: 16px;">You have a check-in in ${employee.department} today:</p>
      <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">
        ${formatTime(checkIn)}
      </p>
      <p style="font-size: 16px;">Please make sure to check-out in one hour.</p>
      <p style="font-size: 16px;">If you have any questions, please contact your admin.</p>
      <br />
      <p style="font-size: 16px;">Best Regards,</p>
      <p style="font-size: 16px;"><strong>EMS</strong></p>
    </div>
  `;
}

// Leave application reminder for admin
export function leavePendingReminderTemplate({ employee, leaveApplication }) {
  const employeeName = employee
    ? `${employee.firstName} ${employee.lastName}`
    : "an employee";
  const department = employee?.department ?? "—";

  return `
    <div style="max-width: 600px; font-family: Arial, sans-serif;">
      <h2>Hi Admin, 👋</h2>
      <p style="font-size: 16px;">
        You have a leave application from <strong>${employeeName}</strong>
        (${department}) that is still pending:
      </p>
      <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">
        ${leaveApplication?.type ?? "LEAVE"} —
        ${formatDate(leaveApplication?.startDate)} to ${formatDate(leaveApplication?.endDate)}
      </p>
      <p style="font-size: 16px;">Reason: ${leaveApplication?.reason ?? "—"}</p>
      <p style="font-size: 16px;">Please take action on this leave application.</p>
      <br />
      <p style="font-size: 16px;">Best Regards,</p>
      <p style="font-size: 16px;"><strong>EMS</strong></p>
    </div>
  `;
}

// Absent attendance reminder
export function absentReminderTemplate({ employee }) {
  return `
    <div style="max-width: 600px; font-family: Arial, sans-serif;">
      <h2>Hi ${employee.firstName}, 👋</h2>
      <p style="font-size: 16px;">We noticed you haven't marked your attendance yet today.</p>
      <p style="font-size: 16px;">
        The deadline was <strong>11:30 AM</strong> and your attendance is still missing.
      </p>
      <p style="font-size: 16px;">
        Please check in as soon as possible or contact your admin if you're facing any issues.
      </p>
      <br />
      <p style="font-size: 14px; color: #666;">Department: ${employee.department}</p>
      <br />
      <p style="font-size: 16px;">Best Regards,</p>
      <p style="font-size: 16px;"><strong>EMS</strong></p>
    </div>
  `;
}
