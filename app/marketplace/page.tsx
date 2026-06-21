import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import MarketplaceClient from './MarketplaceClient';
import Navbar from '@/components/Navbar';
import { getSession } from '@/lib/session';

export default async function MarketplacePage() {
  const user = await getSession();
  if (!user) redirect('/login');

  const services = await prisma.service.findMany({
    where: { isActive: true },
    include: {
      vendorProfile: {
        include: { user: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <MarketplaceClient services={services} />
    </div>
  );
}
