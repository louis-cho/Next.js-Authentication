import { extendSession } from '@/lib/auth/session';

export default async function handler(req, res) {
    console.log('[API] /refresh 쿠키 >>', req.cookies)
    
    const cookie = await extendSession(req.cookies)

    console.log('refresh.ts >> ' + cookie);

    if (!cookie) {
        return res.status(401).json({ message: '세션 없음 또는 만료' })
    }

    res.setHeader('Set-Cookie', cookie)
    return res.status(200).json({ message: '세션 연장 완료' })
}
