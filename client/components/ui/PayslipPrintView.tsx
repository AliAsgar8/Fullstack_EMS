"use client";

import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { dummyEmployeeData, dummyPayslipData } from "@/lib/dummyData";

type Props = {
  payslipId: string;
  backHref: string;
};

function formatMoney(value: number) {
  return `$${value.toLocaleString()}`;
}

export default function PayslipPrintView({ payslipId, backHref }: Props) {
  const payslip = dummyPayslipData.find((item) => item._id === payslipId);
  console.log(payslip);
  const employee =
    dummyEmployeeData.find((emp) => emp._id === payslip?.employeeId) ??
    payslip?.employee;

  if (!payslip || !employee) {
    return (
      <div>
        <p className="text-slate-600">Payslip not found.</p>
        <Link href={backHref} className="mt-4 inline-flex text-sidebar-accent">
          ← Back to payslips
        </Link>
      </div>
    );
  }

  const period = format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payslips
        </Link>
        <button
          type="button"
          onClick={() => typeof window !== "undefined" && window.print()}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sidebar-accent px-4 py-2.5 text-sm font-medium text-white"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>

      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-white p-8 shadow-sm">
        <div className="border-b border-border pb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Employee Management System
          </h1>
          <p className="mt-1 text-sm text-slate-500">Salary Payslip</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs tracking-wide text-slate-500 uppercase">
              Employee
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {employee.firstName} {employee.lastName}
            </p>
            <p className="text-sm text-slate-500">{employee.position}</p>
            <p className="text-sm text-slate-500">{employee.department}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs tracking-wide text-slate-500 uppercase">
              Period
            </p>
            <p className="mt-1 font-semibold text-slate-900">{period}</p>
            <p className="text-sm text-slate-500">{employee.email}</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-slate-600">Basic Salary</td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">
                  {formatMoney(payslip.basicSalary)}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-slate-600">Allowances</td>
                <td className="px-4 py-3 text-right font-medium text-emerald-700">
                  +{formatMoney(payslip.allowances)}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-slate-600">Deductions</td>
                <td className="px-4 py-3 text-right font-medium text-rose-700">
                  -{formatMoney(payslip.deductions)}
                </td>
              </tr>
              <tr className="bg-surface">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  Net Salary
                </td>
                <td className="px-4 py-3 text-right text-lg font-semibold text-slate-900">
                  {formatMoney(payslip.netSalary)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          This is a system-generated payslip for {period}.
        </p>
      </div>
    </div>
  );
}
