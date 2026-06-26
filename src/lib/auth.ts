import crypto from 'crypto';
import { cookies } from 'next/headers';
import { db, User } from './db';

const PBKDF2_ITERATIONS = 10000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = 'sha512';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString('hex');
  return `${salt}.${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split('.');
  if (!salt || !hash) return false;
  const computedHash = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString('hex');
  return computedHash === hash;
}

export async function createSession(userId: string): Promise<string> {
  const session = db.createSession(userId);
  
  // Set the session token in an HTTP-only secure cookie
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'session_token',
    value: session.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(session.expiresAt),
  });

  return session.token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('session_token');
  
  if (tokenCookie?.value) {
    db.deleteSession(tokenCookie.value);
  }
  
  cookieStore.delete('session_token');
}

export async function getSessionUser(): Promise<Omit<User, 'passwordHash'> | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('session_token');
    if (!tokenCookie?.value) return null;

    const session = db.getSession(tokenCookie.value);
    if (!session) return null;

    const user = db.getUserById(session.userId);
    if (!user) return null;

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    console.error('Error fetching session user:', error);
    return null;
  }
}
