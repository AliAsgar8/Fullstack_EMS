import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <aside className="hidden w-[50%] flex-col justify-center bg-[#0B1F3A] px-20  text-white lg:flex">
        <h1 className="text-4xl font-bold max-w-lg">Employee Management System</h1>
        <p className="mt-4 text-base text-slate-300 max-w-lg">
          Streamline your workforce operations, track attendance, manage
          payroll, and empower your team securely.
        </p>
      </aside>

      {/* Right panel */}
      <main className="flex flex-1 items-center justify-center bg-white px-6">
        {children}
      </main>
    </div>
  );
}
