// Database types generated from Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          id: string
          admin_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          admin_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          admin_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string | null
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          role: 'admin' | 'super_admin' | 'viewer'
          is_active: boolean | null
          last_login: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name: string
          role: 'admin' | 'super_admin' | 'viewer'
          is_active?: boolean | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          role?: 'admin' | 'super_admin' | 'viewer'
          is_active?: boolean | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      buses: {
        Row: {
          id: string
          bus_number: string
          route_id: string | null
          total_seats: number
          available_seats: number
          status: 'available' | 'full' | 'maintenance' | 'out_of_service'
          current_latitude: number | null
          current_longitude: number | null
          last_location_update: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          bus_number: string
          route_id?: string | null
          total_seats?: number
          available_seats?: number
          status?: 'available' | 'full' | 'maintenance' | 'out_of_service'
          current_latitude?: number | null
          current_longitude?: number | null
          last_location_update?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          bus_number?: string
          route_id?: string | null
          total_seats?: number
          available_seats?: number
          status?: 'available' | 'full' | 'maintenance' | 'out_of_service'
          current_latitude?: number | null
          current_longitude?: number | null
          last_location_update?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      bus_stops: {
        Row: {
          id: string
          name: string
          latitude: number
          longitude: number
          address: string
          city: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          latitude: number
          longitude: number
          address: string
          city?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          latitude?: number
          longitude?: number
          address?: string
          city?: string | null
          created_at?: string | null
        }
      }
      drivers: {
        Row: {
          id: string
          email: string | null
          phone_number: string | null
          full_name: string
          profile_image_url: string | null
          bus_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          phone_number?: string | null
          full_name: string
          profile_image_url?: string | null
          bus_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          phone_number?: string | null
          full_name?: string
          profile_image_url?: string | null
          bus_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      routes: {
        Row: {
          id: string
          route_number: string
          route_name: string
          description: string | null
          estimated_duration: string | null
          status: 'active' | 'inactive' | 'maintenance'
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          route_number: string
          route_name: string
          description?: string | null
          estimated_duration?: string | null
          status?: 'active' | 'inactive' | 'maintenance'
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          route_number?: string
          route_name?: string
          description?: string | null
          estimated_duration?: string | null
          status?: 'active' | 'inactive' | 'maintenance'
          created_at?: string | null
          updated_at?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          transaction_code: string
          route_id: string
          origin_stop_id: string
          destination_stop_id: string
          amount: number
          quantity: number
          payment_method: string
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded' | 'expired'
          midtrans_transaction_id: string | null
          midtrans_order_id: string | null
          purchase_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          transaction_code: string
          route_id: string
          origin_stop_id: string
          destination_stop_id: string
          amount: number
          quantity?: number
          payment_method: string
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'expired'
          midtrans_transaction_id?: string | null
          midtrans_order_id?: string | null
          purchase_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          transaction_code?: string
          route_id?: string
          origin_stop_id?: string
          destination_stop_id?: string
          amount?: number
          quantity?: number
          payment_method?: string
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'expired'
          midtrans_transaction_id?: string | null
          midtrans_order_id?: string | null
          purchase_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string | null
          phone_number: string | null
          full_name: string
          profile_image_url: string | null
          encrypted_pin: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          phone_number?: string | null
          full_name: string
          profile_image_url?: string | null
          encrypted_pin?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          phone_number?: string | null
          full_name?: string
          profile_image_url?: string | null
          encrypted_pin?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      wallets: {
        Row: {
          user_id: string
          balance: number | null
          last_updated: string | null
        }
        Insert: {
          user_id: string
          balance?: number | null
          last_updated?: string | null
        }
        Update: {
          user_id?: string
          balance?: number | null
          last_updated?: string | null
        }
      }
      tickets: {
        Row: {
          id: string
          transaction_id: string
          ticket_code: string
          qr_code_data: string
          status: 'active' | 'used' | 'expired' | 'cancelled'
          valid_until: string
          used_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          transaction_id: string
          ticket_code: string
          qr_code_data: string
          status?: 'active' | 'used' | 'expired' | 'cancelled'
          valid_until: string
          used_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          transaction_id?: string
          ticket_code?: string
          qr_code_data?: string
          status?: 'active' | 'used' | 'expired' | 'cancelled'
          valid_until?: string
          used_at?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
