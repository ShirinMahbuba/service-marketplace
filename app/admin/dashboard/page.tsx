import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';
import Navbar from '@/components/Navbar';
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
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Platform overview</p>
          </div>
          <Link href="/admin/users" className="btn-secondary text-sm">View All Users</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'End Users', value: userCount, icon: '👥', color: 'text-sky-600' },
            { label: 'Vendors', value: vendorCount, icon: '🏪', color: 'text-emerald-600' },
            { label: 'Services', value: serviceCount, icon: '📋', color: 'text-orange-500' },
            { label: 'Revenue (৳)', value: totalRevenue.toLocaleString(), icon: '💰', color: 'text-purple-600' },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <p className="text-3xl mb-1">{stat.icon}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
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
                    <td className="px-4 py-3 text-right font-bold text-gray-900">৳{txn.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-400 text-xs">
                      {new Date(txn.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
