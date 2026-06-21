import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';
import PageLayout from '@/components/PageLayout';
import VendorServicesClient from './VendorServicesClient';

export default async function VendorServicesPage() {
  const user = getSessionUser();

  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: user.id },
    include: {
      services: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!vendorProfile) redirect('/login');

  return (
    <PageLayout user={user} maxWidth="4xl">
      <VendorServicesClient vendorProfileId={vendorProfile.id} services={vendorProfile.services} />
    </PageLayout>
  );
}
