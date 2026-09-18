"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  role: "admin" | "employee";
};

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/employees", label: "Employees" },
  { href: "/admin/leave", label: "Leave" },
  { href: "/admin/payslip", label: "Payslip" },
  { href: "/admin/settings", label: "Settings" },
];

const employeeLinks = [
  { href: "/employee/dashboard", label: "Dashboard" },
  { href: "/employee/attendance", label: "Attendance" },
  { href: "/employee/leave", label: "Leave" },
  { href: "/employee/payslip", label: "Payslip" },
  { href: "/employee/settings", label: "Settings" },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "admin" ? adminLinks : employeeLinks;

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="border-b border-slate-700 px-5 py-6">
        <p className="text-sm font-semibold tracking-wide uppercase text-slate-300">
          EMS
        </p>
        <h1 className="mt-1 text-lg font-semibold capitalize">{role} Portal</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
