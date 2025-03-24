import { clearSessionCookie, createSessionCookie } from '@/lib/auth/cookie';
import { signToken, verifyToken } from '@/lib/auth/token';
import { db } from '@/lib/db';

const strategy = process.env.SESSION_STRATEGY || 'db';

export async function createSession(user: { id: number, role: string }) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일
  let sessionToken: string;

  if (strategy === 'jwt') {
    sessionToken = await signToken(
      { userId: user.id, role: user.role, expiresAt },
      false // SECRET
    );
  } else {
    const result = await db.query(
      'INSERT INTO sessions (user_id, expires_at) VALUES ($1, $2) RETURNING id',
      [user.id, expiresAt]
    );
    const sessionId = result.rows[0].id;

    if (strategy === 'db-jwt') {
      sessionToken = await signToken(
        { sessionId, expiresAt: expiresAt.toISOString() }, // ISO로 넣기
        true // SECRET <<<< 핵심
      );
    } else {
      sessionToken = String(sessionId);
    }
  }

  return createSessionCookie(sessionToken, expiresAt);
}

export async function verifySession(sessionToken: string | undefined) {
  console.log('[verifySession] sessionToken >>', sessionToken);
  if (!sessionToken) return null;

  try {
    if (strategy === 'jwt') {
      const { payload } = await verifyToken(sessionToken, false); // SECRET
      return { userId: payload.userId, role: payload.role };
    }

    if (strategy === 'db-jwt') {
      const { payload } = await verifyToken(sessionToken, true); // SECRET
      console.log('[verifySession] payload >>', payload);
      const sessionId = payload.sessionId;

      // DB에서 세션 가져오기 (role 포함)
      const result = await db.query(
        'SELECT sessions.user_id, users.role FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.id = $1',
        [sessionId]
      );

      if (result.rowCount === 0) return null;

      return { userId: result.rows[0].user_id, role: result.rows[0].role };
    }

    // db 전략 생략 가능
  } catch (err) {
    console.error('[verifySession] 세션 검증 실패 >>', err);
    return null;
  }
}

export async function deleteSession(rawCookies: { [key: string]: string | undefined }) {
  const sessionCookie = rawCookies['session'];
  if (!sessionCookie) {
    return clearSessionCookie();
  }

  try {
    if (strategy === 'jwt') {
      return clearSessionCookie();
    }

    let sessionId;
    if (strategy === 'db-jwt') {
      const { payload } = await verifyToken(sessionCookie, true); // SECRET
      sessionId = payload.sessionId;
    } else {
      sessionId = sessionCookie;
    }

    await db.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
  } catch (err) {
    console.error('[deleteSession] Error:', err);
  }

  return clearSessionCookie();
}
