import { db } from './db'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const strategy = process.env.SESSION_STRATEGY || 'db'
const sessionSecret = new TextEncoder().encode(process.env.SESSION_SECRET!)
const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET!)

// 세션 생성
export async function createSession(user: { id: number, role: string }) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  let sessionToken: string

  if (strategy === 'jwt') {
    // 세션 ID를 JWT로 암호화
    sessionToken = await new SignJWT({ userId: user.id, role: user.role, expiresAt })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(sessionSecret)
  } else {
    
    const result = await db.query(
      'INSERT INTO next_sessions (user_id, expires_at) VALUES ($1, $2) RETURNING id',
      [user.id, expiresAt]
    )
    const sessionId = result.rows[0].id

    if (strategy === 'db-jwt') {
      sessionToken = await new SignJWT({ sessionId, expiresAt })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(sessionSecret)
    } else {
      sessionToken = String(sessionId)
    }
  }

  cookies().set('session', sessionToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

// 세션 검증
export async function verifySession() {
  const sessionCookie = cookies().get('session')?.value
  if (!sessionCookie) return null

  if (strategy === 'jwt') {
    try {
      const { payload } = await jwtVerify(sessionCookie, jwtSecret)
      return { userId: payload.userId, role: payload.role }
    } catch {
      return null
    }
  }

  let sessionId
  if (strategy === 'db-jwt') {
    try {
      const { payload } = await jwtVerify(sessionCookie, sessionSecret)
      sessionId = payload.sessionId
    } catch {
      return null
    }
  } else {
    sessionId = sessionCookie
  }

  // DB에서 세션 확인
  const result = await db.query(
    'SELECT * FROM next_sessions WHERE id = $1 AND expires_at > NOW()',
    [sessionId]
  )
  if (result.rowCount === 0) return null

  return { userId: result.rows[0].user_id }
}


// 세션 삭제 (로그아웃)
export async function deleteSession() {
  const sessionCookie = cookies().get('session')?.value
  if (!sessionCookie) return

  if (strategy === 'jwt') {
    cookies().delete('session')
    return
  }

  let sessionId
  if (strategy === 'db-jwt') {
    try {
      const { payload } = await jwtVerify(sessionCookie, sessionSecret)
      sessionId = payload.sessionId
    } catch {
      cookies().delete('session')
      return
    }
  } else {
    sessionId = sessionCookie
  }

  await db.query('DELETE FROM next_sessions WHERE id = $1', [sessionId])
  cookies().delete('session')
}
