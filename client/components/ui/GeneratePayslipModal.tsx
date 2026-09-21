"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { dummyEmployeeData } from "@/lib/dummyData";

type Props = {
  onClose: () => void;
};

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function GeneratePayslipModal({ onClose }: Props) {
  const [employeeId, setEmployeeId] = useState(dummyEmployeeData[0]?._id ?? "");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const selectedEmployee = dummyEmployeeData.find((emp) => emp._id === employeeId);
  const basicSalary = selectedEmployee?.basicSalary ?? 0;
  const allowances = selectedEmployee?.allowances ?? 0;
  const deductions = selectedEmployee?.deductions ?? 0;
  const netSalary = basicSalary + allowances - deductions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Generate Payslip
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Create a payslip for an employee
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md p-1.5 text-slate-400 hover:bg-surface hover:text-slate-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label htmlFor="employee" className="label-field">
              Employee
            </label>
            <select
              id="employee"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="input-field"
              required
            >
              {dummyEmployeeData.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="month" className="label-field">
                Month
              </label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="input-field"
                required
              >
                {months.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year" className="label-field">
                Year
              </label>
              <input
                id="year"
                type="number"
                min={2020}
                max={2100}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Basic salary</span>
              <span>${basicSalary.toLocaleString()}</span>
            </div>
            <div className="mt-2 flex justify-between text-slate-600">
              <span>Allowances</span>
              <span>${allowances.toLocaleString()}</span>
            </div>
            <div className="mt-2 flex justify-between text-slate-600">
              <span>Deductions</span>
              <span>${deductions.toLocaleString()}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold text-slate-900">
              <span>Net salary</span>
              <span>${netSalary.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-md bg-sidebar-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-sidebar-accent/90"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
