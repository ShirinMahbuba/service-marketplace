import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';
import PageLayout from '@/components/PageLayout';
import CheckoutClient from './CheckoutClient';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { serviceId?: string };
}) {
  const user = getSessionUser();

  if (!searchParams.serviceId) redirect('/marketplace');

  const service = await prisma.service.findUnique({
    where: { id: searchParams.serviceId },
    include: {
      vendorProfile: { include: { user: true } },
    },
  });

  if (!service) redirect('/marketplace');

  return (
    <PageLayout user={user}>
      <CheckoutClient service={service} userId={user.id} />
    </PageLayout>
  );
}
