import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const portalOptions = [
  {
    to: "/login/admin",
    title: "Admin Portal",
    description:
      "Manage employees, departments, payroll, and system configurations.",
  },
  {
    to: "/login/employee",
    title: "Employee Portal",
    description: "View your payroll, attendance, and personal information.",
  },
];


export default function Login() {
  return (
    <div className="auth-card">
      <div className="mb-10 text-center md:text-left">
        <h2 className="page-title mb-3">Welcome Back</h2>
        <p className="page-subtitle">
          Select your portal to securely access the system.
        </p>
      </div>

      <div className="space-y-4">
        {portalOptions.map((option) => (
          <Link key={option.to} href={option.to} className="portal-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">{option.title}</p>
              </div>
              <ArrowRightIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm text-slate-500">
        {new Date().getFullYear()} © Employee Management System. All rights
        reserved.
      </p>
    </div>
  );
}
