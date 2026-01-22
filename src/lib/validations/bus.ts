import { z } from 'zod'

export const busSchema = z.object({
    bus_number: z.string().min(1, 'Bus number is required'),
    route_id: z.string().nullable(),
    total_seats: z.number().int().min(1, 'Total seats must be at least 1').default(40),
    status: z.enum(['available', 'full', 'maintenance', 'out_of_service']).default('available')
})

export type BusFormData = z.infer<typeof busSchema>
