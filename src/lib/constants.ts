// Pagination
export const ITEMS_PER_PAGE = 20

// Status options
export const BUS_STATUS_OPTIONS = [
    { value: 'available', label: 'Available' },
    { value: 'full', label: 'Full' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'out_of_service', label: 'Out of Service' }
] as const

export const TRANSACTION_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'expired', label: 'Expired' }
] as const

export const PAYMENT_METHOD_OPTIONS = [
    { value: 'wallet', label: 'Wallet' },
    { value: 'midtrans', label: 'Midtrans' }
] as const

export const ROUTE_STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' }
] as const

// Routes
export const ROUTES = {
    DASHBOARD: '/',
    LOGIN: '/login',
    BUSES: '/buses',
    DRIVERS: '/drivers',
    USERS: '/users',
    TRANSACTIONS: '/transactions'
} as const

// Admin roles
export const ADMIN_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    VIEWER: 'viewer'
} as const
