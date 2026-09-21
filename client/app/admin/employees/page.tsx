import { Plus } from "lucide-react";
import { dummyEmployeeData } from "@/lib/dummyData";

export default function Employees() {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Employees</h1>
          <p className="mt-1 text-slate-500">Manage your team members</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-sidebar-accent px-4 py-2.5 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dummyEmployeeData.map((emp) => (
          <div
            key={emp._id}
            className="overflow-hidden rounded-xl border border-border bg-white"
          >
            <div className="bg-surface px-4 pt-4 pb-8">
              <span className="inline-block rounded-md bg-white px-2.5 py-1 text-xs text-slate-600">
                {emp.department}
              </span>
              <div className="mt-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-brand">
                  {emp.firstName[0]}
                  {emp.lastName[0]}
                </div>
              </div>
            </div>
            <div className="border-t border-border px-4 py-4 text-center">
              <p className="font-semibold text-slate-900">
                {emp.firstName} {emp.lastName}
              </p>
              <p className="mt-1 text-sm text-slate-500">{emp.position}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
