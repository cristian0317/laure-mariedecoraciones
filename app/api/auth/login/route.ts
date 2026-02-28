import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (jsonError: any) {
      console.error('Error al parsear JSON:', jsonError);
      return NextResponse.json(
        { success: false, message: 'Cuerpo de solicitud inválido: ' + jsonError.message },
        { status: 400 }
      );
    }

    const { email, password } = body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    // Verificar si faltan variables críticas
    if (!adminEmail || !adminPassword || !jwtSecret) {
      const missing = [];
      if (!adminEmail) missing.push('ADMIN_EMAIL');
      if (!adminPassword) missing.push('ADMIN_PASSWORD');
      if (!jwtSecret) missing.push('JWT_SECRET');
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Configuración incompleta en Vercel. Faltan: ${missing.join(', ')}. Asegúrate de REDESPLEGAR después de agregarlas.` 
        },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      try {
        const token = await signToken({ email });
        const response = NextResponse.json({ success: true });
        
        response.cookies.set('token', token, {
          httpOnly: true,
          secure: true, // Forzado a true para producción/Vercel
          sameSite: 'strict',
          maxAge: 3600,
          path: '/',
        });
        
        return response;
      } catch (tokenError: any) {
        return NextResponse.json(
          { success: false, message: 'Error al generar token: ' + tokenError.message },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Error crítico:', error);
    return NextResponse.json(
      { success: false, message: 'Error crítico del servidor: ' + (error.message || 'Error desconocido') },
      { status: 500 }
    );
  }
}
