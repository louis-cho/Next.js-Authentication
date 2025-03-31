'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Header() {
    const { user, isLoggedIn, logout } = useAuth()
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
            router.push('/login')
        } catch (err) {
            console.error('로그아웃 실패:', err)
        }
    }

    const handleLogin = () => {
        router.push('/login')
    }

    return (
        <header className="w-full px-6 py-3 bg-white shadow flex justify-between items-center">
            {/* 왼쪽 영역 */}
            <div className="text-gray-600">
                {isMounted && isLoggedIn && (
                    <span>
                        안녕하세요, <b>{user?.name}</b>님
                    </span>
                )}
            </div>

            {/* 오른쪽 버튼 영역 */}
            <div>
                {!isMounted ? (
                    <span className="text-sm text-gray-400">로딩중...</span>
                ) : isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                        로그아웃
                    </button>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                        로그인
                    </button>
                )}
            </div>
        </header>
    )
}
