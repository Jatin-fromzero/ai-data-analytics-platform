import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  
  // Public paths allowed for guests
  const isPublicRoute = [
    '/', 
    '/login', 
    '/signup', 
    '/about', 
    '/contact', 
    '/career'
  ].includes(nextUrl.pathname) || 
  nextUrl.pathname.startsWith('/career-outcomes') ||
  nextUrl.pathname.startsWith('/_next') ||
  nextUrl.pathname.startsWith('/api') && !nextUrl.pathname.startsWith('/api/admin');

  const isAuthRoute = ['/login', '/signup'].includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      const role = (req.auth?.user as any)?.role;
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin', nextUrl));
      }
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  if (isAdminRoute && isLoggedIn) {
    const role = (req.auth?.user as any)?.role;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
