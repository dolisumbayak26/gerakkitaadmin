import { Users, Bus, Receipt, Wallet } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
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
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    icon={Users}
                    trend={{
                        value: stats.userGrowth,
                        isPositive: stats.userGrowth > 0
                    }}
                    colorClass="text-blue-500"
                />

                <StatsCard
                    title="Active Buses"
                    value={stats.activeBuses}
                    icon={Bus}
                    trend={{
                        value: stats.busGrowth,
                        isPositive: stats.busGrowth > 0
                    }}
                    colorClass="text-green-500"
                />

                <StatsCard
                    title="Today's Transactions"
                    value={stats.todayTransactions}
                    icon={Receipt}
                    trend={{
                        value: stats.transactionGrowth,
                        isPositive: stats.transactionGrowth > 0
                    }}
                    colorClass="text-yellow-500"
                />

                <StatsCard
                    title="Today's Revenue"
                    value={formatCurrency(stats.todayRevenue)}
                    icon={Wallet}
                    trend={{
                        value: stats.revenueGrowth,
                        isPositive: stats.revenueGrowth > 0
                    }}
                    colorClass="text-purple-500"
                />
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
