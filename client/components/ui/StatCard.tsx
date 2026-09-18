type StatCardProps = {
  label: string;
  value: number | string;
  icon: React.ReactNode;
};

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="group hover:-translate-y-1 transition-all duration-300 cursor-pointer relative flex items-center justify-between rounded-xl bg-white px-6 py-8 shadow-sm border border-border">
      <div className="flex gap-4">
        <span className="absolute top-0 left-0 h-full w-1.5 rounded-l-full bg-sidebar-accent" />
        <div>
          <p className="text-lg font-medium text-slate-900">{label}</p>
          <p className="text-2xl font-semibold text-slate-900 mt-2">{value}</p>
        </div>
      </div>
      <div className="group-hover:text-sidebar-accent transition-colors">
        {icon}
      </div>
    </div>
  );
}
