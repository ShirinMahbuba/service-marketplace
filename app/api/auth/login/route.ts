import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const user = await request.json();

  const response = NextResponse.json({ success: true, user });

  response.cookies.set('session_user', encodeURIComponent(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })), {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: 'lax',
  });

  return response;
}
