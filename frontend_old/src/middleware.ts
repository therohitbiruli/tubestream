import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1] || req.cookies.get('admin-token')?.value;

  const { pathname } = req.nextUrl;

  // For API routes, check for token in headers
  if (pathname.startsWith('/api/videos') && req.method !== 'GET' || pathname.startsWith('/api/upload')) {
    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Authentication required' }), { status: 401 });
    }
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      return new NextResponse(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }
  }

  // For admin pages, check for token in cookies
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

// This configures which paths the middleware runs on
export const config = {
  matcher: ['/admin/:path*', '/api/videos/:path*', '/api/upload'],
};