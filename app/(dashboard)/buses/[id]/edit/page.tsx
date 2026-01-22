'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function EditBusPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [busId, setBusId] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [routes, setRoutes] = useState<any[]>([])
    const [formData, setFormData] = useState({
        bus_number: '',
        total_seats: '' as string | number,
        available_seats: '' as string | number,
        status: 'available',
        route_id: ''
    })

    useEffect(() => {
        const init = async () => {
            const { id } = await params
            setBusId(id)
            fetchBusData(id)
            fetchRoutes()
        }
        init()
    }, [])

    const fetchBusData = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('buses')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            const busData = data as any
            setFormData({
                bus_number: busData.bus_number,
                total_seats: busData.total_seats,
                available_seats: busData.available_seats,
                status: busData.status,
                route_id: busData.route_id || ''
            })
        } catch (error) {
            console.error('Error fetching bus:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchRoutes = async () => {
        try {
            const { data, error } = await supabase
                .from('routes')
                .select('id, route_number, route_name')
                .eq('status', 'active')
                .order('route_number')

            if (error) throw error
            setRoutes(data || [])
        } catch (error) {
            console.error('Error fetching routes:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const { error } = await (supabase
                .from('buses') as any)
                .update({
                    bus_number: formData.bus_number,
                    total_seats: Number(formData.total_seats),
                    available_seats: Number(formData.available_seats),
                    status: formData.status,
                    route_id: formData.route_id || null
                })
                .eq('id', busId)

            if (error) throw error

            router.push(`/buses/${busId}`)
            router.refresh()
        } catch (error: any) {
            console.error('Error updating bus:', error)
            alert('Failed to update bus: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-slate-400">Loading...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/buses/${busId}`}>
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Edit Bus</h1>
                    <p className="text-slate-400 mt-1">
                        Update bus information and assignments
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white">Bus Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="bus_number" className="text-slate-300">
                                    Bus Number *
                                </Label>
                                <Input
                                    id="bus_number"
                                    value={formData.bus_number}
                                    onChange={(e) => setFormData({ ...formData, bus_number: e.target.value })}
                                    required
                                    className="bg-slate-950 border-slate-800 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-slate-300">
                                    Status *
                                </Label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    required
                                    className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="available">Available</option>
                                    <option value="full">Full</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="out_of_service">Out of Service</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="total_seats" className="text-slate-300">
                                    Total Seats *
                                </Label>
                                <Input
                                    id="total_seats"
                                    type="number"
                                    min="1"
                                    value={formData.total_seats}
                                    onChange={(e) => setFormData({ ...formData, total_seats: e.target.value })}
                                    required
                                    className="bg-slate-950 border-slate-800 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="available_seats" className="text-slate-300">
                                    Available Seats *
                                </Label>
                                <Input
                                    id="available_seats"
                                    type="number"
                                    min="0"
                                    value={formData.available_seats}
                                    onChange={(e) => setFormData({ ...formData, available_seats: e.target.value })}
                                    required
                                    className="bg-slate-950 border-slate-800 text-white"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="route_id" className="text-slate-300">
                                    Assigned Route
                                </Label>
                                <select
                                    id="route_id"
                                    value={formData.route_id}
                                    onChange={(e) => setFormData({ ...formData, route_id: e.target.value })}
                                    className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="">No Route</option>
                                    {routes.map((route) => (
                                        <option key={route.id} value={route.id}>
                                            {route.route_number} - {route.route_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>

                            <Link href={`/buses/${busId}`}>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
