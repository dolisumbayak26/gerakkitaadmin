'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
    title: string
    value: string | number
    icon: React.ElementType
    trend?: {
        value: number
        isPositive: boolean
    }
    colorClass?: string
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    colorClass = 'text-blue-500'
}: StatsCardProps) {
    return (
        <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                    {title}
                </CardTitle>
                <Icon className={cn('h-5 w-5', colorClass)} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value}</div>
                {trend && (
                    <div className="flex items-center gap-1 mt-2 text-sm">
                        {trend.isPositive ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span
                            className={cn(
                                'font-medium',
                                trend.isPositive ? 'text-green-500' : 'text-red-500'
                            )}
                        >
                            {Math.abs(trend.value).toFixed(1)}%
                        </span>
                        <span className="text-slate-500">from last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
