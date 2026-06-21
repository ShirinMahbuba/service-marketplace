import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiUrl } from '@/lib/api';
import MarketplaceClient from './MarketplaceClient';
import Navbar from '@/components/Navbar';

export default async function MarketplacePage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session_user');
  if (!sessionCookie) redirect('/login');
  const user = JSON.parse(decodeURIComponent(sessionCookie.value));

  const res = await fetch(apiUrl('/api/services'), { cache: 'no-store' });
  const services = await res.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <MarketplaceClient services={services} />
    </div>
  );
}
