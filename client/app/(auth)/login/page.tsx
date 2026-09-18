import React from "react";
import { ShieldIcon } from "lucide-react";

const Login = () => {

  const portalOptions = [
    {
      to: "/login/admin",
      title: "Admin Portal",
      description: "Manage employees, departments, payroll, and system configurations.",
      icon: <ShieldIcon />,
    },
    {
      to: "/login/employee",
      title: "Employee Portal",
      description: "View your payroll, attendance, and personal information.",
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
        <button>Employee</button>
        <button>Admin</button>
      </div>
      <div>

      </div>

    </div>
  )
};

export default Login;
