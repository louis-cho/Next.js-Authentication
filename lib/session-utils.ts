// lib/session-utils.ts

import { verifySession } from './auth/session'
import { db } from './db'
import { serialize } from 'cookie'
import { GetServerSidePropsContext, NextApiResponse } from 'next'

/**
 * SSR 페이지에서 현재 로그인된 유저 정보를 반환합니다.
 * 세션이 유효하지 않거나 유저가 존재하지 않으면,
 * 세션 쿠키를 삭제하고 로그인 페이지로 리다이렉트합니다.
 *
 * @param context - Next.js GetServerSidePropsContext
 * @param redirectTo - 리다이렉트 경로 (기본값: '/login')
 * @returns 유저 정보 객체 또는 Next.js redirect 객체
 */
export async function getUserOrRedirect(
  context: GetServerSidePropsContext,
  redirectTo = '/login'
) {
  const session = await verifySession(context.req.cookies)

  if (!session) {
    context.res.setHeader('Set-Cookie', serialize('session', '', {
      path: '/',
      expires: new Date(0),
    }))
    return { redirect: { destination: redirectTo, permanent: false } }
  }

  const result = await db.query(
    'SELECT id, name, email, role FROM next_users WHERE id = $1',
    [session.userId]
  )

  if (result.rowCount === 0) {
    context.res.setHeader('Set-Cookie', serialize('session', '', {
      path: '/',
      expires: new Date(0),
    }))
    return { redirect: { destination: redirectTo, permanent: false } }
  }

  return result.rows[0] // user
}

/**
 * API Route에서 현재 로그인된 유저 정보를 반환합니다.
 * 세션이 유효하지 않거나 유저가 존재하지 않으면,
 * 세션 쿠키를 삭제하고 403 Forbidden 응답을 보냅니다.
 *
 * @param reqCookies - NextApiRequest.cookies
 * @param res - NextApiResponse
 * @returns 유저 정보 객체 또는 null
 */
export async function getUserOrFail(
  reqCookies: { [key: string]: string | undefined },
  res: NextApiResponse
) {
  const session = await verifySession(reqCookies)

  if (!session) {
    res.setHeader('Set-Cookie', serialize('session', '', {
      path: '/',
      expires: new Date(0),
    }))
    res.status(403).json({ message: 'Unauthorized' })
    return null
  }

  const result = await db.query(
    'SELECT id, name, email, role FROM next_users WHERE id = $1',
    [session.userId]
  )

  if (result.rowCount === 0) {
    res.setHeader('Set-Cookie', serialize('session', '', {
      path: '/',
      expires: new Date(0),
    }))
    res.status(403).json({ message: 'Unauthorized' })
    return null
  }

  return result.rows[0] // user
}
