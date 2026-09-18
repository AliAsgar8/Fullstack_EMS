import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar role="admin" />
      <main className="flex-1 p-6 pt-16 md:pt-6">{children}</main>
    </div>
  );
}
