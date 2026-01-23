import { Users, Mail, Phone, Calendar, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'

async function getUserDetails(id: string) {
    const supabase = await createClient()

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !user) {
        return null
    }

    // Get user's transaction count and total spent
    const { count: transactionCount, data: transactions } = await supabase
        .from('transactions')
        .select('amount', { count: 'exact' })
        .eq('user_id', id)
        .eq('payment_status', 'settlement')

    const totalSpent = (transactions as any[])?.reduce(
        (sum, tx) => sum + (Number(tx.amount) || 0),
        0
    ) || 0

    return { user, transactionCount: transactionCount || 0, totalSpent }
}

export default async function UserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const data = await getUserDetails(id)

    if (!data) {
        notFound()
    }

    const { user, transactionCount, totalSpent } = data as any

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/users">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Users
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">User Details</h1>
                    <p className="text-slate-400 mt-1">View user information and activity</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* User Information */}
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            User Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="relative h-20 w-20 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                                {user.profile_image_url ? (
                                    <Image
                                        src={user.profile_image_url}
                                        alt={user.full_name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <Users className="h-10 w-10 text-slate-400" />
                                )}
                            </div>
                            <div>
                                <div className="text-xl font-semibold text-white">
                                    {user.full_name}
                                </div>
                                <div className="text-sm text-slate-400 font-mono">
                                    ID: {user.id}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <div>
                                    <div className="text-xs text-slate-500">Email</div>
                                    <div className="text-white">{user.email || 'Not provided'}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <div>
                                    <div className="text-xs text-slate-500">Phone Number</div>
                                    <div className="text-white">{user.phone_number || 'Not provided'}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <div>
                                    <div className="text-xs text-slate-500">Registered</div>
                                    <div className="text-white">{formatDate(user.created_at)}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <div>
                                    <div className="text-xs text-slate-500">Last Updated</div>
                                    <div className="text-white">
                                        {formatDate(user.updated_at || user.created_at)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Stats */}
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white">Activity Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/50">
                                <div className="text-sm text-slate-400">Total Transactions</div>
                                <div className="text-2xl font-bold text-white mt-1">
                                    {transactionCount}
                                </div>
                            </div>

                            <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/50">
                                <div className="text-sm text-slate-400">Total Spent</div>
                                <div className="text-2xl font-bold text-white mt-1">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    }).format(totalSpent)}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                            <div className="text-sm text-slate-400 mb-2">Account Status</div>
                            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-green-600/20 text-green-400">
                                Active
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
