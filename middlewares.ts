import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromRequest } from './lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?redirect=/admin', request.url));
    }
    
    if (user.role !== 'admin' && user.role !== 'staff') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Account routes protection
  if (pathname.startsWith('/account')) {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?redirect=/account', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*']
};