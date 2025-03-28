// pages/api/auth/me.ts
import { verifySession } from '@/lib/auth/session'

export default async function handler(req, res) {
    const session = await verifySession(req.cookies)

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    return res.status(200).json(session)
}
