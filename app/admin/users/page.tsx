import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';
import { formatDate } from '@/lib/format';
import { ROLE_BADGE_COLORS } from '@/lib/constants';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';

export default async function AdminUsersPage() {
  const user = getSessionUser();

  const users = await prisma.user.findMany({
    include: {
      vendorProfile: { include: { services: true } },
      transactions: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <PageLayout user={user}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Users <span className="text-gray-400 text-lg">({users.length})</span></h1>
        <Link href="/admin/dashboard" className="btn-secondary text-sm">← Dashboard</Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Services</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Orders</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-800">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`badge text-xs ${ROLE_BADGE_COLORS[u.role]}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {u.vendorProfile ? u.vendorProfile.services.length : '—'}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">{u.transactions.length}</td>
                <td className="px-4 py-3 text-right text-xs text-gray-400">
                  {formatDate(u.createdAt, 'medium')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}
