import Sidebar from "@/components/layout/Sidebar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar role="employee" />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
