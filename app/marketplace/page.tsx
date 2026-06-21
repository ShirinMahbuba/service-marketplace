import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';
import PageLayout from '@/components/PageLayout';
import MarketplaceClient from './MarketplaceClient';

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
    <PageLayout user={user} maxWidth="7xl">
      <MarketplaceClient services={services} />
    </PageLayout>
  );
}
