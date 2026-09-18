"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  DollarSign,
  Settings,
  Users,
  LogOut,
  UserRound,
  ChevronRight,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { dummyProfileData } from "@/lib/dummyData";

type SidebarProps = {
  role: "admin" | "employee";
};

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/employees", label: "Employees", icon: Users },
  { href: "/admin/leave", label: "Leave", icon: FileText },
  { href: "/admin/payslip", label: "Payslips", icon: DollarSign },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const employeeLinks = [
  { href: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employee/attendance", label: "Attendance", icon: CalendarDays },
  { href: "/employee/leave", label: "Leave", icon: FileText },
  { href: "/employee/payslip", label: "Payslips", icon: DollarSign },
  { href: "/employee/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName = `${dummyProfileData.firstName} ${dummyProfileData.lastName}`;
  const userInitial = dummyProfileData.firstName.charAt(0).toUpperCase();
  const roleLabel = role === "admin" ? "Admin" : "Employee";
  const links = role === "admin" ? adminLinks : employeeLinks;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <>
      <button
        type="button"
        className="fixed top-4 left-4 z-40 rounded-md border border-border bg-white p-2 text-slate-700 shadow-sm md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-white transition-transform duration-200 md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-start justify-between px-5 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <UserRound className="h-6 w-6 shrink-0 text-white" strokeWidth={1.5} />
            <div>
              <p className="text-base font-semibold leading-tight text-white">
                Employee MS
              </p>
              <p className="text-xs text-slate-400">Management System</p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-md p-1 text-slate-300 hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-5 border-t border-dashed border-slate-600" />

        {/* Profile */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-semibold text-white">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {userName}
              </p>
              <p className="text-xs text-slate-400">{roleLabel}</p>
            </div>
          </div>
        </div>

        <div className="mx-5 border-t border-dashed border-slate-600" />

        {/* Navigation */}
        <nav className="flex flex-1 flex-col px-3 py-5">
          <p className="mb-3 px-2 text-[11px] font-medium tracking-wider text-slate-500 uppercase">
            Navigation
          </p>

          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                    isActive
                      ? "bg-sidebar-accent/20 text-indigo-200"
                      : "text-slate-200 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-accent" />
                  )}
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span className="flex-1">{link.label}</span>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 shrink-0 text-indigo-300" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="mx-5 border-t border-dashed border-slate-600" />

        {/* Logout */}
        <div className="px-3 py-5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
