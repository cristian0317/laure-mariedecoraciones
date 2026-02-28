import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  console.log('Middleware ejecutándose para:', pathname);

  // Definir rutas protegidas
  const isProtectedRoute = pathname.startsWith('/admin/dashboard') || pathname.startsWith('/admin/categories');

  if (isProtectedRoute) {
    if (!token) {
      console.log('No hay token, redirigiendo a /admin');
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }

    try {
      const decoded = await verifyToken(token);
      if (!decoded) {
        console.log('Token inválido, redirigiendo a /admin');
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
      console.log('Token válido, permitiendo acceso');
    } catch (error) {
      console.error('Error verificando token en middleware:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  // Si ya tiene token y trata de ir al login (/admin), llevarlo al dashboard
  if (token && pathname === '/admin') {
    try {
      const decoded = await verifyToken(token);
      if (decoded) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
      }
    } catch (e) {
      // Si falla, dejamos que vea el login
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/dashboard/:path*',
    '/admin/categories/:path*',
  ],
};
