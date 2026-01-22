'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Bus,
    UserCog,
    Users,
    Receipt
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
    {
        name: 'Dashboard',
        href: '/',
        icon: LayoutDashboard
    },
    {
        name: 'Buses',
        href: '/buses',
        icon: Bus
    },
    {
        name: 'Drivers',
        href: '/drivers',
        icon: UserCog
    },
    {
        name: 'Users',
        href: '/users',
        icon: Users
    },
    {
        name: 'Transactions',
        href: '/transactions',
        icon: Receipt
    }
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col fixed inset-y-0 z-50 bg-slate-900 border-r border-slate-800">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-800">
                <Bus className="h-8 w-8 text-blue-500" />
                <div>
                    <h1 className="text-xl font-bold text-white">GerakKita</h1>
                    <p className="text-xs text-slate-400">Admin Dashboard</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
