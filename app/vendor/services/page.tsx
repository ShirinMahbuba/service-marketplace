import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import VendorServicesClient from './VendorServicesClient';
import { getSession } from '@/lib/session';

export default async function VendorServicesPage() {
  const user = await getSession();
  if (!user || user.role !== 'VENDOR') redirect('/login');

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
      <VendorServicesClient services={vendorProfile.services} />
    </div>
  );
}
