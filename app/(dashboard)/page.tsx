import { Users, Bus, Receipt, Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { RevenueChart, TransactionChart } from '@/components/dashboard/Charts'

async function getDashboardStats() {
    const supabase = await createClient()

    // Get total users (exclude admin emails)
    const { data: allUsers } = await supabase
        .from('users')
        .select('email', { count: 'exact' })

    const filteredUsers = (allUsers || []).filter((u: any) =>
        !u.email?.toLowerCase().includes('@gerakita.com')
    )
    const totalUsers = filteredUsers.length

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

    const { data: todayTxData, count: todayTransactions } = await supabase
        .from('transactions')
        .select('amount', { count: 'exact' })
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString())
        .eq('payment_status', 'completed')

    // Calculate today's revenue
    const todayRevenue = (todayTxData as any[])?.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0) || 0

    // Get last 7 days transaction data for chart
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: weeklyTx } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: true })

    // Group by date for charts
    const revenueByDate: Record<string, number> = {}
    const countByDate: Record<string, number> = {}

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
        revenueByDate[dateStr] = 0
        countByDate[dateStr] = 0
    }

    // Fill with actual data
    (weeklyTx || []).forEach((tx: any) => {
        const date = new Date(tx.created_at)
        const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
        if (revenueByDate[dateStr] !== undefined) {
            revenueByDate[dateStr] += Number(tx.amount) || 0
            countByDate[dateStr] += 1
        }
    })

    const revenueChartData = Object.entries(revenueByDate).map(([date, amount]) => ({
        date,
        amount
    }))

    const transactionChartData = Object.entries(countByDate).map(([date, count]) => ({
        date,
        count
    }))

    // Get recent transactions for list
    const { data: recentTx } = await supabase
        .from('transactions')
        .select('id, transaction_code, amount, payment_method, payment_status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    return {
        totalUsers,
        activeBuses: activeBuses || 0,
        todayTransactions: todayTransactions || 0,
        todayRevenue,
        revenueChartData,
        transactionChartData,
        recentTransactions: recentTx || []
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
                        <div className="flex items-center gap-1 mt-2 text-sm">
                            <span className="text-slate-500">Registered customers</span>
                        </div>
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
                        <div className="flex items-center gap-1 mt-2 text-sm">
                            <span className="text-slate-500">Completed payments</span>
                        </div>
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

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white">Weekly Revenue</CardTitle>
                        <p className="text-sm text-slate-400">Revenue trend for the last 7 days</p>
                    </CardHeader>
                    <CardContent>
                        <RevenueChart data={stats.revenueChartData} />
                    </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white">Daily Transactions</CardTitle>
                        <p className="text-sm text-slate-400">Transaction count for the last 7 days</p>
                    </CardHeader>
                    <CardContent>
                        <TransactionChart data={stats.transactionChartData} />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                    <CardTitle className="text-white">Recent Transactions</CardTitle>
                    <p className="text-sm text-slate-400">Last 5 transactions</p>
                </CardHeader>
                <CardContent>
                    {stats.recentTransactions.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No transactions yet</p>
                    ) : (
                        <div className="space-y-4">
                            {stats.recentTransactions.map((tx: any) => (
                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/50">
                                    <div>
                                        <div className="font-mono text-sm text-white">{tx.transaction_code}</div>
                                        <div className="text-xs text-slate-400">
                                            {new Date(tx.created_at).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-white">{formatCurrency(Number(tx.amount))}</div>
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${tx.payment_method === 'wallet'
                                                ? 'bg-purple-600/20 text-purple-400'
                                                : tx.payment_method === 'gopay'
                                                    ? 'bg-green-600/20 text-green-400'
                                                    : 'bg-blue-600/20 text-blue-400'
                                            }`}>
                                            {tx.payment_method}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
