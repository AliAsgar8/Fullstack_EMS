"use client"

import { Plus, Thermometer, Umbrella, TreePalm } from "lucide-react";
import { format } from "date-fns";
import { dummyLeaveData } from "@/lib/dummyData";
import StatCard from "@/components/ui/StatCard";
import { useState } from "react";
import ApplyLeaveModal from "@/components/ui/ApplyLeaveModal";

function formatDate(value: string) {
  return format(new Date(value), "MMM d, yyyy");
}

function statusClass(status: string) {
  if (status === "APPROVED") return "bg-emerald-50 text-emerald-700";
  if (status === "REJECTED") return "bg-rose-50 text-rose-700";
  if (status === "PENDING") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

function countTaken(type: string) {
  return dummyLeaveData.filter(
    (leave) => leave.type === type && leave.status === "APPROVED",
  ).length;
}

export default function Leave() {
  const [isOpen, setIsOpen] = useState(false);

  const sickTaken = countTaken("SICK");
  const casualTaken = countTaken("CASUAL");
  const annualTaken = countTaken("ANNUAL");

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Leave Management
          </h1>
          <p className="mt-1 text-slate-500">Your leave history and requests</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-sidebar-accent px-4 py-2.5 text-sm font-medium text-white cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Apply for Leave
        </button>
      </div>
      {isOpen && <ApplyLeaveModal onClose={() => setIsOpen(false)} />}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          label="Sick Leave"
          value={`${sickTaken} taken`}
          icon={<Thermometer className="h-5 w-5" />}
        />
        <StatCard
          label="Casual Leave"
          value={`${casualTaken} taken`}
          icon={<Umbrella className="h-5 w-5" />}
        />
        <StatCard
          label="Annual Leave"
          value={`${annualTaken} taken`}
          icon={<TreePalm className="h-5 w-5" />}
        />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wide text-slate-500 uppercase">
              <th className="px-5 py-4 font-medium">Type</th>
              <th className="px-5 py-4 font-medium">Dates</th>
              <th className="px-5 py-4 font-medium">Reason</th>
              <th className="px-5 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyLeaveData.map((leave) => (
              <tr
                key={leave._id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-5 py-4">
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {leave.type}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-700">
                  {formatDate(leave.startDate)} – {formatDate(leave.endDate)}
                </td>
                <td className="px-5 py-4 text-slate-700">{leave.reason}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${statusClass(leave.status)}`}
                  >
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
