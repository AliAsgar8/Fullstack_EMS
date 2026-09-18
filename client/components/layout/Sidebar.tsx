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
    <aside className="flex min-h-screen w-64 flex-col bg-brand text-white">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
          EMS
        </p>
        <h1 className="mt-1 text-lg font-semibold capitalize">{role} Portal</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
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
