import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildSessionCookies } from '@/lib/session';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = typeof body.email === 'string' ? body.email.trim() : '';

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const { payload, sig, opts, cookieName, sigName } = await buildSessionCookies({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as 'ADMIN' | 'VENDOR' | 'END_USER',
  });

  const response = NextResponse.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });

  response.cookies.set(cookieName, payload, opts);
  response.cookies.set(sigName, sig, opts);

  return response;
}
