import { serialize } from 'cookie';

export const createSessionCookie = (sessionToken: string, expiresAt: Date) => {
  return serialize('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
};

export const clearSessionCookie = () => {
  return serialize('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    sameSite: 'lax',
    path: '/',
  });
};
