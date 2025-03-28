import { AccessControl } from '@/lib/auth/accessControl'; // 경로 맞게 수정
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { DB_SECRET, JWT_SECRET } from './lib/auth/token';

const strategy = process.env.SESSION_STRATEGY || 'db'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const cookie = req.cookies.get('session')?.value
  console.log("cookie 4545 >> " + cookie);
  let session = null

  if (cookie) {
    try {
      if (strategy === 'jwt') {
        const { payload } = await jwtVerify(cookie, JWT_SECRET)
        session = payload;
        console.log("session (jwt) >> " + JSON.stringify(session));
      } else if (strategy === 'db-jwt') {
        const { payload } = await jwtVerify(cookie, DB_SECRET)
        session = payload
        console.log("session (db-jwt) >> " + session);
      } else {
        session = { sessionId: cookie };
        console.log("session (db) >> " + session);
      }
    } catch {
      session = null;
    }


    // ✅ 보호된 페이지인데 로그인 안되어있으면 → 로그인 페이지로
    if (
      AccessControl.userPages.some(route => pathname.startsWith(route)) ||
      AccessControl.adminPages.some(route => pathname.startsWith(route))
    ) {
      if (!session) {
        console.log("middleware.ts login page redirection");
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    console.log("return NextResponse.next() 438905")
    return NextResponse.next()
  } else {
    console.log("return NextResponse.next() 4389")
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|fonts|.*\\.json|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.woff2).*)",
  ], // 모든 페이지 경로에 대해 미들웨어 실행
};