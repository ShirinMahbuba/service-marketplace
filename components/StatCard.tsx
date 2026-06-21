interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export default function StatCard({ label, value, icon, color = 'text-sky-600' }: StatCardProps) {
  return (
    <div className="card text-center">
      {icon && <p className="text-3xl mb-1">{icon}</p>}
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
