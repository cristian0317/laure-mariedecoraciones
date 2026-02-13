import { SignJWT, jwtVerify } from 'jose';

function getSecretKey(): Uint8Array {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('La variable de entorno JWT_SECRET no está definida');
  }
  return new TextEncoder().encode(JWT_SECRET);
}

interface UserPayload {
  email: string;
  [propName: string]: unknown;
}

export async function signToken(payload: UserPayload): Promise<string> {
  const secretKey = getSecretKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    return payload as UserPayload;
  } catch (error) {
    return null;
  }
}
