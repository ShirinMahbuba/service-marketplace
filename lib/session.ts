import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'VENDOR' | 'END_USER';
}

const COOKIE_NAME = 'session_user';
const SIGNATURE_COOKIE = 'session_sig';

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET env var must be set to a random string of at least 32 characters.',
    );
  }
  return secret;
}

async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuf(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

async function sign(payload: string): Promise<string> {
  const key = await getCryptoKey();
  const sig = await globalThis.crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return bufToHex(sig);
}

async function verify(payload: string, signature: string): Promise<boolean> {
  try {
    const key = await getCryptoKey();
    return globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      hexToBuf(signature),
      new TextEncoder().encode(payload),
    );
  } catch {
    return false;
  }
}

export async function buildSessionCookies(user: SessionUser) {
  const payload = encodeURIComponent(
    JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }),
  );
  const sig = await sign(payload);

  const opts = {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };

  return { payload, sig, opts, cookieName: COOKIE_NAME, sigName: SIGNATURE_COOKIE };
}

/** Read and verify the session from Next.js request cookies (middleware context). */
export async function getSessionFromRequest(request: NextRequest): Promise<SessionUser | null> {
  const payloadCookie = request.cookies.get(COOKIE_NAME);
  const sigCookie = request.cookies.get(SIGNATURE_COOKIE);
  if (!payloadCookie || !sigCookie) return null;

  try {
    if (!(await verify(payloadCookie.value, sigCookie.value))) return null;
    return JSON.parse(decodeURIComponent(payloadCookie.value)) as SessionUser;
  } catch {
    return null;
  }
}

/** Read and verify the session from the cookies() helper (server-component / route-handler context). */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const payloadCookie = cookieStore.get(COOKIE_NAME);
  const sigCookie = cookieStore.get(SIGNATURE_COOKIE);
  if (!payloadCookie || !sigCookie) return null;

  try {
    if (!(await verify(payloadCookie.value, sigCookie.value))) return null;
    return JSON.parse(decodeURIComponent(payloadCookie.value)) as SessionUser;
  } catch {
    return null;
  }
}

export function clearSessionCookies() {
  return { cookieName: COOKIE_NAME, sigName: SIGNATURE_COOKIE };
}
