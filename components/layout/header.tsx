import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface User {
    name: string;
    email: string;
}

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);


    useEffect(() => {
        setIsMounted(true);

        (async () => {
            const res = await fetch('/api/auth/me', {
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        })();
    }, []);


    if (!isMounted) return null;

    const handleLogout = async () => {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        router.push('/login');
    };

    return (
        <header className="w-full px-6 py-3 bg-white shadow flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">🔥 내 서비스</h1>
            {user ? (
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                        안녕하세요, <b>{user.name}</b>님
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                        로그아웃
                    </button>
                </div>
            ) : (
                <span className="text-gray-400">로그인 안됨</span>
            )}
        </header>
    );
}
