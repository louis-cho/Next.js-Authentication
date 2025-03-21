import { useState } from 'react'
import { useRouter } from 'next/router'
import { verifySession } from '@/lib/auth/session'
import { GetServerSidePropsContext } from 'next'


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await verifySession(context.req.cookies)

    if (session) {
        // 이미 로그인된 경우 → 원하는 곳으로 리다이렉트
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return { props: {} }
}

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState<{ email?: string[], password?: string[] }>({})
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
            credentials: 'include'
        })

        const data = await res.json();
        if (res.ok) {
            setErrors({})
            setMessage(data.message)
            // 🔥 Role에 따라 다른 곳으로 이동
            if (data.role === 'admin') {
                router.push('/admin/dashboard')
            } else {
                router.push('/user/dashboard')
            }
        } else if (res.status === 400 && data.errors) {
            setErrors(data.errors)
            setMessage('')
        } else {
            setMessage(data.message || '에러 발생')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p>{errors.email[0]}</p>}

            <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <p>{errors.password[0]}</p>}

            <button type="submit">Login</button>
            <p>{message}</p>
        </form>
    )
}
