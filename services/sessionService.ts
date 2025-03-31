import { SESSION_DURATION } from "@/constants/session";
import { signToken, verifyToken } from "@/lib/auth/token";
import * as SessionRepository from "@/repository/sessionRepository";

export const createSession = async (user: { id: number, role: string }) => {
  const expiresAt = new Date(Date.now() + SESSION_DURATION.DEFAULT);

  if (process.env.SESSION_STRATEGY === 'db') {
    const sessionId = await SessionRepository.createSession(user.id, expiresAt);
    return { sessionId, expiresAt };
  }

  if (process.env.SESSION_STRATEGY === 'db-jwt') {
    const sessionId = await SessionRepository.createSession(user.id, expiresAt);
    const jwt = await signToken(
      { sessionId, expiresAt: expiresAt.toISOString() },
      true // SECRET!! <<<< 핵심
    );
    return { jwt, expiresAt };
  }

  if (process.env.SESSION_STRATEGY === 'jwt') {
    const jwt = await signToken(
      { userId: user.id, role: user.role, expiresAt, name: user.name },
      false // SECRET
    );
    return { jwt, expiresAt };
  }
};

export const verifySession = async (rawCookie: string | undefined) => {
  if (!rawCookie) return null;

  if (process.env.SESSION_STRATEGY === 'jwt') {
    return await verifyToken(rawCookie, false);
  }

  if (process.env.SESSION_STRATEGY === 'db-jwt') {
    const payload = await verifyToken(rawCookie, true); // SECRET
    const session = await SessionRepository.findSessionById(payload.sessionId);
    if (!session) return null;
    return { userId: session.user_id };
  }

  // db
  const session = await SessionRepository.findSessionById(Number(rawCookie));
  if (!session) return null;
  return { userId: session.user_id };
};

export const deleteSession = async (rawCookie: string | undefined) => {
  if (!rawCookie) return;

  if (process.env.SESSION_STRATEGY === 'jwt') return;

  if (process.env.SESSION_STRATEGY === 'db-jwt') {
    const payload = await verifyToken(rawCookie, true); // SECRET
    await SessionRepository.deleteSession(payload.sessionId);
    return;
  }

  // db
  await SessionRepository.deleteSession(Number(rawCookie));
};
