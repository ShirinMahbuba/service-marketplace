import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CheckoutClient from './CheckoutClient';
import Navbar from '@/components/Navbar';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { serviceId?: string };
}) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session_user');
  if (!sessionCookie) redirect('/login');
  const user = JSON.parse(decodeURIComponent(sessionCookie.value));

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
      <CheckoutClient service={service} userId={user.id} />
    </div>
  );
}
