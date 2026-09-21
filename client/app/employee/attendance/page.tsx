import { CalendarDays, Clock, Info, LogIn } from "lucide-react";
import { format } from "date-fns";
import {
  dummyAttendanceData,
  getDayTypeDisplay,
  getWorkingHoursDisplay,
} from "@/lib/dummyData";
import StatCard from "@/components/ui/StatCard";

function formatDate(value: string) {
  return format(new Date(value), "MMM d, yyyy");
}

function formatTime(value: string) {
  return format(new Date(value), "hh:mm a");
}

export default function Attendance() {
  const daysPresent = dummyAttendanceData.length;
  const avgHours =
    dummyAttendanceData.reduce((sum, item) => sum + item.workingHours, 0) /
    (daysPresent || 1);

  return (
    <div className="relative pb-24">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Attendance</h1>
        <p className="mt-1 text-slate-500">
          Track your work hours and daily check-ins
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          label="Days Present"
          value={daysPresent}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatCard
          label="Late Arrivals"
          value={0}
          icon={<Info className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Work Hrs"
          value={`${avgHours.toFixed(1)} Hrs`}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Activity
        </h2>

        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-wide text-slate-500 uppercase">
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Check In</th>
                <th className="px-5 py-4 font-medium">Check Out</th>
                <th className="px-5 py-4 font-medium">Working Hours</th>
                <th className="px-5 py-4 font-medium">Day Type</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyAttendanceData.map((record) => {
                const dayType = getDayTypeDisplay(record);

                return (
                  <tr
                    key={record._id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-5 py-4 text-slate-700">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {formatTime(record.checkIn)}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {formatTime(record.checkOut)}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {getWorkingHoursDisplay(record)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        {dayType.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <button
        type="button"
        className="fixed right-6 bottom-6 inline-flex items-center gap-3 rounded-2xl bg-sidebar-accent px-5 py-3 text-left text-white shadow-lg"
      >
        <LogIn className="h-5 w-5 shrink-0" />
        <span>
          <span className="block text-sm font-semibold">Clock In</span>
          <span className="block text-xs text-indigo-100">
            start your work day
          </span>
        </span>
      </button>
    </div>
  );
}
