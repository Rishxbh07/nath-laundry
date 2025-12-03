-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.bill_sequences (
  branch_id uuid NOT NULL,
  month_year text NOT NULL,
  last_seq integer NOT NULL DEFAULT 0,
  CONSTRAINT bill_sequences_pkey PRIMARY KEY (branch_id, month_year),
  CONSTRAINT bill_sequences_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
CREATE TABLE public.branches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  address text,
  phone text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT branches_pkey PRIMARY KEY (id)
);
CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  name text NOT NULL,
  address text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT customers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.laundry_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  kind text NOT NULL CHECK (kind = ANY (ARRAY['WEARABLE_BULK'::text, 'SPECIAL'::text])),
  default_unit text NOT NULL CHECK (default_unit = ANY (ARRAY['PIECE'::text, 'KG'::text])),
  notes text,
  display_order integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT laundry_items_pkey PRIMARY KEY (id)
);
CREATE TABLE public.laundry_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL UNIQUE,
  wf_kg_rate numeric NOT NULL DEFAULT 45.00,
  wi_kg_rate numeric NOT NULL DEFAULT 60.00,
  iron_only_piece_rate numeric NOT NULL DEFAULT 8.00,
  small_order_piece_rate numeric NOT NULL DEFAULT 15.00,
  small_order_threshold integer NOT NULL DEFAULT 3,
  blanket_flat_threshold_kg numeric NOT NULL DEFAULT 1.5,
  blanket_flat_rate numeric NOT NULL DEFAULT 100.00,
  blanket_kg_rate numeric NOT NULL DEFAULT 80.00,
  delivery_mode text NOT NULL DEFAULT 'FREE'::text,
  delivery_flat_fee numeric NOT NULL DEFAULT 0,
  upi_id text,
  upi_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT laundry_settings_pkey PRIMARY KEY (id),
  CONSTRAINT laundry_settings_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  item_id uuid,
  item_name_snapshot text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  weight_kg numeric,
  service_type text NOT NULL,
  unit_price numeric NOT NULL DEFAULT 0,
  total_price numeric NOT NULL DEFAULT 0,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.laundry_items(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  readable_bill_id text UNIQUE,
  total_amount numeric NOT NULL DEFAULT 0,
  discount_amount numeric NOT NULL DEFAULT 0,
  final_amount numeric NOT NULL DEFAULT 0,
  amount_paid numeric NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'UNPAID'::text CHECK (payment_status = ANY (ARRAY['UNPAID'::text, 'PARTIAL'::text, 'PAID'::text])),
  is_open boolean NOT NULL DEFAULT true,
  delivery_mode text NOT NULL DEFAULT 'PICKUP'::text CHECK (delivery_mode = ANY (ARRAY['PICKUP'::text, 'DELIVERY'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  due_date timestamp with time zone,
  completed_at timestamp with time zone,
  status text NOT NULL DEFAULT 'RECEIVED'::text CHECK (status = ANY (ARRAY['RECEIVED'::text, 'IN_PROCESS'::text, 'READY'::text, 'DELIVERED'::text, 'CANCELLED'::text])),
  payment_method text CHECK (payment_method = ANY (ARRAY['CASH'::text, 'UPI'::text, 'OTHER'::text])),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  branch_id uuid NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'STAFF'::text CHECK (role = ANY (ARRAY['OWNER'::text, 'MANAGER'::text, 'STAFF'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT profiles_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
CREATE TABLE public.special_item_rates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL,
  item_id uuid NOT NULL,
  service_type text NOT NULL,
  rate_type text NOT NULL CHECK (rate_type = ANY (ARRAY['PER_PIECE'::text, 'PER_KG'::text, 'FLAT'::text])),
  rate_value numeric NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT special_item_rates_pkey PRIMARY KEY (id),
  CONSTRAINT special_item_rates_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT special_item_rates_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.laundry_items(id)
);