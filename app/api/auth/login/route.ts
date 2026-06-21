import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !body.id || !body.name || !body.email || !body.role) {
      return NextResponse.json(
        { error: 'Missing required user fields (id, name, email, role)' },
        { status: 400 }
      );
    }

    const validRoles = ['ADMIN', 'VENDOR', 'END_USER'];
    if (!validRoles.includes(body.role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    const user = {
      id: body.id,
      name: body.name,
      email: body.email,
      role: body.role,
    };

    const response = NextResponse.json({ success: true, user });

    response.cookies.set('session_user', encodeURIComponent(JSON.stringify(user)), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
