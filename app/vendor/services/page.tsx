import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';
import Navbar from '@/components/Navbar';
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
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <VendorServicesClient vendorProfileId={vendorProfile.id} services={vendorProfile.services} />
    </div>
  );
}
