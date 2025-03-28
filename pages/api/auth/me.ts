import { verifySession } from '@/services/sessionService';
import { findUserById } from '@/services/userService';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await verifySession(req.cookies);
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await findUserById(session.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: { name: user.name, email: user.email } });
}