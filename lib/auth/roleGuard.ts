import { verifySession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { serialize } from 'cookie'
import { GetServerSidePropsContext, NextApiResponse } from 'next'

// SSR: User 보호
export function withUserPage(handler) {
  return async (context: GetServerSidePropsContext) => {
    const session = await verifySession(context.req.cookies)
    if (!session) {
      context.res.setHeader('Set-Cookie', serialize('session', '', { path: '/', expires: new Date(0) }))
      return { redirect: { destination: '/login', permanent: false } }
    }
    return handler(context, session)
  }
}

// SSR: Admin 보호
export function withAdminPage(handler) {
  return async (context: GetServerSidePropsContext) => {
    const session = await verifySession(context.req.cookies)
    console.log("[withAdminPage] session >>", session);

    if (!session) {
      console.log("[withAdminPage] 세션 없음 - 로그인 페이지로 이동");
      context.res.setHeader('Set-Cookie', serialize('session', '', { path: '/', expires: new Date(0) }));
      return { redirect: { destination: '/login', permanent: false } }
    }

    const result = await db.query('SELECT role FROM users WHERE id = $1', [session.userId]);
    console.log("[withAdminPage] DB role 결과 >>", result.rows);

    if (result.rowCount === 0 || result.rows[0].role !== 'admin') {
      console.log("[withAdminPage] 권한 부족 - unauthorized 페이지로 이동");
      return { redirect: { destination: '/unauthorized', permanent: false } }
    }

    return handler(context, session)
  }
}

// API: User 보호
export function withUserApi(handler) {
  return async (req, res: NextApiResponse) => {
    const session = await verifySession(req.cookies)
    if (!session) return res.status(401).json({ message: 'Unauthorized' })
    return handler(req, res, session)
  }
}

// API: Admin 보호
export function withAdminApi(handler) {
  return async (req, res: NextApiResponse) => {
    const session = await verifySession(req.cookies)
    if (!session) return res.status(401).json({ message: 'Unauthorized' })
    const result = await db.query('SELECT role FROM users WHERE id = $1', [session.userId])
    if (result.rowCount === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }
    return handler(req, res, session)
  }
}
