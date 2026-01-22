-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.admin_activity_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT admin_activity_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admin_users(id)
);
CREATE TABLE public.admin_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['admin'::text, 'super_admin'::text, 'viewer'::text])),
  is_active boolean DEFAULT true,
  last_login timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.bus_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  bus_id uuid NOT NULL,
  departure_time time without time zone NOT NULL,
  arrival_time time without time zone NOT NULL,
  days_of_week ARRAY DEFAULT ARRAY['Monday'::text, 'Tuesday'::text, 'Wednesday'::text, 'Thursday'::text, 'Friday'::text, 'Saturday'::text, 'Sunday'::text],
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bus_schedules_pkey PRIMARY KEY (id),
  CONSTRAINT bus_schedules_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.buses(id)
);
CREATE TABLE public.bus_stops (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  latitude numeric NOT NULL CHECK (latitude >= '-90'::integer::numeric AND latitude <= 90::numeric),
  longitude numeric NOT NULL CHECK (longitude >= '-180'::integer::numeric AND longitude <= 180::numeric),
  address text NOT NULL,
  city text DEFAULT 'Medan'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bus_stops_pkey PRIMARY KEY (id)
);
CREATE TABLE public.buses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  bus_number text NOT NULL UNIQUE,
  route_id uuid,
  total_seats integer NOT NULL DEFAULT 40,
  available_seats integer NOT NULL DEFAULT 40,
  status text DEFAULT 'available'::text CHECK (status = ANY (ARRAY['available'::text, 'full'::text, 'maintenance'::text, 'out_of_service'::text])),
  current_latitude numeric CHECK (current_latitude IS NULL OR current_latitude >= '-90'::integer::numeric AND current_latitude <= 90::numeric),
  current_longitude numeric CHECK (current_longitude IS NULL OR current_longitude >= '-180'::integer::numeric AND current_longitude <= 180::numeric),
  last_location_update timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT buses_pkey PRIMARY KEY (id),
  CONSTRAINT buses_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(id)
);
CREATE TABLE public.customers (
  id uuid NOT NULL,
  email text UNIQUE,
  phone_number text UNIQUE,
  full_name text NOT NULL,
  profile_image_url text,
  encrypted_pin text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT customers_pkey PRIMARY KEY (id),
  CONSTRAINT customers_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.drivers (
  id uuid NOT NULL,
  email text UNIQUE,
  phone_number text UNIQUE,
  full_name text NOT NULL,
  profile_image_url text,
  bus_id uuid UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT drivers_pkey PRIMARY KEY (id),
  CONSTRAINT drivers_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT drivers_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.buses(id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  bus_id uuid,
  route_id uuid,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT reviews_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.buses(id),
  CONSTRAINT reviews_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(id)
);
CREATE TABLE public.route_stops (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL,
  bus_stop_id uuid NOT NULL,
  stop_order integer NOT NULL,
  fare_from_origin numeric NOT NULL DEFAULT 0 CHECK (fare_from_origin >= 0::numeric),
  CONSTRAINT route_stops_pkey PRIMARY KEY (id),
  CONSTRAINT route_stops_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(id),
  CONSTRAINT route_stops_bus_stop_id_fkey FOREIGN KEY (bus_stop_id) REFERENCES public.bus_stops(id)
);
CREATE TABLE public.routes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  route_number text NOT NULL UNIQUE,
  route_name text NOT NULL,
  description text,
  estimated_duration interval,
  status text DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'maintenance'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT routes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL,
  ticket_code text NOT NULL UNIQUE,
  qr_code_data text NOT NULL UNIQUE,
  status text DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'used'::text, 'expired'::text, 'cancelled'::text])),
  valid_until timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tickets_pkey PRIMARY KEY (id),
  CONSTRAINT tickets_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id)
);
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  transaction_code text NOT NULL UNIQUE,
  route_id uuid NOT NULL,
  origin_stop_id uuid NOT NULL,
  destination_stop_id uuid NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  payment_method text NOT NULL,
  payment_status text DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'refunded'::text, 'expired'::text])),
  midtrans_transaction_id text,
  midtrans_order_id text UNIQUE,
  purchase_date timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT transactions_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(id),
  CONSTRAINT transactions_origin_stop_id_fkey FOREIGN KEY (origin_stop_id) REFERENCES public.bus_stops(id),
  CONSTRAINT transactions_destination_stop_id_fkey FOREIGN KEY (destination_stop_id) REFERENCES public.bus_stops(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  email text UNIQUE,
  phone_number text UNIQUE,
  full_name text NOT NULL,
  profile_image_url text,
  encrypted_pin text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.wallet_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['topup'::text, 'payment'::text, 'refund'::text])),
  description text,
  payment_reference text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'success'::text, 'failed'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT wallet_transactions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(user_id)
);
CREATE TABLE public.wallets (
  user_id uuid NOT NULL,
  balance numeric DEFAULT 0,
  last_updated timestamp with time zone DEFAULT now(),
  CONSTRAINT wallets_pkey PRIMARY KEY (user_id),
  CONSTRAINT wallets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);