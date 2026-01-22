import { MapPin, Bus, Calendar, Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { formatDate, getStatusColor, cn } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getBusDetails(id: string) {
    const supabase = await createClient()

    // Get bus with route info
    const { data: bus, error } = await supabase
        .from('buses')
        .select(`
      *,
      route:routes(
        id,
        route_number,
        route_name,
        description
      )
    `)
        .eq('id', id)
        .single()

    if (error || !bus) {
        return null
    }

    // Get route stops if bus has a route
    let routeStops: any[] = []
    const busData = bus as any
    if (busData.route_id) {
        const { data: stops } = await supabase
            .from('route_stops')
            .select(`
        id,
        stop_order,
        bus_stop:bus_stops(
          id,
          name,
          latitude,
          longitude,
          address
        )
      `)
            .eq('route_id', busData.route_id)
            .order('stop_order', { ascending: true })

        routeStops = stops || []
    }

    return { bus, routeStops }
}

export default async function BusDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const data = await getBusDetails(id)

    if (!data) {
        notFound()
    }

    const { bus, routeStops } = data as any

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Bus Details</h1>
                    <p className="text-slate-400 mt-1">
                        View and manage bus information
                    </p>
                </div>

                <Link href={`/buses/${id}/edit`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Bus
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Bus Information */}
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Bus className="h-5 w-5 text-blue-500" />
                            Bus Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-sm text-slate-400">Bus Number</div>
                            <div className="text-lg font-semibold text-white">
                                {bus.bus_number}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm text-slate-400">Status</div>
                            <span
                                className={cn(
                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize mt-1',
                                    getStatusColor(bus.status)
                                )}
                            >
                                {bus.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-slate-400">Total Seats</div>
                                <div className="text-lg font-semibold text-white">
                                    {bus.total_seats}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-slate-400">Available Seats</div>
                                <div className="text-lg font-semibold text-white">
                                    {bus.available_seats}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="text-sm text-slate-400 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Last Updated
                            </div>
                            <div className="text-white">
                                {formatDate(bus.updated_at || bus.created_at)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Route Information */}
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-green-500" />
                            Route Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {bus.route ? (
                            <>
                                <div>
                                    <div className="text-sm text-slate-400">Route Number</div>
                                    <div className="text-lg font-semibold text-white">
                                        {bus.route.route_number}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-slate-400">Route Name</div>
                                    <div className="text-white">
                                        {bus.route.route_name}
                                    </div>
                                </div>

                                {bus.route.description && (
                                    <div>
                                        <div className="text-sm text-slate-400">Description</div>
                                        <div className="text-white text-sm">
                                            {bus.route.description}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className="text-sm text-slate-400 mb-2">Total Stops</div>
                                    <div className="text-lg font-semibold text-white">
                                        {routeStops.length} stops
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-slate-500 text-center py-8">
                                No route assigned
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bus Stops List */}
            {routeStops.length > 0 && (
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white">Bus Stops</CardTitle>
                        <p className="text-sm text-slate-400 mt-1">
                            Route stops with location details
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {routeStops.map((routeStop: any, index: number) => (
                                <div
                                    key={routeStop.id}
                                    className="flex items-start gap-4 p-4 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-800/30 transition-colors"
                                >
                                    {/* Stop Number */}
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
                                            {routeStop.stop_order}
                                        </div>
                                        {index < routeStops.length - 1 && (
                                            <div className="h-full w-0.5 bg-slate-700 mt-2 mb-2 min-h-[40px]"></div>
                                        )}
                                    </div>

                                    {/* Stop Details */}
                                    <div className="flex-1 space-y-2">
                                        <div>
                                            <h4 className="text-white font-semibold">
                                                {routeStop.bus_stop.name}
                                            </h4>
                                            <p className="text-slate-400 text-sm">
                                                {routeStop.bus_stop.address}
                                            </p>
                                        </div>

                                        <div className="flex gap-6 text-sm">
                                            <div>
                                                <span className="text-slate-500">Latitude:</span>{' '}
                                                <span className="text-slate-300 font-mono">
                                                    {Number(routeStop.bus_stop.latitude).toFixed(6)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500">Longitude:</span>{' '}
                                                <span className="text-slate-300 font-mono">
                                                    {Number(routeStop.bus_stop.longitude).toFixed(6)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
