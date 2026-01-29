-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.branch_staff (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  branch_id uuid,
  user_id uuid,
  role text DEFAULT 'STAFF'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT branch_staff_pkey PRIMARY KEY (id),
  CONSTRAINT branch_staff_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT branch_staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.branches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  code text UNIQUE,
  address text,
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'ACTIVE'::text CHECK (status = ANY (ARRAY['ACTIVE'::text, 'INACTIVE'::text, 'BANNED'::text, 'ARCHIVED'::text])),
  CONSTRAINT branches_pkey PRIMARY KEY (id),
  CONSTRAINT branches_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id)
);
CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL,
  phone text NOT NULL,
  name text NOT NULL,
  address text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT customers_pkey PRIMARY KEY (id),
  CONSTRAINT customers_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
CREATE TABLE public.item_catalog (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text DEFAULT 'GENERAL'::text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT item_catalog_pkey PRIMARY KEY (id)
);
CREATE TABLE public.master_services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  default_price numeric NOT NULL,
  unit text NOT NULL,
  category text NOT NULL,
  is_active boolean DEFAULT true,
  CONSTRAINT master_services_pkey PRIMARY KEY (id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  item_id uuid,
  item_name_snapshot text NOT NULL,
  service_type text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  weight_kg numeric,
  unit_price numeric NOT NULL DEFAULT 0,
  total_price numeric NOT NULL DEFAULT 0,
  is_chargeable boolean DEFAULT true,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
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
  payment_method text,
  status text NOT NULL DEFAULT 'RECEIVED'::text CHECK (status = ANY (ARRAY['RECEIVED'::text, 'IN_PROCESS'::text, 'READY'::text, 'DELIVERED'::text, 'CANCELLED'::text])),
  bill_status USER-DEFINED NOT NULL DEFAULT 'OPEN'::bill_status_type,
  is_open boolean NOT NULL DEFAULT true,
  delivery_mode text NOT NULL DEFAULT 'PICKUP'::text,
  total_piece_count integer DEFAULT 0,
  total_weight numeric DEFAULT 0,
  due_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  created_by uuid,
  closed_by uuid,
  notes text DEFAULT ''::text,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text,
  phone text,
  email text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.shop_item_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL,
  item_catalog_id uuid NOT NULL,
  services_config jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shop_item_rules_pkey PRIMARY KEY (id),
  CONSTRAINT shop_item_rules_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT shop_item_rules_item_catalog_id_fkey FOREIGN KEY (item_catalog_id) REFERENCES public.item_catalog(id)
);
CREATE TABLE public.shop_services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL,
  name text,
  price numeric NOT NULL DEFAULT 0,
  unit text NOT NULL CHECK (unit = ANY (ARRAY['KG'::text, 'PC'::text])),
  category text DEFAULT 'BULK'::text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  master_service_id uuid,
  CONSTRAINT shop_services_pkey PRIMARY KEY (id),
  CONSTRAINT shop_services_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT shop_services_master_service_id_fkey FOREIGN KEY (master_service_id) REFERENCES public.master_services(id)
);
CREATE TABLE public.shop_settings (
  branch_id uuid NOT NULL,
  billing_mode text DEFAULT 'MANUAL'::text,
  delivery_enabled boolean DEFAULT false,
  tax_rate numeric DEFAULT 0,
  currency text DEFAULT 'INR'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shop_settings_pkey PRIMARY KEY (branch_id),
  CONSTRAINT shop_settings_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
CREATE TABLE public.shop_special_item_rates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL,
  item_catalog_id uuid NOT NULL,
  master_service_id uuid,
  custom_shop_service_id uuid,
  rate numeric NOT NULL DEFAULT 0,
  unit text NOT NULL CHECK (unit = ANY (ARRAY['PC'::text, 'KG'::text, 'FLAT'::text])),
  min_price numeric DEFAULT 0,
  min_value numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shop_special_item_rates_pkey PRIMARY KEY (id),
  CONSTRAINT shop_special_item_rates_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT shop_special_item_rates_item_catalog_id_fkey FOREIGN KEY (item_catalog_id) REFERENCES public.item_catalog(id),
  CONSTRAINT shop_special_item_rates_master_service_id_fkey FOREIGN KEY (master_service_id) REFERENCES public.master_services(id),
  CONSTRAINT shop_special_item_rates_custom_shop_service_id_fkey FOREIGN KEY (custom_shop_service_id) REFERENCES public.shop_services(id)
);