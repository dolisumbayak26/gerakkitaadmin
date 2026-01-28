'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import { createClient } from '@/lib/supabase/server'
import type { AdminUser } from '@/types'

export async function loginAdmin(email: string, password: string) {
    try {
        const supabase = await createClient()

        // Query admin_users table
        const { data: adminUser, error: queryError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .maybeSingle()

        if (queryError || !adminUser) {
            return { error: 'Invalid credentials' }
        }

        const user = adminUser as AdminUser

        // Check if account is active
        if (!user.is_active) {
            return { error: 'Account is deactivated' }
        }

        // Verify password with bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password_hash)

        if (!isPasswordValid) {
            return { error: 'Invalid credentials' }
        }

        // Update last login using type casting for the entire query
        await (supabase
            .from('admin_users') as any)
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id)

        // Create session cookie
        const cookieStore = await cookies()
        const sessionData = {
            adminId: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        }

        cookieStore.set('admin_session', JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/', // Ensure cookie is accessible site-wide
            maxAge: 24 * 60 * 60 // 24 hours
        })

        return { success: true }
    } catch (error: any) {
        console.error('Login error:', error)
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            details: error.details
        })
        return { error: 'Login failed' }
    }
}

export async function logoutAdmin() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    redirect('/login')
}

export async function getAdminSession() {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('admin_session')

        if (!sessionCookie) {
            return null
        }

        const session = JSON.parse(sessionCookie.value)

        // Check if session expired
        if (session.expiresAt < Date.now()) {
            cookieStore.delete('admin_session')
            return null
        }

        return session
    } catch (error) {
        return null
    }
}
