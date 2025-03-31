import { z } from 'zod'

export const SignupFormSchema = z.object({
    name: z.string()
        .min(2, { message: '이름은 최소 2자 이상이어야 합니다.' })
        .trim(),

    email: z.string()
        .email({ message: '유효한 이메일을 입력하세요.' })
        .trim(),

    password: z.string()
        .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
        .regex(/[a-zA-Z]/, { message: '비밀번호에 최소 하나의 문자를 포함하세요.' })
        .regex(/[0-9]/, { message: '비밀번호에 최소 하나의 숫자를 포함하세요.' })
        .regex(/[^a-zA-Z0-9]/, { message: '비밀번호에 최소 하나의 특수문자를 포함하세요.' })
        .trim(),
})

export const LoginFormSchema = z.object({
    email: z.string()
        .email({ message: '유효한 이메일을 입력하세요.' })
        .trim(),
    password: z.string()
        .min(1, { message: '비밀번호를 입력하세요.' })
})


export type SignupFormState = {
    errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
    }
    message?: string
}

export type LoginFormState = {
    errors?: {
        email?: string[]
        password?: string[]
    },
    user?: object,
    message?: string
}