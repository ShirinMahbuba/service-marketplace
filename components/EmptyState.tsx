import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ icon, title, message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="card text-center py-16">
      {icon && <p className="text-5xl mb-4">{icon}</p>}
      <h3 className="font-semibold text-gray-700">{title}</h3>
      {message && <p className="text-sm text-gray-500 mt-1">{message}</p>}
      {actionLabel && actionHref && (
        <div className="mt-4">
          <Link href={actionHref} className="btn-primary">{actionLabel}</Link>
        </div>
      )}
    </div>
  );
}
