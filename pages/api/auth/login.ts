import type { NextApiRequest, NextApiResponse } from 'next'
import { LoginFormSchema, LoginFormState } from '@/lib/validations'
import { db } from '@/lib/db'
import { comparePassword, signToken } from '@/lib/auth'
import cookie from 'cookie'
import { createSession } from '@/lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse<LoginFormState>) {
    if (req.method !== 'POST') return res.status(405).end()

    try {
        const parsed = LoginFormSchema.safeParse(req.body)
        if (!parsed.success) {
            const zodErrors = parsed.error.flatten().fieldErrors
            return res.status(400).json({ errors: zodErrors })
        }

        const { email, password } = parsed.data

        // DB에서 사용자 찾기
        const result = await db.query('SELECT * FROM next_users WHERE email = $1', [email])
        if (result.rowCount === 0) {
            return res.status(401).json({ message: '존재하지 않는 사용자입니다.' })
        }

        const user = result.rows[0]
        const valid = await comparePassword(password, user.password)
        if (!valid) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' })
        }


        await createSession({ id: user.id, role: user.role })

        // JWT 생성
        const token = await signToken({ id: user.id, email: user.email })

        // 쿠키로 전달
        res.setHeader('Set-Cookie', cookie.serialize('session', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7일
        }))

        return res.status(200).json({ message: '로그인 성공!' })
    } catch (err) {
        return res.status(500).json({ message: '서버 오류: ' + err })
    }
}
