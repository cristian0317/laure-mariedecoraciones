import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Si no hay token y la ruta es protegida, redirigir al login
  if (!token && pathname.startsWith('/admin/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  // Si hay token, verificarlo
  if (token) {
    const decoded = await verifyToken(token);

    // Si el token no es válido y la ruta es protegida, redirigir al login
    if (!decoded && pathname.startsWith('/admin/dashboard')) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
