import { ERROR_CODES } from '@/constants/errorCodes';
import { useAuth } from '@/hooks/useAuth';
import { verifySession } from '@/lib/auth/session';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export async function getServerSideProps(context) {
    const session = await verifySession(context.req.cookies);
    if (session) {
        const destination =
            session.role === 'admin'
                ? '/admin/dashboard'
                : session.role === 'user'
                    ? '/user/dashboard'
                    : '/';
        return {
            redirect: { destination, permanent: false },
        };
    }
    return { props: {} };
}

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<{ email?: string[], password?: string[] }>({});
    const [message, setMessage] = useState('');
    const [mounted, setMounted] = useState(false);
    const [doRefresh, setDoRefresh] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const auth = mounted ? useAuth() : null;

    // ✅ 로그인 후 refreshSession 호출
    useEffect(() => {
        if (doRefresh && auth?.refreshSession) {
            (async () => {
                await auth.refreshSession();
                router.reload();
            })();
        }
    }, [doRefresh, auth?.refreshSession]);

    if (!mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
            credentials: 'include',
        });

        const data = await res.json();

        if (res.status === 200) {
            setErrors({});
            setMessage(data.message);
            setDoRefresh(true); // ✅ refreshSession 트리거
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">로그인</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">이메일</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email[0]}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">비밀번호</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password[0]}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                        로그인
                    </button>
                    {message && (
                        <p className="text-center text-sm mt-4 text-gray-700">{message}</p>
                    )}
                </form>
            </div>
        </div>
    );
}
