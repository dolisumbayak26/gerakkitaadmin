'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { busSchema, type BusFormData } from '@/lib/validations/bus'
import { useBuses } from '@/hooks/useBuses'
import Link from 'next/link'
import { useState } from 'react'

export default function NewBusPage() {
    const router = useRouter()
    const { createBus } = useBuses()
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<BusFormData>({
        resolver: zodResolver(busSchema),
        defaultValues: {
            total_seats: 40,
            status: 'available'
        }
    })

    const onSubmit = async (data: BusFormData) => {
        setLoading(true)
        try {
            await createBus({
                ...data,
                available_seats: data.total_seats // Initially all seats are available
            })
            router.push('/buses')
        } catch (error: any) {
            console.error('Error creating bus:', error)
            alert(error.message || 'Failed to create bus')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/buses">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Add New Bus</h1>
                    <p className="text-slate-400 mt-1">
                        Register a new bus to your fleet
                    </p>
                </div>
            </div>

            <Card className="border-slate-800 bg-slate-900/50 max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-white">Bus Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="bus_number" className="text-slate-300">
                                Bus Number *
                            </Label>
                            <Input
                                id="bus_number"
                                placeholder="e.g., BUS-001"
                                className="bg-slate-950 border-slate-800 text-white"
                                {...register('bus_number')}
                                disabled={loading}
                            />
                            {errors.bus_number && (
                                <p className="text-sm text-red-400">{errors.bus_number.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="total_seats" className="text-slate-300">
                                Total Seats *
                            </Label>
                            <Input
                                id="total_seats"
                                type="number"
                                min="1"
                                className="bg-slate-950 border-slate-800 text-white"
                                {...register('total_seats', { valueAsNumber: true })}
                                disabled={loading}
                            />
                            {errors.total_seats && (
                                <p className="text-sm text-red-400">{errors.total_seats.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-slate-300">
                                Status *
                            </Label>
                            <select
                                id="status"
                                className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                {...register('status')}
                                disabled={loading}
                            >
                                <option value="available">Available</option>
                                <option value="full">Full</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="out_of_service">Out of Service</option>
                            </select>
                            {errors.status && (
                                <p className="text-sm text-red-400">{errors.status.message}</p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={loading}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? 'Creating...' : 'Create Bus'}
                            </Button>
                            <Link href="/buses">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-slate-800 text-slate-300 hover:bg-slate-800"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
