import { Users as UsersIcon, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

async function getUsers(searchQuery?: string) {
    const supabase = await createClient()

    // Get admin emails to exclude from user list
    const { data: adminUsers } = await supabase
        .from('admin_users')
        .select('email')

    const adminEmails = (adminUsers as any[])?.map(admin => admin.email) || []

    let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

    // Exclude admin users by email pattern
    if (adminEmails.length > 0) {
        // Filter out users whose email matches admin emails
        for (const adminEmail of adminEmails) {
            query = query.neq('email', adminEmail)
        }
    }

    if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone_number.ilike.%${searchQuery}%`)
    }

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching users:', error)
        return { users: [], count: 0 }
    }

    // Also filter in JS for admin1@gerakita.com pattern
    const filteredUsers = (data || []).filter((user: any) => {
        return !user.email?.toLowerCase().includes('@gerakita.com')
    })

    return { users: filteredUsers, count: filteredUsers.length }
}

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>
}) {
    const params = await searchParams
    const { users, count } = await getUsers(params.search)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">User Management</h1>
                    <p className="text-slate-400 mt-1">
                        Manage registered users and their accounts
                    </p>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                    <UsersIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">{count} total users</span>
                </div>
            </div>

            {/* Search */}
            <Card className="border-slate-800 bg-slate-900/50 p-4">
                <form action="/users" method="GET">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                        <Input
                            name="search"
                            placeholder="Search by name, email, or phone..."
                            defaultValue={params.search}
                            className="pl-10 bg-slate-950 border-slate-800 text-white"
                        />
                    </div>
                </form>
            </Card>

            {/* Users Table */}
            <Card className="border-slate-800 bg-slate-900/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Contact
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Registered
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Last Updated
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        {params.search
                                            ? 'No users found matching your search.'
                                            : 'No users registered yet.'}
                                    </td>
                                </tr>
                            ) : (
                                users.map((user: any) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                                                    {user.profile_image_url ? (
                                                        <Image
                                                            src={user.profile_image_url}
                                                            alt={user.full_name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <UsersIcon className="h-5 w-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">
                                                        {user.full_name}
                                                    </div>
                                                    <div className="text-sm text-slate-400">{user.id.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {user.email && (
                                                    <div className="text-sm text-slate-300">{user.email}</div>
                                                )}
                                                {user.phone_number && (
                                                    <div className="text-sm text-slate-400">{user.phone_number}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {formatDate(user.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {formatDate(user.updated_at || user.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={`/users/${user.id}`}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                            >
                                                View Details
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
