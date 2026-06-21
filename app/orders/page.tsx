import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';
import { formatCurrency, formatDate } from '@/lib/format';
import PageLayout from '@/components/PageLayout';
import StatCard from '@/components/StatCard';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';

export default async function OrdersPage() {
  const user = getSessionUser();

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    include: {
      service: {
        include: { vendorProfile: { include: { user: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <PageLayout user={user} maxWidth="4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Your booking history</p>
        </div>
        <Link href="/marketplace" className="btn-primary text-sm">+ Book Service</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Total Orders" value={transactions.length} color="text-sky-600" />
        <StatCard label="Total Spent" value={formatCurrency(totalSpent)} color="text-emerald-600" />
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          message="Browse the marketplace and book your first service"
          actionLabel="Go to Marketplace"
          actionHref="/marketplace"
        />
      ) : (
        <div className="space-y-3">
          {transactions.map((txn) => (
            <div key={txn.id} className="card flex items-start gap-4">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                🏠
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{txn.service.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">🏪 {txn.service.vendorProfile.user.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900">{formatCurrency(txn.amount)}</p>
                    <span className={`badge text-xs mt-1 ${
                      txn.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>💳 {txn.paymentMethod}</span>
                  <span>·</span>
                  <span>{formatDate(txn.createdAt, 'medium')}</span>
                  <span>·</span>
                  <span className="font-mono truncate max-w-[100px]">{txn.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
