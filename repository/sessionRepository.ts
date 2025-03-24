import { db } from "@/lib/db";

export const createSession = async (userId: number, expiresAt: Date) => {
  const result = await db.query(
    'INSERT INTO sessions (user_id, expires_at) VALUES ($1, $2) RETURNING id',
    [userId, expiresAt]
  );
  return result.rows[0]?.id;
};

export const deleteSession = async (sessionId: string) => {
  await db.query('DELETE FROM next_sessions WHERE id = $1', [sessionId]);
};

export const findSessionById = async (sessionId: string) => {
  const result = await db.query('SELECT * FROM sessions WHERE id = $1', [sessionId]);
  return result.rows[0] || null;
};

export const deleteExpiredSessions = async () => {
  await db.query('DELETE FROM sessions WHERE expires_at < NOW()');
};
