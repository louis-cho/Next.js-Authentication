import { deleteSession } from '@/lib/auth/session'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const expiredCookie = await deleteSession(req.cookies)

        if (expiredCookie) {
            res.setHeader('Set-Cookie', expiredCookie)
        }

        return res.status(200).json({ message: '로그아웃 완료' })
    } catch (err) {
        console.error('[Logout API] 세션 삭제 실패:', err)
        return res.status(500).json({ message: '서버 오류로 로그아웃 실패' })
    }
}