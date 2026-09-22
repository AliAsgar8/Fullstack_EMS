import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { dummyLeaveData } from "@/lib/dummyData";

function formatDate(value: string) {
  return format(new Date(value), "MMM d, yyyy");
}

function getEmployeeName(employee: unknown) {
  const emp = Array.isArray(employee) ? employee[0] : employee;
  if (!emp || typeof emp !== "object") return "—";
  const { firstName, lastName } = emp as {
    firstName?: string;
    lastName?: string;
  };
  return `${firstName ?? ""} ${lastName ?? ""}`.trim() || "—";
}


function statusClass(status: string) {
  if (status === "APPROVED") return "bg-emerald-50 text-emerald-700";
  if (status === "REJECTED") return "bg-rose-50 text-rose-700";
  if (status === "PENDING") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

export default function Leave() {
  return (
    <div>
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Leave Management
        </h1>
        <p className="mt-1 text-slate-500">Manage leave applications</p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wide text-slate-500 uppercase">
              <th className="px-5 py-4 font-medium">Employee</th>
              <th className="px-5 py-4 font-medium">Type</th>
              <th className="px-5 py-4 font-medium">Dates</th>
              <th className="px-5 py-4 font-medium">Reason</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyLeaveData.map((leave) => (
              <tr
                key={leave._id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-5 py-4 font-medium text-slate-900">
                  {getEmployeeName(leave.employee)}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {leave.type}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-700">
                  {formatDate(leave.startDate)} — {formatDate(leave.endDate)}
                </td>
                <td className="px-5 py-4 text-slate-700">{leave.reason}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${statusClass(leave.status)}`}
                  >
                    {leave.status}
                  </span>
                </td>
                <td>
                  {leave.status === "PENDING" ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-md bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100"
                        aria-label="Approve leave"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-md bg-rose-50 p-2 text-rose-600 hover:bg-rose-100"
                        aria-label="Reject leave"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
