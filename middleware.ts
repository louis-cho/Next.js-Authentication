// 세션 쿠키만 복호화하여 빠르게 redirect 처리 (DB 조회 X)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const strategy = process.env.SESSION_STRATEGY || 'db'
const sessionSecret = new TextEncoder().encode(process.env.SESSION_SECRET!)
const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const protectedRoutes = ['/dashboard', '/admin']
  const publicRoutes = ['/login', '/signup', '/']

  const cookie = req.cookies.get('session')?.value
  let session = null

  if (cookie) {
    try {
      if (strategy === 'jwt') {
        const { payload } = await jwtVerify(cookie, jwtSecret)
        session = payload
      } else if (strategy === 'db-jwt') {
        const { payload } = await jwtVerify(cookie, sessionSecret)
        session = payload
      } else {
        session = { sessionId: cookie }  // 단순 db 세션
      }
    } catch {
      session = null
    }
  }

  // 보호된 페이지 → 로그인 안되어 있으면 redirect
  if (protectedRoutes.includes(pathname) && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 로그인, 회원가입 페이지 접근 시 이미 로그인한 경우 redirect
  if (publicRoutes.includes(pathname) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
