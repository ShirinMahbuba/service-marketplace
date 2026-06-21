import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import VendorServicesClient from './VendorServicesClient';

export default async function VendorServicesPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session_user');
  if (!sessionCookie) redirect('/login');
  const user = JSON.parse(decodeURIComponent(sessionCookie.value));

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
