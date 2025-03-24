import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AccessControl } from './lib/auth/access-control'; // 경로 맞게 수정

const strategy = process.env.SESSION_STRATEGY || 'db'
const sessionSecret = new TextEncoder().encode(process.env.SECRET!)
const jwtSecret = new TextEncoder().encode(process.env.SECRET!)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

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
        session = { sessionId: cookie }
      }
    } catch {
      session = null
    }
  }

  // ✅ Public 페이지 접근 시
  if (AccessControl.publicPages.includes(pathname)) {
    if (session) {
      // 로그인 되어있으면 → 그냥 user dashboard로 (admin인지 여부는 SSR에서)
      return NextResponse.redirect(new URL('/user/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // ✅ 보호된 페이지인데 로그인 안되어있으면 → 로그인 페이지로
  if (
    AccessControl.userPages.some(route => pathname.startsWith(route)) ||
    AccessControl.adminPages.some(route => pathname.startsWith(route))
  ) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}
