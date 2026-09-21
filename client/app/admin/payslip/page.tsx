"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { format } from "date-fns";
import { dummyPayslipData } from "@/lib/dummyData";
import GeneratePayslipModal from "@/components/ui/GeneratePayslipModal";

function formatPeriod(month: number, year: number) {
  return format(new Date(year, month - 1), "MMMM yyyy");
}

function formatMoney(value: number) {
  return `$${value.toLocaleString()}`;
}

export default function Payslip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Payslips</h1>
          <p className="mt-1 text-slate-500">
            Generate and manage employee payslips
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sidebar-accent px-4 py-2.5 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          Generate Payslip
        </button>
      </div>

      {isOpen && <GeneratePayslipModal onClose={() => setIsOpen(false)} />}

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wide text-slate-500 uppercase">
              <th className="px-5 py-4 font-medium">Employee</th>
              <th className="px-5 py-4 font-medium">Period</th>
              <th className="px-5 py-4 font-medium">Basic Salary</th>
              <th className="px-5 py-4 font-medium">Net Salary</th>
              <th className="px-5 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyPayslipData.map((payslip) => (
              <tr
                key={payslip._id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-5 py-4 font-medium text-slate-900">
                  {payslip.employee.firstName} {payslip.employee.lastName}
                </td>
                <td className="px-5 py-4 text-slate-700">
                  {formatPeriod(payslip.month, payslip.year)}
                </td>
                <td className="px-5 py-4 text-slate-700">
                  {formatMoney(payslip.basicSalary)}
                </td>
                <td className="px-5 py-4 font-semibold text-slate-900">
                  {formatMoney(payslip.netSalary)}
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/payslip/print/${payslip._id}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-sidebar-accent hover:bg-indigo-100"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
