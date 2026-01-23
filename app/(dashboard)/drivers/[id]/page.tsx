import { UserCog, Mail, Phone, Calendar, ArrowLeft, Bus, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'

async function getDriverDetails(id: string) {
    const supabase = await createClient()

    const { data: driver, error } = await supabase
        .from('drivers')
        .select(`
      *,
      bus:buses(
        id,
        bus_number,
        status,
        total_seats,
        route:routes(
          id,
          route_number,
          route_name,
          description
        )
      )
    `)
        .eq('id', id)
        .single()

    if (error || !driver) {
        return null
    }

    return driver
}

export default async function DriverDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const driver = await getDriverDetails(id) as any

    if (!driver) {
        notFound()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/drivers">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Drivers
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Driver Details</h1>
                    <p className="text-slate-400 mt-1">View driver information and assignment</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Driver Information */}
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <UserCog className="h-5 w-5 text-blue-500" />
                            Driver Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="relative h-20 w-20 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                                {driver.profile_image_url ? (
                                    <Image
                                        src={driver.profile_image_url}
                                        alt={driver.full_name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <UserCog className="h-10 w-10 text-slate-400" />
                                )}
                            </div>
                            <div>
                                <div className="text-xl font-semibold text-white">
                                    {driver.full_name}
                                </div>
                                <div className="text-sm text-slate-400 font-mono">
                                    ID: {driver.id}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <div>
                                    <div className="text-xs text-slate-500">Email</div>
                                    <div className="text-white">{driver.email || 'Not provided'}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <div>
                                    <div className="text-xs text-slate-500">Phone Number</div>
                                    <div className="text-white">{driver.phone_number || 'Not provided'}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <div>
                                    <div className="text-xs text-slate-500">Joined</div>
                                    <div className="text-white">{formatDate(driver.created_at)}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <div>
                                    <div className="text-xs text-slate-500">Last Updated</div>
                                    <div className="text-white">
                                        {formatDate(driver.updated_at || driver.created_at)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bus Assignment */}
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Bus className="h-5 w-5 text-green-500" />
                            Bus Assignment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {driver.bus ? (
                            <>
                                <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-bold text-white">
                                                {driver.bus.bus_number}
                                            </div>
                                            <div className="text-sm text-slate-400">Assigned Bus</div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${driver.bus.status === 'available'
                                                ? 'bg-green-600/20 text-green-400'
                                                : driver.bus.status === 'full'
                                                    ? 'bg-yellow-600/20 text-yellow-400'
                                                    : 'bg-slate-600/20 text-slate-400'
                                            }`}>
                                            {driver.bus.status}
                                        </div>
                                    </div>
                                </div>

                                {driver.bus.route && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-sm">Route Assignment</span>
                                        </div>
                                        <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/50">
                                            <div className="text-lg font-semibold text-white">
                                                {driver.bus.route.route_number}
                                            </div>
                                            <div className="text-slate-300">
                                                {driver.bus.route.route_name}
                                            </div>
                                            {driver.bus.route.description && (
                                                <div className="text-sm text-slate-400 mt-2">
                                                    {driver.bus.route.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <Link href={`/buses/${driver.bus.id}`}>
                                        <Button variant="outline" className="w-full">
                                            View Bus Details
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <Bus className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                <div className="text-slate-400">No bus assigned</div>
                                <p className="text-slate-500 text-sm mt-1">
                                    This driver is not currently assigned to any bus
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
