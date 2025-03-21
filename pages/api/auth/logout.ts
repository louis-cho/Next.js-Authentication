import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteSession } from '@/lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const expiredCookie = await deleteSession(req.cookies) // ✅ 만료 쿠키 문자열 받기
    res.setHeader('Set-Cookie', expiredCookie)             // ✅ 쿠키 삭제 반영
    return res.status(200).json({ message: '로그아웃 완료' })
}