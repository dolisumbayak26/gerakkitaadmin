'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { BusWithRelations } from '@/types'
import { ITEMS_PER_PAGE } from '@/lib/constants'

export function useBuses() {
    const [buses, setBuses] = useState<BusWithRelations[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [totalCount, setTotalCount] = useState(0)

    const fetchBuses = async (page = 1, filters?: any) => {
        setLoading(true)
        setError(null)

        try {
            const from = (page - 1) * ITEMS_PER_PAGE
            const to = from + ITEMS_PER_PAGE - 1

            let query = supabase
                .from('buses')
                .select(`
          *,
          route:routes(id, route_number, route_name),
          driver:drivers!buses_id_fkey(
            id,
            full_name,
            email,
            phone_number
          )
        `, { count: 'exact' })
                .range(from, to)
                .order('created_at', { ascending: false })

            // Apply filters
            if (filters?.status) {
                query = query.eq('status', filters.status)
            }
            if (filters?.route_id) {
                query = query.eq('route_id', filters.route_id)
            }
            if (filters?.search) {
                query = query.or(`bus_number.ilike.%${filters.search}%`)
            }

            const { data, error, count } = await query

            if (error) throw error

            setBuses((data as any[]) || [])
            setTotalCount(count || 0)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBuses()
    }, [])

    const createBus = async (busData: Record<string, any>) => {
        try {
            const { data, error } = await (supabase
                .from('buses') as any)
                .insert(busData)
                .select()

            if (error) throw error

            fetchBuses() // Refresh list
            return data
        } catch (err) {
            throw err
        }
    }

    const updateBus = async (id: string, busData: Record<string, any>) => {
        try {
            const { data, error } = await (supabase
                .from('buses') as any)
                .update(busData)
                .eq('id', id)
                .select()

            if (error) throw error

            fetchBuses() // Refresh list
            return data
        } catch (err) {
            throw err
        }
    }

    const deleteBus = async (id: string) => {
        try {
            const { error } = await (supabase
                .from('buses') as any)
                .delete()
                .eq('id', id)

            if (error) throw error

            fetchBuses() // Refresh list
        } catch (err) {
            throw err
        }
    }

    return {
        buses,
        loading,
        error,
        totalCount,
        fetchBuses,
        createBus,
        updateBus,
        deleteBus
    }
}
