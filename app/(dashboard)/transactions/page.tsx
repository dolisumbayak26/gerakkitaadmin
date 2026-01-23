import { Receipt, Search, Calendar, TrendingUp, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatCurrency } from '@/lib/utils'
import Link from 'next/link'

type ViewType = 'daily' | 'monthly' | 'yearly'

async function getTransactions(view: ViewType, searchQuery?: string) {
    const supabase = await createClient()

    // Get transactions with user and route info
    let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

    if (searchQuery) {
        query = query.or(`transaction_code.ilike.%${searchQuery}%,payment_method.ilike.%${searchQuery}%`)
    }

    // Apply date filter based on view
    const now = new Date()
    if (view === 'daily') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        query = query.gte('created_at', today.toISOString())
    } else if (view === 'monthly') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        query = query.gte('created_at', monthStart.toISOString())
    } else if (view === 'yearly') {
        const yearStart = new Date(now.getFullYear(), 0, 1)
        query = query.gte('created_at', yearStart.toISOString())
    }

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching transactions:', error)
        return { transactions: [], count: 0, summary: { total: 0, completed: 0, revenue: 0 } }
    }

    // Get user and route info for each transaction
    const transactionsWithDetails = await Promise.all((data || []).map(async (tx: any) => {
        let user = null
        let route = null
        let originStop = null
        let destStop = null

        if (tx.user_id) {
            const { data: userData } = await supabase
                .from('users')
                .select('id, full_name, email')
                .eq('id', tx.user_id)
                .single()
            user = userData
        }

        if (tx.route_id) {
            const { data: routeData } = await supabase
                .from('routes')
                .select('id, route_number, route_name')
                .eq('id', tx.route_id)
                .single()
            route = routeData
        }

        if (tx.origin_stop_id) {
            const { data: stopData } = await supabase
                .from('bus_stops')
                .select('id, name')
                .eq('id', tx.origin_stop_id)
                .single()
            originStop = stopData
        }

        if (tx.destination_stop_id) {
            const { data: stopData } = await supabase
                .from('bus_stops')
                .select('id, name')
                .eq('id', tx.destination_stop_id)
                .single()
            destStop = stopData
        }

        return { ...tx, user, route, origin_stop: originStop, destination_stop: destStop }
    }))

    // Calculate summary
    const completed = transactionsWithDetails.filter((tx: any) => tx.payment_status === 'completed')
    const revenue = completed.reduce((sum: number, tx: any) => sum + (Number(tx.amount) || 0), 0)

    return {
        transactions: transactionsWithDetails,
        count: count || 0,
        summary: {
            total: count || 0,
            completed: completed.length,
            revenue
        }
    }
}

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: Promise<{ view?: string; search?: string }>
}) {
    const params = await searchParams
    const view = (params.view as ViewType) || 'daily'
    const { transactions, count, summary } = await getTransactions(view, params.search)

    const viewLabels = {
        daily: 'Today',
        monthly: 'This Month',
        yearly: 'This Year'
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Transaction Management</h1>
                    <p className="text-slate-400 mt-1">
                        View and manage all transactions
                    </p>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                    <Receipt className="h-5 w-5" />
                    <span className="text-sm font-medium">{count} transactions</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Total Transactions</p>
                                <p className="text-2xl font-bold text-white">{summary.total}</p>
                            </div>
                            <Receipt className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Completed</p>
                                <p className="text-2xl font-bold text-green-400">{summary.completed}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Revenue ({viewLabels[view]})</p>
                                <p className="text-2xl font-bold text-white">{formatCurrency(summary.revenue)}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-slate-800 bg-slate-900/50 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* View Toggle */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-slate-500" />
                        <div className="flex rounded-lg border border-slate-800 overflow-hidden">
                            <Link
                                href="/transactions?view=daily"
                                className={`px-4 py-2 text-sm font-medium transition-colors ${view === 'daily'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                                    }`}
                            >
                                Daily
                            </Link>
                            <Link
                                href="/transactions?view=monthly"
                                className={`px-4 py-2 text-sm font-medium transition-colors ${view === 'monthly'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                                    }`}
                            >
                                Monthly
                            </Link>
                            <Link
                                href="/transactions?view=yearly"
                                className={`px-4 py-2 text-sm font-medium transition-colors ${view === 'yearly'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                                    }`}
                            >
                                Yearly
                            </Link>
                        </div>
                    </div>

                    {/* Search */}
                    <form action="/transactions" method="GET" className="flex-1">
                        <input type="hidden" name="view" value={view} />
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                            <Input
                                name="search"
                                placeholder="Search by transaction code..."
                                defaultValue={params.search}
                                className="pl-10 bg-slate-950 border-slate-800 text-white"
                            />
                        </div>
                    </form>
                </div>
            </Card>

            {/* Transactions Table */}
            <Card className="border-slate-800 bg-slate-900/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Transaction
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Customer
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Route
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Payment
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        No transactions found for {viewLabels[view].toLowerCase()}.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx: any) => (
                                    <tr
                                        key={tx.id}
                                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-sm text-white">
                                                {tx.transaction_code}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white">{tx.user?.full_name || 'Unknown'}</div>
                                            <div className="text-sm text-slate-400">{tx.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {tx.route ? (
                                                <div>
                                                    <div className="text-white font-medium">{tx.route.route_number}</div>
                                                    <div className="text-xs text-slate-400">
                                                        {tx.origin_stop?.name} → {tx.destination_stop?.name}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-500">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white font-semibold">
                                                {formatCurrency(Number(tx.amount))}
                                            </div>
                                            <div className="text-xs text-slate-400">x{tx.quantity}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${tx.payment_method === 'wallet'
                                                    ? 'bg-purple-600/20 text-purple-400'
                                                    : tx.payment_method === 'gopay'
                                                        ? 'bg-green-600/20 text-green-400'
                                                        : tx.payment_method === 'qris'
                                                            ? 'bg-blue-600/20 text-blue-400'
                                                            : 'bg-slate-600/20 text-slate-400'
                                                }`}>
                                                {tx.payment_method}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${tx.payment_status === 'completed' || tx.payment_status === 'settlement'
                                                    ? 'bg-green-600/20 text-green-400'
                                                    : tx.payment_status === 'pending'
                                                        ? 'bg-yellow-600/20 text-yellow-400'
                                                        : 'bg-red-600/20 text-red-400'
                                                }`}>
                                                {tx.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {formatDate(tx.created_at)}
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
