import { SESSION_DURATION } from '@/constants/session';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyClientSession(rawCookies: { [key: string]: string | undefined }) {

    console.log("rawCookies >> " + rawCookies);
    if (typeof window === 'undefined') {
        console.log('[verifyClientSession] ⛔ 서버 환경, 실행 안 함');
        return null;
    }

    const sessionCookie = rawCookies['session'];

    console.log('[verifyClientSession] sessionToken >>', sessionCookie)
    if (!sessionCookie) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(sessionCookie, SECRET);

        console.log('[verifyClientSession] payload >>', payload)

        const now = Math.floor(Date.now() / 1000)

        if (payload.exp && payload.exp - now < SESSION_DURATION.UPDATE) {
            console.log('[verifyClientSession] 세션 만료 임박 → refresh 요청')
            await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include',
            })
            // payload.exp = 그대로 둔다 (refresh한 새 토큰은 다음 요청부터 적용됨)
        }

        return {
            userId: payload.userId,
            role: payload.role,
            expireAt: payload.exp,
        }
    } catch (err) {
        console.error('[verifyClientSession] JWT 디코드 실패', err);
        return null;
    }
}
