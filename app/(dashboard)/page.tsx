import { Users, Bus, Receipt, Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
    // Mock data - this will be replaced with real data from Supabase
    const stats = {
        totalUsers: 1247,
        activeBuses: 23,
        todayTransactions: 156,
        todayRevenue: 4580000,
        userGrowth: 12.5,
        busGrowth: 5.2,
        transactionGrowth: -3.1,
        revenueGrowth: 8.7
    }

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
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="font-medium text-green-500">
                                {stats.userGrowth.toFixed(1)}%
                            </span>
                            <span className="text-slate-500">from last month</span>
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
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="font-medium text-green-500">
                                {stats.busGrowth.toFixed(1)}%
                            </span>
                            <span className="text-slate-500">from last month</span>
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
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-red-500">
                                {Math.abs(stats.transactionGrowth).toFixed(1)}%
                            </span>
                            <span className="text-slate-500">from last month</span>
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
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="font-medium text-green-500">
                                {stats.revenueGrowth.toFixed(1)}%
                            </span>
                            <span className="text-slate-500">from last month</span>
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
