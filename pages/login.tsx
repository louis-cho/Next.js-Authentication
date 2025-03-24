import { ERROR_CODES } from '@/constants/errorCodes';
import { verifySession } from '@/lib/auth/session';
import { useRouter } from 'next/router';
import { useState } from 'react';
export async function getServerSideProps(context) {
    console.log("[Login Page] cookies >>", context.req.cookies);

    const sessionToken = context.req.cookies.session;
    console.log("[Login Page] sessionToken >>", sessionToken);

    const session = await verifySession(sessionToken); // 문자열 하나 넘김
    console.log("[Login Page] 세션 >>", session);

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    }

    return { props: {} };
}



export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<{ email?: string[], password?: string[] }>({});
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
            credentials: 'include' // ✅ 쿠키 전달 필수
        });

        const data = await res.json();
        console.log("data >> " + JSON.stringify(data));

        if (res.status === 200) {
            setErrors({});
            setMessage(data.message);
            if (data.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/user/dashboard');
            }
        } else if (res.status === 400 && data.errors) {
            setErrors(data.errors);
            setMessage('');
        } else {
            switch (data.code) {
                case ERROR_CODES.LOGIN.INVALID_CREDENTIALS.code:
                    setMessage('아이디 또는 비밀번호가 틀렸습니다');
                    break;
                case ERROR_CODES.LOGIN.USER_NOT_FOUND.code:
                    setMessage('존재하지 않는 사용자입니다');
                    break;
                default:
                    setMessage(data.message || '알 수 없는 에러 발생');
            }
        }
    };

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
    );
}
