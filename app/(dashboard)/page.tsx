import { Users, Bus, Receipt, Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

async function getDashboardStats() {
    const supabase = await createClient()

    // Get total users
    const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

    // Get active buses (available or full)
    const { count: activeBuses } = await supabase
        .from('buses')
        .select('*', { count: 'exact', head: true })
        .in('status', ['available', 'full'])

    // Get today's transactions
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { count: todayTransactions, data: todayTxData } = await supabase
        .from('transactions')
        .select('amount', { count: 'exact' })
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString())
        .eq('payment_status', 'settlement')

    // Calculate today's revenue
    const todayRevenue = (todayTxData as any[])?.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0) || 0

    // Get last month's data for comparison
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    lastMonth.setHours(0, 0, 0, 0)
    const thisMonth = new Date()
    thisMonth.setHours(0, 0, 0, 0)
    thisMonth.setDate(1)

    const { count: lastMonthUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', thisMonth.toISOString())

    const { count: lastMonthTransactions } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonth.toISOString())
        .lt('created_at', thisMonth.toISOString())
        .eq('payment_status', 'settlement')

    // Calculate growth percentages
    const userGrowth = lastMonthUsers && lastMonthUsers > 0
        ? ((totalUsers || 0) - lastMonthUsers) / lastMonthUsers * 100
        : 0

    const transactionGrowth = lastMonthTransactions && lastMonthTransactions > 0
        ? ((todayTransactions || 0) - lastMonthTransactions) / lastMonthTransactions * 100
        : 0

    return {
        totalUsers: totalUsers || 0,
        activeBuses: activeBuses || 0,
        todayTransactions: todayTransactions || 0,
        todayRevenue,
        userGrowth,
        busGrowth: 0, // Can be calculated if you track bus additions
        transactionGrowth,
        revenueGrowth: 0 // Can be calculated by comparing with last month's revenue
    }
}

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-slate-400 mt-1">
                    Welcome back! Here's what's happening with your bus system.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Users */}
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Total Users
                        </CardTitle>
                        <Users className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
                        {stats.userGrowth !== 0 && (
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                {stats.userGrowth > 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                                <span className={`font-medium ${stats.userGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {Math.abs(stats.userGrowth).toFixed(1)}%
                                </span>
                                <span className="text-slate-500">from last month</span>
                            </div>
                        )}
                        {stats.userGrowth === 0 && (
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                <span className="text-slate-500">No change from last month</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Active Buses */}
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Active Buses
                        </CardTitle>
                        <Bus className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.activeBuses}</div>
                        <div className="flex items-center gap-1 mt-2 text-sm">
                            <span className="text-slate-500">Currently in service</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Today's Transactions */}
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Today's Transactions
                        </CardTitle>
                        <Receipt className="h-5 w-5 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.todayTransactions}</div>
                        {stats.transactionGrowth !== 0 && (
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                {stats.transactionGrowth > 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                                <span className={`font-medium ${stats.transactionGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {Math.abs(stats.transactionGrowth).toFixed(1)}%
                                </span>
                                <span className="text-slate-500">vs last month</span>
                            </div>
                        )}
                        {stats.transactionGrowth === 0 && (
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                <span className="text-slate-500">Settled payments</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Today's Revenue */}
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Today's Revenue
                        </CardTitle>
                        <Wallet className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{formatCurrency(stats.todayRevenue)}</div>
                        <div className="flex items-center gap-1 mt-2 text-sm">
                            <span className="text-slate-500">From {stats.todayTransactions} transactions</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder for future charts and tables */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Recent Transactions
                    </h3>
                    <p className="text-slate-500 text-sm">Coming soon...</p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Weekly Bus Usage
                    </h3>
                    <p className="text-slate-500 text-sm">Coming soon...</p>
                </div>
            </div>
        </div>
    )
}
