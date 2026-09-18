"use client";

import { useEffect, useState } from "react";
import { dummyEmployeeDashboardData } from "@/lib/dummyData";
import { ArrowRight, CalendarDays, DollarSign, Loader2 } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { FileText } from "lucide-react";
import Link from "next/link";

const Dashboard = () => {
  const data = dummyEmployeeDashboardData;

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }, [data.employee]);

    return isLoading ? (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-sidebar-accent" />
      </div>
    ) : (
    <div>
      <h1 className="text-3xl font-semibold text-slate-900">
        Welcome back, {data.employee.firstName}
      </h1>
      <p className="text-sm text-slate-500 mt-2">{data.employee.position} - {data.employee.department}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        <StatCard
          label="Days Present"
          value={data.currentMonthAttendance}
          icon={<CalendarDays />}
        />
        <StatCard
          label="Pending Leaves"
          value={data.pendingLeaves}
          icon={<FileText />}
        />
        <StatCard
          label="Latest Payslip"
          value={`$${ data.latestPayslip.netSalary?.toLocaleString()}`}
          icon={<DollarSign />}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/employee/attendance"
          className="inline-flex items-center gap-2 bg-sidebar-accent text-white px-4 py-2 rounded-md"
        >
          Mark Attendance <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/employee/leaves"
          className="inline-flex items-center gap-2 border border-border text-slate-600 px-4 py-2 rounded-md"
        >
          Apply for Leave
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
