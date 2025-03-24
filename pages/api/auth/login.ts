import { createSessionCookie } from '@/lib/auth/cookie';
import { handleError } from '@/lib/errors/handleError';
import { LoginFormSchema, LoginFormState } from '@/lib/util/validations';
import * as SessionService from '@/services/sessionService';
import * as UserService from '@/services/userService';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<LoginFormState>) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const parsed = LoginFormSchema.safeParse(req.body);
        if (!parsed.success) {
            const zodErrors = parsed.error.flatten().fieldErrors;
            return res.status(400).json({ errors: zodErrors });
        }

        const { email, password } = parsed.data;

        // 사용자 인증
        let user = null;
        try {
            user = await UserService.authenticateUser(email, password);
            if (!user) {
                return res.status(401).json({ message: '잘못된 이메일 또는 비밀번호입니다.' });
            }
        } catch (err) {
            return handleError(res, err);
        }

        console.log("user >> " + JSON.stringify(user));

        // 세션 생성
        const sessionResult = await SessionService.createSession(user);

        // 쿠키 생성
        let cookie: string;
        if (process.env.SESSION_STRATEGY === 'db' && sessionResult?.sessionId && sessionResult.expiresAt) {
            cookie = createSessionCookie(sessionResult.sessionId, sessionResult.expiresAt);
        } else if ((process.env.SESSION_STRATEGY === 'db-jwt' || process.env.SESSION_STRATEGY === 'jwt') && sessionResult?.jwt && sessionResult.expiresAt) {
            cookie = createSessionCookie(sessionResult.jwt, sessionResult.expiresAt);
        } else {
            return res.status(500).json({ message: '잘못된 SESSION_STRATEGY 설정입니다.' });
        }

        console.log("cookie >> " + cookie);
        res.setHeader('Set-Cookie', cookie);

        return res.status(200).json({
            message: '로그인 성공!',
            role: user.role,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}
