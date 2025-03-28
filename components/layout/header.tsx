'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Header() {
    const { user, isLoggedIn, isLoading, logout } = useAuth() // ✅ 무조건 여기서 호출
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        console.log('[Header] user:', user)
        console.log('[Header] isLoading:', isLoading)
    }, [user, isLoading])

    if (!isMounted || isLoading) return <div>로딩중...</div>

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    return (
        <header className="w-full px-6 py-3 bg-white shadow flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">🔥 내 서비스</h1>
            {isLoggedIn ? (
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                        안녕하세요, <b>{user?.name ?? user?.id}</b>님
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
    )
}
