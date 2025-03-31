'use client'

import { ROLES } from '@/constants/role'
import { createContext, useCallback, useEffect, useState } from 'react'

type User = {
    id: string
    name?: string
    role: string
}

type Session = {
    userId: string
    role: string
    expireAt?: number
}

type AuthContextType = {
    user: User | null
    session: Session | null
    isLoading: boolean
    refreshSession: () => Promise<void>
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isLoading: true,
    refreshSession: async () => { },
    logout: async () => { },
})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const refreshSession = useCallback(async () => {
        if (typeof window === 'undefined') return

        setIsLoading(true)

        try {
            // ✅ 세션 연장 먼저 시도
            await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include',
            })

            // ✅ 서버에서 세션 정보 가져오기
            const res = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include',
            })

            if (!res.ok) {
                throw new Error('Unauthorized')
            }

            const data = await res.json()
            console.log('[AuthProvider] 세션 정보 받아옴 >>', JSON.stringify(data))

            setSession({
                userId: data.userId,
                role: data.role,
                expireAt: data.expireAt,
            })

            setUser({
                id: data.userId,
                role: data.role ?? ROLES.VIEWER,
                name: data.name ?? undefined,
            })
        } catch (err) {
            console.warn('[AuthProvider] 세션 없음 또는 실패:', err)
            setSession(null)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const logout = async () => {
        console.log('[logout] 로그아웃 시작');
        setIsLoading(true)
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })
            console.log('[logout] 로그아웃 응답:', res.status);
            setUser(null)
            setSession(null)
        } catch (err) {
            console.error('logout error:', err)
        } finally {
            console.log('[logout] 로그아웃 완료, isLoading false로 설정');
            setIsLoading(false)
        }
    }

    useEffect(() => {
        refreshSession()
    }, [refreshSession])

    return (
        <AuthContext.Provider
            value={{ user, session, isLoading, refreshSession, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}
