import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteSession } from '../../../lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await deleteSession()
    return res.status(200).json({ message: '로그아웃 완료' })
}