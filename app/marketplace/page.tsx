import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';
import MarketplaceClient from './MarketplaceClient';
import Navbar from '@/components/Navbar';

export default async function MarketplacePage() {
  const user = getSessionUser();

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
