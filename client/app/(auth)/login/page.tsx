import React from "react";
import { ShieldIcon } from "lucide-react";
import Link from "next/link";

const Login = () => {

  const portalOptions = [
    {
      to: "/login/employee",
      label: "Employee",
      title: "Employee Portal",
      description: "View your payroll, attendance, and personal information.",
      icon: <ShieldIcon />,
    },
    {
      to: "/login/admin",
      label: "Admin",
      title: "Admin Portal",
      description: "Manage employees, departments, payroll, and system configurations.",
      icon: <ShieldIcon />,
    },
  ]
  return (
    <div className="w-full max-w-md animate-fade-in relative z-10">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-3">Welcome Back</h2>
        <p className="text-slate-500">Select your portal to securely access the system.</p>
      </div>
      <div>
        {portalOptions.map((option) => (
          <Link key={option.to} href={option.to}>
            {option.label}
          </Link>
        ))}
      </div>
      <div>

      </div>

    </div>
  )
};

export default Login;
