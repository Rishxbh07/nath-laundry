-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.branches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  code text UNIQUE,
  address text,
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT branches_pkey PRIMARY KEY (id),
  CONSTRAINT branches_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id)
);
CREATE TABLE public.item_catalog (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text DEFAULT 'GENERAL'::text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT item_catalog_pkey PRIMARY KEY (id)
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
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  unit text NOT NULL CHECK (unit = ANY (ARRAY['KG'::text, 'PC'::text])),
  category text DEFAULT 'BULK'::text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shop_services_pkey PRIMARY KEY (id),
  CONSTRAINT shop_services_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
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