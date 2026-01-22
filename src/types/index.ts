import { Database } from './database'

// Table row types
export type AdminUser = Database['public']['Tables']['admin_users']['Row']
export type AdminActivityLog = Database['public']['Tables']['admin_activity_logs']['Row']
export type Bus = Database['public']['Tables']['buses']['Row']
export type Driver = Database['public']['Tables']['drivers']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Route = Database['public']['Tables']['routes']['Row']
export type BusStop = Database['public']['Tables']['bus_stops']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Ticket = Database['public']['Tables']['tickets']['Row']
export type Wallet = Database['public']['Tables']['wallets']['Row']

// Extended types with relations
export type BusWithRelations = Bus & {
    route: Route | null
    driver: (Driver & { user: User | null }) | null
}

export type DriverWithRelations = Driver & {
    bus: Bus | null
}

export type TransactionWithDetails = Transaction & {
    user: User
    route: Route
    origin_stop: BusStop
    destination_stop: BusStop
    tickets: Ticket[]
}

export type UserWithWallet = User & {
    wallet: Wallet | null
}

// Dashboard metrics
export interface DashboardMetrics {
    totalUsers: number
    activeBuses: number
    todayTransactions: number
    todayRevenue: number
    totalWalletBalance: number
    userGrowth: number // percentage
}

// Form types
export interface BusFormData {
    bus_number: string
    route_id: string | null
    total_seats: number
    status: Bus['status']
}

export interface DriverFormData {
    full_name: string
    email: string
    phone_number: string
    bus_id: string | null
}

export interface LoginFormData {
    email: string
    password: string
}

// Filter types
export interface BusFilters {
    status?: Bus['status']
    route_id?: string
    search?: string
}

export interface TransactionFilters {
    payment_status?: Transaction['payment_status']
    payment_method?: string
    date_from?: Date
    date_to?: Date
    search?: string
}

export interface UserFilters {
    status?: 'active' | 'suspended' | 'banned'
    search?: string
}
