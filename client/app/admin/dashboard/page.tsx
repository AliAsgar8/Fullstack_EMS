"use client";

import StatCard from "@/components/ui/StatCard";
import { dummyAdminDashboardData } from "@/lib/dummyData";
import { Building2, CalendarDays, FileText, Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const data = dummyAdminDashboardData;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [data]);

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-sidebar-accent" />
    </div>
  ) : (
    <div>
      <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-500">
        Welcome back, Admin — here&apos;s your overview
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        <StatCard
          label="Total Employees"
          value={data.totalEmployees}
          icon={<Users />}
        />
        <StatCard
          label="Departments"
          value={data.totalDepartments}
          icon={<Building2 />}
        />
        <StatCard
          label="Today's Attendance"
          value={data.todayAttendance}
          icon={<CalendarDays />}
        />
        <StatCard
          label="Pending Leaves"
          value={data.pendingLeaves}
          icon={<FileText />}
        />
      </div>
    </div>
  );
};

export default Dashboard;
