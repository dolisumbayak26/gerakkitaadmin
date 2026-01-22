'use client'

import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useBuses } from '@/hooks/useBuses'
import { formatDate, getStatusColor, cn } from '@/lib/utils'

export default function BusesPage() {
    const { buses, loading } = useBuses()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Bus Management</h1>
                    <p className="text-slate-400 mt-1">
                        Manage your bus fleet and assignments
                    </p>
                </div>

                <Link href="/buses/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Bus
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                    <CardTitle className="text-lg text-white">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                            <Input
                                placeholder="Search bus number..."
                                className="pl-10 bg-slate-950 border-slate-800 text-white"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-slate-500" />
                            <select className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                <option value="">All Status</option>
                                <option value="available">Available</option>
                                <option value="full">Full</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="out_of_service">Out of Service</option>
                            </select>
                        </div>

                        <select className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            <option value="">All Routes</option>
                            {/* Routes will be loaded from database */}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Buses Table */}
            <Card className="border-slate-800 bg-slate-900/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Bus Number
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Route
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Capacity
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Driver
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
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        Loading buses...
                                    </td>
                                </tr>
                            ) : buses.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        No buses found. Add your first bus to get started.
                                    </td>
                                </tr>
                            ) : (
                                buses.map((bus) => (
                                    <tr
                                        key={bus.id}
                                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{bus.bus_number}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-300">
                                                {bus.route ? (
                                                    <>
                                                        <div className="font-medium">{bus.route.route_number}</div>
                                                        <div className="text-sm text-slate-500">
                                                            {bus.route.route_name}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-slate-500">Not assigned</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-300">
                                                {bus.available_seats}/{bus.total_seats}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={cn(
                                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                    getStatusColor(bus.status)
                                                )}
                                            >
                                                {bus.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-300">
                                                {bus.driver ? (
                                                    <div className="font-medium">{bus.driver.full_name}</div>
                                                ) : (
                                                    <span className="text-slate-500">Not assigned</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {formatDate(bus.updated_at || bus.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/buses/${bus.id}`}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                            >
                                                View
                                            </Link>
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
