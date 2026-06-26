import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard', '/simulation', '/galaxy', '/roadmap'];
  const authPaths = ['/login', '/signup'];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuth = authPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    const url = new URL('/login', request.url);
    // Remember where the user was trying to go
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuth && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/simulation/:path*',
    '/galaxy/:path*',
    '/roadmap/:path*',
    '/login',
    '/signup',
  ],
};
