// pages/api/admin/session-manage.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser, getUserSessions, deleteSessionById, deleteAllSessionsByUser } from '../../../lib/dal'
import { getUserOrFail } from '@/lib/session-utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await getUserOrFail(req.cookies, res)
  if (!admin || admin.role !== 'admin') return;

  const { userId, sessionId } = req.query

  if (req.method === 'GET') {
    // 유저의 모든 세션 조회
    const sessions = await getUserSessions(Number(userId))
    return res.status(200).json({ sessions })
  }

  if (req.method === 'DELETE') {
    if (sessionId) {
      // 특정 세션 하나 삭제 (로그아웃 한 기기만)
      await deleteSessionById(Number(sessionId))
      return res.status(200).json({ message: '세션 삭제 완료' })
    } else {
      // 해당 유저의 모든 세션 삭제
      await deleteAllSessionsByUser(Number(userId))
      return res.status(200).json({ message: '모든 세션 삭제 완료' })
    }
  }

  return res.status(405).end()
}
