// 세션 확인 + DB 확인
import { verifySession } from './auth/session'
import { db } from './db'


export async function getUserById(userId: number) {
    const result = await db.query(
        'SELECT id, name, email, role FROM next_users WHERE id = $1',
        [userId]
    )
    return result.rowCount ? result.rows[0] : null
}

// 유저 정보 가져오기
export async function getCurrentUser(rawCookies: { [key: string]: string | undefined }) {
    const session = await verifySession(rawCookies)
    if (!session) return null

    const result = await db.query(
        'SELECT id, name, email, role FROM next_users WHERE id = $1',
        [session.userId]
    )
    if (result.rowCount === 0) return null

    return result.rows[0]  // 최소한의 정보만
}

// 특정 유저의 모든 세션 가져오기
export async function getUserSessions(userId: number) {
    const result = await db.query(
        'SELECT id, expires_at, created_at FROM next_sessions WHERE user_id = $1',
        [userId]
    )
    return result.rows
}

export async function isAdmin(rawCookies: { [key: string]: string | undefined }) {
    const user = await getCurrentUser(rawCookies)
    if (!user) return false
    return user.role === 'admin'
}

export async function isUser(rawCookies: { [key: string]: string | undefined }) {
    const user = await getCurrentUser(rawCookies)
    if (!user) return false
    return user.role === 'user'
}

// 특정 세션 삭제
export async function deleteSessionById(sessionId: number) {
    await db.query('DELETE FROM next_sessions WHERE id = $1', [sessionId])
}

// 특정 유저의 모든 세션 삭제 (모든 기기 로그아웃)
export async function deleteAllSessionsByUser(userId: number) {
    await db.query('DELETE FROM next_sessions WHERE user_id = $1', [userId])
}