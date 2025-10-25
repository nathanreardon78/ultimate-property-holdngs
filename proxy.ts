import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth/session';

const PUBLIC_ADMIN_PATHS = ['/admin/login'];
const PUBLIC_ADMIN_API = ['/api/admin/login'];

export default async function proxy(request: NextRequest){
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminApiRoute = pathname.startsWith('/api/admin');

  if (!isAdminRoute && !isAdminApiRoute){
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.some((path)=> pathname.startsWith(path)) ||
      PUBLIC_ADMIN_API.some((path)=> pathname.startsWith(path))){
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token){
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifySessionToken(token);
  if (!session){
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.set({ name: SESSION_COOKIE, value: '', path: '/', maxAge: 0 });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
