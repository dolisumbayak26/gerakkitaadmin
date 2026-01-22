'use client'

import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export function Header() {
    const { logout } = useAuth()

    return (
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
            <div className="flex h-16 items-center justify-between px-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-800">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-300">Admin</span>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => logout()}
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    )
}
