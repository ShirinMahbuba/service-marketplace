import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CheckoutClient from './CheckoutClient';
import Navbar from '@/components/Navbar';
import { getSession } from '@/lib/session';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { serviceId?: string };
}) {
  const user = await getSession();
  if (!user || user.role !== 'END_USER') redirect('/login');

  if (!searchParams.serviceId) redirect('/marketplace');

  const service = await prisma.service.findUnique({
    where: { id: searchParams.serviceId },
    include: {
      vendorProfile: { include: { user: true } },
    },
  });

  if (!service) redirect('/marketplace');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <CheckoutClient service={service} />
    </div>
  );
}
