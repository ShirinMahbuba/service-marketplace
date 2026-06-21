import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Reads and parses the session cookie, redirecting to /login if the cookie
 * is missing or contains malformed data.
 */
export function getSessionUser(): SessionUser {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session_user');

  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));

    if (!parsed || !parsed.id || !parsed.name || !parsed.email || !parsed.role) {
      redirect('/login');
    }

    return parsed as SessionUser;
  } catch {
    redirect('/login');
  }
}
