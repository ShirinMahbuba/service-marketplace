import { NextResponse } from 'next/server';
import { clearSessionCookies } from '@/lib/session';

export async function POST() {
  const { cookieName, sigName } = clearSessionCookies();
  const response = NextResponse.json({ success: true });
  response.cookies.delete(cookieName);
  response.cookies.delete(sigName);
  return response;
}
