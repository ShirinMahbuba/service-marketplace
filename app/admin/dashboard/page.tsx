import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';
import { formatCurrency, formatDate } from '@/lib/format';
import PageLayout from '@/components/PageLayout';
import StatCard from '@/components/StatCard';
import Link from 'next/link';

export default async function AdminDashboard() {
  const user = getSessionUser();

  const [userCount, vendorCount, serviceCount, transactions] = await Promise.all([
    prisma.user.count({ where: { role: 'END_USER' } }),
    prisma.user.count({ where: { role: 'VENDOR' } }),
    prisma.service.count(),
    prisma.transaction.findMany({
      include: {
        user: true,
        service: { include: { vendorProfile: { include: { user: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <PageLayout user={user}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Platform overview</p>
        </div>
        <Link href="/admin/users" className="btn-secondary text-sm">View All Users</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="End Users" value={userCount} icon="👥" color="text-sky-600" />
        <StatCard label="Vendors" value={vendorCount} icon="🏪" color="text-emerald-600" />
        <StatCard label="Services" value={serviceCount} icon="📋" color="text-orange-500" />
        <StatCard label="Revenue (৳)" value={totalRevenue.toLocaleString()} icon="💰" color="text-purple-600" />
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h2>
      {transactions.length === 0 ? (
        <div className="card text-center py-10 text-gray-500">No transactions yet.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vendor</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{txn.user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{txn.service.name}</td>
                  <td className="px-4 py-3 text-gray-600">{txn.service.vendorProfile.user.name}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(txn.amount)}</td>
                  <td className="px-4 py-3 text-right text-gray-400 text-xs">
                    {formatDate(txn.createdAt, 'short')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  );
}
