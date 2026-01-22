'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdmin, logoutAdmin } from '@/app/actions/auth'

export function useAuth() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const login = async (email: string, password: string) => {
        setLoading(true)
        setError(null)

        try {
            const result = await loginAdmin(email, password)

            if (result.error) {
                setError(result.error)
                return
            }

            router.push('/')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        await logoutAdmin()
    }

    return {
        login,
        logout,
        loading,
        error
    }
}
