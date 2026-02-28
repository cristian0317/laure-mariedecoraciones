import { SignJWT, jwtVerify } from 'jose';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está definida en las variables de entorno');
  }
  return new TextEncoder().encode(secret);
};

export async function signToken(payload: any) {
  try {
    const secret = getSecretKey();
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(secret);
  } catch (error) {
    console.error('Error signing token:', error);
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}
