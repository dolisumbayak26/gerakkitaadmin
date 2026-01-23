import { UserCog, Search, Bus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

async function getDrivers(searchQuery?: string) {
    const supabase = await createClient()

    // Simple query first without relations
    let query = supabase
        .from('drivers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

    if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone_number.ilike.%${searchQuery}%`)
    }

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching drivers:', error)
        return { drivers: [], count: 0 }
    }

    // Get bus info separately for each driver
    const driversWithBus = await Promise.all((data || []).map(async (driver: any) => {
        if (driver.bus_id) {
            const { data: bus } = await supabase
                .from('buses')
                .select('id, bus_number, route_id')
                .eq('id', driver.bus_id)
                .single()

            if (bus) {
                const busData = bus as any
                // Get route info
                if (busData.route_id) {
                    const { data: route } = await supabase
                        .from('routes')
                        .select('id, route_number, route_name')
                        .eq('id', busData.route_id)
                        .single()

                    return { ...driver, bus: { ...busData, route: route as any } }
                }
                return { ...driver, bus: busData }
            }
        }
        return { ...driver, bus: null }
    }))

    return { drivers: driversWithBus, count: count || 0 }
}

export default async function DriversPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>
}) {
    const params = await searchParams
    const { drivers, count } = await getDrivers(params.search)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Driver Management</h1>
                    <p className="text-slate-400 mt-1">
                        Manage bus drivers and their assignments
                    </p>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                    <UserCog className="h-5 w-5" />
                    <span className="text-sm font-medium">{count} total drivers</span>
                </div>
            </div>

            {/* Search */}
            <Card className="border-slate-800 bg-slate-900/50 p-4">
                <form action="/drivers" method="GET">
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

            {/* Drivers Table */}
            <Card className="border-slate-800 bg-slate-900/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Driver
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Contact
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Assigned Bus
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Route
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Joined
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        {params.search
                                            ? 'No drivers found matching your search.'
                                            : 'No drivers registered yet.'}
                                    </td>
                                </tr>
                            ) : (
                                drivers.map((driver: any) => (
                                    <tr
                                        key={driver.id}
                                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                                                    {driver.profile_image_url ? (
                                                        <Image
                                                            src={driver.profile_image_url}
                                                            alt={driver.full_name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <UserCog className="h-5 w-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">
                                                        {driver.full_name}
                                                    </div>
                                                    <div className="text-sm text-slate-400">{driver.id.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {driver.email && (
                                                    <div className="text-sm text-slate-300">{driver.email}</div>
                                                )}
                                                {driver.phone_number && (
                                                    <div className="text-sm text-slate-400">{driver.phone_number}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {driver.bus ? (
                                                <div className="flex items-center gap-2">
                                                    <Bus className="h-4 w-4 text-green-500" />
                                                    <span className="text-white font-medium">
                                                        {driver.bus.bus_number}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-500">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {driver.bus?.route ? (
                                                <div>
                                                    <div className="text-white font-medium">
                                                        {driver.bus.route.route_number}
                                                    </div>
                                                    <div className="text-sm text-slate-400">
                                                        {driver.bus.route.route_name}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-500">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {formatDate(driver.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/drivers/${driver.id}`}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                            >
                                                View Details
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
