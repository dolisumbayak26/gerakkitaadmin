import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format currency in IDR
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

/**
 * Format date
 */
export function formatDate(date: string | Date | null | undefined, formatStr: string = 'dd MMM yyyy'): string {
    if (!date) return 'N/A'
    return format(new Date(date), formatStr)
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date | null | undefined): string {
    if (!date) return 'N/A'
    return format(new Date(date), 'dd MMM yyyy, HH:mm')
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        // Bus status
        available: 'bg-green-500/20 text-green-400',
        full: 'bg-yellow-500/20 text-yellow-400',
        maintenance: 'bg-orange-500/20 text-orange-400',
        out_of_service: 'bg-red-500/20 text-red-400',

        // Transaction status
        pending: 'bg-yellow-500/20 text-yellow-400',
        completed: 'bg-green-500/20 text-green-400',
        failed: 'bg-red-500/20 text-red-400',
        refunded: 'bg-blue-500/20 text-blue-400',
        expired: 'bg-gray-500/20 text-gray-400',

        // Ticket status
        active: 'bg-green-500/20 text-green-400',
        used: 'bg-blue-500/20 text-blue-400',
        cancelled: 'bg-red-500/20 text-red-400',

        // Route status
        inactive: 'bg-gray-500/20 text-gray-400'
    }

    return colors[status] || 'bg-gray-500/20 text-gray-400'
}

/**
 * Calculate percentage growth
 */
export function calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
}
