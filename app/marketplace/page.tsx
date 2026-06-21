import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import MarketplaceClient from './MarketplaceClient';
import Navbar from '@/components/Navbar';

export default async function MarketplacePage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session_user');
  if (!sessionCookie) redirect('/login');
  const user = JSON.parse(decodeURIComponent(sessionCookie.value));

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
