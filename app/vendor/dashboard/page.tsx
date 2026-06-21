import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';
import { formatCurrency, formatDate } from '@/lib/format';
import PageLayout from '@/components/PageLayout';
import StatCard from '@/components/StatCard';
import Link from 'next/link';

export default async function VendorDashboard() {
  const user = getSessionUser();

  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: user.id },
    include: {
      services: {
        include: {
          transactions: {
            include: { user: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
    },
  });

  if (!vendorProfile) redirect('/login');

  const allTransactions = vendorProfile.services.flatMap((s) => s.transactions);
  const totalEarnings = allTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalOrders = allTransactions.length;

  return (
    <PageLayout user={user}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {user.name}</p>
        </div>
        <Link href="/vendor/services" className="btn-primary text-sm">+ Add Service</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Active Services" value={vendorProfile.services.length} color="text-sky-600" />
        <StatCard label="Total Orders" value={totalOrders} color="text-orange-500" />
        <StatCard label="Total Earnings" value={formatCurrency(totalEarnings)} color="text-emerald-600" />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">My Services</h2>
        {vendorProfile.services.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-gray-500">No services yet. <Link href="/vendor/services" className="text-sky-600 font-medium">Add your first service →</Link></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendorProfile.services.map((service) => (
              <div key={service.id} className="card">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{service.name}</h3>
                  <span className="badge bg-sky-100 text-sky-700 text-xs">{service.category}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-700">{formatCurrency(service.price)}</span>
                  <span className="text-xs text-gray-400">{service.transactions.length} order{service.transactions.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders Received</h2>
        {allTransactions.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-gray-500 text-sm">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allTransactions.slice(0, 10).map((txn) => (
              <div key={txn.id} className="card flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{txn.user.name}</p>
                  <p className="text-xs text-gray-500">{formatDate(txn.createdAt, 'long')}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">{formatCurrency(txn.amount)}</p>
                  <span className="badge bg-green-100 text-green-700 text-xs">{txn.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
