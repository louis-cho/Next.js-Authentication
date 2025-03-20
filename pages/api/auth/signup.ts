import type { NextApiRequest, NextApiResponse } from 'next'
import { SignupFormSchema, SignupFormState } from '@/lib/validations'
import { hashPassword } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse<SignupFormState>) {
    if (req.method !== 'POST') return res.status(405).end()

    try {
        const body = req.body
        // Zod 스키마 검증
        const parsed = SignupFormSchema.safeParse(body)

        if (!parsed.success) {
            const zodErrors = parsed.error.flatten().fieldErrors
            return res.status(400).json({ errors: zodErrors })
        }

        const { name, email, password } = parsed.data

        // DB 내 중복 이메일 확인
        const existing = await db.query('SELECT id FROM next_users WHERE email = $1', [email])
        if (existing.rowCount > 0) {
            return res.status(400).json({
                errors: { email: ['이미 사용 중인 이메일입니다.'] },
            })
        }

        // 비밀번호 해싱
        const hashed = await hashPassword(password)

        // DB에 저장
        await db.query('INSERT INTO next_users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashed])

        return res.status(201).json({ message: '회원가입 성공!' })
    } catch (err) {
        return res.status(500).json({ message: '서버 오류 발생' })
    }
}
