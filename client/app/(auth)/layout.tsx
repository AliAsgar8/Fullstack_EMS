import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-1/2 flex-col justify-center bg-brand px-20 text-white lg:flex">
        <h1 className="max-w-lg text-4xl font-bold">
          Employee Management System
        </h1>
        <p className="mt-4 max-w-lg text-base text-slate-300">
          Streamline your workforce operations, track attendance, manage
          payroll, and empower your team securely.
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center bg-white px-6 py-10">
        {children}
      </main>
    </div>
  );
}
