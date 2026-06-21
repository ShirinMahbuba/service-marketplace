import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { SessionUser } from './auth';
import { SESSION_COOKIE } from './auth';

export function getSessionUser(): SessionUser {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) redirect('/login');

  try {
    return JSON.parse(decodeURIComponent(sessionCookie.value));
  } catch {
    redirect('/login');
  }
}
