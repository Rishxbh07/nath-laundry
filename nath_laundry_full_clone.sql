--
-- PostgreSQL database dump
--

\restrict mPI1UEmUAs7yhQTMRGAF1aaq0SQGMSY2AEy7BmAi52xraxKe3dFq4mFFmSrbdwH

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP POLICY IF EXISTS "Update access for users and admins" ON "public"."profiles";
DROP POLICY IF EXISTS "Staff view branch settings" ON "public"."laundry_settings";
DROP POLICY IF EXISTS "Staff view branch rates" ON "public"."special_item_rates";
DROP POLICY IF EXISTS "Staff can view analytics" ON "public"."daily_analytics_snapshots";
DROP POLICY IF EXISTS "Staff can manage bill sequences" ON "public"."bill_sequences";
DROP POLICY IF EXISTS "Read access for users and admins" ON "public"."profiles";
DROP POLICY IF EXISTS "Public read branches" ON "public"."branches";
DROP POLICY IF EXISTS "Insert access for admins only" ON "public"."profiles";
DROP POLICY IF EXISTS "Auth users view items" ON "public"."laundry_items";
DROP POLICY IF EXISTS "Auth users read branches" ON "public"."branches";
DROP POLICY IF EXISTS "Auth users full access orders" ON "public"."orders";
DROP POLICY IF EXISTS "Auth users full access items" ON "public"."order_items";
DROP POLICY IF EXISTS "Auth users full access customers" ON "public"."customers";
DROP POLICY IF EXISTS "Allow public read access to items" ON "public"."order_items";
DROP POLICY IF EXISTS "Allow public read access to customers" ON "public"."customers";
DROP POLICY IF EXISTS "Allow public read access to branches" ON "public"."branches";
DROP POLICY IF EXISTS "Allow public read access by ID" ON "public"."orders";
ALTER TABLE IF EXISTS ONLY "storage"."vector_indexes" DROP CONSTRAINT IF EXISTS "vector_indexes_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_upload_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."prefixes" DROP CONSTRAINT IF EXISTS "prefixes_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."objects" DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."special_item_rates" DROP CONSTRAINT IF EXISTS "special_item_rates_item_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."special_item_rates" DROP CONSTRAINT IF EXISTS "special_item_rates_branch_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."profiles" DROP CONSTRAINT IF EXISTS "profiles_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."profiles" DROP CONSTRAINT IF EXISTS "profiles_branch_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."orders" DROP CONSTRAINT IF EXISTS "orders_customer_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."orders" DROP CONSTRAINT IF EXISTS "orders_created_by_fkey";
ALTER TABLE IF EXISTS ONLY "public"."orders" DROP CONSTRAINT IF EXISTS "orders_closed_by_fkey";
ALTER TABLE IF EXISTS ONLY "public"."orders" DROP CONSTRAINT IF EXISTS "orders_branch_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."order_items" DROP CONSTRAINT IF EXISTS "order_items_order_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."order_items" DROP CONSTRAINT IF EXISTS "order_items_item_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."laundry_settings" DROP CONSTRAINT IF EXISTS "laundry_settings_branch_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."daily_analytics_snapshots" DROP CONSTRAINT IF EXISTS "daily_analytics_snapshots_branch_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."bill_sequences" DROP CONSTRAINT IF EXISTS "bill_sequences_branch_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sso_domains" DROP CONSTRAINT IF EXISTS "sso_domains_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_oauth_client_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_flow_state_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_session_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."one_time_tokens" DROP CONSTRAINT IF EXISTS "one_time_tokens_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_client_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_client_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_challenges" DROP CONSTRAINT IF EXISTS "mfa_challenges_auth_factor_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "mfa_amr_claims_session_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_user_id_fkey";
DROP TRIGGER IF EXISTS "update_objects_updated_at" ON "storage"."objects";
DROP TRIGGER IF EXISTS "prefixes_delete_hierarchy" ON "storage"."prefixes";
DROP TRIGGER IF EXISTS "prefixes_create_hierarchy" ON "storage"."prefixes";
DROP TRIGGER IF EXISTS "objects_update_create_prefix" ON "storage"."objects";
DROP TRIGGER IF EXISTS "objects_insert_create_prefix" ON "storage"."objects";
DROP TRIGGER IF EXISTS "objects_delete_delete_prefix" ON "storage"."objects";
DROP TRIGGER IF EXISTS "enforce_bucket_name_length_trigger" ON "storage"."buckets";
DROP TRIGGER IF EXISTS "set_bill_id" ON "public"."orders";
DROP TRIGGER IF EXISTS "on_auth_user_created" ON "auth"."users";
DROP INDEX IF EXISTS "storage"."vector_indexes_name_bucket_id_idx";
DROP INDEX IF EXISTS "storage"."objects_bucket_id_level_idx";
DROP INDEX IF EXISTS "storage"."name_prefix_search";
DROP INDEX IF EXISTS "storage"."idx_prefixes_lower_name";
DROP INDEX IF EXISTS "storage"."idx_objects_lower_name";
DROP INDEX IF EXISTS "storage"."idx_objects_bucket_id_name";
DROP INDEX IF EXISTS "storage"."idx_name_bucket_level_unique";
DROP INDEX IF EXISTS "storage"."idx_multipart_uploads_list";
DROP INDEX IF EXISTS "storage"."buckets_analytics_unique_name_idx";
DROP INDEX IF EXISTS "storage"."bucketid_objname";
DROP INDEX IF EXISTS "storage"."bname";
DROP INDEX IF EXISTS "public"."idx_special_rates_branch_item";
DROP INDEX IF EXISTS "public"."idx_snapshots_branch_date";
DROP INDEX IF EXISTS "public"."idx_orders_customer_id";
DROP INDEX IF EXISTS "public"."idx_orders_customer_created";
DROP INDEX IF EXISTS "public"."idx_orders_branch_id";
DROP INDEX IF EXISTS "public"."idx_orders_branch_due_date";
DROP INDEX IF EXISTS "public"."idx_orders_branch_created_at";
DROP INDEX IF EXISTS "public"."idx_orders_branch_created";
DROP INDEX IF EXISTS "public"."idx_order_items_order_id";
DROP INDEX IF EXISTS "public"."idx_order_items_order";
DROP INDEX IF EXISTS "auth"."users_is_anonymous_idx";
DROP INDEX IF EXISTS "auth"."users_instance_id_idx";
DROP INDEX IF EXISTS "auth"."users_instance_id_email_idx";
DROP INDEX IF EXISTS "auth"."users_email_partial_key";
DROP INDEX IF EXISTS "auth"."user_id_created_at_idx";
DROP INDEX IF EXISTS "auth"."unique_phone_factor_per_user";
DROP INDEX IF EXISTS "auth"."sso_providers_resource_id_pattern_idx";
DROP INDEX IF EXISTS "auth"."sso_providers_resource_id_idx";
DROP INDEX IF EXISTS "auth"."sso_domains_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."sso_domains_domain_idx";
DROP INDEX IF EXISTS "auth"."sessions_user_id_idx";
DROP INDEX IF EXISTS "auth"."sessions_oauth_client_id_idx";
DROP INDEX IF EXISTS "auth"."sessions_not_after_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_for_email_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_created_at_idx";
DROP INDEX IF EXISTS "auth"."saml_providers_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_updated_at_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_session_id_revoked_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_parent_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_instance_id_user_id_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_instance_id_idx";
DROP INDEX IF EXISTS "auth"."recovery_token_idx";
DROP INDEX IF EXISTS "auth"."reauthentication_token_idx";
DROP INDEX IF EXISTS "auth"."one_time_tokens_user_id_token_type_key";
DROP INDEX IF EXISTS "auth"."one_time_tokens_token_hash_hash_idx";
DROP INDEX IF EXISTS "auth"."one_time_tokens_relates_to_hash_idx";
DROP INDEX IF EXISTS "auth"."oauth_consents_user_order_idx";
DROP INDEX IF EXISTS "auth"."oauth_consents_active_user_client_idx";
DROP INDEX IF EXISTS "auth"."oauth_consents_active_client_idx";
DROP INDEX IF EXISTS "auth"."oauth_clients_deleted_at_idx";
DROP INDEX IF EXISTS "auth"."oauth_auth_pending_exp_idx";
DROP INDEX IF EXISTS "auth"."mfa_factors_user_id_idx";
DROP INDEX IF EXISTS "auth"."mfa_factors_user_friendly_name_unique";
DROP INDEX IF EXISTS "auth"."mfa_challenge_created_at_idx";
DROP INDEX IF EXISTS "auth"."idx_user_id_auth_method";
DROP INDEX IF EXISTS "auth"."idx_oauth_client_states_created_at";
DROP INDEX IF EXISTS "auth"."idx_auth_code";
DROP INDEX IF EXISTS "auth"."identities_user_id_idx";
DROP INDEX IF EXISTS "auth"."identities_email_idx";
DROP INDEX IF EXISTS "auth"."flow_state_created_at_idx";
DROP INDEX IF EXISTS "auth"."factor_id_created_at_idx";
DROP INDEX IF EXISTS "auth"."email_change_token_new_idx";
DROP INDEX IF EXISTS "auth"."email_change_token_current_idx";
DROP INDEX IF EXISTS "auth"."confirmation_token_idx";
DROP INDEX IF EXISTS "auth"."audit_logs_instance_id_idx";
ALTER TABLE IF EXISTS ONLY "storage"."vector_indexes" DROP CONSTRAINT IF EXISTS "vector_indexes_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."prefixes" DROP CONSTRAINT IF EXISTS "prefixes_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."objects" DROP CONSTRAINT IF EXISTS "objects_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."migrations" DROP CONSTRAINT IF EXISTS "migrations_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."migrations" DROP CONSTRAINT IF EXISTS "migrations_name_key";
ALTER TABLE IF EXISTS ONLY "storage"."buckets_vectors" DROP CONSTRAINT IF EXISTS "buckets_vectors_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."buckets" DROP CONSTRAINT IF EXISTS "buckets_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."buckets_analytics" DROP CONSTRAINT IF EXISTS "buckets_analytics_pkey";
ALTER TABLE IF EXISTS ONLY "public"."special_item_rates" DROP CONSTRAINT IF EXISTS "unique_branch_item_service";
ALTER TABLE IF EXISTS ONLY "public"."special_item_rates" DROP CONSTRAINT IF EXISTS "special_rates_unique_key";
ALTER TABLE IF EXISTS ONLY "public"."special_item_rates" DROP CONSTRAINT IF EXISTS "special_item_rates_pkey";
ALTER TABLE IF EXISTS ONLY "public"."special_item_rates" DROP CONSTRAINT IF EXISTS "special_item_rates_branch_id_item_id_service_type_key";
ALTER TABLE IF EXISTS ONLY "public"."profiles" DROP CONSTRAINT IF EXISTS "profiles_user_id_key";
ALTER TABLE IF EXISTS ONLY "public"."profiles" DROP CONSTRAINT IF EXISTS "profiles_pkey";
ALTER TABLE IF EXISTS ONLY "public"."orders" DROP CONSTRAINT IF EXISTS "orders_readable_bill_id_key";
ALTER TABLE IF EXISTS ONLY "public"."orders" DROP CONSTRAINT IF EXISTS "orders_pkey";
ALTER TABLE IF EXISTS ONLY "public"."order_items" DROP CONSTRAINT IF EXISTS "order_items_pkey";
ALTER TABLE IF EXISTS ONLY "public"."laundry_settings" DROP CONSTRAINT IF EXISTS "laundry_settings_pkey";
ALTER TABLE IF EXISTS ONLY "public"."laundry_settings" DROP CONSTRAINT IF EXISTS "laundry_settings_branch_id_key";
ALTER TABLE IF EXISTS ONLY "public"."laundry_items" DROP CONSTRAINT IF EXISTS "laundry_items_pkey";
ALTER TABLE IF EXISTS ONLY "public"."daily_analytics_snapshots" DROP CONSTRAINT IF EXISTS "daily_snapshots_branch_date_key";
ALTER TABLE IF EXISTS ONLY "public"."daily_analytics_snapshots" DROP CONSTRAINT IF EXISTS "daily_analytics_snapshots_pkey";
ALTER TABLE IF EXISTS ONLY "public"."customers" DROP CONSTRAINT IF EXISTS "customers_pkey";
ALTER TABLE IF EXISTS ONLY "public"."customers" DROP CONSTRAINT IF EXISTS "customers_phone_key";
ALTER TABLE IF EXISTS ONLY "public"."branches" DROP CONSTRAINT IF EXISTS "branches_pkey";
ALTER TABLE IF EXISTS ONLY "public"."branches" DROP CONSTRAINT IF EXISTS "branches_code_key";
ALTER TABLE IF EXISTS ONLY "public"."bill_sequences" DROP CONSTRAINT IF EXISTS "bill_sequences_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."users" DROP CONSTRAINT IF EXISTS "users_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."users" DROP CONSTRAINT IF EXISTS "users_phone_key";
ALTER TABLE IF EXISTS ONLY "auth"."sso_providers" DROP CONSTRAINT IF EXISTS "sso_providers_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."sso_domains" DROP CONSTRAINT IF EXISTS "sso_domains_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."schema_migrations" DROP CONSTRAINT IF EXISTS "schema_migrations_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_entity_id_key";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_token_unique";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."one_time_tokens" DROP CONSTRAINT IF EXISTS "one_time_tokens_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_user_client_unique";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_clients" DROP CONSTRAINT IF EXISTS "oauth_clients_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_client_states" DROP CONSTRAINT IF EXISTS "oauth_client_states_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_authorization_id_key";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_authorization_code_key";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_last_challenged_at_key";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_challenges" DROP CONSTRAINT IF EXISTS "mfa_challenges_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "mfa_amr_claims_session_id_authentication_method_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."instances" DROP CONSTRAINT IF EXISTS "instances_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_provider_id_provider_unique";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."flow_state" DROP CONSTRAINT IF EXISTS "flow_state_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."audit_log_entries" DROP CONSTRAINT IF EXISTS "audit_log_entries_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "amr_id_pk";
ALTER TABLE IF EXISTS "auth"."refresh_tokens" ALTER COLUMN "id" DROP DEFAULT;
DROP TABLE IF EXISTS "storage"."vector_indexes";
DROP TABLE IF EXISTS "storage"."s3_multipart_uploads_parts";
DROP TABLE IF EXISTS "storage"."s3_multipart_uploads";
DROP TABLE IF EXISTS "storage"."prefixes";
DROP TABLE IF EXISTS "storage"."objects";
DROP TABLE IF EXISTS "storage"."migrations";
DROP TABLE IF EXISTS "storage"."buckets_vectors";
DROP TABLE IF EXISTS "storage"."buckets_analytics";
DROP TABLE IF EXISTS "storage"."buckets";
DROP TABLE IF EXISTS "public"."special_item_rates";
DROP TABLE IF EXISTS "public"."profiles";
DROP TABLE IF EXISTS "public"."orders";
DROP TABLE IF EXISTS "public"."order_items";
DROP TABLE IF EXISTS "public"."laundry_settings";
DROP TABLE IF EXISTS "public"."laundry_items";
DROP TABLE IF EXISTS "public"."daily_analytics_snapshots";
DROP TABLE IF EXISTS "public"."customers";
DROP TABLE IF EXISTS "public"."branches";
DROP TABLE IF EXISTS "public"."bill_sequences";
DROP TABLE IF EXISTS "auth"."users";
DROP TABLE IF EXISTS "auth"."sso_providers";
DROP TABLE IF EXISTS "auth"."sso_domains";
DROP TABLE IF EXISTS "auth"."sessions";
DROP TABLE IF EXISTS "auth"."schema_migrations";
DROP TABLE IF EXISTS "auth"."saml_relay_states";
DROP TABLE IF EXISTS "auth"."saml_providers";
DROP SEQUENCE IF EXISTS "auth"."refresh_tokens_id_seq";
DROP TABLE IF EXISTS "auth"."refresh_tokens";
DROP TABLE IF EXISTS "auth"."one_time_tokens";
DROP TABLE IF EXISTS "auth"."oauth_consents";
DROP TABLE IF EXISTS "auth"."oauth_clients";
DROP TABLE IF EXISTS "auth"."oauth_client_states";
DROP TABLE IF EXISTS "auth"."oauth_authorizations";
DROP TABLE IF EXISTS "auth"."mfa_factors";
DROP TABLE IF EXISTS "auth"."mfa_challenges";
DROP TABLE IF EXISTS "auth"."mfa_amr_claims";
DROP TABLE IF EXISTS "auth"."instances";
DROP TABLE IF EXISTS "auth"."identities";
DROP TABLE IF EXISTS "auth"."flow_state";
DROP TABLE IF EXISTS "auth"."audit_log_entries";
DROP FUNCTION IF EXISTS "storage"."update_updated_at_column"();
DROP FUNCTION IF EXISTS "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer, "levels" integer, "start_after" "text", "sort_order" "text", "sort_column" "text", "sort_column_after" "text");
DROP FUNCTION IF EXISTS "storage"."search_v1_optimised"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text");
DROP FUNCTION IF EXISTS "storage"."search_legacy_v1"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text");
DROP FUNCTION IF EXISTS "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text");
DROP FUNCTION IF EXISTS "storage"."prefixes_insert_trigger"();
DROP FUNCTION IF EXISTS "storage"."prefixes_delete_cleanup"();
DROP FUNCTION IF EXISTS "storage"."operation"();
DROP FUNCTION IF EXISTS "storage"."objects_update_prefix_trigger"();
DROP FUNCTION IF EXISTS "storage"."objects_update_level_trigger"();
DROP FUNCTION IF EXISTS "storage"."objects_update_cleanup"();
DROP FUNCTION IF EXISTS "storage"."objects_insert_prefix_trigger"();
DROP FUNCTION IF EXISTS "storage"."objects_delete_cleanup"();
DROP FUNCTION IF EXISTS "storage"."lock_top_prefixes"("bucket_ids" "text"[], "names" "text"[]);
DROP FUNCTION IF EXISTS "storage"."list_objects_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "start_after" "text", "next_token" "text");
DROP FUNCTION IF EXISTS "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "next_key_token" "text", "next_upload_token" "text");
DROP FUNCTION IF EXISTS "storage"."get_size_by_bucket"();
DROP FUNCTION IF EXISTS "storage"."get_prefixes"("name" "text");
DROP FUNCTION IF EXISTS "storage"."get_prefix"("name" "text");
DROP FUNCTION IF EXISTS "storage"."get_level"("name" "text");
DROP FUNCTION IF EXISTS "storage"."foldername"("name" "text");
DROP FUNCTION IF EXISTS "storage"."filename"("name" "text");
DROP FUNCTION IF EXISTS "storage"."extension"("name" "text");
DROP FUNCTION IF EXISTS "storage"."enforce_bucket_name_length"();
DROP FUNCTION IF EXISTS "storage"."delete_prefix_hierarchy_trigger"();
DROP FUNCTION IF EXISTS "storage"."delete_prefix"("_bucket_id" "text", "_name" "text");
DROP FUNCTION IF EXISTS "storage"."delete_leaf_prefixes"("bucket_ids" "text"[], "names" "text"[]);
DROP FUNCTION IF EXISTS "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb");
DROP FUNCTION IF EXISTS "storage"."add_prefixes"("_bucket_id" "text", "_name" "text");
DROP FUNCTION IF EXISTS "public"."update_daily_analytics"("target_date" "date");
DROP FUNCTION IF EXISTS "public"."search_orders_v1"("p_branch_id" "uuid", "p_search_term" "text");
DROP FUNCTION IF EXISTS "public"."mark_bill_as_delivered"("target_bill_id" "uuid");
DROP FUNCTION IF EXISTS "public"."handle_new_user"();
DROP FUNCTION IF EXISTS "public"."get_my_role"();
DROP FUNCTION IF EXISTS "public"."generate_smart_tag"("p_branch_id" "uuid");
DROP FUNCTION IF EXISTS "public"."generate_daily_snapshot"("target_date" "date");
DROP FUNCTION IF EXISTS "public"."generate_bill_id"();
DROP FUNCTION IF EXISTS "public"."create_full_order"("p_branch_id" "uuid", "p_customer_phone" "text", "p_customer_name" "text", "p_customer_address" "text", "p_order_details" "jsonb", "p_items" "jsonb");
DROP FUNCTION IF EXISTS "auth"."uid"();
DROP FUNCTION IF EXISTS "auth"."role"();
DROP FUNCTION IF EXISTS "auth"."jwt"();
DROP FUNCTION IF EXISTS "auth"."email"();
DROP TYPE IF EXISTS "storage"."buckettype";
DROP TYPE IF EXISTS "public"."order_status";
DROP TYPE IF EXISTS "public"."billing_mode";
DROP TYPE IF EXISTS "public"."bill_status_type";
DROP TYPE IF EXISTS "public"."app_role";
DROP TYPE IF EXISTS "auth"."one_time_token_type";
DROP TYPE IF EXISTS "auth"."oauth_response_type";
DROP TYPE IF EXISTS "auth"."oauth_registration_type";
DROP TYPE IF EXISTS "auth"."oauth_client_type";
DROP TYPE IF EXISTS "auth"."oauth_authorization_status";
DROP TYPE IF EXISTS "auth"."factor_type";
DROP TYPE IF EXISTS "auth"."factor_status";
DROP TYPE IF EXISTS "auth"."code_challenge_method";
DROP TYPE IF EXISTS "auth"."aal_level";
DROP SCHEMA IF EXISTS "storage";
DROP SCHEMA IF EXISTS "public";
DROP SCHEMA IF EXISTS "auth";
--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA "auth";


ALTER SCHEMA "auth" OWNER TO "supabase_admin";

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";

--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA "storage";


ALTER SCHEMA "storage" OWNER TO "supabase_admin";

--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."aal_level" AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE "auth"."aal_level" OWNER TO "supabase_auth_admin";

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."code_challenge_method" AS ENUM (
    's256',
    'plain'
);


ALTER TYPE "auth"."code_challenge_method" OWNER TO "supabase_auth_admin";

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."factor_status" AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE "auth"."factor_status" OWNER TO "supabase_auth_admin";

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."factor_type" AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE "auth"."factor_type" OWNER TO "supabase_auth_admin";

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."oauth_authorization_status" AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE "auth"."oauth_authorization_status" OWNER TO "supabase_auth_admin";

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."oauth_client_type" AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE "auth"."oauth_client_type" OWNER TO "supabase_auth_admin";

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."oauth_registration_type" AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE "auth"."oauth_registration_type" OWNER TO "supabase_auth_admin";

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."oauth_response_type" AS ENUM (
    'code'
);


ALTER TYPE "auth"."oauth_response_type" OWNER TO "supabase_auth_admin";

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."one_time_token_type" AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE "auth"."one_time_token_type" OWNER TO "supabase_auth_admin";

--
-- Name: app_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."app_role" AS ENUM (
    'ADMIN',
    'AUTH_USER',
    'USER'
);


ALTER TYPE "public"."app_role" OWNER TO "postgres";

--
-- Name: bill_status_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."bill_status_type" AS ENUM (
    'OPEN',
    'CLOSED',
    'RECORD',
    'ARCHIVED'
);


ALTER TYPE "public"."bill_status_type" OWNER TO "postgres";

--
-- Name: billing_mode; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."billing_mode" AS ENUM (
    'PER_KG',
    'PER_PIECE'
);


ALTER TYPE "public"."billing_mode" OWNER TO "postgres";

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."order_status" AS ENUM (
    'RECEIVED',
    'IN_PROCESS',
    'READY',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE "public"."order_status" OWNER TO "postgres";

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE "storage"."buckettype" AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE "storage"."buckettype" OWNER TO "supabase_storage_admin";

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION "auth"."email"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION "auth"."email"() OWNER TO "supabase_auth_admin";

--
-- Name: FUNCTION "email"(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION "auth"."email"() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION "auth"."jwt"() RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION "auth"."jwt"() OWNER TO "supabase_auth_admin";

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION "auth"."role"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION "auth"."role"() OWNER TO "supabase_auth_admin";

--
-- Name: FUNCTION "role"(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION "auth"."role"() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION "auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION "auth"."uid"() OWNER TO "supabase_auth_admin";

--
-- Name: FUNCTION "uid"(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION "auth"."uid"() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: create_full_order("uuid", "text", "text", "text", "jsonb", "jsonb"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."create_full_order"("p_branch_id" "uuid", "p_customer_phone" "text", "p_customer_name" "text", "p_customer_address" "text", "p_order_details" "jsonb", "p_items" "jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_customer_id uuid;
  v_order_id uuid;
  v_seq_int integer;
  v_seq_str text;
  v_branch_code text;
  v_display_mmyy text;
  v_bill_id text;
  v_item jsonb;
  
  -- Logic Variables
  v_temp integer;
  v_num integer;
  v_char_code integer;
  v_c1 integer;
  v_c2 integer;
  
  -- Limits
  v_limit_1 integer := 1000; 
  v_limit_2 integer := 27000;
  v_max_seq integer := 94600;

BEGIN
  -- 1. Customer Upsert
  INSERT INTO customers (phone, name, address)
  VALUES (p_customer_phone, p_customer_name, p_customer_address)
  ON CONFLICT (phone) DO UPDATE 
  SET name = EXCLUDED.name, address = COALESCE(NULLIF(EXCLUDED.address, ''), customers.address)
  RETURNING id INTO v_customer_id;

  -- 2. Get Branch Info
  SELECT code INTO v_branch_code FROM branches WHERE id = p_branch_id;
  v_display_mmyy := to_char(now(), 'MMYY'); 

  -- 3. SEQUENCE UPDATE
  INSERT INTO bill_sequences (branch_id, month_year, last_seq)
  VALUES (p_branch_id, 'GLOBAL_SEQ', 0)
  ON CONFLICT (branch_id, month_year) DO NOTHING;

  UPDATE bill_sequences
  SET last_seq = CASE 
    WHEN last_seq >= v_max_seq THEN 1 
    ELSE last_seq + 1 
  END
  WHERE branch_id = p_branch_id AND month_year = 'GLOBAL_SEQ'
  RETURNING last_seq INTO v_seq_int;

  -- 4. ID FORMATTING
  v_temp := v_seq_int - 1;

  IF v_temp < v_limit_1 THEN
    v_seq_str := lpad(v_temp::text, 4, '0');
  ELSIF v_temp < v_limit_2 THEN
    v_temp := v_temp - v_limit_1;
    v_char_code := v_temp / 1000;
    v_num := v_temp % 1000;
    v_seq_str := lpad(v_num::text, 3, '0') || chr(65 + v_char_code);
  ELSE
    v_temp := v_temp - v_limit_2;
    v_char_code := v_temp / 100;
    v_c1 := v_char_code / 26;
    v_c2 := v_char_code % 26;
    v_num := v_temp % 100;
    v_seq_str := lpad(v_num::text, 2, '0') || chr(65 + v_c1) || chr(65 + v_c2);
  END IF;

  v_bill_id := v_branch_code || '-' || v_display_mmyy || '-' || v_seq_str;

  -- 5. Insert Order (UPDATED WITH TOTAL_WEIGHT)
  INSERT INTO orders (
    branch_id, customer_id, readable_bill_id, total_amount, discount_amount,
    final_amount, payment_status, payment_method, delivery_mode,
    due_date, created_by, closed_by, completed_at, bill_status, 
    total_piece_count, total_weight, status, amount_paid  -- <--- Added total_weight here
  )
  VALUES (
    p_branch_id, v_customer_id, v_bill_id,
    (p_order_details->>'total_amount')::numeric,
    (p_order_details->>'discount_amount')::numeric,
    (p_order_details->>'final_amount')::numeric,
    p_order_details->>'payment_status',
    p_order_details->>'payment_method',
    p_order_details->>'delivery_mode',
    (p_order_details->>'due_date')::timestamp with time zone,
    (p_order_details->>'created_by')::uuid,
    (p_order_details->>'closed_by')::uuid,
    (p_order_details->>'completed_at')::timestamp with time zone,
    COALESCE((p_order_details->>'bill_status')::bill_status_type, 'OPEN'),
    COALESCE((p_order_details->>'total_piece_count')::int, 0),
    COALESCE((p_order_details->>'total_weight')::numeric, 0), -- <--- Added value extraction here
    COALESCE(p_order_details->>'status', 'RECEIVED'),
    CASE WHEN (p_order_details->>'payment_status') = 'PAID' THEN (p_order_details->>'final_amount')::numeric ELSE 0 END
  )
  RETURNING id INTO v_order_id;

  -- 6. Insert Items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO order_items (
      order_id, item_id, item_name_snapshot, service_type,
      quantity, weight_kg, unit_price, total_price, is_chargeable
    )
    VALUES (
      v_order_id, (v_item->>'item_id')::uuid, v_item->>'item_name_snapshot',
      v_item->>'service_type', (v_item->>'quantity')::int, (v_item->>'weight_kg')::numeric,
      (v_item->>'unit_price')::numeric, (v_item->>'total_price')::numeric,
      COALESCE((v_item->>'is_chargeable')::boolean, true)
    );
  END LOOP;

  RETURN v_order_id;
END;
$$;


ALTER FUNCTION "public"."create_full_order"("p_branch_id" "uuid", "p_customer_phone" "text", "p_customer_name" "text", "p_customer_address" "text", "p_order_details" "jsonb", "p_items" "jsonb") OWNER TO "postgres";

--
-- Name: generate_bill_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."generate_bill_id"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_branch_code text;
    v_mmyy text;
    v_seq integer;
    v_new_id text;
BEGIN
    -- 1. Find the Branch Code (e.g., "SH01" or "DEMO-01")
    SELECT code INTO v_branch_code 
    FROM public.branches 
    WHERE id = NEW.branch_id;

    -- Safety check: If branch code is missing, use "GEN" (Generic)
    IF v_branch_code IS NULL THEN
        v_branch_code := 'GEN';
    END IF;

    -- 2. Get the current Month+Year (e.g., "1225" for Dec 2025)
    v_mmyy := to_char(now(), 'MMYY');

    -- 3. Update the Sequence Table
    -- This tries to insert a "1". If "1225" already exists, it adds +1 to the old number.
    INSERT INTO public.bill_sequences (branch_id, month_year, last_seq)
    VALUES (NEW.branch_id, v_mmyy, 1)
    ON CONFLICT (branch_id, month_year) 
    DO UPDATE SET last_seq = bill_sequences.last_seq + 1
    RETURNING last_seq INTO v_seq;

    -- 4. Format the ID: "CODE-MMYY-0000"
    -- lpad(..., 4, '0') makes sure '1' becomes '0001'
    v_new_id := v_branch_code || '-' || v_mmyy || '-' || lpad(v_seq::text, 4, '0');

    -- 5. Stamp the new ID onto the order row
    NEW.readable_bill_id := v_new_id;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."generate_bill_id"() OWNER TO "postgres";

--
-- Name: generate_daily_snapshot("date"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."generate_daily_snapshot"("target_date" "date" DEFAULT (CURRENT_DATE - '1 day'::interval)) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  r_branch record;
  v_total_sales numeric;
  v_total_revenue numeric;
  v_orders_created int;
  v_orders_completed int;
  v_total_load numeric;
  v_total_pieces int;
  v_new_customers int;
begin
  for r_branch in select id from branches where is_active = true loop
    
    -- 1. Sales & Orders
    select coalesce(sum(final_amount), 0), count(id), coalesce(sum(total_piece_count), 0)
    into v_total_sales, v_orders_created, v_total_pieces
    from orders
    where branch_id = r_branch.id
    and date(created_at) = target_date;

    -- 2. Revenue (Cash In)
    select coalesce(sum(amount_paid), 0), count(id)
    into v_total_revenue, v_orders_completed
    from orders
    where branch_id = r_branch.id
    and date(completed_at) = target_date
    and status = 'DELIVERED';

    -- 3. Load (Weight)
    select coalesce(sum(oi.weight_kg), 0)
    into v_total_load
    from order_items oi
    join orders o on oi.order_id = o.id
    where o.branch_id = r_branch.id
    and date(o.created_at) = target_date;

    -- 4. New Customers (FIXED LOGIC)
    -- Counts customers created on this date who have at least one order in this branch
    select count(distinct c.id)
    into v_new_customers
    from customers c
    join orders o on c.id = o.customer_id
    where o.branch_id = r_branch.id
    and date(c.created_at) = target_date;

    -- 5. Upsert Snapshot
    insert into daily_analytics_snapshots (
      branch_id, date, 
      total_sales, total_revenue, 
      orders_created, orders_completed, 
      total_load_kg, total_pieces,
      new_customers, updated_at
    )
    values (
      r_branch.id, target_date,
      v_total_sales, v_total_revenue,
      v_orders_created, v_orders_completed,
      v_total_load, v_total_pieces,
      v_new_customers, now()
    )
    on conflict (branch_id, date) do update set
      total_sales = excluded.total_sales,
      total_revenue = excluded.total_revenue,
      orders_created = excluded.orders_created,
      orders_completed = excluded.orders_completed,
      total_load_kg = excluded.total_load_kg,
      total_pieces = excluded.total_pieces,
      new_customers = excluded.new_customers,
      updated_at = now();
      
  end loop;
end;
$$;


ALTER FUNCTION "public"."generate_daily_snapshot"("target_date" "date") OWNER TO "postgres";

--
-- Name: generate_smart_tag("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."generate_smart_tag"("p_branch_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_seq_key  text := 'cycle_1'; -- Static global key for continuous counting
  v_new_seq  integer;
  v_num_part integer;
  v_char_part text;
  v_max_seq  integer := 25974; -- 999 numbers * 26 letters (A-Z)
BEGIN
  -- 1. ATOMIC UPSERT
  -- We insert or update in a SINGLE step. The database locks the row, 
  -- calculates the new value (checking for wrap-around), and returns it.
  -- This makes race conditions impossible.
  INSERT INTO public.bill_sequences (branch_id, month_year, last_seq)
  VALUES (p_branch_id, v_seq_key, 1)
  ON CONFLICT (branch_id, month_year)
  DO UPDATE
     SET last_seq = CASE
                      -- If we hit the max (999Z), reset to 1 immediately in the same transaction
                      WHEN bill_sequences.last_seq >= v_max_seq THEN 1
                      ELSE bill_sequences.last_seq + 1
                    END
  RETURNING last_seq INTO v_new_seq;

  -- 2. Convert Sequence to Tag (123A format)
  -- Math: Groups of 999. (Seq 1-999 = A, 1000-1998 = B...)
  v_num_part := ((v_new_seq - 1) % 999) + 1;
  
  -- ASCII Logic: 65 is 'A'. 
  -- We perform integer division to find which "Letter Group" we are in.
  v_char_part := chr(65 + ((v_new_seq - 1) / 999)::int);

  -- 3. Return Format: "333A"
  RETURN v_num_part || v_char_part;
END;
$$;


ALTER FUNCTION "public"."generate_smart_tag"("p_branch_id" "uuid") OWNER TO "postgres";

--
-- Name: get_my_role(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_my_role"() RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  );
END;
$$;


ALTER FUNCTION "public"."get_my_role"() OWNER TO "postgres";

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'USER'::public.app_role);
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

--
-- Name: mark_bill_as_delivered("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."mark_bill_as_delivered"("target_bill_id" "uuid") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_order_record record;
    v_user_id uuid;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    UPDATE public.orders
    SET 
        status = 'DELIVERED',
        payment_status = 'PAID',
        -- vvvv FIX IS HERE vvvv
        bill_status = 'CLOSED'::bill_status_type, 
        -- ^^^^ Explicitly cast text to your Enum Type ^^^^
        is_open = false,
        completed_at = now(),
        closed_by = v_user_id, -- Accurately captures who scanned/closed it
        amount_paid = final_amount
    WHERE id = target_bill_id
    RETURNING * INTO v_order_record;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    RETURN to_json(v_order_record);
END;
$$;


ALTER FUNCTION "public"."mark_bill_as_delivered"("target_bill_id" "uuid") OWNER TO "postgres";

--
-- Name: search_orders_v1("uuid", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."search_orders_v1"("p_branch_id" "uuid", "p_search_term" "text") RETURNS TABLE("id" "uuid", "readable_bill_id" "text", "total_amount" numeric, "final_amount" numeric, "amount_paid" numeric, "payment_status" "text", "is_open" boolean, "delivery_mode" "text", "created_at" timestamp with time zone, "due_date" timestamp with time zone, "status" "text", "notes" "text", "total_piece_count" integer, "customer_name" "text", "customer_phone" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.readable_bill_id,
    o.total_amount,
    o.final_amount,
    o.amount_paid,
    o.payment_status,
    o.is_open,
    o.delivery_mode,
    o.created_at,
    o.due_date,
    o.status,
    o.notes,
    o.total_piece_count,
    c.name as customer_name,
    c.phone as customer_phone
  FROM public.orders o
  JOIN public.customers c ON o.customer_id = c.id
  WHERE o.branch_id = p_branch_id
  AND (
    -- Search Logic: Matches Bill ID, Name, or Phone
    o.readable_bill_id ILIKE '%' || p_search_term || '%' OR
    c.name ILIKE '%' || p_search_term || '%' OR
    c.phone ILIKE '%' || p_search_term || '%'
  )
  ORDER BY o.created_at DESC
  LIMIT 50; -- Limit results for performance
END;
$$;


ALTER FUNCTION "public"."search_orders_v1"("p_branch_id" "uuid", "p_search_term" "text") OWNER TO "postgres";

--
-- Name: update_daily_analytics("date"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."update_daily_analytics"("target_date" "date" DEFAULT (CURRENT_DATE - 1)) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  r_branch record;
  v_total_sales numeric;
  v_total_revenue numeric;
  v_orders_created int;
  v_orders_completed int;
  v_total_load numeric;
  v_total_pieces int;
  v_new_customers int;
begin
  -- Loop through all active branches
  for r_branch in select id from branches where is_active = true loop
    
    -- 1. Sales & Orders (Created on target_date)
    select coalesce(sum(final_amount), 0), count(id), coalesce(sum(total_piece_count), 0)
    into v_total_sales, v_orders_created, v_total_pieces
    from orders
    where branch_id = r_branch.id
    and date(created_at) = target_date;

    -- 2. Revenue (Completed/Paid on target_date)
    select coalesce(sum(amount_paid), 0), count(id)
    into v_total_revenue, v_orders_completed
    from orders
    where branch_id = r_branch.id
    and date(completed_at) = target_date
    and status = 'DELIVERED';

    -- 3. Load (Weight of orders created on target_date)
    select coalesce(sum(oi.weight_kg), 0)
    into v_total_load
    from order_items oi
    join orders o on oi.order_id = o.id
    where o.branch_id = r_branch.id
    and date(o.created_at) = target_date;

    -- 4. New Customers
    select count(distinct c.id)
    into v_new_customers
    from customers c
    join orders o on c.id = o.customer_id
    where o.branch_id = r_branch.id
    and date(c.created_at) = target_date;

    -- 5. Upsert Snapshot
    insert into daily_analytics_snapshots (
      branch_id, date, 
      total_sales, total_revenue, 
      orders_created, orders_completed, 
      total_load_kg, total_pieces,
      new_customers, updated_at
    )
    values (
      r_branch.id, target_date,
      v_total_sales, v_total_revenue,
      v_orders_created, v_orders_completed,
      v_total_load, v_total_pieces,
      v_new_customers, now()
    )
    on conflict (branch_id, date) do update set
      total_sales = excluded.total_sales,
      total_revenue = excluded.total_revenue,
      orders_created = excluded.orders_created,
      orders_completed = excluded.orders_completed,
      total_load_kg = excluded.total_load_kg,
      total_pieces = excluded.total_pieces,
      new_customers = excluded.new_customers,
      updated_at = now();
      
  end loop;
end;
$$;


ALTER FUNCTION "public"."update_daily_analytics"("target_date" "date") OWNER TO "postgres";

--
-- Name: add_prefixes("text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."add_prefixes"("_bucket_id" "text", "_name" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION "storage"."add_prefixes"("_bucket_id" "text", "_name" "text") OWNER TO "supabase_storage_admin";

--
-- Name: can_insert_object("text", "text", "uuid", "jsonb"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb") OWNER TO "supabase_storage_admin";

--
-- Name: delete_leaf_prefixes("text"[], "text"[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."delete_leaf_prefixes"("bucket_ids" "text"[], "names" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION "storage"."delete_leaf_prefixes"("bucket_ids" "text"[], "names" "text"[]) OWNER TO "supabase_storage_admin";

--
-- Name: delete_prefix("text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."delete_prefix"("_bucket_id" "text", "_name" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION "storage"."delete_prefix"("_bucket_id" "text", "_name" "text") OWNER TO "supabase_storage_admin";

--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."delete_prefix_hierarchy_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION "storage"."delete_prefix_hierarchy_trigger"() OWNER TO "supabase_storage_admin";

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."enforce_bucket_name_length"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION "storage"."enforce_bucket_name_length"() OWNER TO "supabase_storage_admin";

--
-- Name: extension("text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."extension"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION "storage"."extension"("name" "text") OWNER TO "supabase_storage_admin";

--
-- Name: filename("text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."filename"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION "storage"."filename"("name" "text") OWNER TO "supabase_storage_admin";

--
-- Name: foldername("text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."foldername"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION "storage"."foldername"("name" "text") OWNER TO "supabase_storage_admin";

--
-- Name: get_level("text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."get_level"("name" "text") RETURNS integer
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION "storage"."get_level"("name" "text") OWNER TO "supabase_storage_admin";

--
-- Name: get_prefix("text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."get_prefix"("name" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION "storage"."get_prefix"("name" "text") OWNER TO "supabase_storage_admin";

--
-- Name: get_prefixes("text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."get_prefixes"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION "storage"."get_prefixes"("name" "text") OWNER TO "supabase_storage_admin";

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."get_size_by_bucket"() RETURNS TABLE("size" bigint, "bucket_id" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION "storage"."get_size_by_bucket"() OWNER TO "supabase_storage_admin";

--
-- Name: list_multipart_uploads_with_delimiter("text", "text", "text", integer, "text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "next_key_token" "text" DEFAULT ''::"text", "next_upload_token" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "id" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "next_key_token" "text", "next_upload_token" "text") OWNER TO "supabase_storage_admin";

--
-- Name: list_objects_with_delimiter("text", "text", "text", integer, "text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."list_objects_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "start_after" "text" DEFAULT ''::"text", "next_token" "text" DEFAULT ''::"text") RETURNS TABLE("name" "text", "id" "uuid", "metadata" "jsonb", "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION "storage"."list_objects_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "start_after" "text", "next_token" "text") OWNER TO "supabase_storage_admin";

--
-- Name: lock_top_prefixes("text"[], "text"[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."lock_top_prefixes"("bucket_ids" "text"[], "names" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


ALTER FUNCTION "storage"."lock_top_prefixes"("bucket_ids" "text"[], "names" "text"[]) OWNER TO "supabase_storage_admin";

--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."objects_delete_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION "storage"."objects_delete_cleanup"() OWNER TO "supabase_storage_admin";

--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."objects_insert_prefix_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION "storage"."objects_insert_prefix_trigger"() OWNER TO "supabase_storage_admin";

--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."objects_update_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION "storage"."objects_update_cleanup"() OWNER TO "supabase_storage_admin";

--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."objects_update_level_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "storage"."objects_update_level_trigger"() OWNER TO "supabase_storage_admin";

--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."objects_update_prefix_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION "storage"."objects_update_prefix_trigger"() OWNER TO "supabase_storage_admin";

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."operation"() RETURNS "text"
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION "storage"."operation"() OWNER TO "supabase_storage_admin";

--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."prefixes_delete_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION "storage"."prefixes_delete_cleanup"() OWNER TO "supabase_storage_admin";

--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."prefixes_insert_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION "storage"."prefixes_insert_trigger"() OWNER TO "supabase_storage_admin";

--
-- Name: search("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text") OWNER TO "supabase_storage_admin";

--
-- Name: search_legacy_v1("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."search_legacy_v1"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION "storage"."search_legacy_v1"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text") OWNER TO "supabase_storage_admin";

--
-- Name: search_v1_optimised("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."search_v1_optimised"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION "storage"."search_v1_optimised"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text") OWNER TO "supabase_storage_admin";

--
-- Name: search_v2("text", "text", integer, integer, "text", "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "start_after" "text" DEFAULT ''::"text", "sort_order" "text" DEFAULT 'asc'::"text", "sort_column" "text" DEFAULT 'name'::"text", "sort_column_after" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


ALTER FUNCTION "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer, "levels" integer, "start_after" "text", "sort_order" "text", "sort_column" "text", "sort_column_after" "text") OWNER TO "supabase_storage_admin";

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION "storage"."update_updated_at_column"() OWNER TO "supabase_storage_admin";

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."audit_log_entries" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "payload" json,
    "created_at" timestamp with time zone,
    "ip_address" character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE "auth"."audit_log_entries" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "audit_log_entries"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."audit_log_entries" IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."flow_state" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid",
    "auth_code" "text" NOT NULL,
    "code_challenge_method" "auth"."code_challenge_method" NOT NULL,
    "code_challenge" "text" NOT NULL,
    "provider_type" "text" NOT NULL,
    "provider_access_token" "text",
    "provider_refresh_token" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" "text" NOT NULL,
    "auth_code_issued_at" timestamp with time zone
);


ALTER TABLE "auth"."flow_state" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "flow_state"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."flow_state" IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."identities" (
    "provider_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "identity_data" "jsonb" NOT NULL,
    "provider" "text" NOT NULL,
    "last_sign_in_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "email" "text" GENERATED ALWAYS AS ("lower"(("identity_data" ->> 'email'::"text"))) STORED,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "auth"."identities" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "identities"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."identities" IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN "identities"."email"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."identities"."email" IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."instances" (
    "id" "uuid" NOT NULL,
    "uuid" "uuid",
    "raw_base_config" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


ALTER TABLE "auth"."instances" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "instances"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."instances" IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."mfa_amr_claims" (
    "session_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "authentication_method" "text" NOT NULL,
    "id" "uuid" NOT NULL
);


ALTER TABLE "auth"."mfa_amr_claims" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "mfa_amr_claims"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."mfa_amr_claims" IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."mfa_challenges" (
    "id" "uuid" NOT NULL,
    "factor_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "verified_at" timestamp with time zone,
    "ip_address" "inet" NOT NULL,
    "otp_code" "text",
    "web_authn_session_data" "jsonb"
);


ALTER TABLE "auth"."mfa_challenges" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "mfa_challenges"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."mfa_challenges" IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."mfa_factors" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "friendly_name" "text",
    "factor_type" "auth"."factor_type" NOT NULL,
    "status" "auth"."factor_status" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "secret" "text",
    "phone" "text",
    "last_challenged_at" timestamp with time zone,
    "web_authn_credential" "jsonb",
    "web_authn_aaguid" "uuid",
    "last_webauthn_challenge_data" "jsonb"
);


ALTER TABLE "auth"."mfa_factors" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "mfa_factors"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."mfa_factors" IS 'auth: stores metadata about factors';


--
-- Name: COLUMN "mfa_factors"."last_webauthn_challenge_data"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."mfa_factors"."last_webauthn_challenge_data" IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."oauth_authorizations" (
    "id" "uuid" NOT NULL,
    "authorization_id" "text" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "redirect_uri" "text" NOT NULL,
    "scope" "text" NOT NULL,
    "state" "text",
    "resource" "text",
    "code_challenge" "text",
    "code_challenge_method" "auth"."code_challenge_method",
    "response_type" "auth"."oauth_response_type" DEFAULT 'code'::"auth"."oauth_response_type" NOT NULL,
    "status" "auth"."oauth_authorization_status" DEFAULT 'pending'::"auth"."oauth_authorization_status" NOT NULL,
    "authorization_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '00:03:00'::interval) NOT NULL,
    "approved_at" timestamp with time zone,
    "nonce" "text",
    CONSTRAINT "oauth_authorizations_authorization_code_length" CHECK (("char_length"("authorization_code") <= 255)),
    CONSTRAINT "oauth_authorizations_code_challenge_length" CHECK (("char_length"("code_challenge") <= 128)),
    CONSTRAINT "oauth_authorizations_expires_at_future" CHECK (("expires_at" > "created_at")),
    CONSTRAINT "oauth_authorizations_nonce_length" CHECK (("char_length"("nonce") <= 255)),
    CONSTRAINT "oauth_authorizations_redirect_uri_length" CHECK (("char_length"("redirect_uri") <= 2048)),
    CONSTRAINT "oauth_authorizations_resource_length" CHECK (("char_length"("resource") <= 2048)),
    CONSTRAINT "oauth_authorizations_scope_length" CHECK (("char_length"("scope") <= 4096)),
    CONSTRAINT "oauth_authorizations_state_length" CHECK (("char_length"("state") <= 4096))
);


ALTER TABLE "auth"."oauth_authorizations" OWNER TO "supabase_auth_admin";

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."oauth_client_states" (
    "id" "uuid" NOT NULL,
    "provider_type" "text" NOT NULL,
    "code_verifier" "text",
    "created_at" timestamp with time zone NOT NULL
);


ALTER TABLE "auth"."oauth_client_states" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "oauth_client_states"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."oauth_client_states" IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."oauth_clients" (
    "id" "uuid" NOT NULL,
    "client_secret_hash" "text",
    "registration_type" "auth"."oauth_registration_type" NOT NULL,
    "redirect_uris" "text" NOT NULL,
    "grant_types" "text" NOT NULL,
    "client_name" "text",
    "client_uri" "text",
    "logo_uri" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "client_type" "auth"."oauth_client_type" DEFAULT 'confidential'::"auth"."oauth_client_type" NOT NULL,
    CONSTRAINT "oauth_clients_client_name_length" CHECK (("char_length"("client_name") <= 1024)),
    CONSTRAINT "oauth_clients_client_uri_length" CHECK (("char_length"("client_uri") <= 2048)),
    CONSTRAINT "oauth_clients_logo_uri_length" CHECK (("char_length"("logo_uri") <= 2048))
);


ALTER TABLE "auth"."oauth_clients" OWNER TO "supabase_auth_admin";

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."oauth_consents" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "scopes" "text" NOT NULL,
    "granted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "revoked_at" timestamp with time zone,
    CONSTRAINT "oauth_consents_revoked_after_granted" CHECK ((("revoked_at" IS NULL) OR ("revoked_at" >= "granted_at"))),
    CONSTRAINT "oauth_consents_scopes_length" CHECK (("char_length"("scopes") <= 2048)),
    CONSTRAINT "oauth_consents_scopes_not_empty" CHECK (("char_length"(TRIM(BOTH FROM "scopes")) > 0))
);


ALTER TABLE "auth"."oauth_consents" OWNER TO "supabase_auth_admin";

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."one_time_tokens" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token_type" "auth"."one_time_token_type" NOT NULL,
    "token_hash" "text" NOT NULL,
    "relates_to" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "one_time_tokens_token_hash_check" CHECK (("char_length"("token_hash") > 0))
);


ALTER TABLE "auth"."one_time_tokens" OWNER TO "supabase_auth_admin";

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."refresh_tokens" (
    "instance_id" "uuid",
    "id" bigint NOT NULL,
    "token" character varying(255),
    "user_id" character varying(255),
    "revoked" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "parent" character varying(255),
    "session_id" "uuid"
);


ALTER TABLE "auth"."refresh_tokens" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "refresh_tokens"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."refresh_tokens" IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE "auth"."refresh_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "auth"."refresh_tokens_id_seq" OWNER TO "supabase_auth_admin";

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE "auth"."refresh_tokens_id_seq" OWNED BY "auth"."refresh_tokens"."id";


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."saml_providers" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "entity_id" "text" NOT NULL,
    "metadata_xml" "text" NOT NULL,
    "metadata_url" "text",
    "attribute_mapping" "jsonb",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "name_id_format" "text",
    CONSTRAINT "entity_id not empty" CHECK (("char_length"("entity_id") > 0)),
    CONSTRAINT "metadata_url not empty" CHECK ((("metadata_url" = NULL::"text") OR ("char_length"("metadata_url") > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK (("char_length"("metadata_xml") > 0))
);


ALTER TABLE "auth"."saml_providers" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "saml_providers"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."saml_providers" IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."saml_relay_states" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "request_id" "text" NOT NULL,
    "for_email" "text",
    "redirect_to" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "flow_state_id" "uuid",
    CONSTRAINT "request_id not empty" CHECK (("char_length"("request_id") > 0))
);


ALTER TABLE "auth"."saml_relay_states" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "saml_relay_states"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."saml_relay_states" IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."schema_migrations" (
    "version" character varying(255) NOT NULL
);


ALTER TABLE "auth"."schema_migrations" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "schema_migrations"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."schema_migrations" IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."sessions" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "factor_id" "uuid",
    "aal" "auth"."aal_level",
    "not_after" timestamp with time zone,
    "refreshed_at" timestamp without time zone,
    "user_agent" "text",
    "ip" "inet",
    "tag" "text",
    "oauth_client_id" "uuid",
    "refresh_token_hmac_key" "text",
    "refresh_token_counter" bigint,
    "scopes" "text",
    CONSTRAINT "sessions_scopes_length" CHECK (("char_length"("scopes") <= 4096))
);


ALTER TABLE "auth"."sessions" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "sessions"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."sessions" IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN "sessions"."not_after"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."sessions"."not_after" IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN "sessions"."refresh_token_hmac_key"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."sessions"."refresh_token_hmac_key" IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN "sessions"."refresh_token_counter"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."sessions"."refresh_token_counter" IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."sso_domains" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "domain" "text" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK (("char_length"("domain") > 0))
);


ALTER TABLE "auth"."sso_domains" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "sso_domains"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."sso_domains" IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."sso_providers" (
    "id" "uuid" NOT NULL,
    "resource_id" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "disabled" boolean,
    CONSTRAINT "resource_id not empty" CHECK ((("resource_id" = NULL::"text") OR ("char_length"("resource_id") > 0)))
);


ALTER TABLE "auth"."sso_providers" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "sso_providers"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."sso_providers" IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN "sso_providers"."resource_id"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."sso_providers"."resource_id" IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."users" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "aud" character varying(255),
    "role" character varying(255),
    "email" character varying(255),
    "encrypted_password" character varying(255),
    "email_confirmed_at" timestamp with time zone,
    "invited_at" timestamp with time zone,
    "confirmation_token" character varying(255),
    "confirmation_sent_at" timestamp with time zone,
    "recovery_token" character varying(255),
    "recovery_sent_at" timestamp with time zone,
    "email_change_token_new" character varying(255),
    "email_change" character varying(255),
    "email_change_sent_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" "jsonb",
    "raw_user_meta_data" "jsonb",
    "is_super_admin" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "phone" "text" DEFAULT NULL::character varying,
    "phone_confirmed_at" timestamp with time zone,
    "phone_change" "text" DEFAULT ''::character varying,
    "phone_change_token" character varying(255) DEFAULT ''::character varying,
    "phone_change_sent_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone GENERATED ALWAYS AS (LEAST("email_confirmed_at", "phone_confirmed_at")) STORED,
    "email_change_token_current" character varying(255) DEFAULT ''::character varying,
    "email_change_confirm_status" smallint DEFAULT 0,
    "banned_until" timestamp with time zone,
    "reauthentication_token" character varying(255) DEFAULT ''::character varying,
    "reauthentication_sent_at" timestamp with time zone,
    "is_sso_user" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_anonymous" boolean DEFAULT false NOT NULL,
    CONSTRAINT "users_email_change_confirm_status_check" CHECK ((("email_change_confirm_status" >= 0) AND ("email_change_confirm_status" <= 2)))
);


ALTER TABLE "auth"."users" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "users"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."users" IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN "users"."is_sso_user"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."users"."is_sso_user" IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: bill_sequences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."bill_sequences" (
    "branch_id" "uuid" NOT NULL,
    "month_year" "text" NOT NULL,
    "last_seq" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."bill_sequences" OWNER TO "postgres";

--
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."branches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "address" "text",
    "phone" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."branches" OWNER TO "postgres";

--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."customers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "phone" "text" NOT NULL,
    "name" "text" NOT NULL,
    "address" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."customers" OWNER TO "postgres";

--
-- Name: daily_analytics_snapshots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."daily_analytics_snapshots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "branch_id" "uuid" NOT NULL,
    "date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "total_revenue" numeric DEFAULT 0,
    "total_sales" numeric DEFAULT 0,
    "orders_created" integer DEFAULT 0,
    "orders_completed" integer DEFAULT 0,
    "total_load_kg" numeric DEFAULT 0,
    "total_pieces" integer DEFAULT 0,
    "new_customers" integer DEFAULT 0,
    "returning_customers" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."daily_analytics_snapshots" OWNER TO "postgres";

--
-- Name: laundry_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."laundry_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "category" "text" NOT NULL,
    "kind" "text" NOT NULL,
    "default_unit" "text" NOT NULL,
    "notes" "text",
    "display_order" integer DEFAULT 100 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "laundry_items_kind_check" CHECK (("kind" = ANY (ARRAY['WEARABLE_BULK'::"text", 'SPECIAL'::"text"]))),
    CONSTRAINT "laundry_items_unit_check" CHECK (("default_unit" = ANY (ARRAY['PIECE'::"text", 'KG'::"text"])))
);


ALTER TABLE "public"."laundry_items" OWNER TO "postgres";

--
-- Name: laundry_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."laundry_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "branch_id" "uuid" NOT NULL,
    "wf_kg_rate" numeric(10,2) DEFAULT 45.00 NOT NULL,
    "wi_kg_rate" numeric(10,2) DEFAULT 60.00 NOT NULL,
    "iron_only_piece_rate" numeric(10,2) DEFAULT 8.00 NOT NULL,
    "small_order_piece_rate" numeric(10,2) DEFAULT 15.00 NOT NULL,
    "small_order_threshold" integer DEFAULT 3 NOT NULL,
    "blanket_flat_threshold_kg" numeric(10,2) DEFAULT 1.5 NOT NULL,
    "blanket_flat_rate" numeric(10,2) DEFAULT 100.00 NOT NULL,
    "blanket_kg_rate" numeric(10,2) DEFAULT 80.00 NOT NULL,
    "delivery_mode" "text" DEFAULT 'FREE'::"text" NOT NULL,
    "delivery_flat_fee" numeric(10,2) DEFAULT 0 NOT NULL,
    "upi_id" "text",
    "upi_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."laundry_settings" OWNER TO "postgres";

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "item_id" "uuid",
    "item_name_snapshot" "text" NOT NULL,
    "quantity" integer DEFAULT 1 NOT NULL,
    "weight_kg" numeric(5,2),
    "service_type" "text" NOT NULL,
    "unit_price" numeric(10,2) DEFAULT 0 NOT NULL,
    "total_price" numeric(10,2) DEFAULT 0 NOT NULL,
    "is_chargeable" boolean DEFAULT true
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "branch_id" "uuid" NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "readable_bill_id" "text",
    "total_amount" numeric(10,2) DEFAULT 0 NOT NULL,
    "discount_amount" numeric(10,2) DEFAULT 0 NOT NULL,
    "final_amount" numeric(10,2) DEFAULT 0 NOT NULL,
    "amount_paid" numeric(10,2) DEFAULT 0 NOT NULL,
    "payment_status" "text" DEFAULT 'UNPAID'::"text" NOT NULL,
    "is_open" boolean DEFAULT true NOT NULL,
    "delivery_mode" "text" DEFAULT 'PICKUP'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "due_date" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "status" "text" DEFAULT 'RECEIVED'::"text" NOT NULL,
    "payment_method" "text",
    "created_by" "uuid",
    "closed_by" "uuid",
    "bill_status" "public"."bill_status_type" DEFAULT 'OPEN'::"public"."bill_status_type" NOT NULL,
    "total_piece_count" integer DEFAULT 0,
    "total_weight" numeric DEFAULT 0,
    "notes" "text" DEFAULT ''::"text",
    CONSTRAINT "orders_delivery_mode_check" CHECK (("delivery_mode" = ANY (ARRAY['PICKUP'::"text", 'DELIVERY'::"text"]))),
    CONSTRAINT "orders_payment_method_check" CHECK (("payment_method" = ANY (ARRAY['CASH'::"text", 'UPI'::"text", 'OTHER'::"text"]))),
    CONSTRAINT "orders_payment_status_check" CHECK (("payment_status" = ANY (ARRAY['UNPAID'::"text", 'PARTIAL'::"text", 'PAID'::"text"]))),
    CONSTRAINT "orders_status_check" CHECK (("status" = ANY (ARRAY['RECEIVED'::"text", 'IN_PROCESS'::"text", 'READY'::"text", 'DELIVERED'::"text", 'CANCELLED'::"text"])))
);


ALTER TABLE "public"."orders" OWNER TO "postgres";

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "branch_id" "uuid",
    "full_name" "text",
    "role" "public"."app_role" DEFAULT 'USER'::"public"."app_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";

--
-- Name: special_item_rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."special_item_rates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "branch_id" "uuid" NOT NULL,
    "item_id" "uuid" NOT NULL,
    "service_type" "text" NOT NULL,
    "rate_type" "text" NOT NULL,
    "rate_value" numeric(10,2) NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "special_rates_type_check" CHECK (("rate_type" = ANY (ARRAY['PER_PIECE'::"text", 'PER_KG'::"text", 'FLAT'::"text"])))
);


ALTER TABLE "public"."special_item_rates" OWNER TO "postgres";

--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."buckets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "public" boolean DEFAULT false,
    "avif_autodetection" boolean DEFAULT false,
    "file_size_limit" bigint,
    "allowed_mime_types" "text"[],
    "owner_id" "text",
    "type" "storage"."buckettype" DEFAULT 'STANDARD'::"storage"."buckettype" NOT NULL
);


ALTER TABLE "storage"."buckets" OWNER TO "supabase_storage_admin";

--
-- Name: COLUMN "buckets"."owner"; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN "storage"."buckets"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."buckets_analytics" (
    "name" "text" NOT NULL,
    "type" "storage"."buckettype" DEFAULT 'ANALYTICS'::"storage"."buckettype" NOT NULL,
    "format" "text" DEFAULT 'ICEBERG'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "storage"."buckets_analytics" OWNER TO "supabase_storage_admin";

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."buckets_vectors" (
    "id" "text" NOT NULL,
    "type" "storage"."buckettype" DEFAULT 'VECTOR'::"storage"."buckettype" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "storage"."buckets_vectors" OWNER TO "supabase_storage_admin";

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "hash" character varying(40) NOT NULL,
    "executed_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "storage"."migrations" OWNER TO "supabase_storage_admin";

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."objects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bucket_id" "text",
    "name" "text",
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_accessed_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb",
    "path_tokens" "text"[] GENERATED ALWAYS AS ("string_to_array"("name", '/'::"text")) STORED,
    "version" "text",
    "owner_id" "text",
    "user_metadata" "jsonb",
    "level" integer
);


ALTER TABLE "storage"."objects" OWNER TO "supabase_storage_admin";

--
-- Name: COLUMN "objects"."owner"; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN "storage"."objects"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."prefixes" (
    "bucket_id" "text" NOT NULL,
    "name" "text" NOT NULL COLLATE "pg_catalog"."C",
    "level" integer GENERATED ALWAYS AS ("storage"."get_level"("name")) STORED NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "storage"."prefixes" OWNER TO "supabase_storage_admin";

--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."s3_multipart_uploads" (
    "id" "text" NOT NULL,
    "in_progress_size" bigint DEFAULT 0 NOT NULL,
    "upload_signature" "text" NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "version" "text" NOT NULL,
    "owner_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_metadata" "jsonb"
);


ALTER TABLE "storage"."s3_multipart_uploads" OWNER TO "supabase_storage_admin";

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."s3_multipart_uploads_parts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "upload_id" "text" NOT NULL,
    "size" bigint DEFAULT 0 NOT NULL,
    "part_number" integer NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "etag" "text" NOT NULL,
    "owner_id" "text",
    "version" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "storage"."s3_multipart_uploads_parts" OWNER TO "supabase_storage_admin";

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."vector_indexes" (
    "id" "text" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL COLLATE "pg_catalog"."C",
    "bucket_id" "text" NOT NULL,
    "data_type" "text" NOT NULL,
    "dimension" integer NOT NULL,
    "distance_metric" "text" NOT NULL,
    "metadata_configuration" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "storage"."vector_indexes" OWNER TO "supabase_storage_admin";

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."refresh_tokens" ALTER COLUMN "id" SET DEFAULT "nextval"('"auth"."refresh_tokens_id_seq"'::"regclass");


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
c501819a-802e-4366-afc0-192e9fa71627	c501819a-802e-4366-afc0-192e9fa71627	{"sub": "c501819a-802e-4366-afc0-192e9fa71627", "email": "rishabhpatre69@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-12-03 09:04:45.275101+00	2025-12-03 09:04:45.275158+00	2025-12-03 09:04:45.275158+00	af79379c-a30c-454d-abcd-eaa5c7acf59f
89d9a709-b55c-42dc-9783-288b8d3a5695	89d9a709-b55c-42dc-9783-288b8d3a5695	{"sub": "89d9a709-b55c-42dc-9783-288b8d3a5695", "email": "pankajmagar2067@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-12-09 18:42:16.245485+00	2025-12-09 18:42:16.246652+00	2025-12-09 18:42:16.246652+00	e3ce3d68-d94f-42fb-8c28-9fffce10ab3a
1014eb4c-d00e-4446-ba11-c3e690cc58d7	1014eb4c-d00e-4446-ba11-c3e690cc58d7	{"sub": "1014eb4c-d00e-4446-ba11-c3e690cc58d7", "email": "bhavnapatil8767537734@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-12-09 18:45:03.560143+00	2025-12-09 18:45:03.560196+00	2025-12-09 18:45:03.560196+00	7ea48dfc-dfcc-4589-a9d1-450cc467e08e
09204c3d-c198-4dbb-9309-2b7739a56b1f	09204c3d-c198-4dbb-9309-2b7739a56b1f	{"sub": "09204c3d-c198-4dbb-9309-2b7739a56b1f", "email": "demouser@dapbuddy.com", "email_verified": false, "phone_verified": false}	email	2025-12-12 07:52:00.056064+00	2025-12-12 07:52:00.056665+00	2025-12-12 07:52:00.056665+00	4daae9f6-7aa7-4ca7-9917-f848baf9c2c0
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
64c27205-3a43-4d95-b455-e3d0017c692d	2025-12-12 11:38:28.770902+00	2025-12-12 11:38:28.770902+00	password	6b42e4a2-82a9-4fd7-90c1-3a18c79d9060
cd64131e-ed05-4b64-88ea-e450dddace92	2025-12-13 07:10:37.825471+00	2025-12-13 07:10:37.825471+00	password	f45a9a7b-ecf3-41de-9c9b-f47bf0f217be
287ce214-d13e-4cec-93ed-cfad8ded9aba	2025-12-13 17:25:06.850594+00	2025-12-13 17:25:06.850594+00	password	f79b8e0c-6fa3-408e-9950-b6992b14b36e
f99d0b9d-517a-47b5-a026-0898d4eb6157	2025-12-22 06:43:29.487492+00	2025-12-22 06:43:29.487492+00	password	f099298e-f9e2-487f-aba6-eb048306c1c9
1a2fc497-6872-4e5a-ae79-3ce5094d9057	2026-01-16 03:56:02.404614+00	2026-01-16 03:56:02.404614+00	password	67d3badc-af68-4d96-909f-32e35f62b3a4
2499ee78-6710-4e2a-a783-f7f02a5556a3	2026-01-16 09:48:06.119651+00	2026-01-16 09:48:06.119651+00	password	492cd4b5-34f9-4cf1-81a2-675a84b1f8f0
15f817c1-7fd6-439e-a743-0b2ac651a37e	2026-01-16 14:36:53.244383+00	2026-01-16 14:36:53.244383+00	password	8e7a7943-2d70-4ddd-9aeb-e394ea7fe923
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_client_states" ("id", "provider_type", "code_verifier", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type") FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	158	khmwowoxdr5m	09204c3d-c198-4dbb-9309-2b7739a56b1f	t	2025-12-22 06:43:29.442185+00	2025-12-22 08:29:43.854029+00	\N	f99d0b9d-517a-47b5-a026-0898d4eb6157
00000000-0000-0000-0000-000000000000	159	mlsooh7othut	09204c3d-c198-4dbb-9309-2b7739a56b1f	f	2025-12-22 08:29:43.869274+00	2025-12-22 08:29:43.869274+00	khmwowoxdr5m	f99d0b9d-517a-47b5-a026-0898d4eb6157
00000000-0000-0000-0000-000000000000	95	rz4bh3qdjrmu	09204c3d-c198-4dbb-9309-2b7739a56b1f	t	2025-12-12 11:38:28.760352+00	2026-01-03 10:04:23.785987+00	\N	64c27205-3a43-4d95-b455-e3d0017c692d
00000000-0000-0000-0000-000000000000	167	lzinn3ftnarm	09204c3d-c198-4dbb-9309-2b7739a56b1f	f	2026-01-03 10:04:23.821795+00	2026-01-03 10:04:23.821795+00	rz4bh3qdjrmu	64c27205-3a43-4d95-b455-e3d0017c692d
00000000-0000-0000-0000-000000000000	104	cidgvil5rqv7	09204c3d-c198-4dbb-9309-2b7739a56b1f	f	2025-12-13 07:10:37.810163+00	2025-12-13 07:10:37.810163+00	\N	cd64131e-ed05-4b64-88ea-e450dddace92
00000000-0000-0000-0000-000000000000	176	wkafzjcslfij	89d9a709-b55c-42dc-9783-288b8d3a5695	t	2026-01-16 03:56:02.371308+00	2026-01-16 05:29:39.986082+00	\N	1a2fc497-6872-4e5a-ae79-3ce5094d9057
00000000-0000-0000-0000-000000000000	177	nf6cnr27uga7	89d9a709-b55c-42dc-9783-288b8d3a5695	t	2026-01-16 05:29:40.002858+00	2026-01-16 06:33:10.481492+00	wkafzjcslfij	1a2fc497-6872-4e5a-ae79-3ce5094d9057
00000000-0000-0000-0000-000000000000	113	av4cmx4kz5tz	09204c3d-c198-4dbb-9309-2b7739a56b1f	f	2025-12-13 17:25:06.847797+00	2025-12-13 17:25:06.847797+00	\N	287ce214-d13e-4cec-93ed-cfad8ded9aba
00000000-0000-0000-0000-000000000000	178	dxfzpq7r5ooe	89d9a709-b55c-42dc-9783-288b8d3a5695	t	2026-01-16 06:33:10.494396+00	2026-01-16 08:39:22.089627+00	nf6cnr27uga7	1a2fc497-6872-4e5a-ae79-3ce5094d9057
00000000-0000-0000-0000-000000000000	181	2qwpt4qaxxno	89d9a709-b55c-42dc-9783-288b8d3a5695	t	2026-01-16 09:48:06.116617+00	2026-01-16 11:55:26.400018+00	\N	2499ee78-6710-4e2a-a783-f7f02a5556a3
00000000-0000-0000-0000-000000000000	179	3hvvcwp3vgvy	89d9a709-b55c-42dc-9783-288b8d3a5695	t	2026-01-16 08:39:22.119178+00	2026-01-16 12:41:13.623895+00	dxfzpq7r5ooe	1a2fc497-6872-4e5a-ae79-3ce5094d9057
00000000-0000-0000-0000-000000000000	182	iumdqxg5zjbl	89d9a709-b55c-42dc-9783-288b8d3a5695	t	2026-01-16 11:55:26.413712+00	2026-01-16 13:39:22.811679+00	2qwpt4qaxxno	2499ee78-6710-4e2a-a783-f7f02a5556a3
00000000-0000-0000-0000-000000000000	184	wy7rmqkd4ale	89d9a709-b55c-42dc-9783-288b8d3a5695	f	2026-01-16 13:39:22.829953+00	2026-01-16 13:39:22.829953+00	iumdqxg5zjbl	2499ee78-6710-4e2a-a783-f7f02a5556a3
00000000-0000-0000-0000-000000000000	185	jflrof6bfrlb	c501819a-802e-4366-afc0-192e9fa71627	f	2026-01-16 14:36:53.2191+00	2026-01-16 14:36:53.2191+00	\N	15f817c1-7fd6-439e-a743-0b2ac651a37e
00000000-0000-0000-0000-000000000000	183	2s3zj62jqzq7	89d9a709-b55c-42dc-9783-288b8d3a5695	t	2026-01-16 12:41:13.653776+00	2026-01-16 14:52:23.266988+00	3hvvcwp3vgvy	1a2fc497-6872-4e5a-ae79-3ce5094d9057
00000000-0000-0000-0000-000000000000	186	o7rcvjxo7bpa	89d9a709-b55c-42dc-9783-288b8d3a5695	f	2026-01-16 14:52:23.288715+00	2026-01-16 14:52:23.288715+00	2s3zj62jqzq7	1a2fc497-6872-4e5a-ae79-3ce5094d9057
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."schema_migrations" ("version") FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
cd64131e-ed05-4b64-88ea-e450dddace92	09204c3d-c198-4dbb-9309-2b7739a56b1f	2025-12-13 07:10:37.793513+00	2025-12-13 07:10:37.793513+00	\N	aal1	\N	\N	node	13.222.56.114	\N	\N	\N	\N	\N
287ce214-d13e-4cec-93ed-cfad8ded9aba	09204c3d-c198-4dbb-9309-2b7739a56b1f	2025-12-13 17:25:06.837034+00	2025-12-13 17:25:06.837034+00	\N	aal1	\N	\N	node	184.73.62.239	\N	\N	\N	\N	\N
f99d0b9d-517a-47b5-a026-0898d4eb6157	09204c3d-c198-4dbb-9309-2b7739a56b1f	2025-12-22 06:43:29.388994+00	2025-12-22 08:29:43.895826+00	\N	aal1	\N	2025-12-22 08:29:43.895719	node	13.234.12.32	\N	\N	\N	\N	\N
64c27205-3a43-4d95-b455-e3d0017c692d	09204c3d-c198-4dbb-9309-2b7739a56b1f	2025-12-12 11:38:28.735336+00	2026-01-03 10:04:23.851905+00	\N	aal1	\N	2026-01-03 10:04:23.851252	node	44.208.34.119	\N	\N	\N	\N	\N
2499ee78-6710-4e2a-a783-f7f02a5556a3	89d9a709-b55c-42dc-9783-288b8d3a5695	2026-01-16 09:48:06.104626+00	2026-01-16 13:39:22.846311+00	\N	aal1	\N	2026-01-16 13:39:22.846199	node	43.204.97.209	\N	\N	\N	\N	\N
15f817c1-7fd6-439e-a743-0b2ac651a37e	c501819a-802e-4366-afc0-192e9fa71627	2026-01-16 14:36:53.191015+00	2026-01-16 14:36:53.191015+00	\N	aal1	\N	\N	node	49.36.57.203	\N	\N	\N	\N	\N
1a2fc497-6872-4e5a-ae79-3ce5094d9057	89d9a709-b55c-42dc-9783-288b8d3a5695	2026-01-16 03:56:02.32826+00	2026-01-16 14:52:23.315086+00	\N	aal1	\N	2026-01-16 14:52:23.314975	node	13.233.183.41	\N	\N	\N	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	09204c3d-c198-4dbb-9309-2b7739a56b1f	authenticated	authenticated	demouser@dapbuddy.com	$2a$10$m.GK/oPCd4jeOXYdyz/DB.9HoYTq3HnHqj5cg9JdkQFB8OuP5cSom	2025-12-12 07:52:00.068368+00	\N		\N		\N			\N	2025-12-22 06:43:29.387766+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-12-12 07:52:00.027245+00	2026-01-03 10:04:23.844468+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	c501819a-802e-4366-afc0-192e9fa71627	authenticated	authenticated	rishabhpatre69@gmail.com	$2a$10$YSnjelIEZraTYHXPgw4v7elfO1RODOc4aMIvK3MMEpA1iFnVOJBMe	2025-12-03 09:04:45.279615+00	\N		\N		\N			\N	2026-01-16 14:36:53.190874+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-12-03 09:04:45.271655+00	2026-01-16 14:36:53.240055+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	89d9a709-b55c-42dc-9783-288b8d3a5695	authenticated	authenticated	pankajmagar2067@gmail.com	$2a$10$4QJqrj7R5DDtWir5yOsPVuBOSKdoFYt/vg2JZEoSPAjJ.A5XDAuvq	2025-12-09 18:42:16.25793+00	\N		\N		\N			\N	2026-01-16 09:48:06.104512+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-12-09 18:42:16.218935+00	2026-01-16 14:52:23.307066+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	1014eb4c-d00e-4446-ba11-c3e690cc58d7	authenticated	authenticated	bhavnapatil8767537734@gmail.com	$2a$10$buQF9QbxGCcSS4yRWZnWJ.xnc2AqzbaerMl3d9GaQhBMstRNv7HrK	2025-12-09 18:45:03.561854+00	\N		\N		\N			\N	2025-12-09 20:05:24.101469+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-12-09 18:45:03.555359+00	2025-12-10 09:30:06.223881+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: bill_sequences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."bill_sequences" ("branch_id", "month_year", "last_seq") FROM stdin;
820b1e06-4f43-4e90-b2eb-296b97fe5e4f	GLOBAL_SEQ	118
820b1e06-4f43-4e90-b2eb-296b97fe5e4f	0126	18
621d9703-7608-42a9-9a47-777f53c0280a	GLOBAL_SEQ	3
621d9703-7608-42a9-9a47-777f53c0280a	1225	3
820b1e06-4f43-4e90-b2eb-296b97fe5e4f	1225	103
c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	1225	12
c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	GLOBAL_SEQ	14
c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	0126	2
c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	DEC-25	0
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."branches" ("id", "code", "name", "address", "phone", "is_active", "created_at") FROM stdin;
c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	DEMO-01	Pune Main Branch	123 MG Road, Camp, Pune	9876543210	t	2025-12-02 14:14:30.82395+00
a3015513-c6c3-44fb-9551-2dfe25fb0c0a	COL-01	College Road Branch	\N	\N	f	2025-12-02 14:31:18.048825+00
621d9703-7608-42a9-9a47-777f53c0280a	NATH2	Nath Drycleaners	IIIT hostel road, Ambegaon bk. Pune	8793741220/8767537734	t	2025-12-09 18:32:44.894377+00
820b1e06-4f43-4e90-b2eb-296b97fe5e4f	NATH1	Nath Drycleaners	ISMS College road ambegaon bk. pune	8793741220/8767537734	t	2025-12-09 18:32:44.894377+00
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."customers" ("id", "phone", "name", "address", "created_at") FROM stdin;
322e12a8-8ed8-4561-bbfc-e269c94c7e89	9999999999	Test User	\N	2025-12-02 17:54:36.603045+00
a94197aa-cca1-48f2-869b-bcfcf0afee47	1111111111	Krishna 		2025-12-05 13:43:26.048395+00
95aa571d-fbea-4f96-9c5d-829ef9e6b49e	8087634111	Bhagwat 		2025-12-05 14:15:34.67812+00
60539ea4-34c8-49c8-b807-37bbd49019e7	9172712223	Piyush malve		2025-12-05 17:31:42.057779+00
e1ddd55d-4aa5-4f80-9bcc-87c408f7e79b	7776027667	Surya		2025-12-06 09:08:35.448652+00
2bfa83a3-2dda-493f-8071-f983092d7109	9022521918	Ganesh		2025-12-13 02:39:24.418734+00
1342eb70-3a1d-4721-a990-cbcab9cfeac3	9370641665	Kulkarni 		2025-12-13 02:44:08.160489+00
94f9ff7c-2150-48d1-af8e-99efb53d007d	7972369991	Devdatta		2025-12-13 02:56:56.984958+00
74019103-d23f-4343-b2fb-95b95d9053cf	9100022942	Pankaj 		2025-12-13 03:09:01.461084+00
b813fc33-9573-42d1-bc3e-9168c4a3c818	7507050508	Sahil		2025-12-13 04:09:49.673905+00
b161f9af-48b5-46ff-947a-8bea2ad35f67	9923909060	Rushikesh 		2025-12-13 04:24:45.821502+00
fc76bb02-ced1-42d1-9ec9-e3ee6d9457fb	7066740330	Gaurav 		2025-12-08 16:19:54.894567+00
086f7f11-10a9-45b4-aa91-01bbf8fffd1e	9175469245	Chinmay		2025-12-13 04:35:53.923207+00
0eab5357-74ba-459a-aa44-3810a91edab4	8830182149	Pawan		2025-12-13 04:39:07.190624+00
1da642c2-eb36-4919-8bef-0ffc94d3b2d5	8208177516	Sanskar 		2025-12-13 04:43:37.61834+00
56b3b083-9274-4fd5-b303-56a9ac070518	9307318898	Om		2025-12-13 05:41:56.440694+00
cc945b8c-7282-4591-b96a-f7bb0e755bc5	9595596867	Kishor walave		2025-12-13 05:47:06.876077+00
c61f5125-97b1-4165-8009-7f866308336e	7666365662	Ganesh k		2025-12-13 05:49:17.434448+00
f3bbc65f-619a-4f65-a3f8-7e945d2f5f02	7588452562	Viraj 		2025-12-13 06:22:13.477238+00
8fd238bf-ef22-4d07-9d38-99af229a2fde	8080127399	Nilesh pawar		2025-12-13 06:28:02.100765+00
75d7110f-ee14-4135-abc4-854ed90b6d16	9172992643	Ganesh		2025-12-13 06:30:19.68776+00
8f48cbae-58c4-40ca-a001-57d29226602b	7083822269	Priyanshu		2025-12-13 06:52:26.641694+00
3f882a08-eca1-463f-8bcb-cf5107dc0805	7745092269	Prathamesh 		2025-12-13 07:07:00.381699+00
8e96e3fd-ba16-4fa7-bc07-dc65df018be0	9730203515	Shivam		2025-12-13 07:10:14.441719+00
2d54a5b3-1ba2-4b6b-85ef-b1e7e85e375f	7028233509	Mahesh		2025-12-13 07:17:25.966877+00
2b0bedc7-50b5-447f-8ec9-83745148286b	7397979036	Vikrant 		2025-12-13 07:30:13.352799+00
594f7037-8fda-4356-bd4f-4ec66d32da2b	7666125971	Rohit		2025-12-13 07:40:06.676543+00
9aeefb0f-2566-406f-866e-f58b9717aa2b	7057300573	Samadhan 		2025-12-13 07:44:52.311594+00
28076366-6d20-4dc1-9d96-46fbaac00373	7843036882	Abhijeet 		2025-12-13 07:51:09.845018+00
e062faad-0f01-4926-9bd8-a5dabf3654c6	9823915616	Ankush		2025-12-13 07:53:49.147083+00
2214f1e2-9f38-4d80-acc6-eb5081cba9f9	9764764318	Bramhand 		2025-12-13 08:38:20.51781+00
eae45472-1475-4a21-b098-da5558d87c95	7498996278	Chai		2025-12-13 09:13:51.496151+00
7610ce85-ac05-418e-a0ac-ade50d907e81	9623518270	Yash		2025-12-13 09:15:03.76493+00
0a9faf23-400a-40a9-9922-e859c8332701	9096095680	Pranav		2025-12-13 09:47:33.531761+00
db2c5dbb-816a-433b-8bcb-c1e08c7fbcd3	9051667743	Abhishek 		2025-12-13 12:34:08.270991+00
2d7bb19c-a017-4ca2-966e-204e9fe1fe9c	9823279204	Akshada 		2025-12-13 12:35:41.541232+00
948e7328-3698-4ed2-8137-3a0c7fb26215	8459598651	Satyam 		2025-12-13 13:06:55.389541+00
9ca3477e-9b89-4757-b26e-6f87121ecc8d	8686011001	Swapnil 		2025-12-13 13:59:40.773156+00
aa3d1dcb-1a2d-4e63-ac2b-3cefa8dd42f3	9527699710	Maitrey		2025-12-13 15:23:43.546925+00
8bb3051e-c000-471b-8b72-b0c53980e36f	7387817460	Tejas 		2025-12-13 15:31:53.332627+00
4cbc8c35-a617-4306-a2f5-8b5bea9a6bec	7218274387	Akash Patil 		2025-12-13 15:38:30.891432+00
c9ca7843-1740-4a7e-845b-5f12a9c1a6f0	7820937412	Vv		2025-12-13 17:26:50.51183+00
4127b4c5-5981-4d22-8214-d621330b3d7e	8878584016	Khushal		2025-12-14 12:20:11.167476+00
9d5ba098-9485-4a07-aba7-fb6a308152db	7972909414	Sameer 		2025-12-14 12:43:59.554556+00
7d2e2777-7d81-4c7e-a40e-ad293745f41b	8421533410	Hashad		2025-12-19 13:52:47.912215+00
844ea5d3-11b1-4a11-bee0-bf6c4a1185da	8080239539	Pratham pande		2026-01-01 11:04:11.569567+00
675feb54-cc8f-4d38-857e-d0cb3e4234d3	8625975613	Harshal 		2025-12-14 04:10:35.791848+00
2dc9019c-d581-4fd8-987a-6c9b2d67d6fc	9168525456	Ranjit 		2025-12-14 04:49:55.451038+00
c58964ba-9a52-4688-9755-b14a7049d0b1	8999253273	Amanat		2025-12-14 13:22:48.005855+00
04b408fd-8105-4e58-b6bb-c2bf15fba8e5	7758022839	Sumit		2025-12-10 10:04:32.980851+00
9220068d-857e-4616-b712-5089d5b7f5d6	8459204997	saurabh suryavanshi	Ambegaon BK - Katraj Road, Ambegaon Budruk, Pune, Maharashtra, India	2025-12-04 08:13:25.869379+00
1e54f403-f921-4645-899a-c5255b9384f7	7722079491	Pratik patil		2025-12-10 15:17:59.320742+00
cad047d5-8b96-49dc-a4d4-fa237410fcf8	8767537734	Pankaj		2025-12-10 15:36:09.256164+00
33eae6de-8fd5-455c-a4ef-00a38306aabb	9325280422	Dave 		2025-12-10 16:04:35.208099+00
ce30d6de-5ed4-451a-8b92-980bb4d4cc54	9699530509	Sidhant chavan		2025-12-14 14:29:28.715958+00
fe4f3273-884c-4334-bc60-4acc927ba14c	7755939447	Abhishek 	Ambegaon BK - Katraj Road, Ambegaon Budruk, Pune, Maharashtra, India	2025-12-11 06:26:10.129685+00
f044f353-ab53-4394-af54-56c1f548a408	8007240108	Sumit		2025-12-12 11:07:28.081543+00
38a63117-a7ef-404c-8635-b71c2d930bd2	9730978095	Omkar		2025-12-14 04:51:55.506526+00
0f43262a-3844-45e9-82a1-e3bca7be2007	9146176143	Vivek kale		2025-12-14 04:55:28.632383+00
fa7f6acd-59ce-440a-b72c-196edd296c1e	9404866334	Sanket 		2025-12-14 05:00:56.448368+00
99a42345-8c56-440b-92b1-192b7ddf8453	8788075135	Vaibhav 		2025-12-14 05:45:14.674611+00
f8491244-ee15-45cd-a646-a95136fb5d48	9022123717	Umesh		2025-12-14 05:48:58.34754+00
2270a7f8-655d-4aa9-9045-a6c4cc8cbf15	8767646855	Jaydeep 		2025-12-14 05:50:48.869289+00
28873e08-2dd7-434f-80a6-6c3c43389458	8956589627	Mayur 		2025-12-14 05:52:19.742833+00
6c027f97-3b79-4926-9826-5d0fa1c386ad	6294433754	Sanjiv 		2025-12-14 06:14:30.883122+00
79dda078-ddc8-49d3-8e76-1edda15fa51b	8108750654	Samad		2025-12-14 06:37:59.489148+00
9b59aef0-9a73-41b1-8906-a89b2c2ce331	9075916810	Rushikesh pawar 		2025-12-14 06:40:13.306753+00
7b5930d5-512d-4484-a310-16bbc39b095a	7620611911	Malhari Kate		2025-12-14 06:56:59.936966+00
930cde90-0531-4e0f-8ee0-ad1977acb718	8291975766	Shree		2025-12-14 07:04:53.241782+00
b4619dec-31e8-41cd-9d7d-a93394e6722b	9545035351	Vishal 		2025-12-14 07:10:16.179489+00
4cea6e6d-c4d9-4a5d-88d3-46666de17d7e	7796170072	Ajay more		2025-12-14 07:20:45.935687+00
ee5b1ead-7438-4902-a5e3-e06339d10196	7350581718	Shubham 		2025-12-14 07:34:11.55332+00
92b50d45-863e-4e50-b2df-fe14e8434e28	9150936957	Arunima		2025-12-14 07:50:07.040855+00
7dd97cd7-2146-4335-ad2f-37cbdbdd5b99	8888863345	Sanyuja kale		2025-12-14 08:09:16.830607+00
d06212df-fd3c-4550-b25c-ac76e1b37ec2	7205179559	Shubham Das		2025-12-14 08:11:15.453609+00
4ac2a9a0-4898-412b-98ae-6c87227bab30	7709067402	Vikas		2025-12-14 08:13:15.90949+00
d6c92e3c-5cdc-4609-adc1-b11ce608c88a	9604241308	Sanket bhujbal		2025-12-14 08:15:51.08964+00
0e3c58e9-b34b-4dab-8c49-67c558db2b01	8055430440	Ajinkya 		2025-12-14 08:18:18.278174+00
eda3c5ac-c466-4baa-9c77-74041b3271c9	7276746480	Shaikh 		2025-12-14 08:21:42.838144+00
5d71e1cc-0f9e-400e-ab3b-7378f8c3239e	9823746052	Swapnali bansode 		2025-12-14 08:53:25.337143+00
6f1f9bb9-7556-4dc4-a170-28ac6651ea4b	7249651455	Ajay s		2026-01-15 07:59:31.771092+00
81dc1304-183a-45ae-83a9-26d052f47729	8055925797	Ashish 		2025-12-14 09:36:59.562653+00
0b60ace8-43c2-4419-ab53-478466c235be	7057680010	Sawan shinde		2025-12-14 10:14:13.459272+00
474edaca-4859-4fb5-8a06-2728cb2bd360	9146512122	Pradeep 		2025-12-14 10:31:30.608798+00
9aa46fcb-08ff-40e5-bf10-075d05d5039b	9764569114	Yash		2025-12-14 10:47:31.203558+00
ca5531c4-1924-4618-8d50-ddc422bffeca	7620532313	Vitthal 		2025-12-14 14:49:32.40028+00
414573e3-f0dd-4a1e-978f-29d6c1316bcc	8668295583	Sanket b		2025-12-15 02:57:27.994868+00
d0a73007-af5f-42c4-9bdc-390393414cee	9028728077	Gaurav 		2025-12-15 03:12:41.495066+00
0654bd32-aba6-47b6-9a47-f178d9ecfacc	9011415058	Ronak		2025-12-15 03:25:16.638812+00
8c2dec66-e734-4faf-a348-2fa65d86530b	7720996565	Ravi ingle 		2025-12-15 03:46:27.180632+00
08994129-2f57-4601-80d4-d71437576ce7	7588372515	Ganesh 		2025-12-15 04:06:23.973448+00
bff51ac3-d4d8-4f19-86dc-f14a1d0d19ba	7066529591	Amey 		2025-12-15 16:09:48.015357+00
365ebcc5-a509-4897-a680-69aa4f9e3606	8329811115	Tejas kapure		2025-12-05 12:06:01.020429+00
bb21261d-fdcf-44bd-b5d3-b3f65c1d0588	8080695506	rishabh 	Ambegaon BK - Katraj Road, Ambegaon Budruk, Pune, Maharashtra, India	2025-12-03 17:49:25.243206+00
34099ef4-14a8-41b5-b8c5-217ea0a84e18	9399415787	Abhishek Abhishek 		2025-12-13 15:21:55.872808+00
36f0181e-f379-444e-b83d-a91de2130938	9158310615	Swapnil swapnil 		2025-12-13 03:51:58.883495+00
f521d2c4-fcf9-4eed-a8ee-cd0073277618	9422720906	Aditya tambe		2026-01-16 05:31:30.102077+00
11e4c6fe-9340-49ee-b797-0d6530c58b97	9422095825	Kore		2025-12-14 07:56:43.741275+00
11693c7c-3f6e-4e61-ab9c-d28b12f7571b	9922164672	Sujal		2026-01-16 06:28:12.897467+00
8dfd93ba-3107-4eaa-b848-4463800eb8ba	8799975746	Customer 		2026-01-16 06:39:41.923224+00
df5c95ab-643a-41fe-9d41-8b97d82e9adb	8888258407	Dhairyshil		2026-01-16 06:58:21.953331+00
a74aea95-b904-49aa-a10c-cf5df4e6ce41	9420298102	S s		2025-12-14 07:23:03.401243+00
faa1cf1f-8b53-4b2a-a11c-77215184c7b5	9834113033	Giri		2026-01-16 07:29:15.933061+00
f212301e-903c-424d-8c3c-1f0a73c258ed	9146565973	Akash		2026-01-16 08:40:11.494682+00
166f80a4-b09d-4596-b5f0-da063a793b63	9699184344	Vicky 		2026-01-16 08:42:28.462198+00
6a2e886e-6b06-4d8d-ae80-fa69be9b7db8	9529758861	Hitesh		2026-01-16 08:50:47.058683+00
0a46a853-411f-417a-9f33-1f207d0e21a5	8766462951	Omkar		2026-01-16 09:28:30.348049+00
3f397e3a-1d22-466e-8323-a7cf04e3e754	8554979240	Pravin		2026-01-16 09:32:31.249302+00
c8b2534d-bcb4-46b4-b9fb-92bf96ab3c53	7722083964	Prathmesh mali		2026-01-16 12:44:30.359522+00
245e9008-d898-497b-a5cd-40eea355555b	9373281183	Rishi		2026-01-16 13:21:29.251822+00
235efb2a-8ed5-4d49-9aec-e106622b8573	7448212956	Samarudhi ingle		2026-01-16 14:54:23.542572+00
0b8bcd61-d25e-48a9-8fad-b3505fc85370	9413780110	Shreyash		2026-01-16 15:05:51.54206+00
\.


--
-- Data for Name: daily_analytics_snapshots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."daily_analytics_snapshots" ("id", "branch_id", "date", "total_revenue", "total_sales", "orders_created", "orders_completed", "total_load_kg", "total_pieces", "new_customers", "returning_customers", "created_at", "updated_at") FROM stdin;
7270f77f-5b82-4a43-aad7-6fe3e93c9e87	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-08	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
ae43f932-0277-478d-b22c-7b5121ab6b65	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-08	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
1c9d4c70-0b59-47ed-8c3a-99dcde32271b	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-09	200.00	320.00	1	1	5.00	6	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
2d3e9b16-7c82-4cef-82da-0d9ca43bf491	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-09	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
6b64d721-1192-4210-b8b8-8583a7101ffd	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-10	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
e839296a-2afc-4430-8de1-a8232db3d715	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-10	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
b84beaa5-9b23-4825-b9a4-d168fc2af0dd	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-11	320.00	260.00	1	1	4.00	14	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
d659ad98-8b45-44d1-bf8b-bd3626c69eed	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-11	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
e4591de2-d7e7-4e50-a28a-561c6d096712	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-12	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
2a1272a0-919f-40de-bf7f-1539cbfd7562	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-12	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
cafe2294-f1f3-4ed2-b14e-8bbce7a657ad	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-13	260.00	380.00	1	1	6.00	14	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
d1a4393b-9b7a-4808-90fd-208d1665f615	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-13	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
dbc9d28b-5348-41d3-b939-a233613fe202	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-14	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
90d86c58-0818-4856-b166-e7fb6fa1d4ec	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-14	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
87e06bc9-4129-4d6e-af23-4946f8265f72	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-15	380.00	200.00	1	1	3.00	9	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
80b5e252-3b57-4ef3-b1d2-1cd24a549ccb	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-15	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
46c250b5-fe27-4c4d-91e5-ec0f94ea2f83	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-16	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
64aad8f8-2ddd-49de-98e4-60bfe095124d	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-16	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
0537474b-8c10-4e38-8d0b-640aaf8a92e9	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-17	200.00	200.00	1	1	3.00	14	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
1ab40712-7c9c-44bc-88f3-7fc4b044815d	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-17	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
f372dce4-a2fa-4896-98b9-bdf9514118df	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-18	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
3d89bbd5-b873-48d4-abf1-7924c24449b6	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-18	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
1a895a6b-8a84-40af-b82e-fb7da232d07b	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-19	200.00	200.00	1	1	3.00	5	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
e93e8d9a-b377-41fb-a2ec-d8844f8af168	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-19	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
b5eff016-b383-4284-8f51-7e58ea2feb5c	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-20	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
ce2ba46c-a38b-4466-a0de-737ccbcc7a0b	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-20	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
1fa75074-e5e9-44c3-baa2-7ad2fa6bd523	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-21	200.00	380.00	1	1	6.00	8	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
a508a965-2c17-45ce-b8a5-0e553be309a1	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-21	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
23d1bdf9-ee3d-459f-a7f4-6750f58cd6eb	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-22	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
d035c38f-5ee3-4c21-8f2a-201e209387e0	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-22	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
7f4f4962-9325-4199-abfb-242bb00b98ae	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-23	380.00	260.00	1	1	4.00	14	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
9aa794f4-f7e9-4781-a1cc-7fba0da3eb24	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-23	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
55097067-237b-47f5-9f03-23fb6989b934	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-24	0	240.00	1	0	4.00	16	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
9e4ee1d5-b573-4c81-a301-2007fcbbab29	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-24	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
5a8ecfe9-c266-443e-ac89-fcd7b968c91a	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-25	260.00	440.00	2	1	7.00	16	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
16bee63c-598b-4e11-b2e9-fa8d8ba1ffed	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-25	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
e2b3a4a9-27b7-48e4-a7d0-d9c91647bd66	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-26	0	180.00	1	0	3.00	12	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
d015598b-b71b-49bb-aea7-5153031cd5e3	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-26	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
b4ae2cb2-b676-4520-83a3-7dc233abbd50	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-27	320.00	300.00	1	1	5.00	20	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
34ea6a8d-fa8e-43b3-9a36-46a0ad9b6bcf	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-27	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
9c7ae170-4cd7-4996-8808-db435f4ebdef	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-28	0	300.00	1	0	5.00	20	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
7f1ccac8-f9c2-4945-9352-8265d616885e	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-28	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
d08d6ecc-4933-49a6-b95d-7727751c4afd	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-29	0	300.00	1	0	5.00	20	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
de166621-abd5-4b08-9698-9593859a09b9	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-29	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
81931e17-ea8c-46fe-b61f-5014f695b99c	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-11-30	0	180.00	1	0	3.00	12	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
9dd4fa8a-1fc9-4f51-93e6-37df8762dc83	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-11-30	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
50e1a574-b863-47aa-8252-b5b398454232	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-01	0	60.00	1	0	1.00	4	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
1c081e14-1838-4bbc-ac0f-5e7283640059	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-12-01	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
1dfe9673-5f0a-4fcf-a20c-63ed9f4fdb6c	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-02	0	180.00	1	0	3.00	12	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
c9a74263-7f93-4b36-803c-ba4927f02e31	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-12-02	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
8de7463f-3427-4118-8610-a7d53078fc51	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-03	0	240.00	1	0	4.00	16	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
ae64c0a8-a7c4-44ac-86e1-926692c56e40	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-12-03	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
2b8c839d-85d3-4b83-8f76-7557d3de1b20	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-04	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
11f9619a-5238-4564-a220-4d22c47349ac	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-12-04	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
2a246485-43fe-4004-887a-bb129cf3462c	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-05	0	2865.00	12	0	54.00	162	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
02f8e503-db3c-4152-8b9e-76d938713a21	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-12-05	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
2a7aec5a-47f9-41d7-b663-0cf800b0e3e8	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-06	0	1845.00	6	0	41.00	205	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
79bb8f55-b7b2-4c98-8431-79d3b8e70c0e	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-12-06	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
f2f45258-215c-4bea-9baa-f64f1e32ff3d	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-07	5549.00	4129.00	15	26	80.20	207	0	0	2025-12-08 06:07:23.899231+00	2025-12-08 06:09:53.906479+00
4d4deecf-ae5f-45ad-b510-96174d098ca3	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-12-07	0	0	0	0	0	0	0	0	2025-12-08 06:07:23.899231+00	2025-12-08 06:09:53.906479+00
2688837e-8f53-4a09-9ae9-367021e353f0	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-08	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
531d6327-35fb-4a5a-b099-4656547823db	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	2025-12-08	0	0	0	0	0	0	0	0	2025-12-08 06:09:53.906479+00	2025-12-08 06:09:53.906479+00
fd0c3a87-b319-4948-a0f1-023a6b1395c0	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-12	0	0	0	0	0	0	0	0	2025-12-13 20:00:00.099406+00	2025-12-13 20:00:00.099406+00
da564970-02df-4d2e-b6db-4221ad568619	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-12	0	0	0	0	0	0	0	0	2025-12-13 20:00:00.099406+00	2025-12-13 20:00:00.099406+00
e0d7cdea-c1f4-445c-bb6b-27a92889c371	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-12	0	205.00	1	0	0.00	8	1	0	2025-12-13 20:00:00.099406+00	2025-12-13 20:00:00.099406+00
9ba36997-98d9-404a-b263-8b9f6b3f01a2	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-13	0	840.00	5	0	16.00	31	1	0	2025-12-14 20:00:00.166484+00	2025-12-14 20:00:00.166484+00
c6380b07-3e21-4744-bdd6-3a7ceac6ebb4	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-13	0	0	0	0	0	0	0	0	2025-12-14 20:00:00.166484+00	2025-12-14 20:00:00.166484+00
9d8af8b8-9eaf-40a3-af28-f44ff2fe83e5	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-13	0	5130.00	38	0	71.61	263	37	0	2025-12-14 20:00:00.166484+00	2025-12-14 20:00:00.166484+00
e9232898-f7cf-46cb-b011-6f4d40b9695d	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-14	0	0	0	0	0	0	0	0	2025-12-15 20:00:00.182512+00	2025-12-15 20:00:00.182512+00
15fa6539-f9ad-42f2-a217-edf43c9314dd	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-14	0	0	0	0	0	0	0	0	2025-12-15 20:00:00.182512+00	2025-12-15 20:00:00.182512+00
ef21ac26-5f9d-4521-8f1f-dd61d1a743ed	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-14	0	4953.00	38	0	52.50	271	36	0	2025-12-15 20:00:00.182512+00	2025-12-15 20:00:00.182512+00
fff2f28f-1806-4b3c-a804-1e7c14481b71	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-15	0	0	0	0	0	0	0	0	2025-12-16 20:00:00.190153+00	2025-12-16 20:00:00.190153+00
d56a52da-0bc6-48df-a4f0-b06e51102e06	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-15	0	0	0	0	0	0	0	0	2025-12-16 20:00:00.190153+00	2025-12-16 20:00:00.190153+00
425223ad-b7f2-4179-9548-b565313dbd97	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-15	0	792.00	6	0	9.50	37	6	0	2025-12-16 20:00:00.190153+00	2025-12-16 20:00:00.190153+00
f85749b5-7c19-4cfd-ba2a-37a910c6a9af	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-16	120.00	450.00	1	1	10.00	10	0	0	2025-12-17 20:00:00.173209+00	2025-12-17 20:00:00.173209+00
aa842d3f-a7b0-48e5-84b1-3db71d848c9a	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-16	0	0	0	0	0	0	0	0	2025-12-17 20:00:00.173209+00	2025-12-17 20:00:00.173209+00
108e781d-11f4-40ab-ad07-5c67d97ef703	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-16	0	0	0	0	0	0	0	0	2025-12-17 20:00:00.173209+00	2025-12-17 20:00:00.173209+00
854cee58-915a-4e43-b0a3-ff9c5a43e95b	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-17	0	0	0	0	0	0	0	0	2025-12-18 20:00:00.165649+00	2025-12-18 20:00:00.165649+00
90227154-ae68-49a6-accc-a96508ceb7ad	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-17	0	0	0	0	0	0	0	0	2025-12-18 20:00:00.165649+00	2025-12-18 20:00:00.165649+00
b655f720-4c67-4699-8b3f-bcd4d6fdb979	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-17	0	0	0	0	0	0	0	0	2025-12-18 20:00:00.165649+00	2025-12-18 20:00:00.165649+00
37af3d0f-9589-47a7-9c6b-d26fcd3111e1	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-18	0	0	0	0	0	0	0	0	2025-12-19 20:00:00.197607+00	2025-12-19 20:00:00.197607+00
b2f85c02-8d46-46e1-8e73-e757784cf91e	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-18	0	0	0	0	0	0	0	0	2025-12-19 20:00:00.197607+00	2025-12-19 20:00:00.197607+00
fb5edba1-1dc2-409b-a802-3f63bcdd062e	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-18	0	0	0	0	0	0	0	0	2025-12-19 20:00:00.197607+00	2025-12-19 20:00:00.197607+00
28a4b676-94a3-41f2-80cf-b9a5e12dfa9a	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-19	360.00	360.00	1	1	6.00	23	1	0	2025-12-20 20:00:00.180161+00	2025-12-20 20:00:00.180161+00
1fa3c452-22a8-49e5-b8f5-651f27edc316	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-19	0	0	0	0	0	0	0	0	2025-12-20 20:00:00.180161+00	2025-12-20 20:00:00.180161+00
dcc047a0-cbe5-45eb-b804-56755119cd32	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-19	0	0	0	0	0	0	0	0	2025-12-20 20:00:00.180161+00	2025-12-20 20:00:00.180161+00
3d691c02-e4ce-4133-92dd-b4b2acf3b1cf	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-20	0	0	0	0	0	0	0	0	2025-12-21 20:00:00.183065+00	2025-12-21 20:00:00.183065+00
23eb78b4-1755-43f4-931d-dcd4b10d1e1b	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-20	0	0	0	0	0	0	0	0	2025-12-21 20:00:00.183065+00	2025-12-21 20:00:00.183065+00
dd3c34d2-d924-42ca-a24f-40e8bd874fc3	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-20	0	0	0	0	0	0	0	0	2025-12-21 20:00:00.183065+00	2025-12-21 20:00:00.183065+00
9a87aa44-fd58-4797-8f9a-0eb4bcfb02a4	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-21	0	0	0	0	0	0	0	0	2025-12-22 20:00:00.179401+00	2025-12-22 20:00:00.179401+00
91aa2d4a-c725-4214-88e0-105ae5b2f66e	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-21	0	0	0	0	0	0	0	0	2025-12-22 20:00:00.179401+00	2025-12-22 20:00:00.179401+00
ac35da7d-2b3c-45c9-9b40-0a00d00758c2	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-21	0	0	0	0	0	0	0	0	2025-12-22 20:00:00.179401+00	2025-12-22 20:00:00.179401+00
545732a7-087d-4e6a-a458-2fe2a5ac4f54	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-22	0	0	0	0	0	0	0	0	2025-12-23 20:00:00.20619+00	2025-12-23 20:00:00.20619+00
49adba6a-daf0-4ad4-a4c3-0500d25ef0a7	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-22	0	0	0	0	0	0	0	0	2025-12-23 20:00:00.20619+00	2025-12-23 20:00:00.20619+00
d56fa6fa-fc4c-408d-9d35-df136e70fa4a	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-22	0	0	0	0	0	0	0	0	2025-12-23 20:00:00.20619+00	2025-12-23 20:00:00.20619+00
b5f51a02-dabe-4b9a-8bb7-2cb8c78b4608	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-23	0	0	0	0	0	0	0	0	2025-12-24 20:00:00.179226+00	2025-12-24 20:00:00.179226+00
45210959-ac33-48ee-8ac1-d44167e3a33b	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-23	0	0	0	0	0	0	0	0	2025-12-24 20:00:00.179226+00	2025-12-24 20:00:00.179226+00
a21ea508-3e73-4065-8a2e-acf352fcc022	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-23	0	0	0	0	0	0	0	0	2025-12-24 20:00:00.179226+00	2025-12-24 20:00:00.179226+00
8619fd41-d73f-49cf-bec3-e088d95a6cc9	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-24	0	0	0	0	0	0	0	0	2025-12-25 20:00:00.197235+00	2025-12-25 20:00:00.197235+00
94f75e75-82b4-498f-9e83-5e4a59639345	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-24	0	0	0	0	0	0	0	0	2025-12-25 20:00:00.197235+00	2025-12-25 20:00:00.197235+00
684d3263-70da-4681-a069-49a9321bc709	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-24	0	0	0	0	0	0	0	0	2025-12-25 20:00:00.197235+00	2025-12-25 20:00:00.197235+00
56f5f3e0-b462-4751-8adb-de105026551c	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-25	0	0	0	0	0	0	0	0	2025-12-26 20:00:00.197017+00	2025-12-26 20:00:00.197017+00
efb9e598-bbe6-4d7c-9a9b-0e48370df7ec	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-25	0	0	0	0	0	0	0	0	2025-12-26 20:00:00.197017+00	2025-12-26 20:00:00.197017+00
7adc665d-0ae5-4037-9002-f1f8f3768dd1	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-25	0	0	0	0	0	0	0	0	2025-12-26 20:00:00.197017+00	2025-12-26 20:00:00.197017+00
b3157b6c-1f31-45d8-a7e0-b6a16bdcc7d8	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-26	0	0	0	0	0	0	0	0	2025-12-27 20:00:00.178709+00	2025-12-27 20:00:00.178709+00
268bf15d-d5c6-4415-96cc-393b78789da8	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-26	0	0	0	0	0	0	0	0	2025-12-27 20:00:00.178709+00	2025-12-27 20:00:00.178709+00
58bac20d-95f5-43a0-b679-7cfc840295c2	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-26	0	0	0	0	0	0	0	0	2025-12-27 20:00:00.178709+00	2025-12-27 20:00:00.178709+00
eed13eda-26a2-4d12-82df-9d7077437fda	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-27	0	0	0	0	0	0	0	0	2025-12-28 20:00:00.182785+00	2025-12-28 20:00:00.182785+00
86dd01f8-d454-44cc-833e-0dbd1e46fe3b	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-27	0	0	0	0	0	0	0	0	2025-12-28 20:00:00.182785+00	2025-12-28 20:00:00.182785+00
290d3d42-bede-4219-b104-1f60c2919e3d	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-27	0	0	0	0	0	0	0	0	2025-12-28 20:00:00.182785+00	2025-12-28 20:00:00.182785+00
21319d4c-375d-4895-ba39-92058da6012d	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-28	0	0	0	0	0	0	0	0	2025-12-29 20:00:00.185456+00	2025-12-29 20:00:00.185456+00
f7b0a407-7c82-4b81-8c95-020096c35652	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-28	0	0	0	0	0	0	0	0	2025-12-29 20:00:00.185456+00	2025-12-29 20:00:00.185456+00
7d952eda-b5db-4962-9fea-4532088c6138	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-28	0	0	0	0	0	0	0	0	2025-12-29 20:00:00.185456+00	2025-12-29 20:00:00.185456+00
2255f3f5-a248-45af-8d1b-f9caf92410c6	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-29	0	0	0	0	0	0	0	0	2025-12-30 20:00:00.160248+00	2025-12-30 20:00:00.160248+00
7e0935f3-b846-4b91-9d94-7756499e1df5	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-29	0	0	0	0	0	0	0	0	2025-12-30 20:00:00.160248+00	2025-12-30 20:00:00.160248+00
4e16164e-127a-40f6-a7a9-7caa2fb11e50	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-29	0	0	0	0	0	0	0	0	2025-12-30 20:00:00.160248+00	2025-12-30 20:00:00.160248+00
22ebe71d-1e93-4253-b369-d12aa0c23887	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-30	0	45.00	1	0	0.00	3	0	0	2025-12-31 20:00:00.178025+00	2025-12-31 20:00:00.178025+00
0ba5b295-b167-493d-9a46-6276fd68ee93	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-30	0	0	0	0	0	0	0	0	2025-12-31 20:00:00.178025+00	2025-12-31 20:00:00.178025+00
837aa7f3-2d06-46c8-8720-10e9369aca30	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-30	0	0	0	0	0	0	0	0	2025-12-31 20:00:00.178025+00	2025-12-31 20:00:00.178025+00
f2f56a6e-9ce9-45c5-bf8f-2109baca8535	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2025-12-31	0	0	0	0	0	0	0	0	2026-01-01 20:00:00.177699+00	2026-01-01 20:00:00.177699+00
84f3948c-e0a2-4ce2-8a1c-27e1036907bb	621d9703-7608-42a9-9a47-777f53c0280a	2025-12-31	0	0	0	0	0	0	0	0	2026-01-01 20:00:00.177699+00	2026-01-01 20:00:00.177699+00
bd386281-5fce-410a-9c7d-76b48b906ad7	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2025-12-31	0	0	0	0	0	0	0	0	2026-01-01 20:00:00.177699+00	2026-01-01 20:00:00.177699+00
abd52631-0ccd-4c85-9fc4-bbf7f8be6862	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-01	0	300.00	1	0	5.00	10	1	0	2026-01-02 20:00:00.168552+00	2026-01-02 20:00:00.168552+00
ab008e25-9d09-427c-ae52-f82c06bdba67	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-01	0	0	0	0	0	0	0	0	2026-01-02 20:00:00.168552+00	2026-01-02 20:00:00.168552+00
51abdad5-f49a-4104-a97c-00a1ee76384a	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-01	0	0	0	0	0	0	0	0	2026-01-02 20:00:00.168552+00	2026-01-02 20:00:00.168552+00
5bee56ad-75f1-416c-9897-8ed1f6177a29	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-02	0	0	0	0	0	0	0	0	2026-01-03 20:00:00.178542+00	2026-01-03 20:00:00.178542+00
50814fcc-2e11-47f4-86a7-0756985dcf8d	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-02	0	0	0	0	0	0	0	0	2026-01-03 20:00:00.178542+00	2026-01-03 20:00:00.178542+00
40d6a637-7425-47fb-bbd1-d9b46fe047e6	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-02	0	0	0	0	0	0	0	0	2026-01-03 20:00:00.178542+00	2026-01-03 20:00:00.178542+00
89c55924-3450-459d-9f97-0d68cbc8898f	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-03	0	0	0	0	0	0	0	0	2026-01-04 20:00:00.167398+00	2026-01-04 20:00:00.167398+00
3f79b9a6-b5d6-4dd1-a4bc-08300bc7cf06	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-03	0	0	0	0	0	0	0	0	2026-01-04 20:00:00.167398+00	2026-01-04 20:00:00.167398+00
302c33ef-653d-4b9a-bd7d-5d2b529f55a9	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-03	0	0	0	0	0	0	0	0	2026-01-04 20:00:00.167398+00	2026-01-04 20:00:00.167398+00
3af2bf36-481f-4cf3-87df-756af89a55df	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-04	0	0	0	0	0	0	0	0	2026-01-05 20:00:00.202583+00	2026-01-05 20:00:00.202583+00
b5a7ee14-9701-4a69-a725-ea474e69da86	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-04	0	0	0	0	0	0	0	0	2026-01-05 20:00:00.202583+00	2026-01-05 20:00:00.202583+00
76ab0508-5b07-4e02-ab20-f4f5493b48d4	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-04	0	246.00	1	0	4.10	11	0	0	2026-01-05 20:00:00.202583+00	2026-01-05 20:00:00.202583+00
e86a913f-4e34-4c3c-996a-6e01a643264f	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-05	0	0	0	0	0	0	0	0	2026-01-06 20:00:00.204042+00	2026-01-06 20:00:00.204042+00
df6d8399-4f07-456f-9429-7b17f43efe16	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-05	0	0	0	0	0	0	0	0	2026-01-06 20:00:00.204042+00	2026-01-06 20:00:00.204042+00
14adf98e-4537-4816-a981-04e3ec492a0a	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-05	0	0	0	0	0	0	0	0	2026-01-06 20:00:00.204042+00	2026-01-06 20:00:00.204042+00
f2644ddf-5515-4f1f-9812-489af6f2b5a0	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-06	0	0	0	0	0	0	0	0	2026-01-07 20:00:00.187479+00	2026-01-07 20:00:00.187479+00
f090bf04-d1d0-4b40-8a53-bdd5d463736b	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-06	0	0	0	0	0	0	0	0	2026-01-07 20:00:00.187479+00	2026-01-07 20:00:00.187479+00
c1e45cf2-0aa9-47d5-8c9f-c68090160a05	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-06	0	0	0	0	0	0	0	0	2026-01-07 20:00:00.187479+00	2026-01-07 20:00:00.187479+00
6e02df08-e086-4899-bf79-f3edf301f0a5	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-07	0	0	0	0	0	0	0	0	2026-01-08 20:00:00.183038+00	2026-01-08 20:00:00.183038+00
6a6416c1-a313-4da6-9386-97472e82580d	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-07	0	0	0	0	0	0	0	0	2026-01-08 20:00:00.183038+00	2026-01-08 20:00:00.183038+00
1e6c3bc5-1724-4df2-a291-dbec8cca7c9e	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-07	0	0	0	0	0	0	0	0	2026-01-08 20:00:00.183038+00	2026-01-08 20:00:00.183038+00
c80e980d-d5d7-4ded-8533-0520217af36d	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-08	0	0	0	0	0	0	0	0	2026-01-09 20:00:00.175557+00	2026-01-09 20:00:00.175557+00
192419eb-448d-41c2-b9c0-25ad4ad0d2c0	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-08	0	0	0	0	0	0	0	0	2026-01-09 20:00:00.175557+00	2026-01-09 20:00:00.175557+00
b47e97af-d705-4e64-b121-c82bb1c5799a	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-08	0	0	0	0	0	0	0	0	2026-01-09 20:00:00.175557+00	2026-01-09 20:00:00.175557+00
4398eb64-94ad-4735-89d2-b662aced3909	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-09	0	0	0	0	0	0	0	0	2026-01-10 20:00:00.164009+00	2026-01-10 20:00:00.164009+00
3482e9bc-abc2-430d-97d5-d0e83afc6e80	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-09	0	0	0	0	0	0	0	0	2026-01-10 20:00:00.164009+00	2026-01-10 20:00:00.164009+00
8ad4d2ce-f51c-4cb1-9b4c-55c9c26e4a45	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-09	0	0	0	0	0	0	0	0	2026-01-10 20:00:00.164009+00	2026-01-10 20:00:00.164009+00
0eacb46c-46cf-4a1b-9223-054b7feb9e00	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-10	0	0	0	0	0	0	0	0	2026-01-11 20:00:00.175539+00	2026-01-11 20:00:00.175539+00
50b974b3-5e61-429c-a978-73ec53af437c	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-10	0	0	0	0	0	0	0	0	2026-01-11 20:00:00.175539+00	2026-01-11 20:00:00.175539+00
38c20c6d-57f7-444c-b45c-494d294a9749	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-10	0	0	0	0	0	0	0	0	2026-01-11 20:00:00.175539+00	2026-01-11 20:00:00.175539+00
ee850e6b-3520-490c-aba8-6dcf4f6ecc70	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-11	0	0	0	0	0	0	0	0	2026-01-12 20:00:00.195777+00	2026-01-12 20:00:00.195777+00
2972e53a-ea04-4700-a8e1-dc63eaaf180f	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-11	0	0	0	0	0	0	0	0	2026-01-12 20:00:00.195777+00	2026-01-12 20:00:00.195777+00
2edff561-11eb-4d3e-adee-e62b42b9a6f2	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-11	0	0	0	0	0	0	0	0	2026-01-12 20:00:00.195777+00	2026-01-12 20:00:00.195777+00
dffb829e-ff21-4c4c-b184-94aa22be81f3	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-12	0	0	0	0	0	0	0	0	2026-01-13 20:00:00.208785+00	2026-01-13 20:00:00.208785+00
da582b3a-14f6-4a1c-ab7d-8d67c896a8cb	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-12	0	0	0	0	0	0	0	0	2026-01-13 20:00:00.208785+00	2026-01-13 20:00:00.208785+00
e2195b37-6847-46d7-870a-4139445bac11	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-12	0	0	0	0	0	0	0	0	2026-01-13 20:00:00.208785+00	2026-01-13 20:00:00.208785+00
89c05399-e36a-42bb-8b93-4e4594d0c33b	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-13	0	0	0	0	0	0	0	0	2026-01-14 20:00:00.198844+00	2026-01-14 20:00:00.198844+00
dd6f94b3-b116-49cd-83ed-7f1a6a994d06	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-13	0	0	0	0	0	0	0	0	2026-01-14 20:00:00.198844+00	2026-01-14 20:00:00.198844+00
68fe8099-d550-4c36-a3c7-06691ddfcce1	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-13	0	0	0	0	0	0	0	0	2026-01-14 20:00:00.198844+00	2026-01-14 20:00:00.198844+00
ed4eae6e-4fcc-4ee5-bdc6-376d6e4bbc6b	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	2026-01-14	0	0	0	0	0	0	0	0	2026-01-15 20:00:00.202075+00	2026-01-15 20:00:00.202075+00
2ca53f89-5073-4d57-a513-a4136fdd94ff	621d9703-7608-42a9-9a47-777f53c0280a	2026-01-14	0	0	0	0	0	0	0	0	2026-01-15 20:00:00.202075+00	2026-01-15 20:00:00.202075+00
f1c9f23b-0fc4-4cce-82db-dc8d773c52d7	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2026-01-14	0	0	0	0	0	0	0	0	2026-01-15 20:00:00.202075+00	2026-01-15 20:00:00.202075+00
\.


--
-- Data for Name: laundry_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."laundry_items" ("id", "name", "category", "kind", "default_unit", "notes", "display_order", "is_active", "created_at", "updated_at") FROM stdin;
cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	UPPER	WEARABLE_BULK	PIECE	\N	1	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	UPPER	WEARABLE_BULK	PIECE	\N	2	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
4755af9d-1b41-4b0f-8ae0-5dcfbaa6591b	Top	UPPER	WEARABLE_BULK	PIECE	\N	3	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
593898aa-3b94-499c-8978-fc32abd8a4c5	Blouse 	UPPER	WEARABLE_BULK	PIECE	\N	4	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
59d03d7e-c3e1-4dc7-8b67-04404994338c	Kurta 	UPPER	WEARABLE_BULK	PIECE	\N	5	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
b5c1b36f-324d-454a-9aef-f7780af6a409	Sweatshirt	UPPER	WEARABLE_BULK	PIECE	\N	6	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
621a2bdf-e188-4255-af20-6e525e166c80	Hoodie	UPPER	WEARABLE_BULK	PIECE	\N	7	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
a8a50923-6d6d-4ac6-ac20-9b3c409e0e08	Sweater	UPPER	WEARABLE_BULK	PIECE	\N	8	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	LOWER	WEARABLE_BULK	PIECE	\N	9	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	LOWER	WEARABLE_BULK	PIECE	\N	10	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
80bca426-2418-435d-8f9d-cdaecdc5bf09	Shorts	LOWER	WEARABLE_BULK	PIECE	\N	11	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
13d14ea4-5ad6-4c4c-bf07-7ddfbbb52b68	Skirt 	LOWER	WEARABLE_BULK	PIECE	\N	12	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
fbcd99e7-cf6a-40a8-8c67-3c0cff082ca9	Leggings	LOWER	WEARABLE_BULK	PIECE	\N	13	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	LOWER	WEARABLE_BULK	PIECE	\N	14	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
39ea4de6-1bd3-43e6-bd4e-2fbe23d4a3d7	Sweatpants	LOWER	WEARABLE_BULK	PIECE	\N	15	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
682c6fc1-e3b4-485b-ac28-4d7370ded042	Dhoti 	LOWER	WEARABLE_BULK	PIECE	\N	16	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
5393f924-7ddb-4656-a565-21c9f54f1fcb	Lungi	LOWER	WEARABLE_BULK	PIECE	\N	17	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
cf3a0821-b568-406a-8339-767a15b8a612	Saree	ETHNIC	SPECIAL	PIECE	\N	20	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
e68a9229-37ee-43bc-9f53-588ea3d8d8ae	Lehenga / Ghagra	ETHNIC	SPECIAL	PIECE	\N	21	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
f84f6b87-5bf0-41c2-9cff-f68b1db8dc5f	Blouse (Ethnic)	ETHNIC	SPECIAL	PIECE	\N	22	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
4151b435-8a15-4dea-a592-fd309fdf015c	Anarkali Suit	ETHNIC	SPECIAL	PIECE	\N	23	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
e08561c2-8988-4ed2-beeb-12e9367d3ade	Salwar Kameez Set	ETHNIC	SPECIAL	PIECE	\N	24	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
41feeaeb-104a-4de9-b6dd-a4d2e1d8dc4f	Sherwani	ETHNIC	SPECIAL	PIECE	\N	25	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
9c0c0ad7-6405-491e-a5b2-025cf5e40c4a	Bandhgala	ETHNIC	SPECIAL	PIECE	\N	26	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
f5e1a3a1-93d4-4b48-a4ed-e1f56608dde2	Kurta-Pajama Set	ETHNIC	SPECIAL	PIECE	\N	27	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
2015cd29-0d72-4e79-bd84-74be3d1f6b84	Gown 	ETHNIC	SPECIAL	PIECE	\N	28	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
d2e09a19-d793-4da3-aa46-308552a2d62c	Dhoti Kurta Set	ETHNIC	SPECIAL	PIECE	\N	29	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
165c81f3-b681-4741-a6b8-49843069a903	Stole / Shawl	ETHNIC	SPECIAL	PIECE	\N	30	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
b69c0b95-2c40-407d-9c16-82b88c7eb5a5	Blanket	HOME_LINEN	SPECIAL	KG	\N	40	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
11451d77-da91-45cb-b0ac-1c26c51fca0f	Bedsheet (Double)	HOME_LINEN	SPECIAL	PIECE	\N	42	f	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
6f8b78f9-371b-4848-83f3-758b4e398917	Bedsheet	HOME_LINEN	SPECIAL	PIECE	\N	41	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
e8304b5e-8fd9-4834-a5d8-80a552e09505	Pillow Cover	HOME_LINEN	SPECIAL	PIECE	\N	43	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
7d4b5765-4ea3-4097-8458-e2f66fa8fcef	Curtains 	HOME_LINEN	SPECIAL	PIECE	\N	45	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
a141bf07-e166-46cc-b98f-657a80bd9833	Carpet / Rug	HOME_LINEN	SPECIAL	KG	\N	46	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
29c28179-0446-46a6-bc7d-36fca68d730b	Bath Mat	HOME_LINEN	SPECIAL	PIECE	\N	47	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
0ff5a462-957a-4f33-84e2-373022954d06	Shoes (Casual)	OTHER	SPECIAL	PIECE	\N	50	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
6b526249-3b99-4030-9569-b9ed2e920fe3	Handbag	OTHER	SPECIAL	PIECE	\N	51	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
d269ba2d-030e-46aa-9f5f-78132380fa64	Backpack	OTHER	SPECIAL	PIECE	\N	52	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
618571bd-02d7-46cd-9b32-d689e2ec4a1d	Leather Jacket	OTHER	SPECIAL	PIECE	\N	53	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
5ede8f68-bafa-4802-998d-9932eade0844	Travel Bag	OTHER	SPECIAL	PIECE	\N	54	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
55fa35a4-588a-40d8-8236-51e55b53440f	Towel	OTHER	SPECIAL	PIECE	\N	55	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
b19ebd0d-b4ca-47a3-b1ff-56bc3051e7df	Sofa Covers	HOME_LINEN	SPECIAL	PIECE	\N	44	t	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
\.


--
-- Data for Name: laundry_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."laundry_settings" ("id", "branch_id", "wf_kg_rate", "wi_kg_rate", "iron_only_piece_rate", "small_order_piece_rate", "small_order_threshold", "blanket_flat_threshold_kg", "blanket_flat_rate", "blanket_kg_rate", "delivery_mode", "delivery_flat_fee", "upi_id", "upi_name", "created_at", "updated_at") FROM stdin;
f7354bfb-0660-4d1d-93f2-9a879753a916	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	45.00	60.00	8.00	15.00	3	1.50	100.00	80.00	FREE	0.00	\N	\N	2025-12-02 14:14:30.82395+00	2025-12-02 14:14:30.82395+00
c236a8e0-cc8f-41ff-966b-423e9a4cfe12	a3015513-c6c3-44fb-9551-2dfe25fb0c0a	40.00	50.00	5.00	12.00	3	1.50	90.00	80.00	FREE	0.00	\N	\N	2025-12-02 14:31:18.048825+00	2025-12-02 14:31:18.048825+00
392cfebf-cf3a-4678-a83e-e0c06c7c3360	621d9703-7608-42a9-9a47-777f53c0280a	40.00	55.00	8.00	15.00	3	1.50	100.00	80.00	FREE	0.00	\N	\N	2025-12-09 18:32:44.894377+00	2025-12-09 18:32:44.894377+00
2f174f24-0c3a-4569-ac1c-dfe55689a82e	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	45.00	60.00	8.00	15.00	3	1.50	100.00	80.00	FREE	0.00	\N	\N	2025-12-09 18:32:44.894377+00	2025-12-09 18:32:44.894377+00
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."order_items" ("id", "order_id", "item_id", "item_name_snapshot", "quantity", "weight_kg", "service_type", "unit_price", "total_price", "is_chargeable") FROM stdin;
5563f75c-901e-4196-a022-cfa8f22c00e9	4e01e3ce-a22b-4bf7-a9f3-604f1982a35a	\N	Bulk Pile (Wash & Fold)	1	2.69	Wash & Fold	121.00	121.00	t
4df6e8ea-3175-46fa-8912-bd47aec39406	4e01e3ce-a22b-4bf7-a9f3-604f1982a35a	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	3	0.00	Wash & Fold	0.00	0.00	t
3da4c66d-adf5-4083-aca1-d4e892fa583c	4e01e3ce-a22b-4bf7-a9f3-604f1982a35a	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	5	0.00	Wash & Fold	0.00	0.00	t
509712e1-42af-4427-9b31-16c87f026788	4e01e3ce-a22b-4bf7-a9f3-604f1982a35a	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Dry Clean	50.00	50.00	t
184cc778-3eb2-469c-898e-65eeb74800e6	4e01e3ce-a22b-4bf7-a9f3-604f1982a35a	b5c1b36f-324d-454a-9aef-f7780af6a409	Sweatshirt	1	0.00	Wash & Fold	0.00	0.00	t
7c1f1c2e-7155-40fc-af5d-d88a6bf09fc9	4e01e3ce-a22b-4bf7-a9f3-604f1982a35a	621a2bdf-e188-4255-af20-6e525e166c80	Hoodie	1	0.00	Wash & Fold	0.00	0.00	t
093be42f-d216-484f-bd95-3d377e02d2a5	2bae21a5-81ca-4a27-8468-23723f941cef	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Dry Clean	50.00	100.00	t
eeb04eb6-bf14-4a15-a202-43dee0ad20b2	2bae21a5-81ca-4a27-8468-23723f941cef	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	3	0.00	Piece Wash	15.00	45.00	t
8ab8c4b1-e54b-4c9b-a7c8-c911238b1d7e	2bae21a5-81ca-4a27-8468-23723f941cef	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	3	0.00	Piece Wash	15.00	45.00	t
e548d27c-cb98-4c1a-984a-630453f1f5a2	2bae21a5-81ca-4a27-8468-23723f941cef	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Piece Wash	15.00	15.00	t
7a8c2430-e60e-4db9-8a43-41b1f756abf5	26e4fa2f-e4ab-4d0e-ad00-c27055bfd870	\N	Bulk Pile (Wash & Iron)	1	3.10	Wash & Iron	171.00	171.00	t
cd77068a-013a-4579-9049-f5c3fbc0c870	26e4fa2f-e4ab-4d0e-ad00-c27055bfd870	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	4	0.00	Iron Only	8.00	32.00	t
21fe37f5-6f6a-4000-9274-dd6f7d68b96d	26e4fa2f-e4ab-4d0e-ad00-c27055bfd870	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Wash & Iron	0.00	0.00	t
d40ed672-6057-47c2-82f9-45fd249af811	26e4fa2f-e4ab-4d0e-ad00-c27055bfd870	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Iron	0.00	0.00	t
a93287e1-41d8-4bfa-b8d6-8841b4ff7f3a	26e4fa2f-e4ab-4d0e-ad00-c27055bfd870	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	3	0.00	Wash & Iron	0.00	0.00	t
f4244287-e73c-4c47-8fb1-122d3d47de01	dba7c82a-ec28-415b-b16b-873eb4942ce1	\N	Solapuri chadar	1	1.10	Custom	80.00	80.00	t
f310c3d7-ea2f-42fd-87c1-542c71465e42	bea87b4e-b308-4665-a6f0-2603980206ae	\N	Bulk Pile (Wash & Fold)	1	1.20	Wash & Fold	54.00	54.00	t
f5e45ce4-f1d8-4f62-b2cc-9f9f7ff67590	bea87b4e-b308-4665-a6f0-2603980206ae	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	3	0.00	Wash & Fold	0.00	0.00	t
6ee9e41b-831d-4996-9287-2937c4f0e5b9	bea87b4e-b308-4665-a6f0-2603980206ae	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Fold	0.00	0.00	t
86d641af-7b03-4ad0-9338-bf1636604a33	103c82c0-7bc7-457f-8f31-0ef0a01f4060	\N	Bulk Pile (Wash & Fold)	1	1.90	Wash & Fold	86.00	86.00	t
770f4c09-f48b-46a3-aaf0-8d14a80916a0	103c82c0-7bc7-457f-8f31-0ef0a01f4060	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	3	0.00	Wash & Fold	0.00	0.00	t
3f6c8f55-18cb-4792-886d-177599b30380	103c82c0-7bc7-457f-8f31-0ef0a01f4060	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Fold	0.00	0.00	t
c82c4a3f-2b8d-4339-834d-92106665f6c0	299f9aa9-89c5-4d30-a8f2-b3f911cb84f4	\N	Bulk Pile (Wash & Iron)	1	1.28	Wash & Iron	71.00	71.00	t
73a06a8f-0680-45de-b12f-35e512ecdb76	299f9aa9-89c5-4d30-a8f2-b3f911cb84f4	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Iron	0.00	0.00	t
81ccaf96-0265-4e56-9b16-08f3f014683b	299f9aa9-89c5-4d30-a8f2-b3f911cb84f4	621a2bdf-e188-4255-af20-6e525e166c80	Hoodie	1	0.00	Wash & Iron	0.00	0.00	t
38b3db1e-ff57-46e2-b8a6-811353cbcf9f	299f9aa9-89c5-4d30-a8f2-b3f911cb84f4	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Iron	0.00	0.00	t
d5094d26-b4e7-41a7-b43b-7f4ab2f0435f	299f9aa9-89c5-4d30-a8f2-b3f911cb84f4	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Wash & Iron	0.00	0.00	t
27097b30-726c-4a33-9df1-3cc1fd1509a2	299f9aa9-89c5-4d30-a8f2-b3f911cb84f4	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Dry Clean	50.00	50.00	t
a9f65a0a-c0e3-470b-9485-6e25593c77bc	33a2f5c6-16a3-4eb4-9eb7-c72dc6ea4f1b	\N	Bulk Pile (Wash & Iron)	1	1.56	Wash & Iron	86.00	86.00	t
459dd277-97d1-45f9-9fd1-b2d00d6dc490	33a2f5c6-16a3-4eb4-9eb7-c72dc6ea4f1b	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Iron	0.00	0.00	t
7788e6f1-2562-4b76-a89b-ce196616cdfa	33a2f5c6-16a3-4eb4-9eb7-c72dc6ea4f1b	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Wash & Iron	0.00	0.00	t
fa206251-42b3-410d-a5a5-faec0515201d	33a2f5c6-16a3-4eb4-9eb7-c72dc6ea4f1b	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Iron	0.00	0.00	t
4f415924-4d26-4b88-801a-9f149b8c8e7e	33a2f5c6-16a3-4eb4-9eb7-c72dc6ea4f1b	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Iron	0.00	0.00	t
177caf62-c342-4fad-a8f0-2afabd68d2c1	87a9483e-93ab-4dad-b2e2-a815f8677e98	\N	Bulk Pile (Wash & Iron)	1	2.80	Wash & Iron	154.00	154.00	t
c4b9b7fd-6761-4e21-9777-f2331e164750	87a9483e-93ab-4dad-b2e2-a815f8677e98	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	3	0.00	Wash & Iron	0.00	0.00	t
ffe7b04f-9b64-4549-a386-939aaac4991c	87a9483e-93ab-4dad-b2e2-a815f8677e98	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	2	0.00	Wash & Iron	0.00	0.00	t
59e5c2cc-9cc5-4671-9517-5c6554321894	87a9483e-93ab-4dad-b2e2-a815f8677e98	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	3	0.00	Wash & Iron	0.00	0.00	t
609e3196-8100-48d7-b9dc-e17fef6b0a32	87a9483e-93ab-4dad-b2e2-a815f8677e98	55fa35a4-588a-40d8-8236-51e55b53440f	Towel	1	0.00	Special Wash	50.00	50.00	t
9fbe54ea-a636-47fd-9fe1-9774d3eabdb2	87a9483e-93ab-4dad-b2e2-a815f8677e98	\N	Short	1	0.00	Custom	15.00	15.00	t
2cba6430-f98a-4b55-b8ea-f57d0bb6e965	cb571cae-2807-446b-b7b1-d64211b10b02	\N	Bulk Pile (Wash & Iron)	1	9.80	Wash & Iron	539.00	539.00	t
2979d497-3014-4c8b-ac54-53b3427b1a85	cb571cae-2807-446b-b7b1-d64211b10b02	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	13	0.00	Wash & Iron	0.00	0.00	t
6081b2ee-cc86-46e7-8891-55e4c285c3d5	cb571cae-2807-446b-b7b1-d64211b10b02	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	7	0.00	Wash & Iron	0.00	0.00	t
cb5cc959-a243-4c74-87d9-0212afb73610	cb571cae-2807-446b-b7b1-d64211b10b02	55fa35a4-588a-40d8-8236-51e55b53440f	Towel	1	0.00	Special Wash	50.00	50.00	t
21c029fe-1f9b-4e09-a92a-870965352e19	cb571cae-2807-446b-b7b1-d64211b10b02	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	6	0.00	Wash & Iron	0.00	0.00	t
35a6a289-2db1-4adb-9662-49cded597246	cb571cae-2807-446b-b7b1-d64211b10b02	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	3	0.00	Wash & Iron	0.00	0.00	t
de7a2ccd-fbb9-4e28-9c94-7b787772128a	cb571cae-2807-446b-b7b1-d64211b10b02	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Dry Clean	50.00	50.00	t
1fe77303-84c5-4f8b-b13b-cc7434663bdd	1cf071c6-594b-406a-bb2c-38f455bd4f67	\N	Bulk Pile (Wash & Iron)	1	2.30	Wash & Iron	126.00	126.00	t
0ae87e22-256e-4c48-8760-5881a62589e2	1cf071c6-594b-406a-bb2c-38f455bd4f67	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	3	0.00	Wash & Iron	0.00	0.00	t
dd904c12-3e36-47ba-952b-558148a9ac91	1cf071c6-594b-406a-bb2c-38f455bd4f67	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Iron	0.00	0.00	t
1a43dd43-5284-4451-8249-27b92a205b61	1cf071c6-594b-406a-bb2c-38f455bd4f67	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	3	0.00	Wash & Iron	0.00	0.00	t
67b0572f-bcbb-48ac-8695-27634c3081c6	49d71863-872e-417d-aef7-763d7c98b5f5	\N	Blanket 	1	0.00	Custom	100.00	100.00	t
09cb794c-0ada-4c61-808c-b98f468ae83a	49d71863-872e-417d-aef7-763d7c98b5f5	\N	Bedsheet 	1	0.00	Custom	30.00	30.00	t
d65b12f3-4039-40bb-9813-14598810aa5b	49d71863-872e-417d-aef7-763d7c98b5f5	\N	Jacket 	1	0.00	Custom	20.00	20.00	t
2bc4e697-532b-47a3-a534-2ccaa9866012	07a0c931-3c8f-4903-8dcb-78614775970a	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	8	0.00	Piece Wash	15.00	120.00	t
8ea1a411-8a20-4eec-9dcf-77769c45522f	07a0c931-3c8f-4903-8dcb-78614775970a	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	8	0.00	Iron Only	8.00	64.00	t
3f9a6317-0ea2-4ab1-b478-3777afa186f9	942e1eb0-b780-47f5-8dc8-55640713a0bf	\N	Bulk Pile (Wash & Fold)	1	1.80	Wash & Fold	81.00	81.00	t
8bbe764d-36a7-4202-b4e5-8d8d95bfbc1a	942e1eb0-b780-47f5-8dc8-55640713a0bf	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Fold	0.00	0.00	t
c4275af6-20ce-4757-8ac5-76d839e5672f	942e1eb0-b780-47f5-8dc8-55640713a0bf	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Wash & Fold	0.00	0.00	t
edd313e0-de7b-4cdc-b01e-535b9960d1b2	942e1eb0-b780-47f5-8dc8-55640713a0bf	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Wash & Fold	0.00	0.00	t
084b2068-223c-4728-b208-365407e52cde	942e1eb0-b780-47f5-8dc8-55640713a0bf	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	2	0.00	Wash & Fold	0.00	0.00	t
401e51a3-167f-41ca-a54a-9e226cab5f5a	942e1eb0-b780-47f5-8dc8-55640713a0bf	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Fold	0.00	0.00	t
ce717a52-6512-4fc6-85d9-8cde8597db39	942e1eb0-b780-47f5-8dc8-55640713a0bf	55fa35a4-588a-40d8-8236-51e55b53440f	Towel	1	0.00	Special Wash	50.00	50.00	t
ae8d6094-1306-4f58-82ed-3a5c284b2d5a	05df3a5c-9198-4982-a723-ab5465e926c0	\N	Bulk Pile (Wash & Iron)	1	3.00	Wash & Iron	165.00	165.00	t
998e0e7f-2848-437a-bb84-92e9a8287cc8	05df3a5c-9198-4982-a723-ab5465e926c0	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	4	0.00	Wash & Iron	0.00	0.00	t
d7ab0a2f-779b-4b39-8723-8e0ac9383dee	05df3a5c-9198-4982-a723-ab5465e926c0	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	3	0.00	Wash & Iron	0.00	0.00	t
65049004-6923-436e-b3da-ed1b86cc9a03	05df3a5c-9198-4982-a723-ab5465e926c0	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Iron	0.00	0.00	t
1268e616-af4a-4da2-970f-b850aa46b50a	327301b1-16d8-4ab0-8568-726448e0c178	\N	Bulk Pile (Wash & Fold)	1	1.80	Wash & Fold	81.00	81.00	t
41596d3c-22fd-4774-b911-06bf45648db4	327301b1-16d8-4ab0-8568-726448e0c178	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Wash & Fold	0.00	0.00	t
ac791438-45db-4e7a-9f7b-324dc419fac0	327301b1-16d8-4ab0-8568-726448e0c178	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Wash & Fold	0.00	0.00	t
b1986e22-0f80-40cf-874b-50b3a8a5b269	327301b1-16d8-4ab0-8568-726448e0c178	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	2	0.00	Wash & Fold	0.00	0.00	t
1d2cdb2b-255e-4019-acba-057de0306237	2ddadcbc-fe79-4ac7-bb44-63be33e72f83	\N	Bulk Pile (Wash & Iron)	1	2.40	Wash & Iron	132.00	132.00	t
32a793bc-a299-422d-aeec-de1b10c06e10	2ddadcbc-fe79-4ac7-bb44-63be33e72f83	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	5	0.00	Wash & Iron	0.00	0.00	t
bed6e705-3807-47df-bb20-c346881d563a	2ddadcbc-fe79-4ac7-bb44-63be33e72f83	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	2	0.00	Wash & Iron	0.00	0.00	t
92458ce5-9a2c-4714-8faf-80daa5f537fd	12fde9e3-ff5e-40f0-8aa5-ce2f4f4f6264	\N	Blanket	4	0.00	Custom	400.00	1600.00	t
64a52a96-9f57-437c-8e5e-52af2e4f73dd	12fde9e3-ff5e-40f0-8aa5-ce2f4f4f6264	\N	Bedsheet 	5	0.00	Custom	150.00	750.00	t
c0f460f5-dda8-4cf0-9530-e898328327ec	12fde9e3-ff5e-40f0-8aa5-ce2f4f4f6264	\N	Pillow cover 	2	0.00	Custom	15.00	30.00	t
9e1748c9-bebf-4d1c-b847-8f5f4720c41f	9ab2a5b8-481b-4979-8b5d-952c2baf8837	\N	Bulk Pile (Wash & Fold)	1	2.00	Wash & Fold	90.00	90.00	t
01106cbe-79f2-4b04-b1ee-c6e42ec07900	9ab2a5b8-481b-4979-8b5d-952c2baf8837	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	3	0.00	Wash & Fold	0.00	0.00	t
3e20299d-aa4a-48c1-8c59-6c07a917527c	9ab2a5b8-481b-4979-8b5d-952c2baf8837	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Fold	0.00	0.00	t
c50e41a8-b89d-4ae3-b2b1-5c771f44bf3f	9ab2a5b8-481b-4979-8b5d-952c2baf8837	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Fold	0.00	0.00	t
e7ff4455-a56e-49ea-a081-9bfd7dbee7a2	154ad56e-74eb-44e9-b429-f8cb9c7eb417	\N	Bulk Pile (Wash & Fold)	1	2.80	Wash & Fold	126.00	126.00	t
ad1c018f-3c41-4765-a992-a9af9e54cf41	154ad56e-74eb-44e9-b429-f8cb9c7eb417	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	5	0.00	Wash & Fold	0.00	0.00	t
19ebe697-6c79-41d2-93c8-22b2f99205e6	154ad56e-74eb-44e9-b429-f8cb9c7eb417	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	4	0.00	Wash & Fold	0.00	0.00	t
d68f7ec1-b0ca-4c83-b92c-7e10ee792119	154ad56e-74eb-44e9-b429-f8cb9c7eb417	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Fold	0.00	0.00	t
a5122455-31ba-4db4-a1e6-dff37db37660	49292bd5-c024-4e26-adfd-70d7845b73f6	\N	Bulk Pile (Wash & Iron)	1	0.80	Wash & Iron	44.00	44.00	t
0e075495-1f9c-4034-9dd1-c22fabe76fae	49292bd5-c024-4e26-adfd-70d7845b73f6	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Wash & Iron	0.00	0.00	t
61d52c73-0e48-4e7b-a2ef-fc2ac7034789	49292bd5-c024-4e26-adfd-70d7845b73f6	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Iron	0.00	0.00	t
cdfb6fac-aa36-43e0-9814-5aa27686bf5b	3ea4bec7-f61c-4093-85d3-7bccb34eca35	\N	Bulk Pile (Wash & Iron)	1	1.75	Wash & Iron	96.00	96.00	t
40af4a36-4f7f-4548-a67f-b9ba075e4eb3	3ea4bec7-f61c-4093-85d3-7bccb34eca35	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	5	0.00	Wash & Iron	0.00	0.00	t
cdfbc974-b4ba-4490-9c48-bfef9802d5b7	3ea4bec7-f61c-4093-85d3-7bccb34eca35	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	2	0.00	Wash & Iron	0.00	0.00	t
93a6ab3b-7240-438b-8d58-8725abf899fa	b7cc9ac3-0d1c-49d8-b313-9d21a0168e77	\N	Bulk Pile (Wash & Iron)	1	0.84	Wash & Iron	46.00	46.00	t
9a5aac37-05a2-4ad5-8120-07b835a57e5a	b7cc9ac3-0d1c-49d8-b313-9d21a0168e77	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Wash & Iron	0.00	0.00	t
b53f201a-865f-46e3-9b75-8b9f1338ac93	b7cc9ac3-0d1c-49d8-b313-9d21a0168e77	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Iron	0.00	0.00	t
261e3005-023e-4add-9768-9b0843905d1b	ffe43eda-eeb8-4767-ac11-42ccd97f73cd	\N	Bulk Pile (Wash & Iron)	1	2.59	Wash & Iron	142.00	142.00	t
5985af84-0ed9-4672-968e-a37287c325ad	ffe43eda-eeb8-4767-ac11-42ccd97f73cd	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Wash & Iron	0.00	0.00	t
f3d4845a-bf26-4c21-956e-9b81a53d33ec	ffe43eda-eeb8-4767-ac11-42ccd97f73cd	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Iron	0.00	0.00	t
36b3ef4d-1a60-41c9-ab00-5bb28233ffe2	ffe43eda-eeb8-4767-ac11-42ccd97f73cd	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	2	0.00	Wash & Iron	0.00	0.00	t
938e1521-c810-4a31-a26b-b122f43de3ee	ffe43eda-eeb8-4767-ac11-42ccd97f73cd	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	5	0.00	Wash & Iron	0.00	0.00	t
d8c4a962-1146-4f51-a9df-966f0d2ccf08	ffe43eda-eeb8-4767-ac11-42ccd97f73cd	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Iron	0.00	0.00	t
8fbe4b78-7304-43e4-8f42-45790e7eda6e	4ed90aa8-670c-41fa-a364-c379ec53b487	\N	Bulk Pile (Wash & Iron)	1	2.00	Wash & Iron	110.00	110.00	t
467cc6bb-a5d5-43a6-8bef-984c0c627722	4ed90aa8-670c-41fa-a364-c379ec53b487	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	4	0.00	Wash & Iron	0.00	0.00	t
95f8d748-9010-40ff-a94b-0fde2072014a	4ed90aa8-670c-41fa-a364-c379ec53b487	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	2	0.00	Wash & Iron	0.00	0.00	t
646c6ffb-b00e-432a-95de-ff03e8cc1a5e	60981eef-5513-4d2b-ba9d-dfe539823ecf	\N	Bulk Pile (Wash & Iron)	1	1.99	Wash & Iron	109.00	109.00	t
b6d12be6-7f7c-4a12-a1c8-4ab19e96428a	60981eef-5513-4d2b-ba9d-dfe539823ecf	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Wash & Iron	0.00	0.00	t
6c8d6ae9-9a7f-44a8-be12-edfdec04f01f	60981eef-5513-4d2b-ba9d-dfe539823ecf	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Wash & Iron	0.00	0.00	t
83a54550-522d-4343-9710-a8b890c9375d	60981eef-5513-4d2b-ba9d-dfe539823ecf	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	2	0.00	Wash & Iron	0.00	0.00	t
2048217e-6503-491d-8627-1e6acf2a450e	0066bb38-017e-4910-807c-3e4aaa6d460a	\N	Bulk Pile (Wash & Iron)	1	3.00	Wash & Iron	165.00	165.00	t
ecbbf4a2-e710-42fd-82b3-d90332a98297	0066bb38-017e-4910-807c-3e4aaa6d460a	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Iron	0.00	0.00	t
aca3ec51-447d-45d7-b314-e3e220bebd1e	0066bb38-017e-4910-807c-3e4aaa6d460a	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	3	0.00	Wash & Iron	0.00	0.00	t
bda8efac-b40b-4032-b00a-8e21081fc610	0066bb38-017e-4910-807c-3e4aaa6d460a	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	2	0.00	Wash & Iron	0.00	0.00	t
18dc4356-9333-4eaf-94af-cc9c25cd81ce	ee5d0b7f-db1f-43dc-9595-6e1400299eed	\N	Bulk Pile (Wash & Fold)	1	3.30	Wash & Fold	149.00	149.00	t
6fa8b9d7-eb42-4012-abb8-43f6b35b540c	ee5d0b7f-db1f-43dc-9595-6e1400299eed	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	5	0.00	Wash & Fold	0.00	0.00	t
f1ec57c3-79b4-4863-83d7-1757cbe15d17	ee5d0b7f-db1f-43dc-9595-6e1400299eed	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Fold	0.00	0.00	t
a0844978-d06b-440c-85e8-c35aa62a5c50	ee5d0b7f-db1f-43dc-9595-6e1400299eed	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	6	0.00	Wash & Fold	0.00	0.00	t
ab999dcf-c6bc-46ee-9eaf-a173b480834c	638a1cef-c621-4a63-aa43-cebe6b09c1b0	\N	Bulk Pile (Wash & Fold)	1	3.00	Wash & Fold	135.00	135.00	t
a0a54103-f236-4bea-99ac-2e45c756de71	638a1cef-c621-4a63-aa43-cebe6b09c1b0	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	3	0.00	Wash & Fold	0.00	0.00	t
8b96ecbe-c5e0-454f-a04c-88446786ecf2	638a1cef-c621-4a63-aa43-cebe6b09c1b0	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Fold	0.00	0.00	t
0e8415b5-bbe4-4e4d-8db6-4fec943d56f5	638a1cef-c621-4a63-aa43-cebe6b09c1b0	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	3	0.00	Wash & Fold	0.00	0.00	t
07525b0e-5aba-48e6-a8f1-977331f9146a	638a1cef-c621-4a63-aa43-cebe6b09c1b0	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Fold	0.00	0.00	t
c476a4c6-abe1-499f-90e6-90f40d86903e	6ff1cfcc-a414-488c-a4df-f8217b162603	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Dry Clean	50.00	100.00	t
0b1c8e36-0ed0-4158-95cb-393ba8f2e46d	6ff1cfcc-a414-488c-a4df-f8217b162603	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Piece Wash	15.00	15.00	t
e13985a9-55f8-42bd-b8ac-89ec1436d001	2de9c47e-722a-4b25-81bc-b2490ad50b95	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	12	0.00	Iron Only	8.00	96.00	t
55a70420-3aa7-4ea4-a2fc-eb5a0efb6449	434661f4-9b8d-443a-82d0-62f2cb23dbf0	\N	Bulk Pile (Wash & Fold)	1	0.70	Wash & Fold	31.00	31.00	t
d4f35ba2-ae7c-4978-9726-80aeb18a6cf1	434661f4-9b8d-443a-82d0-62f2cb23dbf0	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Fold	0.00	0.00	t
e71c563e-7f6d-4d2e-a54d-2a4ade0fbacb	434661f4-9b8d-443a-82d0-62f2cb23dbf0	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Fold	0.00	0.00	t
82692017-a4f4-451d-abb0-4b1a7d0871aa	e9497c5d-1391-4d95-a435-085c05ed495c	\N	Bulk Pile (Wash & Iron)	1	6.30	Wash & Iron	347.00	347.00	t
7998863d-3bb5-4254-a84f-ac790a178b49	e9497c5d-1391-4d95-a435-085c05ed495c	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Wash & Iron	0.00	0.00	t
298e8062-3ad3-40c4-bd6a-9bea9c24454a	e9497c5d-1391-4d95-a435-085c05ed495c	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	9	0.00	Wash & Iron	0.00	0.00	t
a5d0fad1-febf-42c7-a071-3ffd5ed5d7f4	e9497c5d-1391-4d95-a435-085c05ed495c	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	5	0.00	Wash & Iron	0.00	0.00	t
292b0cc2-88f4-4861-a233-187bfc114601	e9497c5d-1391-4d95-a435-085c05ed495c	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	2	0.00	Wash & Iron	0.00	0.00	t
1d632b0f-1721-4790-9735-c3f1c46628e1	e9497c5d-1391-4d95-a435-085c05ed495c	\N	Towel	1	0.00	Custom	10.00	10.00	t
746fbb0f-38be-46de-adda-1e03ec79338b	6e66ae30-d172-49ff-b50f-c27ceb04d4ba	b5c1b36f-324d-454a-9aef-f7780af6a409	Sweatshirt	1	0.00	Dry Clean	50.00	50.00	t
a76101eb-8ceb-4302-afa9-f147e7c6b917	cad34f3c-b838-42bc-939e-cb1fe760921a	\N	Bulk Pile (Wash & Iron)	1	1.10	Wash & Iron	61.00	61.00	t
82b607fc-00d0-44ef-be14-9b7aa9cd6a70	cad34f3c-b838-42bc-939e-cb1fe760921a	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	2	0.00	Wash & Iron	0.00	0.00	t
fbc61b4c-0f19-4386-b1dc-73c12e9e98bc	cad34f3c-b838-42bc-939e-cb1fe760921a	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Iron	0.00	0.00	t
63b2bf8c-67ab-4a54-821e-1bcaefd8ea7f	cad34f3c-b838-42bc-939e-cb1fe760921a	55fa35a4-588a-40d8-8236-51e55b53440f	Towel	1	0.00	Special Wash	10.00	10.00	t
e2adbd08-8f0a-473b-b2ac-322d2baebcc4	26303a2c-746b-4b09-9b17-11e2bbb72536	\N	Bulk Pile (Wash & Fold)	1	0.80	Wash & Fold	36.00	36.00	t
843b64ff-92f7-4b32-bfcd-c1dbe8b227fd	26303a2c-746b-4b09-9b17-11e2bbb72536	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Fold	0.00	0.00	t
c6ef5f89-96a2-42d7-8805-bb86d42a3cf2	26303a2c-746b-4b09-9b17-11e2bbb72536	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Fold	0.00	0.00	t
8575a75e-29f1-4f87-88e6-36900f4ef76f	8cfe2267-74b8-4db0-b509-b9d016b130fb	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Dry Clean	50.00	100.00	t
5dd9339b-581b-45c0-bdcc-647e8aef0c68	4b88e92e-d887-4991-b33d-bc25da9d62f8	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Dry Clean	50.00	50.00	t
06673857-91e7-4d31-9a30-a92e038252c8	7b628141-7a5a-4319-9438-91ab836829a6	\N	Bulk Pile (Wash & Fold)	1	2.60	Wash & Fold	117.00	117.00	t
51ab9e02-0404-4256-8ade-eef4504b7490	7b628141-7a5a-4319-9438-91ab836829a6	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	7	0.00	Wash & Fold	0.00	0.00	t
da779e5c-c2d3-4179-9636-38183f5c8fd4	8f97e846-fb27-4c31-a721-0cff942b1e8d	\N	Bulk Pile (Wash & Fold)	1	2.00	Wash & Fold	90.00	90.00	t
9aa8f607-92e0-4644-b8eb-f65bdb6bdeb2	8f97e846-fb27-4c31-a721-0cff942b1e8d	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	6	0.00	Wash & Fold	0.00	0.00	t
2f744283-e03e-488f-a619-49066d66f412	8f97e846-fb27-4c31-a721-0cff942b1e8d	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	2	0.00	Wash & Fold	0.00	0.00	t
99b9bf76-9360-498d-ac9d-52b3f389b54f	8f97e846-fb27-4c31-a721-0cff942b1e8d	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Iron Only	8.00	16.00	t
8ac5bea1-a503-46eb-9332-1d10d33461dd	a1c9d292-91b9-4e4b-aa28-f73fbf91bb27	\N	Bulk Pile (Wash & Iron)	1	2.00	Wash & Iron	120.00	120.00	t
92a41010-63d6-4dbb-937f-01c11cdf54d3	a1c9d292-91b9-4e4b-aa28-f73fbf91bb27	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	4	0.00	Wash & Iron	0.00	0.00	t
0ba481eb-4c0f-4b34-967c-59d312bd29fc	4380c765-b0f6-48fc-9017-1f41433dcc37	\N	Bulk Pile (Wash & Iron)	1	2.00	Wash & Iron	120.00	120.00	t
3de1c85d-d99b-41ae-8631-1e6d962acd2f	4380c765-b0f6-48fc-9017-1f41433dcc37	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	5	0.00	Wash & Iron	0.00	0.00	t
0d947bb0-ef9c-44b9-b2fa-a8731468cae2	4380c765-b0f6-48fc-9017-1f41433dcc37	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	4	0.00	Wash & Iron	0.00	0.00	t
de9d71bd-164d-46be-a7b6-215f662a1451	ed1fb018-9608-44ea-b6c3-e0a0e8e1d57f	\N	Bulk Pile (Wash & Iron)	1	1.00	Wash & Iron	60.00	60.00	t
0f62d149-f2d5-4b3d-bc8b-a5ff11ef3ba9	ed1fb018-9608-44ea-b6c3-e0a0e8e1d57f	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	5	0.00	Wash & Iron	0.00	0.00	t
8fe8977a-f463-4a16-9747-202648a8b6cf	d716749a-48b1-4619-80d1-3c631ecbf171	\N	Bulk Pile (Wash & Fold)	1	11.00	Wash & Fold	495.00	495.00	t
cdd69a17-2b43-44e2-a595-ddc2a693c568	d716749a-48b1-4619-80d1-3c631ecbf171	b5c1b36f-324d-454a-9aef-f7780af6a409	Sweatshirt	10	0.00	Wash & Fold	0.00	0.00	t
73852853-133c-42bc-852b-11e58cb51b15	473410cd-450f-40e5-ac5d-1e652f3633d5	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Piece Wash	15.00	15.00	t
b5f99893-a3fd-4082-a593-670156a9cd44	473410cd-450f-40e5-ac5d-1e652f3633d5	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Piece Wash	15.00	15.00	t
6b423093-334c-4178-845e-183f994ed1a5	473410cd-450f-40e5-ac5d-1e652f3633d5	4755af9d-1b41-4b0f-8ae0-5dcfbaa6591b	Top	1	0.00	Piece Wash	15.00	15.00	t
6772a89e-d154-4317-9b7a-37fbdbdbd746	ed0cc617-e4af-4fdf-97f6-2176d76b12e2	\N	Bulk Pile (Wash & Iron)	1	1.60	Wash & Iron	96.00	96.00	t
f33dc6de-8233-46eb-90f9-fdc26b14ad82	ed0cc617-e4af-4fdf-97f6-2176d76b12e2	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Wash & Iron	0.00	0.00	t
076c11df-7240-4ead-a0c7-04a4b472e2c5	ed0cc617-e4af-4fdf-97f6-2176d76b12e2	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Iron	0.00	0.00	t
39155494-86be-4ab6-bcd7-3a96f352e704	ed0cc617-e4af-4fdf-97f6-2176d76b12e2	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Wash & Iron	0.00	0.00	t
7c91a77a-9ac7-40e5-ab33-67a0dddbfc35	ed0cc617-e4af-4fdf-97f6-2176d76b12e2	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Iron	0.00	0.00	t
b7ec0ad9-2472-4ac1-a814-370db6efc93a	4e53a897-c1ea-46ab-bf70-c319e9fe5150	\N	Bulk Pile (Wash & Iron)	1	2.30	Wash & Iron	138.00	138.00	t
5189dfe5-bbfc-4d2b-bab1-909f0a74ac59	4e53a897-c1ea-46ab-bf70-c319e9fe5150	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	4	0.00	Wash & Iron	0.00	0.00	t
e3810009-7474-4f26-a638-5b1923a08aca	4e53a897-c1ea-46ab-bf70-c319e9fe5150	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Wash & Iron	0.00	0.00	t
c7825691-41a1-4209-abdb-78a288d1de04	4e53a897-c1ea-46ab-bf70-c319e9fe5150	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	2	0.00	Wash & Iron	0.00	0.00	t
e23cafd5-56fc-4cd2-b9df-38fc0cf10c88	4e53a897-c1ea-46ab-bf70-c319e9fe5150	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Iron	0.00	0.00	t
2325c293-c22e-4f49-9fc8-550d6ca3c115	ced8b24c-84e6-4a98-a2d5-3ae732e5ebeb	\N	Bulk Pile (Wash & Iron)	1	3.90	Wash & Iron	234.00	234.00	t
857cb6c0-68b1-4d50-8de6-d662f8522ac1	ced8b24c-84e6-4a98-a2d5-3ae732e5ebeb	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	3	0.00	Wash & Iron	0.00	0.00	t
3b62886b-42dd-4584-a500-3329076eb253	ced8b24c-84e6-4a98-a2d5-3ae732e5ebeb	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	8	0.00	Wash & Iron	0.00	0.00	t
8a5dcf06-c514-4ee2-b7b2-aecbc980112f	ced8b24c-84e6-4a98-a2d5-3ae732e5ebeb	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Iron	0.00	0.00	t
6959da81-2499-4dc5-8d8d-701e1adf38cc	ced8b24c-84e6-4a98-a2d5-3ae732e5ebeb	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Iron	0.00	0.00	t
6b89711a-fdb5-40de-834a-75bb8197a608	f3a1b3d6-2fd3-4996-8f26-c2961923638b	\N	Bulk Pile (Wash & Fold)	1	2.80	Wash & Fold	126.00	126.00	t
6d64a1a1-d4e0-4b71-adb6-fb2862120772	f3a1b3d6-2fd3-4996-8f26-c2961923638b	\N	Shoes	1	0.00	Custom	100.00	100.00	t
7d0cedf6-48ef-4f77-904a-c958a051555d	f3a1b3d6-2fd3-4996-8f26-c2961923638b	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	4	0.00	Wash & Fold	0.00	0.00	t
73514476-47f7-49df-b8a4-8889ee6f007d	f3a1b3d6-2fd3-4996-8f26-c2961923638b	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Wash & Fold	0.00	0.00	t
2d2e9200-e70d-476d-8365-5d90944bb4ee	f3a1b3d6-2fd3-4996-8f26-c2961923638b	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Fold	0.00	0.00	t
03906073-ce3f-444b-8502-ecf3923155fe	f3a1b3d6-2fd3-4996-8f26-c2961923638b	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	2	0.00	Wash & Fold	0.00	0.00	t
ba9787b8-3b81-4f7d-a081-09c2cf03805d	f3a1b3d6-2fd3-4996-8f26-c2961923638b	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Fold	0.00	0.00	t
1e33f0a6-b752-4f6a-acc3-840d1c9d8066	f3a1b3d6-2fd3-4996-8f26-c2961923638b	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Dry Clean	50.00	100.00	t
9f1be40a-21a4-4890-ac67-0db1cb46edda	85f6471f-a8f7-45ad-8bd0-2a173e870d70	\N	Towel	2	0.00	Custom	13.00	26.00	t
4372bdfd-c882-43c4-a571-5b7ab8ef9d79	85f6471f-a8f7-45ad-8bd0-2a173e870d70	\N	Bedsheet 	1	0.00	Custom	1.00	1.00	t
40feac91-cbe4-4018-a246-a31b5806b941	85f6471f-a8f7-45ad-8bd0-2a173e870d70	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	5	0.00	Piece Wash	15.00	75.00	t
f16b785a-4f55-409a-adb1-ca7409c5238f	85f6471f-a8f7-45ad-8bd0-2a173e870d70	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	3	0.00	Piece Wash	15.00	45.00	t
2ffb6c32-bee3-4aae-99a5-283a82b42427	85f6471f-a8f7-45ad-8bd0-2a173e870d70	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Piece Wash	15.00	15.00	t
7cfbc2c7-afa2-4660-823d-25283ae32047	85f6471f-a8f7-45ad-8bd0-2a173e870d70	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Piece Wash	15.00	15.00	t
e7601f6f-f8c7-4976-aec1-88eb747696fd	85f6471f-a8f7-45ad-8bd0-2a173e870d70	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Piece Wash	15.00	15.00	t
d5b15049-d128-48b7-ae57-274c1f4b8f48	85f6471f-a8f7-45ad-8bd0-2a173e870d70	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	5	0.00	Iron Only	8.00	40.00	t
877d66a1-3562-455c-b8e0-58b097ee1498	06cc03dc-1792-4903-97e9-237c9a222519	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Piece Wash	15.00	15.00	t
80732b07-e5f0-4971-a915-465870c235ec	06cc03dc-1792-4903-97e9-237c9a222519	55fa35a4-588a-40d8-8236-51e55b53440f	Towel	1	0.00	Special Wash	15.00	15.00	t
6dd0d951-d8ac-480a-b8e8-c46a2ec2bce0	377e24df-a83e-431f-9feb-b0de365a82ac	\N	Bulk Pile (Wash & Fold)	1	1.80	Wash & Fold	81.00	81.00	t
df4e9591-4ed8-43a3-9111-0ff4f04ecfd0	377e24df-a83e-431f-9feb-b0de365a82ac	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Wash & Fold	0.00	0.00	t
93577b83-4dfe-4e8f-b90d-07025002b3e5	377e24df-a83e-431f-9feb-b0de365a82ac	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	2	0.00	Wash & Fold	0.00	0.00	t
bafb1bdb-5aa1-4770-a3fc-06d864e2883c	377e24df-a83e-431f-9feb-b0de365a82ac	621a2bdf-e188-4255-af20-6e525e166c80	Hoodie	1	0.00	Wash & Fold	0.00	0.00	t
d6a64e89-0620-4e7b-afc3-2534662a8742	addcc671-cc7e-4dff-99fe-7a53394f3598	\N	Bulk Pile (Wash & Fold)	1	1.20	Wash & Fold	54.00	54.00	t
4ce1bf7b-618a-4a30-bf7d-01cd624a6e75	addcc671-cc7e-4dff-99fe-7a53394f3598	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Wash & Fold	0.00	0.00	t
5b0e7535-d8f4-44c1-a21b-0ae49e1c46ba	addcc671-cc7e-4dff-99fe-7a53394f3598	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Fold	0.00	0.00	t
4aedd693-8c36-4d45-8a93-ea0623a57122	addcc671-cc7e-4dff-99fe-7a53394f3598	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Fold	0.00	0.00	t
b993fd43-c74e-42d7-a82c-eb671b83c288	addcc671-cc7e-4dff-99fe-7a53394f3598	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Fold	0.00	0.00	t
3948453d-2a27-4f7e-9baf-33ca8961a73d	cd935607-4bc5-485f-81ba-f940d178e420	\N	Bulk Pile (Wash & Iron)	1	2.00	Wash & Iron	120.00	120.00	t
dbee82bc-112a-4572-acd9-8fa92b24276d	cd935607-4bc5-485f-81ba-f940d178e420	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	5	0.00	Wash & Iron	0.00	0.00	t
0d203443-a440-4835-8411-7c7343701884	cd935607-4bc5-485f-81ba-f940d178e420	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Iron	0.00	0.00	t
49877d9b-ec53-45a2-ad2c-51757cad4655	8056d2d2-08a3-4197-b477-1757bd59fd9a	\N	Bulk Pile (Wash & Iron)	1	2.10	Wash & Iron	126.00	126.00	t
a35fc7b3-dfe1-4116-a553-7ffaabf1d8bf	8056d2d2-08a3-4197-b477-1757bd59fd9a	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	4	0.00	Wash & Iron	0.00	0.00	t
fd75760d-5787-4ede-9359-b7df2c872946	8056d2d2-08a3-4197-b477-1757bd59fd9a	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	2	0.00	Wash & Iron	0.00	0.00	t
576e0379-e407-4524-9622-7104b8df5db1	8056d2d2-08a3-4197-b477-1757bd59fd9a	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Iron	0.00	0.00	t
8b913d2e-4a8b-41eb-8bfb-9a0cb96f846f	74c6feff-7b73-4dcd-b947-79ff36172a2d	\N	Bulk Pile (Wash & Fold)	1	1.50	Wash & Fold	68.00	68.00	t
e756a953-5ff2-46c6-9488-6f19d3871bc8	74c6feff-7b73-4dcd-b947-79ff36172a2d	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Fold	0.00	0.00	t
518dde1a-d50f-4b1e-b80b-79d7d43c04ab	74c6feff-7b73-4dcd-b947-79ff36172a2d	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	4	0.00	Wash & Fold	0.00	0.00	t
098512ea-228c-4be1-896d-df89eb95c324	74c6feff-7b73-4dcd-b947-79ff36172a2d	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Fold	0.00	0.00	t
b41a2bb2-0bec-4dca-b52a-87754c2e30bc	74c6feff-7b73-4dcd-b947-79ff36172a2d	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Iron Only	8.00	8.00	t
5301292d-27bd-48a0-92a1-9e54f1dc4c09	74c6feff-7b73-4dcd-b947-79ff36172a2d	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Iron Only	8.00	8.00	t
9f86df19-90fa-49a2-8000-fc0256f7dcbc	6f15be12-8421-4680-aa93-a26bcfd8c4f9	\N	Bulk Pile (Wash & Iron)	1	0.50	Wash & Iron	30.00	30.00	t
bb7ee391-d270-40bc-a8f9-98fbe6909102	6f15be12-8421-4680-aa93-a26bcfd8c4f9	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Wash & Iron	0.00	0.00	t
47647270-41c2-40ab-8453-cb1ab8c0ecfa	70ebb1ff-590f-49bf-944c-3155f441f6b8	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	4	0.00	Piece Wash	15.00	60.00	t
9968c1f8-9040-4ec3-83f9-698fbf580943	70ebb1ff-590f-49bf-944c-3155f441f6b8	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Piece Wash	15.00	15.00	t
588767b1-b7d2-4ec9-aef8-a66b34bfdb48	70ebb1ff-590f-49bf-944c-3155f441f6b8	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	3	0.00	Piece Wash	15.00	45.00	t
f0effa70-722f-464e-af06-074d13ac3ce0	5e172a19-61d2-417e-978a-b438af3001f0	\N	Bulk Pile (Wash & Fold)	1	1.80	Wash & Fold	81.00	81.00	t
0b788be4-7c8c-4f9c-bfde-a0df59e55f7a	5e172a19-61d2-417e-978a-b438af3001f0	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Wash & Fold	0.00	0.00	t
959ac2bc-3ddd-4549-a921-9df888c1f5ab	5e172a19-61d2-417e-978a-b438af3001f0	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	3	0.00	Wash & Fold	0.00	0.00	t
e465d120-e2c7-472a-89c0-39910e154aaa	5e172a19-61d2-417e-978a-b438af3001f0	621a2bdf-e188-4255-af20-6e525e166c80	Hoodie	1	0.00	Wash & Fold	0.00	0.00	t
8fe677eb-fe85-4245-a416-cab00f5c6332	0bc204f1-3f42-4c7d-993a-33d3401caf36	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Piece Wash	15.00	30.00	t
1ff458ce-ab4a-4467-9267-c1423a30e710	0bc204f1-3f42-4c7d-993a-33d3401caf36	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	2	0.00	Piece Wash	15.00	30.00	t
6a24acdc-2402-4062-860b-fac16ef6f19e	fcd79a05-39e3-43d1-8fb3-89631830e8f2	\N	Bulk Pile (Wash & Iron)	1	1.00	Wash & Iron	60.00	60.00	t
45799373-335c-43d7-a676-163fc7cad1fd	fcd79a05-39e3-43d1-8fb3-89631830e8f2	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Wash & Iron	0.00	0.00	t
e30c9b62-975b-4f72-a3a6-76b912db67d6	fcd79a05-39e3-43d1-8fb3-89631830e8f2	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Iron	0.00	0.00	t
cb51438c-dffb-4a36-850c-41f8a0ab31d9	db1fe6a8-15fa-427d-bcf5-01f92ba80303	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Piece Wash	15.00	15.00	t
71003677-bebb-47ec-b79b-7128f49717fb	db1fe6a8-15fa-427d-bcf5-01f92ba80303	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	3	0.00	Piece Wash	15.00	45.00	t
da01d090-e461-4da6-badc-822ff4139d8d	db1fe6a8-15fa-427d-bcf5-01f92ba80303	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Piece Wash	15.00	15.00	t
ba5120d0-a1b6-4e91-b528-5769e08a983c	db1fe6a8-15fa-427d-bcf5-01f92ba80303	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Piece Wash	15.00	15.00	t
220d3825-df5f-4961-ba45-9661a546c9a1	db1fe6a8-15fa-427d-bcf5-01f92ba80303	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Piece Wash	15.00	15.00	t
19eae25b-3dd8-4555-8995-c7d13bce5fc2	1aaefcf5-f2cf-46fb-87de-471657d2c8d5	\N	Bulk Pile (Wash & Iron)	1	3.50	Wash & Iron	210.00	210.00	t
714301fb-2781-4978-b79b-498ddc46df55	1aaefcf5-f2cf-46fb-87de-471657d2c8d5	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	6	0.00	Wash & Iron	0.00	0.00	t
3392741d-171f-4f45-8bcf-eedb54bc57ba	1aaefcf5-f2cf-46fb-87de-471657d2c8d5	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Dry Clean	50.00	50.00	t
bbf05860-6c04-4838-bde7-4955704ceb68	1aaefcf5-f2cf-46fb-87de-471657d2c8d5	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Wash & Iron	0.00	0.00	t
3b5bec1a-1610-4b5c-aaab-fd42ef8d8c87	1aaefcf5-f2cf-46fb-87de-471657d2c8d5	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	2	0.00	Wash & Iron	0.00	0.00	t
45dab5dc-360a-4b51-9b64-a86e274dcbc5	1aaefcf5-f2cf-46fb-87de-471657d2c8d5	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	2	0.00	Wash & Iron	0.00	0.00	t
f1849ec9-d15b-44d0-9565-6d865121274e	1aaefcf5-f2cf-46fb-87de-471657d2c8d5	\N	Towel 	1	0.00	Custom	10.00	10.00	t
2bd78337-cb8c-4e6f-b5ed-e71cafd68f2b	e00ca99d-686f-4a0e-8930-08ede7534acc	\N	Blanket 	2	0.00	Custom	50.00	100.00	t
19b2fb91-8e79-448b-b338-9fa91a64c177	cebe7876-ffe5-4a06-b0de-ac984eeca2a4	\N	Bulk Pile (Wash & Fold)	1	1.50	Wash & Fold	68.00	68.00	t
dd7ca7f8-adfe-408b-918e-55a34c540a97	cebe7876-ffe5-4a06-b0de-ac984eeca2a4	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Fold	0.00	0.00	t
f799d60e-c0d0-4988-8512-89bf69bdd500	cebe7876-ffe5-4a06-b0de-ac984eeca2a4	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Fold	0.00	0.00	t
2c4ebb5e-0753-4ce5-b77c-4318881cc360	cebe7876-ffe5-4a06-b0de-ac984eeca2a4	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Fold	0.00	0.00	t
d93f6b5c-104e-443a-a615-d0c67b8ac616	cebe7876-ffe5-4a06-b0de-ac984eeca2a4	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Wash & Fold	0.00	0.00	t
987fc83f-771e-4c3c-a531-61ef9e4b62dc	cebe7876-ffe5-4a06-b0de-ac984eeca2a4	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Fold	0.00	0.00	t
73738473-98e5-4604-8d58-b60809eae38d	cebe7876-ffe5-4a06-b0de-ac984eeca2a4	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Iron Only	8.00	16.00	t
04e74995-bf41-4743-99be-144424e720c0	cebe7876-ffe5-4a06-b0de-ac984eeca2a4	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Iron Only	8.00	8.00	t
969706e6-d7c2-4d60-ad96-332847d4db30	deb869d1-37c3-4d98-88d5-db7f88e01298	\N	Nos 10	10	0.00	Custom	10.00	100.00	t
47de4a5a-a9ef-44af-ba95-1e0c6970d4d0	f588d346-8521-45a0-a9a6-9dda1cd57b13	\N	Bulk Pile (Wash & Fold)	1	1.30	Wash & Fold	59.00	59.00	t
6a1f1df9-e7b4-4811-a0df-49ac03a26f2f	f588d346-8521-45a0-a9a6-9dda1cd57b13	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Wash & Fold	0.00	0.00	t
477e594c-273d-478f-a2d1-0566a82ba0bb	f588d346-8521-45a0-a9a6-9dda1cd57b13	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Fold	0.00	0.00	t
1d2e66e7-bf5a-4897-9f0f-1d49a166d2d6	f588d346-8521-45a0-a9a6-9dda1cd57b13	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Fold	0.00	0.00	t
1c701801-25b8-43f3-bf2a-a2ee0c885b24	f588d346-8521-45a0-a9a6-9dda1cd57b13	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Iron Only	8.00	16.00	t
a790b47a-778e-4954-8072-849c008e13da	b8323c1b-9be0-411f-a3e4-4c5cb15c9a87	\N	Bulk Pile (Wash & Fold)	1	1.00	Wash & Fold	45.00	45.00	t
3df2b3a1-67c5-44d4-ac31-dc887dc4c02e	b8323c1b-9be0-411f-a3e4-4c5cb15c9a87	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Wash & Fold	0.00	0.00	t
28dfb4fc-d4c0-4dff-8879-97eae2af5be3	b8323c1b-9be0-411f-a3e4-4c5cb15c9a87	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Fold	0.00	0.00	t
227c9726-1bc4-47d5-8efc-448337ee1843	8fa4ab65-491d-4f29-bf04-70a8144e76ad	\N	Bulk Pile (Wash & Fold)	1	4.50	Wash & Fold	203.00	203.00	t
ab229c83-1bf7-4d1d-a799-4dfa0f0960c8	8fa4ab65-491d-4f29-bf04-70a8144e76ad	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	3	0.00	Wash & Fold	0.00	0.00	t
0532726f-d55a-4605-9cc1-4ba6e57e5b66	8fa4ab65-491d-4f29-bf04-70a8144e76ad	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	4	0.00	Wash & Fold	0.00	0.00	t
02daaf72-8c57-4ca0-b6ec-f3cf5eb4b260	8fa4ab65-491d-4f29-bf04-70a8144e76ad	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	6	0.00	Wash & Fold	0.00	0.00	t
3971232d-a828-463e-9576-859774b0ddea	8fa4ab65-491d-4f29-bf04-70a8144e76ad	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	5	0.00	Iron Only	8.00	40.00	t
a528961d-132d-43e6-9749-6a3c425a3eb5	4334d03b-349c-49cc-b30d-1d1caf1ff0eb	\N	Bulk Pile (Wash & Iron)	1	1.20	Wash & Iron	72.00	72.00	t
29662cbf-be4b-46ee-9094-de5f20f4692f	4334d03b-349c-49cc-b30d-1d1caf1ff0eb	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Wash & Iron	0.00	0.00	t
665b8da6-25b4-48c7-ae10-47c19380c0fd	4334d03b-349c-49cc-b30d-1d1caf1ff0eb	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Wash & Iron	0.00	0.00	t
71f16000-d706-4300-b724-0542254b6481	4334d03b-349c-49cc-b30d-1d1caf1ff0eb	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Iron	0.00	0.00	t
b0422b23-a41e-4601-ad91-0922b5c2e918	e9680322-ff96-41ab-b5a7-56c6540b611f	\N	Bulk Pile (Wash & Fold)	1	6.00	Wash & Fold	270.00	270.00	t
b4b51fc6-789d-4af6-acee-211864da9424	e9680322-ff96-41ab-b5a7-56c6540b611f	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	6	0.00	Wash & Fold	0.00	0.00	t
d0fef16d-d06b-435c-8971-c85aed2a634a	e9680322-ff96-41ab-b5a7-56c6540b611f	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	4	0.00	Wash & Fold	0.00	0.00	t
aa5c574c-f660-4f5b-8954-ff489973b6ba	e9680322-ff96-41ab-b5a7-56c6540b611f	621a2bdf-e188-4255-af20-6e525e166c80	Hoodie	1	0.00	Wash & Fold	0.00	0.00	t
cba1c0e0-a790-4f0a-950d-93c1a031ea0f	e9680322-ff96-41ab-b5a7-56c6540b611f	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	5	0.00	Wash & Fold	0.00	0.00	t
a79ae45d-b185-42a8-a61a-91701b1a8fe2	e9680322-ff96-41ab-b5a7-56c6540b611f	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	6	0.00	Iron Only	8.00	48.00	t
1ccc8502-1f70-4526-bc50-fc670d44b4ae	2feaa5ef-71df-488e-94fb-2d051b75a0b9	\N	Nos17	17	0.00	Custom	10.00	170.00	t
e048967f-26a0-4b62-8c38-90817a9558a3	688389c0-0f29-45f4-8e09-d8846dfe0e4e	\N	Bulk Pile (Wash & Iron)	1	1.20	Wash & Iron	72.00	72.00	t
03f954dc-a2e5-4092-a819-cee5a2a9d0b1	688389c0-0f29-45f4-8e09-d8846dfe0e4e	\N	1 blanket 	1	0.00	Custom	100.00	100.00	t
0090ffa1-cac3-4111-aa96-947f793dbe66	688389c0-0f29-45f4-8e09-d8846dfe0e4e	\N	Bedsheet 	1	0.00	Custom	100.00	100.00	t
d9f07813-e20b-40d3-9a0d-edca77acefcd	688389c0-0f29-45f4-8e09-d8846dfe0e4e	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	3	0.00	Wash & Iron	0.00	0.00	t
30b1f181-f3b7-4e2c-ad2c-1c5b11ec8742	688389c0-0f29-45f4-8e09-d8846dfe0e4e	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Iron	0.00	0.00	t
94876a09-fc02-42d7-9f87-635e13fa943c	52c18c21-dbfc-4a5a-a687-4acaf200ab3f	621a2bdf-e188-4255-af20-6e525e166c80	Hoodie	1	0.00	Dry Clean	50.00	50.00	t
81e4b4a0-bd92-46ba-b3b6-c8b682ad81be	52c18c21-dbfc-4a5a-a687-4acaf200ab3f	\N	Shoes 	1	0.00	Custom	100.00	100.00	t
336ced23-319e-48e6-a4b2-6f08a605d930	5978f062-3686-4801-b642-6cb239904ed2	\N	Bulk Pile (Wash & Iron)	1	2.40	Wash & Iron	144.00	144.00	t
45b06e31-5017-45cd-8c40-5fdd55ecbf34	5978f062-3686-4801-b642-6cb239904ed2	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	6	0.00	Wash & Iron	0.00	0.00	t
31ad5034-5eb0-4a87-9f4b-a8f9bbf4a888	5978f062-3686-4801-b642-6cb239904ed2	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	2	0.00	Wash & Iron	0.00	0.00	t
dfb4b3b3-9eb8-455e-989c-94c9ef147f2d	1dde82b9-57ba-4d0f-8072-daa9cc2d2501	\N	Bulk Pile (Wash & Iron)	1	1.00	Wash & Iron	60.00	60.00	t
33f27df7-78c0-4ee1-bb1c-4fc189b9f731	1dde82b9-57ba-4d0f-8072-daa9cc2d2501	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Iron	0.00	0.00	t
9a33705c-506c-4966-a7c3-eb96470620cc	1dde82b9-57ba-4d0f-8072-daa9cc2d2501	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	2	0.00	Wash & Iron	0.00	0.00	t
75c45d6a-4db0-462c-85b4-021ac9b9dae2	f0d8c1f9-fef0-49c4-89c9-19da9b2f9491	\N	Bulk Pile (Wash & Fold)	1	2.90	Wash & Fold	131.00	131.00	t
a8b35a1f-322b-43d9-8856-6c747a621802	f0d8c1f9-fef0-49c4-89c9-19da9b2f9491	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	7	0.00	Wash & Fold	0.00	0.00	t
257c1d1b-07c3-447e-86be-ea9f441fa98b	f0d8c1f9-fef0-49c4-89c9-19da9b2f9491	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	2	0.00	Wash & Fold	0.00	0.00	t
8f72f9fb-a06b-4420-a4ad-2837dcfdc1b8	f0d8c1f9-fef0-49c4-89c9-19da9b2f9491	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Fold	0.00	0.00	t
a0f8300e-c47c-4623-8458-075d01b21667	f0d8c1f9-fef0-49c4-89c9-19da9b2f9491	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Wash & Fold	0.00	0.00	t
3948c4b8-3a85-48fe-b951-eb7f974e6e5e	f0d8c1f9-fef0-49c4-89c9-19da9b2f9491	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	7	0.00	Wash & Fold	0.00	0.00	t
a8564d8a-851f-4855-980c-79d317c9bdc6	73471913-6e7b-46a0-9c83-ae3ade8fb0fb	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	7	0.00	Piece Wash	15.00	105.00	t
527136ab-00c2-4308-a0d5-db227fbf919c	73471913-6e7b-46a0-9c83-ae3ade8fb0fb	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Piece Wash	15.00	15.00	t
f56cbf01-d83b-4efc-b34d-3fe70043d7e3	73471913-6e7b-46a0-9c83-ae3ade8fb0fb	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	2	0.00	Piece Wash	15.00	30.00	t
2b020eb1-a981-4ad1-87db-919f3f91ea83	73471913-6e7b-46a0-9c83-ae3ade8fb0fb	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Piece Wash	15.00	15.00	t
3ea08433-a1e6-4cb9-bf5e-cc980d1a7c11	73471913-6e7b-46a0-9c83-ae3ade8fb0fb	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	7	0.00	Piece Wash	15.00	105.00	t
0892b55d-a963-444f-aa8f-6a9c6e54966f	098b0da6-562e-4aed-a453-09e34735e5ac	\N	Bulk Pile (Wash & Fold)	1	1.50	Wash & Fold	68.00	68.00	t
88cf05d6-da1f-47fc-bc14-75ae7b1fac2b	098b0da6-562e-4aed-a453-09e34735e5ac	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	4	0.00	Wash & Fold	0.00	0.00	t
a9a0361c-126a-4fcd-8bf8-b1afb819155c	098b0da6-562e-4aed-a453-09e34735e5ac	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Fold	0.00	0.00	t
8942fa3d-f177-4381-baad-94edf6fd1659	d526c080-8422-4b2a-af55-3293342d974d	\N	Blanket 	1	0.00	Custom	80.00	80.00	t
ae54b17e-db33-463d-840a-77db44bb7e2b	d526c080-8422-4b2a-af55-3293342d974d	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Piece Wash	15.00	30.00	t
4672e3a7-10b1-4eb5-b9a6-177896af9d84	e0d8fb92-9da6-4999-b74c-4f216cd4aedb	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Piece Wash	15.00	30.00	t
f1e2ca31-90c5-4269-ac52-7a7c1637a39f	e0d8fb92-9da6-4999-b74c-4f216cd4aedb	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Piece Wash	15.00	15.00	t
b4a2d759-caaa-400e-98bd-92445cc5db74	e0d8fb92-9da6-4999-b74c-4f216cd4aedb	55fa35a4-588a-40d8-8236-51e55b53440f	Towel	1	0.00	Special Wash	10.00	10.00	t
378c59e1-ae0f-477b-ae72-718cd90ca94e	cf997584-b04a-48b7-b9f8-4feaef0166b1	\N	Bulk Pile (Wash & Iron)	1	2.00	Wash & Iron	120.00	120.00	t
37a571bc-8d2a-4ba7-8d7f-6d0feb8f667c	cf997584-b04a-48b7-b9f8-4feaef0166b1	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	4	0.00	Wash & Iron	0.00	0.00	t
c77b464c-874c-4c79-bf65-03742bd6a72e	cf997584-b04a-48b7-b9f8-4feaef0166b1	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Iron	0.00	0.00	t
e2bafc27-4400-453f-a0d2-a3da2c5ca924	cf997584-b04a-48b7-b9f8-4feaef0166b1	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Iron	0.00	0.00	t
147b3691-d0f7-40e9-b218-fae21d61db6b	6d7e1d91-5441-4f5c-9b02-8f8d241b9fa1	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	6	0.00	Piece Wash	15.00	90.00	t
321c9178-88e0-48f9-bd02-4de0231636fd	6d7e1d91-5441-4f5c-9b02-8f8d241b9fa1	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	3	0.00	Piece Wash	15.00	45.00	t
770d9cc6-fb4f-46f1-8c09-dee08639fee7	6d7e1d91-5441-4f5c-9b02-8f8d241b9fa1	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	2	0.00	Piece Wash	15.00	30.00	t
c413ac12-a5bb-41a5-8115-8f292a5d147c	6d7e1d91-5441-4f5c-9b02-8f8d241b9fa1	\N	Towel 	1	0.00	Custom	10.00	10.00	t
7bf42f25-7678-4d43-8ca4-677e86125a55	d94a6214-86c6-4aa7-bf7f-e5cd878b0355	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Iron Only	8.00	16.00	t
080f4974-4981-4b23-889a-cfe64f764e07	64ba507b-2bf6-41cf-aa9b-90d4180dd12a	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Dry Clean	50.00	50.00	t
865aa82e-a3ad-4ffe-a4d6-016d1d06634a	22e9174d-b9eb-40a7-94ed-608b7a608a9c	\N	Bedsheet 	3	0.00	Custom	30.00	90.00	t
aa806562-b9c7-4cbf-a78e-5a49347d09e0	3109498c-2b4b-40ab-8fe4-7bf1afd43260	\N	Bulk Pile (Wash & Iron)	1	4.70	Wash & Iron	282.00	282.00	t
f4eb2aa4-7e98-4c86-9e97-224bc55834a2	3109498c-2b4b-40ab-8fe4-7bf1afd43260	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	7	0.00	Wash & Iron	0.00	0.00	t
9fbd2431-b963-448d-9294-61cba926a072	3109498c-2b4b-40ab-8fe4-7bf1afd43260	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	7	0.00	Wash & Iron	0.00	0.00	t
12dc06ea-4408-40f3-b445-a30bd1b5e05d	3109498c-2b4b-40ab-8fe4-7bf1afd43260	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Iron	0.00	0.00	t
35d55580-2de5-4e59-8d98-8d3b352e649c	28ff9fe2-95e0-4c9d-a5a1-d36fa1ef1000	\N	Shoes 	1	0.00	Custom	100.00	100.00	t
f878cd3e-a03f-4e5c-b0b4-705d06020dee	28ff9fe2-95e0-4c9d-a5a1-d36fa1ef1000	\N	Jacket 	1	0.00	Custom	30.00	30.00	t
270495bb-f5c6-4986-8191-b272066040e9	575e7775-e328-4139-ac77-fdf0f4287c35	\N	Bulk Pile (Wash & Fold)	1	4.80	Wash & Fold	216.00	216.00	t
6631a466-3ac8-4a16-9829-f74136f18eee	575e7775-e328-4139-ac77-fdf0f4287c35	\N	1 bedsheet 	1	0.00	Custom	30.00	30.00	t
5bd847ba-aa26-4353-96d9-f9408737de77	575e7775-e328-4139-ac77-fdf0f4287c35	\N	Towel 	1	0.00	Custom	10.00	10.00	t
b89242e4-d8f0-4166-acbe-34f8f9bb9f86	575e7775-e328-4139-ac77-fdf0f4287c35	4755af9d-1b41-4b0f-8ae0-5dcfbaa6591b	Top	3	0.00	Wash & Fold	0.00	0.00	t
361f71c2-a0b9-436d-906a-153cb022c4b3	575e7775-e328-4139-ac77-fdf0f4287c35	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	3	0.00	Wash & Fold	0.00	0.00	t
a22ef14e-1d60-4684-82f0-fceb01887c40	575e7775-e328-4139-ac77-fdf0f4287c35	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Wash & Fold	0.00	0.00	t
07d7cf5c-a735-4949-974d-19dc334d4c38	575e7775-e328-4139-ac77-fdf0f4287c35	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	5	0.00	Wash & Fold	0.00	0.00	t
cb569faf-746f-4021-b00f-1897bdcc873d	575e7775-e328-4139-ac77-fdf0f4287c35	621a2bdf-e188-4255-af20-6e525e166c80	Hoodie	1	0.00	Wash & Fold	0.00	0.00	t
95c9a3b0-345b-438c-aa94-457642583afa	d56df784-30e5-40ec-9b77-ec6dcb44d79c	\N	Bulk Pile (Wash & Fold)	1	10.00	Wash & Fold	450.00	450.00	t
ecc85d86-7854-4f65-ae8e-035a1f85b491	d56df784-30e5-40ec-9b77-ec6dcb44d79c	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	10	0.00	Wash & Fold	0.00	0.00	t
b66eb879-34a2-4e94-b2c5-256137394196	40d07c03-261b-4cc9-99aa-d5373572f2ed	\N	Bulk Pile (Wash & Iron)	1	6.00	Wash & Iron	360.00	360.00	t
df2f4b6d-26a8-4efe-87e3-3d2e11b1f9cf	40d07c03-261b-4cc9-99aa-d5373572f2ed	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	5	0.00	Wash & Iron	0.00	0.00	t
e32449b9-5fda-4f99-92cd-91e6a141200d	40d07c03-261b-4cc9-99aa-d5373572f2ed	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	5	0.00	Wash & Iron	0.00	0.00	t
781556b6-2e9c-4ff4-b1a9-fd1e548638aa	40d07c03-261b-4cc9-99aa-d5373572f2ed	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	6	0.00	Wash & Iron	0.00	0.00	t
e5777183-85b7-417b-8e11-872fded933cc	40d07c03-261b-4cc9-99aa-d5373572f2ed	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	3	0.00	Wash & Iron	0.00	0.00	t
80d37b79-14c0-4976-881f-e2c04b063b76	40d07c03-261b-4cc9-99aa-d5373572f2ed	80bca426-2418-435d-8f9d-cdaecdc5bf09	Shorts	3	0.00	Wash & Iron	0.00	0.00	t
4e446665-52cc-47f5-9fda-a9cc5eb764a5	a1b1d2b7-9ea4-4253-a485-01089c373466	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Piece Wash	15.00	30.00	t
72460bbf-0f94-4244-b92d-0de769bb4859	a1b1d2b7-9ea4-4253-a485-01089c373466	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Piece Wash	15.00	15.00	t
2a0f10e8-17dd-45d0-9906-79f9766e5875	34ae88e1-615c-47a4-9f5c-3c6b0460a79c	\N	Bulk Pile (Wash & Iron)	1	5.00	Wash & Iron	300.00	300.00	t
5218177b-b942-4916-83ed-00099a5ee18f	34ae88e1-615c-47a4-9f5c-3c6b0460a79c	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	4	0.00	Wash & Iron	0.00	0.00	t
110029cf-8727-4c73-b8f6-4fee4d365660	34ae88e1-615c-47a4-9f5c-3c6b0460a79c	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	7	0.00	Wash & Iron	0.00	0.00	t
fb950047-064f-46e0-b188-c29c6d468789	34ae88e1-615c-47a4-9f5c-3c6b0460a79c	59d03d7e-c3e1-4dc7-8b67-04404994338c	Kurta 	6	0.00	Wash & Iron	0.00	0.00	t
4d987ede-8506-4a41-b62f-0dccaa948e0d	34ae88e1-615c-47a4-9f5c-3c6b0460a79c	621a2bdf-e188-4255-af20-6e525e166c80	Hoodie	5	0.00	Wash & Iron	0.00	0.00	t
b7e2b2a3-8da9-4a79-b331-b14986c975ca	4868072a-fe85-4f2e-95e5-0b2df7efa02b	\N	Bulk Pile (Wash & Iron)	1	4.10	Wash & Iron	246.00	246.00	t
90f0e3c5-8af0-4a0f-963c-e1f3e3eb0441	4868072a-fe85-4f2e-95e5-0b2df7efa02b	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	3	0.00	Wash & Iron	0.00	0.00	t
cadd6de0-96a9-45aa-a669-fa6aa2fb5667	4868072a-fe85-4f2e-95e5-0b2df7efa02b	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	3	0.00	Wash & Iron	0.00	0.00	t
335fc1bc-b164-4955-a2e4-9a34cd91ca59	4868072a-fe85-4f2e-95e5-0b2df7efa02b	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	2	0.00	Wash & Iron	0.00	0.00	t
6ffe2adb-0a16-4138-80e8-e5139556dd99	4868072a-fe85-4f2e-95e5-0b2df7efa02b	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	2	0.00	Wash & Iron	0.00	0.00	t
536428b3-4302-4869-ba6c-57121231bf08	c06c3cdf-ad7a-4a5e-8dfd-5e63238cd82d	\N	Bulk Pile (Wash & Iron)	1	3.00	Wash & Iron	180.00	180.00	t
101d6d88-e90a-44e2-896c-ecb2b118ccaa	c06c3cdf-ad7a-4a5e-8dfd-5e63238cd82d	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	5	0.00	Wash & Iron	0.00	0.00	t
6405c00f-ddd6-457d-848a-12c083488f40	c06c3cdf-ad7a-4a5e-8dfd-5e63238cd82d	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Wash & Iron	0.00	0.00	t
dda2e61c-20a4-40fa-90c7-71ec756cdc8b	c06c3cdf-ad7a-4a5e-8dfd-5e63238cd82d	621a2bdf-e188-4255-af20-6e525e166c80	Hoodie	1	0.00	Wash & Iron	0.00	0.00	t
c15a996b-84cf-4c5c-b297-0ddb97799bc2	c06c3cdf-ad7a-4a5e-8dfd-5e63238cd82d	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	3	0.00	Wash & Iron	0.00	0.00	t
16a0313a-7b96-40d4-a80e-8119a5dd79a4	c06c3cdf-ad7a-4a5e-8dfd-5e63238cd82d	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	2	0.00	Wash & Iron	0.00	0.00	t
e3ecf54c-e1fd-4aa6-9053-5cd75b1fd881	62afc966-7d0e-47fa-87c0-6df484445c7b	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Piece Wash	15.00	30.00	t
f051f2be-1abf-4bdc-b142-058b02fb130e	62afc966-7d0e-47fa-87c0-6df484445c7b	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	2	0.00	Piece Wash	15.00	30.00	t
93ba523f-7d64-4341-aaa2-75c98a955bf4	62afc966-7d0e-47fa-87c0-6df484445c7b	b5c1b36f-324d-454a-9aef-f7780af6a409	Sweatshirt	2	0.00	Piece Wash	15.00	30.00	t
e9da13fe-4c53-421f-a98e-6f2ed27cce8f	62afc966-7d0e-47fa-87c0-6df484445c7b	\N	1shirt starch	1	0.00	Custom	40.00	40.00	t
b7e91b5f-fbb9-4252-8e10-5129e185d550	c0c16541-b643-4dfb-ab7e-4ea37e92d579	\N	Shirt 	3	0.00	Custom	17.00	51.00	t
289c8597-1b42-4d8d-ad30-6e4486c1349c	c0c16541-b643-4dfb-ab7e-4ea37e92d579	\N	Tshirt 	1	0.00	Custom	12.00	12.00	t
88e86221-6775-49f0-83ab-4aed4b89d9a2	c0c16541-b643-4dfb-ab7e-4ea37e92d579	\N	1 shirt only press	1	0.00	Custom	10.00	10.00	t
01b0aff4-ec46-44a2-aece-cabd3df22aaf	63ed8e7e-d3ba-48c0-bc77-5bd0fa47527a	\N	Bulk Pile (Wash & Fold)	1	1.60	Wash & Fold	72.00	72.00	t
7d139e69-3729-47b0-9bdf-06f60b9c9663	63ed8e7e-d3ba-48c0-bc77-5bd0fa47527a	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	1	0.00	Wash & Fold	0.00	0.00	t
e3583c6a-73fe-4806-a0ee-744ce2ece11d	63ed8e7e-d3ba-48c0-bc77-5bd0fa47527a	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Wash & Fold	0.00	0.00	t
6059dd7e-fea2-4308-8dec-150c3a2c4f7c	63ed8e7e-d3ba-48c0-bc77-5bd0fa47527a	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Fold	0.00	0.00	t
5f4ba56e-8a84-4167-a0e3-666b8d9599bd	63ed8e7e-d3ba-48c0-bc77-5bd0fa47527a	\N	Jacket 	1	0.00	Custom	20.00	20.00	t
06fb123a-43e9-4d69-843c-8c43e886aac2	63ed8e7e-d3ba-48c0-bc77-5bd0fa47527a	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Iron Only	8.00	16.00	t
ea5eedc8-7197-4441-ad36-f520e789d882	12509371-9366-4f7e-a1f0-b301ec7e997b	\N	Bulk Pile (Wash & Iron)	1	10.00	Wash & Iron	600.00	600.00	t
65af9545-c79d-4f24-a31c-486e766c551d	12509371-9366-4f7e-a1f0-b301ec7e997b	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	10	0.00	Wash & Iron	0.00	0.00	t
8baf0f2f-2307-489e-90a3-93b8081e47ec	12509371-9366-4f7e-a1f0-b301ec7e997b	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	6	0.00	Wash & Iron	0.00	0.00	t
a88ae05a-960e-45fa-b5f5-10ff9060333f	12509371-9366-4f7e-a1f0-b301ec7e997b	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Wash & Iron	0.00	0.00	t
ec04691b-e821-4023-ba5f-e89edb37bddb	12509371-9366-4f7e-a1f0-b301ec7e997b	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	7	0.00	Wash & Iron	0.00	0.00	t
68e47d3d-18cf-4235-b8e8-98784ea34696	12509371-9366-4f7e-a1f0-b301ec7e997b	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Iron	0.00	0.00	t
befa0f9f-db4d-4493-9977-051b0f136513	12509371-9366-4f7e-a1f0-b301ec7e997b	\N	Shirt starch	5	0.00	Custom	40.00	200.00	t
ef47051e-f92e-4cf2-9868-f25357f13857	12509371-9366-4f7e-a1f0-b301ec7e997b	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Dry Clean	50.00	100.00	t
76efb460-4516-4b19-821d-6d31ddad26f8	12509371-9366-4f7e-a1f0-b301ec7e997b	\N	Jacket 	1	0.00	Custom	40.00	40.00	t
71e863b2-4212-4d3e-800f-38c199b7e387	12509371-9366-4f7e-a1f0-b301ec7e997b	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Dry Clean	50.00	50.00	t
aace4c64-4e64-4039-b941-75a8140415a5	12509371-9366-4f7e-a1f0-b301ec7e997b	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Dry Clean	50.00	50.00	t
e077c9e8-332a-4c39-846c-9aa62a51363f	88344a39-ef4b-48bd-9453-afb5109b8b95	\N	Bulk Pile (Wash & Fold)	1	1.70	Wash & Fold	77.00	77.00	t
2c188b51-dd9d-4136-ab3c-88d1903c9308	88344a39-ef4b-48bd-9453-afb5109b8b95	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	4	0.00	Wash & Fold	0.00	0.00	t
637bb524-baa3-4118-99de-587b207c7b43	88344a39-ef4b-48bd-9453-afb5109b8b95	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Fold	0.00	0.00	t
d9b69ab5-90f6-48a7-b83d-cdf6b459fe1a	88344a39-ef4b-48bd-9453-afb5109b8b95	39ea4de6-1bd3-43e6-bd4e-2fbe23d4a3d7	Sweatpants	1	0.00	Wash & Fold	0.00	0.00	t
0bc23fed-c394-4072-a7b0-c64a59d8d9b9	13a06d9f-69af-48d6-a882-ea2098f304e2	\N	Bulk Pile (Wash & Fold)	1	5.50	Wash & Fold	248.00	248.00	t
1b35bda9-986b-422b-816e-8f88f69490de	13a06d9f-69af-48d6-a882-ea2098f304e2	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	6	0.00	Wash & Fold	0.00	0.00	t
e5383442-0d15-4dac-b159-982bfa94cfd3	13a06d9f-69af-48d6-a882-ea2098f304e2	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	7	0.00	Wash & Fold	0.00	0.00	t
31697a60-7684-4ebc-9c0e-2f0e0c1da604	13a06d9f-69af-48d6-a882-ea2098f304e2	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	6	0.00	Wash & Fold	0.00	0.00	t
1c3c787f-d5a8-44d9-8ced-0b24df52eb24	13a06d9f-69af-48d6-a882-ea2098f304e2	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Fold	0.00	0.00	t
518f079c-7ca4-4a95-b818-b2900953dc4b	da516521-d1b7-42c9-9aab-e94b992cea3e	c0f5e763-477d-4fa7-bf82-3b2004a3f284	Trousers	1	0.00	Piece Wash	15.00	15.00	t
c8d8872b-9e5b-4ddb-94d8-0a53bfb1f4bb	da516521-d1b7-42c9-9aab-e94b992cea3e	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Piece Wash	15.00	15.00	t
f7e42d26-ce5d-4c2f-820c-6a0ca845955c	da516521-d1b7-42c9-9aab-e94b992cea3e	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	3	0.00	Piece Wash	15.00	45.00	t
160b370b-e7f5-4fd0-bdf6-a701c611149d	da516521-d1b7-42c9-9aab-e94b992cea3e	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	10	0.00	Piece Wash	15.00	150.00	t
0741e90d-020a-41c5-9d2c-547fd78ee712	da516521-d1b7-42c9-9aab-e94b992cea3e	\N	Jacket 	2	0.00	Custom	40.00	80.00	t
98609ea1-780a-459a-a9e0-f15bfa2590ef	3f0e81c6-e648-4274-b702-1b9d2c17dd5f	\N	Bulk Pile (Wash & Fold)	1	2.90	Wash & Fold	131.00	131.00	t
36eb8001-45e7-4324-a39a-b474766d1015	3f0e81c6-e648-4274-b702-1b9d2c17dd5f	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	1	0.00	Wash & Fold	0.00	0.00	t
86475329-5921-4f67-a79b-7365c43932cc	3f0e81c6-e648-4274-b702-1b9d2c17dd5f	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	3	0.00	Wash & Fold	0.00	0.00	t
8204ac46-824f-4990-aab2-0384249ffb3f	3f0e81c6-e648-4274-b702-1b9d2c17dd5f	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Fold	0.00	0.00	t
4c722340-c93d-41f3-ad5d-df0ba6b0e5d2	3f0e81c6-e648-4274-b702-1b9d2c17dd5f	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	2	0.00	Wash & Fold	0.00	0.00	t
0e78603e-6801-4cfe-a6a4-8514a20e48e0	3f0e81c6-e648-4274-b702-1b9d2c17dd5f	\N	Jacket 	1	0.00	Custom	20.00	20.00	t
de5464de-55dd-44d4-9f21-679e10dbd454	0dd3b920-ac44-4d43-a11a-136b56f04e6d	\N	Bulk Pile (Wash & Iron)	1	1.30	Wash & Iron	78.00	78.00	t
3899a3a1-0f7f-497e-8d71-7bde9c4b1000	0dd3b920-ac44-4d43-a11a-136b56f04e6d	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	4	0.00	Wash & Iron	0.00	0.00	t
b93eca9e-95c6-4fae-bb40-8f0812989de7	1fbf756d-b6a9-472d-ae05-912af8b6d3b1	\N	Bulk Pile (Wash & Fold)	1	2.80	Wash & Fold	126.00	126.00	t
540a76a5-6c4e-4cdf-90c5-81ba2229a105	1fbf756d-b6a9-472d-ae05-912af8b6d3b1	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	3	0.00	Wash & Fold	0.00	0.00	t
6ecc7782-a06f-4d02-9afc-bb444e32b7b6	1fbf756d-b6a9-472d-ae05-912af8b6d3b1	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	3	0.00	Wash & Fold	0.00	0.00	t
67b8dc2f-537b-4dfd-858f-f3d346f20598	1fbf756d-b6a9-472d-ae05-912af8b6d3b1	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	2	0.00	Wash & Fold	0.00	0.00	t
e004532b-f8ad-4f2b-8187-2b59ffaee13e	1fbf756d-b6a9-472d-ae05-912af8b6d3b1	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Fold	0.00	0.00	t
808e0fd0-ee64-4f8c-9d4a-43e1100302ac	e7cb7ec7-774c-47bd-8750-51c6810b6b49	\N	Jacket 	2	0.00	Custom	20.00	40.00	t
3ddba58c-dd8b-47d9-9aed-8e40b8c6f261	0db46d08-7bf6-46b2-92c7-2453bc97854c	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	3	0.00	Piece Wash	15.00	45.00	t
f36232e4-ed15-4923-b68e-ad902dbfc095	0db46d08-7bf6-46b2-92c7-2453bc97854c	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Piece Wash	15.00	30.00	t
8844a1da-13bd-4312-a94f-6919e38eca7b	0db46d08-7bf6-46b2-92c7-2453bc97854c	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Piece Wash	15.00	15.00	t
73011a29-613e-49be-848a-fc4a4fb3cc4d	0db46d08-7bf6-46b2-92c7-2453bc97854c	\N	Bedsheet 	1	0.00	Custom	50.00	50.00	t
fb3f6a0f-bead-429d-bbe8-e4ea49900f41	03ef38aa-7a7b-475d-b496-422784b17e7e	621a2bdf-e188-4255-af20-6e525e166c80	Hoodie	3	0.00	Piece Wash	15.00	45.00	t
307f6b6c-7402-46a7-845b-b249c2a3153a	03ef38aa-7a7b-475d-b496-422784b17e7e	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	2	0.00	Piece Wash	15.00	30.00	t
4639a933-bb50-4aca-8ec3-f038f442acb4	03ef38aa-7a7b-475d-b496-422784b17e7e	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	5	0.00	Piece Wash	15.00	75.00	t
0e420261-3c72-41ee-ad97-53eb6be23aeb	03ef38aa-7a7b-475d-b496-422784b17e7e	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	2	0.00	Piece Wash	15.00	30.00	t
ae1cd562-8eac-48af-b3ee-74251bbb347a	03ef38aa-7a7b-475d-b496-422784b17e7e	55fa35a4-588a-40d8-8236-51e55b53440f	Towel	2	0.00	Special Wash	10.00	20.00	t
cee4898f-683b-43aa-9b9c-cf8cf7f81d24	03ef38aa-7a7b-475d-b496-422784b17e7e	\N	Bedsheet 	3	0.00	Custom	30.00	90.00	t
6d08bc13-999a-4c32-a5fb-ba2bacb2dd27	03ef38aa-7a7b-475d-b496-422784b17e7e	\N	Blanket 	1	0.00	Custom	100.00	100.00	t
732e94e1-870f-4b2b-bf92-d21400f25c73	fd8a85c4-b026-4518-9bd7-230017cddba2	\N	Bulk Pile (Wash & Fold)	1	11.90	Wash & Fold	536.00	536.00	t
9bbb1ca4-fa4e-491b-828b-0f6d8759a999	fd8a85c4-b026-4518-9bd7-230017cddba2	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	7	0.00	Wash & Fold	0.00	0.00	t
77f9b34b-96bc-4e09-8124-a41281130ee3	fd8a85c4-b026-4518-9bd7-230017cddba2	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	1	0.00	Wash & Fold	0.00	0.00	t
f0fc6b1b-a2e0-4b49-aef3-e364b77dc1ba	fd8a85c4-b026-4518-9bd7-230017cddba2	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	24	0.00	Wash & Fold	0.00	0.00	t
47de0166-2d0b-425b-b789-e8ed324ca239	fd8a85c4-b026-4518-9bd7-230017cddba2	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	13	0.00	Wash & Fold	0.00	0.00	t
2a11b974-1e7b-4323-9735-8aa908cc32c8	fd8a85c4-b026-4518-9bd7-230017cddba2	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	24	0.00	Iron Only	8.00	192.00	t
7148266c-7e73-4aa2-80ff-b51ee4a56893	675f82b7-298f-4d24-8237-9a2a1e353c9b	\N	Bulk Pile (Wash & Fold)	1	4.20	Wash & Fold	189.00	189.00	t
f116a5ba-418e-40da-8ce5-b2a874c42cb1	675f82b7-298f-4d24-8237-9a2a1e353c9b	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	5	0.00	Wash & Fold	0.00	0.00	t
8ea228f5-98e4-442e-bdfa-edb15d40f6df	675f82b7-298f-4d24-8237-9a2a1e353c9b	621a2bdf-e188-4255-af20-6e525e166c80	Hoodie	1	0.00	Wash & Fold	0.00	0.00	t
16d5cab5-4588-491c-97a8-5989d51937a6	675f82b7-298f-4d24-8237-9a2a1e353c9b	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	4	0.00	Wash & Fold	0.00	0.00	t
21face41-90a1-49db-8534-67aec0c90cf0	0df8816f-d7fd-45bb-bed3-8af5b5d2ab63	\N	Bulk Pile (Wash & Fold)	1	3.50	Wash & Fold	158.00	158.00	t
c4ab67c5-447e-414a-b4f7-6df9b7211ba9	0df8816f-d7fd-45bb-bed3-8af5b5d2ab63	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	13	0.00	Wash & Fold	0.00	0.00	t
59426daa-9694-4d65-b8fb-a522b6b99ed6	0df8816f-d7fd-45bb-bed3-8af5b5d2ab63	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	1	0.00	Wash & Fold	0.00	0.00	t
7b83a2ae-3c86-4d7b-b0de-eddb724d2112	0df8816f-d7fd-45bb-bed3-8af5b5d2ab63	974fbe4f-9f6d-4c3f-9d9b-271cd736b315	Track Pants	5	0.00	Wash & Fold	0.00	0.00	t
d3e66281-4c26-4ba1-9361-7d75453b2152	0df8816f-d7fd-45bb-bed3-8af5b5d2ab63	\N	Bedsheet 	2	0.00	Custom	25.00	50.00	t
1812c857-e783-4de5-89a8-e70d1683645f	a465c305-d57a-4004-b284-3ab19e673d8d	\N	Bulk Pile (Wash & Iron)	1	3.80	Wash & Iron	228.00	228.00	t
7e1f4e9a-03a4-4a60-8623-dffc270abee9	a465c305-d57a-4004-b284-3ab19e673d8d	cf93620e-efb7-450f-991f-b993d41ecff3	Shirt	4	0.00	Wash & Iron	0.00	0.00	t
4548c019-7d7f-4d9d-94e5-3c54ed67744b	a465c305-d57a-4004-b284-3ab19e673d8d	77ac0cd6-c6a7-48d7-9354-d29486fa6e58	T-Shirt	2	0.00	Wash & Iron	0.00	0.00	t
3da2a932-ed53-4c24-9c99-81eb63e68861	a465c305-d57a-4004-b284-3ab19e673d8d	3934bb56-5650-476b-9f41-376e56d5bac9	Jeans	3	0.00	Wash & Iron	0.00	0.00	t
7e9fd18f-2ae8-4ea3-a863-0074bea75d1e	a465c305-d57a-4004-b284-3ab19e673d8d	39ea4de6-1bd3-43e6-bd4e-2fbe23d4a3d7	Sweatpants	1	0.00	Wash & Iron	0.00	0.00	t
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."orders" ("id", "branch_id", "customer_id", "readable_bill_id", "total_amount", "discount_amount", "final_amount", "amount_paid", "payment_status", "is_open", "delivery_mode", "created_at", "due_date", "completed_at", "status", "payment_method", "created_by", "closed_by", "bill_status", "total_piece_count", "total_weight", "notes") FROM stdin;
bea87b4e-b308-4665-a6f0-2603980206ae	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	94f9ff7c-2150-48d1-af8e-99efb53d007d	NATH1-1225-0024	54.00	0.00	54.00	0.00	UNPAID	t	PICKUP	2025-12-13 02:56:56.984958+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	4	1.2	
103c82c0-7bc7-457f-8f31-0ef0a01f4060	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	74019103-d23f-4343-b2fb-95b95d9053cf	NATH1-1225-0025	86.00	0.00	86.00	0.00	UNPAID	t	PICKUP	2025-12-13 03:09:01.461084+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	4	1.9	
299f9aa9-89c5-4d30-a8f2-b3f911cb84f4	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	36f0181e-f379-444e-b83d-a91de2130938	NATH1-1225-0026	121.00	0.00	121.00	0.00	UNPAID	t	PICKUP	2025-12-13 03:51:58.883495+00	2025-12-15 21:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	5	1.283	
33a2f5c6-16a3-4eb4-9eb7-c72dc6ea4f1b	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	b813fc33-9573-42d1-bc3e-9168c4a3c818	NATH1-1225-0027	86.00	0.00	86.00	0.00	UNPAID	t	PICKUP	2025-12-13 04:09:49.673905+00	2025-12-15 21:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	4	1.559	
87a9483e-93ab-4dad-b2e2-a815f8677e98	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	b813fc33-9573-42d1-bc3e-9168c4a3c818	NATH1-1225-0028	219.00	0.00	219.00	0.00	UNPAID	t	PICKUP	2025-12-13 04:12:18.076655+00	2025-12-15 20:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	11	2.8	
cb571cae-2807-446b-b7b1-d64211b10b02	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	b161f9af-48b5-46ff-947a-8bea2ad35f67	NATH1-1225-0029	639.00	39.00	600.00	0.00	UNPAID	t	PICKUP	2025-12-13 04:24:45.821502+00	2025-12-15 21:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	32	9.8	
1cf071c6-594b-406a-bb2c-38f455bd4f67	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	086f7f11-10a9-45b4-aa91-01bbf8fffd1e	NATH1-1225-0030	126.00	0.00	126.00	0.00	UNPAID	t	PICKUP	2025-12-13 04:35:53.923207+00	2025-12-15 21:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	7	2.3	
2bae21a5-81ca-4a27-8468-23723f941cef	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	f044f353-ab53-4394-af54-56c1f548a408	NATH1-1225-0021	205.00	0.00	205.00	0.00	UNPAID	t	PICKUP	2025-12-12 11:07:28.081543+00	2025-12-14 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	8	0	
26e4fa2f-e4ab-4d0e-ad00-c27055bfd870	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2bfa83a3-2dda-493f-8071-f983092d7109	NATH1-1225-0022	203.00	0.00	203.00	0.00	UNPAID	t	PICKUP	2025-12-13 02:39:24.418734+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	9	3.1	
dba7c82a-ec28-415b-b16b-873eb4942ce1	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	1342eb70-3a1d-4721-a990-cbcab9cfeac3	NATH1-1225-0023	80.00	0.00	80.00	0.00	UNPAID	t	PICKUP	2025-12-13 02:44:08.160489+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	1	1.1	
49d71863-872e-417d-aef7-763d7c98b5f5	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	0eab5357-74ba-459a-aa44-3810a91edab4	NATH1-1225-0031	150.00	0.00	150.00	0.00	UNPAID	t	PICKUP	2025-12-13 04:39:07.190624+00	2025-12-14 20:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	3	0	
07a0c931-3c8f-4903-8dcb-78614775970a	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	1da642c2-eb36-4919-8bef-0ffc94d3b2d5	NATH1-1225-0032	184.00	56.00	128.00	0.00	UNPAID	t	PICKUP	2025-12-13 04:43:37.61834+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	8	0	Only 8 kapade prees 64 r onlys
942e1eb0-b780-47f5-8dc8-55640713a0bf	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	56b3b083-9274-4fd5-b303-56a9ac070518	NATH1-1225-0033	131.00	0.00	131.00	0.00	UNPAID	t	PICKUP	2025-12-13 05:41:56.440694+00	2025-12-15 20:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	7	1.8	
05df3a5c-9198-4982-a723-ab5465e926c0	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	cc945b8c-7282-4591-b96a-f7bb0e755bc5	NATH1-1225-0034	165.00	5.00	160.00	0.00	UNPAID	t	PICKUP	2025-12-13 05:47:06.876077+00	2025-12-15 21:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	8	3	
327301b1-16d8-4ab0-8568-726448e0c178	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	c61f5125-97b1-4165-8009-7f866308336e	NATH1-1225-0035	81.00	0.00	81.00	0.00	UNPAID	t	PICKUP	2025-12-13 05:49:17.434448+00	2025-12-15 21:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	6	1.8	
2ddadcbc-fe79-4ac7-bb44-63be33e72f83	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	f3bbc65f-619a-4f65-a3f8-7e945d2f5f02	NATH1-1225-0036	132.00	0.00	132.00	0.00	UNPAID	t	PICKUP	2025-12-13 06:22:13.477238+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	7	2.4	
12fde9e3-ff5e-40f0-8aa5-ce2f4f4f6264	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	8fd238bf-ef22-4d07-9d38-99af229a2fde	NATH1-1225-0037	2380.00	1880.00	500.00	0.00	UNPAID	t	PICKUP	2025-12-13 06:28:02.100765+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	10	0	
9ab2a5b8-481b-4979-8b5d-952c2baf8837	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	75d7110f-ee14-4135-abc4-854ed90b6d16	NATH1-1225-0038	90.00	0.00	90.00	0.00	UNPAID	t	PICKUP	2025-12-13 06:30:19.68776+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	5	2	
154ad56e-74eb-44e9-b429-f8cb9c7eb417	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	8f48cbae-58c4-40ca-a001-57d29226602b	NATH1-1225-0039	126.00	0.00	126.00	0.00	UNPAID	t	PICKUP	2025-12-13 06:52:26.641694+00	2025-12-14 21:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	10	2.8	
49292bd5-c024-4e26-adfd-70d7845b73f6	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	3f882a08-eca1-463f-8bcb-cf5107dc0805	NATH1-1225-0040	44.00	4.00	40.00	0.00	UNPAID	t	PICKUP	2025-12-13 07:07:00.381699+00	2025-12-14 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	2	0.8	
3ea4bec7-f61c-4093-85d3-7bccb34eca35	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	8e96e3fd-ba16-4fa7-bc07-dc65df018be0	NATH1-1225-0041	96.00	0.00	96.00	0.00	UNPAID	t	PICKUP	2025-12-13 07:10:14.441719+00	2025-12-14 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	7	1.745	
b7cc9ac3-0d1c-49d8-b313-9d21a0168e77	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2d54a5b3-1ba2-4b6b-85ef-b1e7e85e375f	NATH1-1225-0042	46.00	0.00	46.00	0.00	UNPAID	t	PICKUP	2025-12-13 07:17:25.966877+00	2025-12-14 21:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	3	0.837	
ffe43eda-eeb8-4767-ac11-42ccd97f73cd	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2b0bedc7-50b5-447f-8ec9-83745148286b	NATH1-1225-0043	142.00	0.00	142.00	0.00	UNPAID	t	PICKUP	2025-12-13 07:30:13.352799+00	2025-12-14 21:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	11	2.588	
4ed90aa8-670c-41fa-a364-c379ec53b487	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	594f7037-8fda-4356-bd4f-4ec66d32da2b	NATH1-1225-0044	110.00	0.00	110.00	0.00	UNPAID	t	PICKUP	2025-12-13 07:40:06.676543+00	2025-12-14 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	6	2	
60981eef-5513-4d2b-ba9d-dfe539823ecf	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	9aeefb0f-2566-406f-866e-f58b9717aa2b	NATH1-1225-0045	109.00	9.00	100.00	0.00	UNPAID	t	PICKUP	2025-12-13 07:44:52.311594+00	2025-12-14 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	6	1.99	
0066bb38-017e-4910-807c-3e4aaa6d460a	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	28076366-6d20-4dc1-9d96-46fbaac00373	NATH1-1225-0046	165.00	25.00	140.00	0.00	UNPAID	t	PICKUP	2025-12-13 07:51:09.845018+00	2025-12-14 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	7	3	
ee5d0b7f-db1f-43dc-9595-6e1400299eed	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	e062faad-0f01-4926-9bd8-a5dabf3654c6	NATH1-1225-0047	149.00	0.00	149.00	0.00	UNPAID	t	PICKUP	2025-12-13 07:53:49.147083+00	2025-12-14 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	12	3.3	
638a1cef-c621-4a63-aa43-cebe6b09c1b0	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2214f1e2-9f38-4d80-acc6-eb5081cba9f9	NATH1-1225-0048	135.00	0.00	135.00	0.00	UNPAID	t	PICKUP	2025-12-13 08:38:20.51781+00	2025-12-14 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	8	3	
6ff1cfcc-a414-488c-a4df-f8217b162603	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	eae45472-1475-4a21-b098-da5558d87c95	NATH1-1225-0049	115.00	0.00	115.00	0.00	UNPAID	t	PICKUP	2025-12-13 09:13:51.496151+00	2025-12-14 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	3	0	
2de9c47e-722a-4b25-81bc-b2490ad50b95	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	7610ce85-ac05-418e-a0ac-ade50d907e81	NATH1-1225-0050	96.00	0.00	96.00	0.00	UNPAID	t	PICKUP	2025-12-13 09:15:03.76493+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	12	0	
434661f4-9b8d-443a-82d0-62f2cb23dbf0	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	0a9faf23-400a-40a9-9922-e859c8332701	NATH1-1225-0051	31.00	0.00	31.00	0.00	UNPAID	t	PICKUP	2025-12-13 09:47:33.531761+00	2025-12-14 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	2	0.7	
e9497c5d-1391-4d95-a435-085c05ed495c	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	db2c5dbb-816a-433b-8bcb-c1e08c7fbcd3	NATH1-1225-0052	357.00	0.00	357.00	0.00	UNPAID	t	PICKUP	2025-12-13 12:34:08.270991+00	2025-12-15 19:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	19	6.3	
6e66ae30-d172-49ff-b50f-c27ceb04d4ba	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2d7bb19c-a017-4ca2-966e-204e9fe1fe9c	NATH1-1225-0053	50.00	0.00	50.00	0.00	UNPAID	t	PICKUP	2025-12-13 12:35:41.541232+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	1	0	
cad34f3c-b838-42bc-939e-cb1fe760921a	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	948e7328-3698-4ed2-8137-3a0c7fb26215	NATH1-1225-0054	71.00	0.00	71.00	0.00	UNPAID	t	PICKUP	2025-12-13 13:06:55.389541+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	4	1.1	
26303a2c-746b-4b09-9b17-11e2bbb72536	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	9ca3477e-9b89-4757-b26e-6f87121ecc8d	NATH1-1225-0055	36.00	0.00	36.00	0.00	UNPAID	t	PICKUP	2025-12-13 13:59:40.773156+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	2	0.8	
8cfe2267-74b8-4db0-b509-b9d016b130fb	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	34099ef4-14a8-41b5-b8c5-217ea0a84e18	NATH1-1225-0056	100.00	20.00	80.00	0.00	UNPAID	t	PICKUP	2025-12-13 15:21:55.872808+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	2	0	
4b88e92e-d887-4991-b33d-bc25da9d62f8	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	aa3d1dcb-1a2d-4e63-ac2b-3cefa8dd42f3	NATH1-1225-0057	50.00	10.00	40.00	0.00	UNPAID	t	PICKUP	2025-12-13 15:23:43.546925+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	1	0	
7b628141-7a5a-4319-9438-91ab836829a6	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	8bb3051e-c000-471b-8b72-b0c53980e36f	NATH1-1225-0058	117.00	0.00	117.00	0.00	UNPAID	t	PICKUP	2025-12-13 15:31:53.332627+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	7	2.6	
8f97e846-fb27-4c31-a721-0cff942b1e8d	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	4cbc8c35-a617-4306-a2f5-8b5bea9a6bec	NATH1-1225-0059	106.00	0.00	106.00	0.00	UNPAID	t	PICKUP	2025-12-13 15:38:30.891432+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	7	2	
a1c9d292-91b9-4e4b-aa28-f73fbf91bb27	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	c9ca7843-1740-4a7e-845b-5f12a9c1a6f0	DEMO-01-1225-0005	120.00	0.00	120.00	0.00	UNPAID	t	PICKUP	2025-12-13 17:26:50.51183+00	2025-12-18 20:00:00+00	\N	RECEIVED	\N	09204c3d-c198-4dbb-9309-2b7739a56b1f	\N	OPEN	4	2	
ed1fb018-9608-44ea-b6c3-e0a0e8e1d57f	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	bb21261d-fdcf-44bd-b5d3-b3f65c1d0588	DEMO-01-1225-0007	60.00	0.00	60.00	0.00	UNPAID	t	PICKUP	2025-12-13 21:19:02.313001+00	2025-12-15 18:00:00+00	\N	RECEIVED	\N	c501819a-802e-4366-afc0-192e9fa71627	\N	OPEN	5	1	
d716749a-48b1-4619-80d1-3c631ecbf171	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	365ebcc5-a509-4897-a680-69aa4f9e3606	DEMO-01-1225-0008	495.00	0.00	495.00	0.00	UNPAID	t	PICKUP	2025-12-13 21:29:21.686155+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	c501819a-802e-4366-afc0-192e9fa71627	\N	OPEN	10	11	
473410cd-450f-40e5-ac5d-1e652f3633d5	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	bb21261d-fdcf-44bd-b5d3-b3f65c1d0588	DEMO-01-1225-0009	45.00	0.00	45.00	0.00	UNPAID	t	PICKUP	2025-12-13 21:58:03.153971+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	c501819a-802e-4366-afc0-192e9fa71627	\N	OPEN	3	0	
ed0cc617-e4af-4fdf-97f6-2176d76b12e2	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	675feb54-cc8f-4d38-857e-d0cb3e4234d3	NATH1-1225-0060	96.00	0.00	96.00	0.00	UNPAID	t	PICKUP	2025-12-14 04:10:35.791848+00	2025-12-16 13:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	6	1.6	
4e53a897-c1ea-46ab-bf70-c319e9fe5150	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2dc9019c-d581-4fd8-987a-6c9b2d67d6fc	NATH1-1225-0061	138.00	0.00	138.00	0.00	UNPAID	t	PICKUP	2025-12-14 04:49:55.451038+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	8	2.3	
ced8b24c-84e6-4a98-a2d5-3ae732e5ebeb	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	38a63117-a7ef-404c-8635-b71c2d930bd2	NATH1-1225-0062	234.00	0.00	234.00	0.00	UNPAID	t	PICKUP	2025-12-14 04:51:55.506526+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	13	3.9	
f3a1b3d6-2fd3-4996-8f26-c2961923638b	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	0f43262a-3844-45e9-82a1-e3bca7be2007	NATH1-1225-0063	326.00	0.00	326.00	0.00	UNPAID	t	PICKUP	2025-12-14 04:55:28.632383+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	12	2.8	
85f6471f-a8f7-45ad-8bd0-2a173e870d70	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	fa7f6acd-59ce-440a-b72c-196edd296c1e	NATH1-1225-0064	232.00	0.00	232.00	0.00	UNPAID	t	PICKUP	2025-12-14 05:00:56.448368+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	14	0	
06cc03dc-1792-4903-97e9-237c9a222519	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	99a42345-8c56-440b-92b1-192b7ddf8453	NATH1-1225-0065	30.00	0.00	30.00	0.00	UNPAID	t	PICKUP	2025-12-14 05:45:14.674611+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	2	0	
377e24df-a83e-431f-9feb-b0de365a82ac	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	f8491244-ee15-45cd-a646-a95136fb5d48	NATH1-1225-0066	81.00	0.00	81.00	0.00	UNPAID	t	PICKUP	2025-12-14 05:48:58.34754+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	5	1.8	
addcc671-cc7e-4dff-99fe-7a53394f3598	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2270a7f8-655d-4aa9-9045-a6c4cc8cbf15	NATH1-1225-0067	54.00	0.00	54.00	0.00	UNPAID	t	PICKUP	2025-12-14 05:50:48.869289+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	5	1.2	
cd935607-4bc5-485f-81ba-f940d178e420	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	28873e08-2dd7-434f-80a6-6c3c43389458	NATH1-1225-0068	120.00	0.00	120.00	0.00	UNPAID	t	PICKUP	2025-12-14 05:52:19.742833+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	6	2	
8056d2d2-08a3-4197-b477-1757bd59fd9a	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	6c027f97-3b79-4926-9826-5d0fa1c386ad	NATH1-1225-0069	126.00	0.00	126.00	0.00	UNPAID	t	PICKUP	2025-12-14 06:14:30.883122+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	7	2.1	
74c6feff-7b73-4dcd-b947-79ff36172a2d	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	79dda078-ddc8-49d3-8e76-1edda15fa51b	NATH1-1225-0070	84.00	0.00	84.00	0.00	UNPAID	t	PICKUP	2025-12-14 06:37:59.489148+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	6	1.5	
6f15be12-8421-4680-aa93-a26bcfd8c4f9	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	9b59aef0-9a73-41b1-8906-a89b2c2ce331	NATH1-1225-0071	30.00	0.00	30.00	0.00	UNPAID	t	PICKUP	2025-12-14 06:40:13.306753+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	2	0.5	
70ebb1ff-590f-49bf-944c-3155f441f6b8	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	7b5930d5-512d-4484-a310-16bbc39b095a	NATH1-1225-0072	120.00	0.00	120.00	0.00	UNPAID	t	PICKUP	2025-12-14 06:56:59.936966+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	8	0	
5e172a19-61d2-417e-978a-b438af3001f0	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	930cde90-0531-4e0f-8ee0-ad1977acb718	NATH1-1225-0073	81.00	0.00	81.00	0.00	UNPAID	t	PICKUP	2025-12-14 07:04:53.241782+00	2025-12-15 15:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	6	1.8	
0bc204f1-3f42-4c7d-993a-33d3401caf36	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	b4619dec-31e8-41cd-9d7d-a93394e6722b	NATH1-1225-0074	60.00	0.00	60.00	0.00	UNPAID	t	PICKUP	2025-12-14 07:10:16.179489+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	4	0	
fcd79a05-39e3-43d1-8fb3-89631830e8f2	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	4cea6e6d-c4d9-4a5d-88d3-46666de17d7e	NATH1-1225-0075	60.00	0.00	60.00	0.00	UNPAID	t	PICKUP	2025-12-14 07:20:45.935687+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	3	1	
db1fe6a8-15fa-427d-bcf5-01f92ba80303	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	a74aea95-b904-49aa-a10c-cf5df4e6ce41	NATH1-1225-0076	105.00	0.00	105.00	0.00	UNPAID	t	PICKUP	2025-12-14 07:23:03.401243+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	7	0	
1aaefcf5-f2cf-46fb-87de-471657d2c8d5	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	ee5b1ead-7438-4902-a5e3-e06339d10196	NATH1-1225-0077	270.00	20.00	250.00	0.00	UNPAID	t	PICKUP	2025-12-14 07:34:11.55332+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	12	3.5	
e00ca99d-686f-4a0e-8930-08ede7534acc	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	92b50d45-863e-4e50-b2df-fe14e8434e28	NATH1-1225-0078	100.00	0.00	100.00	0.00	UNPAID	t	PICKUP	2025-12-14 07:50:07.040855+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	2	0	
cebe7876-ffe5-4a06-b0de-ac984eeca2a4	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	11e4c6fe-9340-49ee-b797-0d6530c58b97	NATH1-1225-0079	92.00	0.00	92.00	0.00	UNPAID	t	PICKUP	2025-12-14 07:56:43.741275+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	6	1.5	
deb869d1-37c3-4d98-88d5-db7f88e01298	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	7dd97cd7-2146-4335-ad2f-37cbdbdd5b99	NATH1-1225-0080	100.00	0.00	100.00	0.00	UNPAID	t	PICKUP	2025-12-14 08:09:16.830607+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	10	0	
f588d346-8521-45a0-a9a6-9dda1cd57b13	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	d06212df-fd3c-4550-b25c-ac76e1b37ec2	NATH1-1225-0081	75.00	0.00	75.00	0.00	UNPAID	t	PICKUP	2025-12-14 08:11:15.453609+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	4	1.3	
b8323c1b-9be0-411f-a3e4-4c5cb15c9a87	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	4ac2a9a0-4898-412b-98ae-6c87227bab30	NATH1-1225-0082	45.00	0.00	45.00	0.00	UNPAID	t	PICKUP	2025-12-14 08:13:15.90949+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	3	1	
8fa4ab65-491d-4f29-bf04-70a8144e76ad	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	d6c92e3c-5cdc-4609-adc1-b11ce608c88a	NATH1-1225-0083	243.00	40.00	203.00	0.00	UNPAID	t	PICKUP	2025-12-14 08:15:51.08964+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	12	4.5	
4334d03b-349c-49cc-b30d-1d1caf1ff0eb	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	0e3c58e9-b34b-4dab-8c49-67c558db2b01	NATH1-1225-0084	72.00	0.00	72.00	0.00	UNPAID	t	PICKUP	2025-12-14 08:18:18.278174+00	2025-12-15 16:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	4	1.2	
e9680322-ff96-41ab-b5a7-56c6540b611f	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	eda3c5ac-c466-4baa-9c77-74041b3271c9	NATH1-1225-0085	318.00	0.00	318.00	0.00	UNPAID	t	PICKUP	2025-12-14 08:21:42.838144+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	16	6	
2feaa5ef-71df-488e-94fb-2d051b75a0b9	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	5d71e1cc-0f9e-400e-ab3b-7378f8c3239e	NATH1-1225-0086	170.00	0.00	170.00	0.00	UNPAID	t	PICKUP	2025-12-14 08:53:25.337143+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	17	0	
688389c0-0f29-45f4-8e09-d8846dfe0e4e	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	34099ef4-14a8-41b5-b8c5-217ea0a84e18	NATH1-1225-0087	272.00	0.00	272.00	0.00	UNPAID	t	PICKUP	2025-12-14 09:18:13.152588+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	6	1.2	
52c18c21-dbfc-4a5a-a687-4acaf200ab3f	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	81dc1304-183a-45ae-83a9-26d052f47729	NATH1-1225-0088	150.00	0.00	150.00	0.00	UNPAID	t	PICKUP	2025-12-14 09:36:59.562653+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	2	0	
5978f062-3686-4801-b642-6cb239904ed2	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	0b60ace8-43c2-4419-ab53-478466c235be	NATH1-1225-0089	144.00	4.00	140.00	0.00	UNPAID	t	PICKUP	2025-12-14 10:14:13.459272+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	8	2.4	
1dde82b9-57ba-4d0f-8072-daa9cc2d2501	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	474edaca-4859-4fb5-8a06-2728cb2bd360	NATH1-1225-0090	60.00	0.00	60.00	0.00	UNPAID	t	PICKUP	2025-12-14 10:31:30.608798+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	3	1	
f0d8c1f9-fef0-49c4-89c9-19da9b2f9491	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	9aa46fcb-08ff-40e5-bf10-075d05d5039b	NATH1-1225-0091	131.00	0.00	131.00	0.00	UNPAID	t	PICKUP	2025-12-14 10:47:31.203558+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	11	2.9	
73471913-6e7b-46a0-9c83-ae3ade8fb0fb	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	9aa46fcb-08ff-40e5-bf10-075d05d5039b	NATH1-1225-0092	270.00	0.00	270.00	0.00	UNPAID	t	PICKUP	2025-12-14 10:53:58.781225+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	11	0	
098b0da6-562e-4aed-a453-09e34735e5ac	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	4127b4c5-5981-4d22-8214-d621330b3d7e	NATH1-1225-0093	68.00	0.00	68.00	0.00	UNPAID	t	PICKUP	2025-12-14 12:20:11.167476+00	2025-12-15 16:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	5	1.5	
d526c080-8422-4b2a-af55-3293342d974d	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	9d5ba098-9485-4a07-aba7-fb6a308152db	NATH1-1225-0094	110.00	0.00	110.00	0.00	UNPAID	t	PICKUP	2025-12-14 12:43:59.554556+00	2025-12-15 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	3	0	
e0d8fb92-9da6-4999-b74c-4f216cd4aedb	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	c58964ba-9a52-4688-9755-b14a7049d0b1	NATH1-1225-0095	55.00	0.00	55.00	0.00	UNPAID	t	PICKUP	2025-12-14 13:22:48.005855+00	2025-12-15 15:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	4	0	
cf997584-b04a-48b7-b9f8-4feaef0166b1	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	ce30d6de-5ed4-451a-8b92-980bb4d4cc54	NATH1-1225-0096	120.00	0.00	120.00	0.00	UNPAID	t	PICKUP	2025-12-14 14:29:28.715958+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	6	2	
6d7e1d91-5441-4f5c-9b02-8f8d241b9fa1	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	ca5531c4-1924-4618-8d50-ddc422bffeca	NATH1-1225-0097	175.00	0.00	175.00	0.00	UNPAID	t	PICKUP	2025-12-14 14:49:32.40028+00	2025-12-16 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	12	0	
d94a6214-86c6-4aa7-bf7f-e5cd878b0355	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	414573e3-f0dd-4a1e-978f-29d6c1316bcc	NATH1-1225-0098	16.00	0.00	16.00	0.00	UNPAID	t	PICKUP	2025-12-15 02:57:27.994868+00	2025-12-17 07:00:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	2	0	
64ba507b-2bf6-41cf-aa9b-90d4180dd12a	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	d0a73007-af5f-42c4-9bdc-390393414cee	NATH1-1225-0099	50.00	0.00	50.00	0.00	UNPAID	t	PICKUP	2025-12-15 03:12:41.495066+00	2025-12-17 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	1	0	
22e9174d-b9eb-40a7-94ed-608b7a608a9c	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	0654bd32-aba6-47b6-9a47-f178d9ecfacc	NATH1-1225-0100	90.00	0.00	90.00	0.00	UNPAID	t	PICKUP	2025-12-15 03:25:16.638812+00	2025-12-17 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	3	0	
3109498c-2b4b-40ab-8fe4-7bf1afd43260	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	8c2dec66-e734-4faf-a348-2fa65d86530b	NATH1-1225-0101	282.00	32.00	250.00	0.00	UNPAID	t	PICKUP	2025-12-15 03:46:27.180632+00	2025-12-17 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	13	4.7	
28ff9fe2-95e0-4c9d-a5a1-d36fa1ef1000	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	08994129-2f57-4601-80d4-d71437576ce7	NATH1-1225-0102	130.00	0.00	130.00	0.00	UNPAID	t	PICKUP	2025-12-15 04:06:23.973448+00	2025-12-17 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	2	0	
575e7775-e328-4139-ac77-fdf0f4287c35	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	bff51ac3-d4d8-4f19-86dc-f14a1d0d19ba	NATH1-1225-0103	256.00	0.00	256.00	0.00	UNPAID	t	PICKUP	2025-12-15 16:09:48.015357+00	2025-12-17 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	16	4.8	
d56df784-30e5-40ec-9b77-ec6dcb44d79c	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	365ebcc5-a509-4897-a680-69aa4f9e3606	DEMO-01-1225-0010	450.00	0.00	450.00	0.00	UNPAID	t	PICKUP	2025-12-16 12:23:47.174883+00	2025-12-18 12:30:00+00	\N	READY	\N	c501819a-802e-4366-afc0-192e9fa71627	\N	OPEN	10	10	
4e01e3ce-a22b-4bf7-a9f3-604f1982a35a	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	fe4f3273-884c-4334-bc60-4acc927ba14c	DEMO-01-1225-0004	171.00	0.00	171.00	171.00	PAID	f	PICKUP	2025-12-11 06:26:10.129685+00	2025-12-13 18:00:00+00	2025-12-16 12:27:52.537399+00	READY	\N	c501819a-802e-4366-afc0-192e9fa71627	c501819a-802e-4366-afc0-192e9fa71627	CLOSED	10	2.69	
4380c765-b0f6-48fc-9017-1f41433dcc37	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	365ebcc5-a509-4897-a680-69aa4f9e3606	DEMO-01-1225-0006	120.00	0.00	120.00	120.00	PAID	f	PICKUP	2025-12-13 21:16:27.207567+00	2025-12-15 12:30:00+00	2025-12-16 12:35:12.304605+00	DELIVERED	\N	c501819a-802e-4366-afc0-192e9fa71627	c501819a-802e-4366-afc0-192e9fa71627	CLOSED	9	2	
40d07c03-261b-4cc9-99aa-d5373572f2ed	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	7d2e2777-7d81-4c7e-a40e-ad293745f41b	DEMO-01-1225-0011	360.00	0.00	360.00	360.00	PAID	f	PICKUP	2025-12-19 13:52:47.912215+00	2025-12-21 12:30:00+00	2025-12-19 13:53:45.130573+00	DELIVERED	\N	c501819a-802e-4366-afc0-192e9fa71627	c501819a-802e-4366-afc0-192e9fa71627	CLOSED	23	6	
a1b1d2b7-9ea4-4253-a485-01089c373466	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	bb21261d-fdcf-44bd-b5d3-b3f65c1d0588	DEMO-01-1225-0012	45.00	0.00	45.00	0.00	UNPAID	t	PICKUP	2025-12-30 06:56:47.28729+00	2026-01-01 12:30:00+00	\N	RECEIVED	\N	c501819a-802e-4366-afc0-192e9fa71627	\N	OPEN	3	0	
34ae88e1-615c-47a4-9f5c-3c6b0460a79c	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	844ea5d3-11b1-4a11-bee0-bf6c4a1185da	DEMO-01-0126-0001	300.00	0.00	300.00	0.00	UNPAID	t	PICKUP	2026-01-01 11:04:11.569567+00	2026-01-03 12:30:00+00	\N	RECEIVED	\N	c501819a-802e-4366-afc0-192e9fa71627	\N	OPEN	10	5	
4868072a-fe85-4f2e-95e5-0b2df7efa02b	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	34099ef4-14a8-41b5-b8c5-217ea0a84e18	NATH1-0126-0001	246.00	0.00	246.00	0.00	UNPAID	t	PICKUP	2026-01-04 06:28:06.768404+00	2026-01-07 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	11	4.1	
c06c3cdf-ad7a-4a5e-8dfd-5e63238cd82d	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	6f1f9bb9-7556-4dc4-a170-28ac6651ea4b	DEMO-01-0126-0002	180.00	0.00	180.00	180.00	PAID	f	PICKUP	2026-01-15 07:59:31.771092+00	2026-01-17 12:30:00+00	2026-01-15 08:00:28.76223+00	DELIVERED	\N	c501819a-802e-4366-afc0-192e9fa71627	c501819a-802e-4366-afc0-192e9fa71627	CLOSED	10	3	
62afc966-7d0e-47fa-87c0-6df484445c7b	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	36f0181e-f379-444e-b83d-a91de2130938	NATH1-0126-0002	130.00	0.00	130.00	0.00	UNPAID	t	PICKUP	2026-01-16 03:58:03.590045+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	7	0	
c0c16541-b643-4dfb-ab7e-4ea37e92d579	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	f521d2c4-fcf9-4eed-a8ee-cd0073277618	NATH1-0126-0003	73.00	0.00	73.00	0.00	UNPAID	t	PICKUP	2026-01-16 05:31:30.102077+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	4	0	
63ed8e7e-d3ba-48c0-bc77-5bd0fa47527a	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	11e4c6fe-9340-49ee-b797-0d6530c58b97	NATH1-0126-0004	108.00	0.00	108.00	0.00	UNPAID	t	PICKUP	2026-01-16 06:03:12.430451+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	5	1.6	
12509371-9366-4f7e-a1f0-b301ec7e997b	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	11693c7c-3f6e-4e61-ab9c-d28b12f7571b	NATH1-0126-0005	1040.00	0.00	1040.00	0.00	UNPAID	t	PICKUP	2026-01-16 06:28:12.897467+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	34	10	
88344a39-ef4b-48bd-9453-afb5109b8b95	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	8dfd93ba-3107-4eaa-b848-4463800eb8ba	NATH1-0126-0006	77.00	0.00	77.00	0.00	UNPAID	t	PICKUP	2026-01-16 06:39:41.923224+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	6	1.7	
13a06d9f-69af-48d6-a882-ea2098f304e2	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	df5c95ab-643a-41fe-9d41-8b97d82e9adb	NATH1-0126-0007	248.00	0.00	248.00	0.00	UNPAID	t	PICKUP	2026-01-16 06:58:21.953331+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	20	5.5	
da516521-d1b7-42c9-9aab-e94b992cea3e	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	a74aea95-b904-49aa-a10c-cf5df4e6ce41	NATH1-0126-0008	305.00	0.00	305.00	0.00	UNPAID	t	PICKUP	2026-01-16 07:15:04.551575+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	17	0	
3f0e81c6-e648-4274-b702-1b9d2c17dd5f	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	faa1cf1f-8b53-4b2a-a11c-77215184c7b5	NATH1-0126-0009	151.00	0.00	151.00	0.00	UNPAID	t	PICKUP	2026-01-16 07:29:15.933061+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	8	2.9	
0dd3b920-ac44-4d43-a11a-136b56f04e6d	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	f212301e-903c-424d-8c3c-1f0a73c258ed	NATH1-0126-0010	78.00	8.00	70.00	0.00	UNPAID	t	PICKUP	2026-01-16 08:40:11.494682+00	2026-01-18 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	4	1.3	
1fbf756d-b6a9-472d-ae05-912af8b6d3b1	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	166f80a4-b09d-4596-b5f0-da063a793b63	NATH1-0126-0011	126.00	0.00	126.00	0.00	UNPAID	t	PICKUP	2026-01-16 08:42:28.462198+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	8	2.8	
e7cb7ec7-774c-47bd-8750-51c6810b6b49	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	6a2e886e-6b06-4d8d-ae80-fa69be9b7db8	NATH1-0126-0012	40.00	0.00	40.00	0.00	UNPAID	t	PICKUP	2026-01-16 08:50:47.058683+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	2	0	
0db46d08-7bf6-46b2-92c7-2453bc97854c	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	0a46a853-411f-417a-9f33-1f207d0e21a5	NATH1-0126-0013	140.00	0.00	140.00	0.00	UNPAID	t	PICKUP	2026-01-16 09:28:30.348049+00	2026-01-18 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	8	0	
03ef38aa-7a7b-475d-b496-422784b17e7e	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	3f397e3a-1d22-466e-8323-a7cf04e3e754	NATH1-0126-0014	390.00	0.00	390.00	0.00	UNPAID	t	PICKUP	2026-01-16 09:32:31.249302+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	19	0	
fd8a85c4-b026-4518-9bd7-230017cddba2	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	c8b2534d-bcb4-46b4-b9fb-92bf96ab3c53	NATH1-0126-0015	728.00	100.00	628.00	0.00	UNPAID	t	PICKUP	2026-01-16 12:44:30.359522+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	45	11.9	
675f82b7-298f-4d24-8237-9a2a1e353c9b	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	245e9008-d898-497b-a5cd-40eea355555b	NATH1-0126-0016	189.00	40.00	149.00	0.00	UNPAID	t	PICKUP	2026-01-16 13:21:29.251822+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	10	4.2	
0df8816f-d7fd-45bb-bed3-8af5b5d2ab63	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	235efb2a-8ed5-4d49-9aec-e106622b8573	NATH1-0126-0017	208.00	0.00	208.00	0.00	UNPAID	t	PICKUP	2026-01-16 14:54:23.542572+00	2026-01-19 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	21	3.5	
a465c305-d57a-4004-b284-3ab19e673d8d	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	0b8bcd61-d25e-48a9-8fad-b3505fc85370	NATH1-0126-0018	228.00	68.00	160.00	0.00	UNPAID	t	PICKUP	2026-01-16 15:05:51.54206+00	2026-01-18 12:30:00+00	\N	RECEIVED	\N	89d9a709-b55c-42dc-9783-288b8d3a5695	\N	OPEN	8	3.8	
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."profiles" ("id", "user_id", "branch_id", "full_name", "role", "created_at") FROM stdin;
39f44714-246c-4638-b5c6-1cfc2b672f52	c501819a-802e-4366-afc0-192e9fa71627	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	Rishabh Patre	ADMIN	2025-12-03 09:04:45.2713+00
51ad7014-74be-4e2d-adec-20561eb6b40a	89d9a709-b55c-42dc-9783-288b8d3a5695	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	Pankaj Magar	ADMIN	2025-12-09 18:42:16.217205+00
d527c051-902f-46a1-80a2-1412ce3f65e1	1014eb4c-d00e-4446-ba11-c3e690cc58d7	621d9703-7608-42a9-9a47-777f53c0280a	Bhavna Patil	AUTH_USER	2025-12-09 18:45:03.551847+00
8989a999-4f97-4f7f-b97e-5a58e4018a42	09204c3d-c198-4dbb-9309-2b7739a56b1f	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	Demo User	AUTH_USER	2025-12-12 07:52:00.025919+00
\.


--
-- Data for Name: special_item_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."special_item_rates" ("id", "branch_id", "item_id", "service_type", "rate_type", "rate_value", "is_active", "created_at", "updated_at") FROM stdin;
533541d0-2342-40b4-b547-db0b7461475d	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	0ff5a462-957a-4f33-84e2-373022954d06	Standard	PER_PIECE	50.00	t	2025-12-04 10:23:48.776499+00	2025-12-04 10:23:48.776499+00
28d84c2c-bd02-4919-870a-6608e8755d18	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	cf3a0821-b568-406a-8339-767a15b8a612	Standard	PER_PIECE	120.00	t	2025-12-04 10:23:48.776499+00	2025-12-04 10:23:48.776499+00
a9a580ae-b739-4681-beb7-ebc34841b6a8	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	f84f6b87-5bf0-41c2-9cff-f68b1db8dc5f	Dry Clean	PER_PIECE	50.00	t	2025-12-04 10:23:48.776499+00	2025-12-04 10:23:48.776499+00
4268df07-db20-4f66-8525-8a379b1f11b5	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	41feeaeb-104a-4de9-b6dd-a4d2e1d8dc4f	Dry Clean	PER_PIECE	120.00	t	2025-12-04 10:23:48.776499+00	2025-12-04 10:23:48.776499+00
d9d1c707-3566-47e9-8827-067a62c404a1	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	11451d77-da91-45cb-b0ac-1c26c51fca0f	Dry Clean	PER_PIECE	50.00	t	2025-12-04 10:23:48.776499+00	2025-12-04 10:23:48.776499+00
2e5614ba-d3ab-49ab-8ad6-4a081b376c65	c43a7145-30e6-4fb4-8db4-3aaf5dcdc006	b69c0b95-2c40-407d-9c16-82b88c7eb5a5	Standard	PER_PIECE	150.00	t	2025-12-04 10:23:48.776499+00	2025-12-04 10:23:48.776499+00
32072f45-5416-49a4-b17e-e6c95a90922f	621d9703-7608-42a9-9a47-777f53c0280a	0ff5a462-957a-4f33-84e2-373022954d06	Standard	PER_PIECE	100.00	t	2025-12-10 07:35:40.151972+00	2025-12-10 07:35:40.151972+00
697fb3e6-cc80-4c1f-955e-31272d3b3680	621d9703-7608-42a9-9a47-777f53c0280a	cf3a0821-b568-406a-8339-767a15b8a612	Dry Clean	PER_PIECE	120.00	t	2025-12-10 07:35:40.151972+00	2025-12-10 07:35:40.151972+00
437ce5c8-fa06-4d13-b025-31a878885fb9	621d9703-7608-42a9-9a47-777f53c0280a	11451d77-da91-45cb-b0ac-1c26c51fca0f	Standard	PER_PIECE	30.00	t	2025-12-10 07:35:40.151972+00	2025-12-10 07:35:40.151972+00
834f6c39-3aab-4ed6-abaa-94566d54ae75	621d9703-7608-42a9-9a47-777f53c0280a	11451d77-da91-45cb-b0ac-1c26c51fca0f	Dry Clean	PER_PIECE	40.00	t	2025-12-10 07:35:40.151972+00	2025-12-10 07:35:40.151972+00
c3efc672-4904-4cc6-b3ff-e5e23b42ea59	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	0ff5a462-957a-4f33-84e2-373022954d06	Standard	PER_PIECE	100.00	t	2025-12-10 07:35:40.151972+00	2025-12-10 07:35:40.151972+00
639d3390-08bd-460d-8298-ce7ab8eff035	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	cf3a0821-b568-406a-8339-767a15b8a612	Dry Clean	PER_PIECE	120.00	t	2025-12-10 07:35:40.151972+00	2025-12-10 07:35:40.151972+00
330bf907-cb80-46de-9ed4-33c28f745e92	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	11451d77-da91-45cb-b0ac-1c26c51fca0f	Standard	PER_PIECE	30.00	t	2025-12-10 07:35:40.151972+00	2025-12-10 07:35:40.151972+00
d070bd16-93ca-4dd0-a55a-aab1b452f85e	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	11451d77-da91-45cb-b0ac-1c26c51fca0f	Dry Clean	PER_PIECE	40.00	t	2025-12-10 07:35:40.151972+00	2025-12-10 07:35:40.151972+00
7696f7eb-c34e-4413-a638-8358550d072d	621d9703-7608-42a9-9a47-777f53c0280a	41feeaeb-104a-4de9-b6dd-a4d2e1d8dc4f	Standard	PER_PIECE	50.00	t	2025-12-10 08:03:41.734527+00	2025-12-10 08:03:41.734527+00
07dce189-298c-41f5-b662-a541343cab63	621d9703-7608-42a9-9a47-777f53c0280a	2015cd29-0d72-4e79-bd84-74be3d1f6b84	Standard	PER_PIECE	50.00	t	2025-12-10 08:03:41.734527+00	2025-12-10 08:03:41.734527+00
3bf7774e-e113-4d37-9b8e-3f3b5e9c5ef6	621d9703-7608-42a9-9a47-777f53c0280a	618571bd-02d7-46cd-9b32-d689e2ec4a1d	Standard	PER_PIECE	60.00	t	2025-12-10 08:03:41.734527+00	2025-12-10 08:03:41.734527+00
c34533d1-905c-4e5e-bff4-be5fb928e259	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	41feeaeb-104a-4de9-b6dd-a4d2e1d8dc4f	Standard	PER_PIECE	50.00	t	2025-12-10 08:03:41.734527+00	2025-12-10 08:03:41.734527+00
63e626be-5603-4804-a9b7-a7f0081e9974	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	2015cd29-0d72-4e79-bd84-74be3d1f6b84	Standard	PER_PIECE	50.00	t	2025-12-10 08:03:41.734527+00	2025-12-10 08:03:41.734527+00
1f4f6ecd-c310-4edb-887c-f62e69eabea1	820b1e06-4f43-4e90-b2eb-296b97fe5e4f	618571bd-02d7-46cd-9b32-d689e2ec4a1d	Standard	PER_PIECE	60.00	t	2025-12-10 08:03:41.734527+00	2025-12-10 08:03:41.734527+00
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."migrations" ("id", "name", "hash", "executed_at") FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-12-02 04:56:21.683659
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-12-02 04:56:21.69044
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-12-02 04:56:21.69622
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-12-02 04:56:21.721591
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-12-02 04:56:21.823461
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-12-02 04:56:21.826892
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-12-02 04:56:21.831642
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-12-02 04:56:21.835325
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-12-02 04:56:21.838658
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-12-02 04:56:21.842085
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-12-02 04:56:21.845692
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-12-02 04:56:21.849452
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-12-02 04:56:21.864288
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-12-02 04:56:21.868104
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-12-02 04:56:21.871787
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-12-02 04:56:21.910993
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-12-02 04:56:21.914317
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-12-02 04:56:21.917497
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-12-02 04:56:21.921205
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-12-02 04:56:21.92867
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-12-02 04:56:21.932061
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-12-02 04:56:21.93882
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-12-02 04:56:21.96054
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-12-02 04:56:21.985587
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-12-02 04:56:21.990181
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-12-02 04:56:21.997473
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-12-02 04:56:22.002122
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-12-02 04:56:22.018257
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-12-02 04:56:23.109613
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-12-02 04:56:23.118358
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-12-02 04:56:23.128805
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-12-02 04:56:23.647386
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-12-02 04:56:23.654094
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-12-02 04:56:23.660478
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-12-02 04:56:23.662187
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-12-02 04:56:23.667245
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-12-02 04:56:23.670672
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-12-02 04:56:23.677533
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-12-02 04:56:23.682634
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-12-02 04:56:23.696597
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-12-02 04:56:23.700501
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-12-02 04:56:23.708064
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-12-02 04:56:23.712248
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-12-02 04:56:23.71984
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2025-12-02 04:56:23.725607
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2025-12-02 04:56:23.729502
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2025-12-02 04:56:23.740266
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2025-12-02 04:56:23.744087
48	iceberg-catalog-ids	2666dff93346e5d04e0a878416be1d5fec345d6f	2025-12-02 04:56:23.747613
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-01-16 10:50:42.630078
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") FROM stdin;
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."prefixes" ("bucket_id", "name", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 186, true);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "amr_id_pk" PRIMARY KEY ("id");


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."audit_log_entries"
    ADD CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id");


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."flow_state"
    ADD CONSTRAINT "flow_state_pkey" PRIMARY KEY ("id");


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_pkey" PRIMARY KEY ("id");


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_provider_id_provider_unique" UNIQUE ("provider_id", "provider");


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."instances"
    ADD CONSTRAINT "instances_pkey" PRIMARY KEY ("id");


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_authentication_method_pkey" UNIQUE ("session_id", "authentication_method");


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id");


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_last_challenged_at_key" UNIQUE ("last_challenged_at");


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_code_key" UNIQUE ("authorization_code");


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_id_key" UNIQUE ("authorization_id");


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_client_states"
    ADD CONSTRAINT "oauth_client_states_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_clients"
    ADD CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_client_unique" UNIQUE ("user_id", "client_id");


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id");


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_token_unique" UNIQUE ("token");


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_entity_id_key" UNIQUE ("entity_id");


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_pkey" PRIMARY KEY ("id");


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_pkey" PRIMARY KEY ("id");


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_pkey" PRIMARY KEY ("id");


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."sso_providers"
    ADD CONSTRAINT "sso_providers_pkey" PRIMARY KEY ("id");


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- Name: bill_sequences bill_sequences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."bill_sequences"
    ADD CONSTRAINT "bill_sequences_pkey" PRIMARY KEY ("branch_id", "month_year");


--
-- Name: branches branches_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."branches"
    ADD CONSTRAINT "branches_code_key" UNIQUE ("code");


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."branches"
    ADD CONSTRAINT "branches_pkey" PRIMARY KEY ("id");


--
-- Name: customers customers_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_phone_key" UNIQUE ("phone");


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");


--
-- Name: daily_analytics_snapshots daily_analytics_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."daily_analytics_snapshots"
    ADD CONSTRAINT "daily_analytics_snapshots_pkey" PRIMARY KEY ("id");


--
-- Name: daily_analytics_snapshots daily_snapshots_branch_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."daily_analytics_snapshots"
    ADD CONSTRAINT "daily_snapshots_branch_date_key" UNIQUE ("branch_id", "date");


--
-- Name: laundry_items laundry_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."laundry_items"
    ADD CONSTRAINT "laundry_items_pkey" PRIMARY KEY ("id");


--
-- Name: laundry_settings laundry_settings_branch_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."laundry_settings"
    ADD CONSTRAINT "laundry_settings_branch_id_key" UNIQUE ("branch_id");


--
-- Name: laundry_settings laundry_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."laundry_settings"
    ADD CONSTRAINT "laundry_settings_pkey" PRIMARY KEY ("id");


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");


--
-- Name: orders orders_readable_bill_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_readable_bill_id_key" UNIQUE ("readable_bill_id");


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_key" UNIQUE ("user_id");


--
-- Name: special_item_rates special_item_rates_branch_id_item_id_service_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."special_item_rates"
    ADD CONSTRAINT "special_item_rates_branch_id_item_id_service_type_key" UNIQUE ("branch_id", "item_id", "service_type");


--
-- Name: special_item_rates special_item_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."special_item_rates"
    ADD CONSTRAINT "special_item_rates_pkey" PRIMARY KEY ("id");


--
-- Name: special_item_rates special_rates_unique_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."special_item_rates"
    ADD CONSTRAINT "special_rates_unique_key" UNIQUE ("branch_id", "item_id", "service_type");


--
-- Name: special_item_rates unique_branch_item_service; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."special_item_rates"
    ADD CONSTRAINT "unique_branch_item_service" UNIQUE ("branch_id", "item_id", "service_type");


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."buckets_analytics"
    ADD CONSTRAINT "buckets_analytics_pkey" PRIMARY KEY ("id");


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."buckets"
    ADD CONSTRAINT "buckets_pkey" PRIMARY KEY ("id");


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."buckets_vectors"
    ADD CONSTRAINT "buckets_vectors_pkey" PRIMARY KEY ("id");


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_name_key" UNIQUE ("name");


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_pkey" PRIMARY KEY ("id");


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."prefixes"
    ADD CONSTRAINT "prefixes_pkey" PRIMARY KEY ("bucket_id", "level", "name");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_pkey" PRIMARY KEY ("id");


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_pkey" PRIMARY KEY ("id");


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."vector_indexes"
    ADD CONSTRAINT "vector_indexes_pkey" PRIMARY KEY ("id");


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries" USING "btree" ("instance_id");


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "confirmation_token_idx" ON "auth"."users" USING "btree" ("confirmation_token") WHERE (("confirmation_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "email_change_token_current_idx" ON "auth"."users" USING "btree" ("email_change_token_current") WHERE (("email_change_token_current")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "email_change_token_new_idx" ON "auth"."users" USING "btree" ("email_change_token_new") WHERE (("email_change_token_new")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors" USING "btree" ("user_id", "created_at");


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state" USING "btree" ("created_at" DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "identities_email_idx" ON "auth"."identities" USING "btree" ("email" "text_pattern_ops");


--
-- Name: INDEX "identities_email_idx"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX "auth"."identities_email_idx" IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "identities_user_id_idx" ON "auth"."identities" USING "btree" ("user_id");


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "idx_auth_code" ON "auth"."flow_state" USING "btree" ("auth_code");


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "idx_oauth_client_states_created_at" ON "auth"."oauth_client_states" USING "btree" ("created_at");


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state" USING "btree" ("user_id", "authentication_method");


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges" USING "btree" ("created_at" DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "mfa_factors_user_friendly_name_unique" ON "auth"."mfa_factors" USING "btree" ("friendly_name", "user_id") WHERE (TRIM(BOTH FROM "friendly_name") <> ''::"text");


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors" USING "btree" ("user_id");


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "oauth_auth_pending_exp_idx" ON "auth"."oauth_authorizations" USING "btree" ("expires_at") WHERE ("status" = 'pending'::"auth"."oauth_authorization_status");


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "oauth_clients_deleted_at_idx" ON "auth"."oauth_clients" USING "btree" ("deleted_at");


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "oauth_consents_active_client_idx" ON "auth"."oauth_consents" USING "btree" ("client_id") WHERE ("revoked_at" IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "oauth_consents_active_user_client_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "client_id") WHERE ("revoked_at" IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "oauth_consents_user_order_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "granted_at" DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("relates_to");


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("token_hash");


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens" USING "btree" ("user_id", "token_type");


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "reauthentication_token_idx" ON "auth"."users" USING "btree" ("reauthentication_token") WHERE (("reauthentication_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "recovery_token_idx" ON "auth"."users" USING "btree" ("recovery_token") WHERE (("recovery_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id");


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id", "user_id");


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens" USING "btree" ("parent");


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens" USING "btree" ("session_id", "revoked");


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens" USING "btree" ("updated_at" DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers" USING "btree" ("sso_provider_id");


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states" USING "btree" ("created_at" DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states" USING "btree" ("for_email");


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states" USING "btree" ("sso_provider_id");


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions" USING "btree" ("not_after" DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "sessions_oauth_client_id_idx" ON "auth"."sessions" USING "btree" ("oauth_client_id");


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions" USING "btree" ("user_id");


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "sso_domains_domain_idx" ON "auth"."sso_domains" USING "btree" ("lower"("domain"));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains" USING "btree" ("sso_provider_id");


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "sso_providers_resource_id_idx" ON "auth"."sso_providers" USING "btree" ("lower"("resource_id"));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "sso_providers_resource_id_pattern_idx" ON "auth"."sso_providers" USING "btree" ("resource_id" "text_pattern_ops");


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "unique_phone_factor_per_user" ON "auth"."mfa_factors" USING "btree" ("user_id", "phone");


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions" USING "btree" ("user_id", "created_at");


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "users_email_partial_key" ON "auth"."users" USING "btree" ("email") WHERE ("is_sso_user" = false);


--
-- Name: INDEX "users_email_partial_key"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX "auth"."users_email_partial_key" IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "users_instance_id_email_idx" ON "auth"."users" USING "btree" ("instance_id", "lower"(("email")::"text"));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "users_instance_id_idx" ON "auth"."users" USING "btree" ("instance_id");


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "users_is_anonymous_idx" ON "auth"."users" USING "btree" ("is_anonymous");


--
-- Name: idx_order_items_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_order_items_order" ON "public"."order_items" USING "btree" ("order_id");


--
-- Name: idx_order_items_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_order_items_order_id" ON "public"."order_items" USING "btree" ("order_id");


--
-- Name: idx_orders_branch_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_orders_branch_created" ON "public"."orders" USING "btree" ("branch_id", "created_at" DESC);


--
-- Name: idx_orders_branch_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_orders_branch_created_at" ON "public"."orders" USING "btree" ("branch_id", "created_at" DESC);


--
-- Name: idx_orders_branch_due_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_orders_branch_due_date" ON "public"."orders" USING "btree" ("branch_id", "due_date");


--
-- Name: idx_orders_branch_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_orders_branch_id" ON "public"."orders" USING "btree" ("branch_id");


--
-- Name: idx_orders_customer_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_orders_customer_created" ON "public"."orders" USING "btree" ("customer_id", "created_at" DESC);


--
-- Name: idx_orders_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_orders_customer_id" ON "public"."orders" USING "btree" ("customer_id");


--
-- Name: idx_snapshots_branch_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_snapshots_branch_date" ON "public"."daily_analytics_snapshots" USING "btree" ("branch_id", "date");


--
-- Name: idx_special_rates_branch_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_special_rates_branch_item" ON "public"."special_item_rates" USING "btree" ("branch_id", "item_id");


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX "bname" ON "storage"."buckets" USING "btree" ("name");


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX "bucketid_objname" ON "storage"."objects" USING "btree" ("bucket_id", "name");


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX "buckets_analytics_unique_name_idx" ON "storage"."buckets_analytics" USING "btree" ("name") WHERE ("deleted_at" IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX "idx_multipart_uploads_list" ON "storage"."s3_multipart_uploads" USING "btree" ("bucket_id", "key", "created_at");


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX "idx_name_bucket_level_unique" ON "storage"."objects" USING "btree" ("name" COLLATE "C", "bucket_id", "level");


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX "idx_objects_bucket_id_name" ON "storage"."objects" USING "btree" ("bucket_id", "name" COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX "idx_objects_lower_name" ON "storage"."objects" USING "btree" (("path_tokens"["level"]), "lower"("name") "text_pattern_ops", "bucket_id", "level");


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX "idx_prefixes_lower_name" ON "storage"."prefixes" USING "btree" ("bucket_id", "level", (("string_to_array"("name", '/'::"text"))["level"]), "lower"("name") "text_pattern_ops");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX "name_prefix_search" ON "storage"."objects" USING "btree" ("name" "text_pattern_ops");


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX "objects_bucket_id_level_idx" ON "storage"."objects" USING "btree" ("bucket_id", "level", "name" COLLATE "C");


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX "vector_indexes_name_bucket_id_idx" ON "storage"."vector_indexes" USING "btree" ("name", "bucket_id");


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();


--
-- Name: orders set_bill_id; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "set_bill_id" BEFORE INSERT ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."generate_bill_id"();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER "enforce_bucket_name_length_trigger" BEFORE INSERT OR UPDATE OF "name" ON "storage"."buckets" FOR EACH ROW EXECUTE FUNCTION "storage"."enforce_bucket_name_length"();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER "objects_delete_delete_prefix" AFTER DELETE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."delete_prefix_hierarchy_trigger"();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER "objects_insert_create_prefix" BEFORE INSERT ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."objects_insert_prefix_trigger"();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER "objects_update_create_prefix" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW WHEN ((("new"."name" <> "old"."name") OR ("new"."bucket_id" <> "old"."bucket_id"))) EXECUTE FUNCTION "storage"."objects_update_prefix_trigger"();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER "prefixes_create_hierarchy" BEFORE INSERT ON "storage"."prefixes" FOR EACH ROW WHEN (("pg_trigger_depth"() < 1)) EXECUTE FUNCTION "storage"."prefixes_insert_trigger"();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER "prefixes_delete_hierarchy" AFTER DELETE ON "storage"."prefixes" FOR EACH ROW EXECUTE FUNCTION "storage"."delete_prefix_hierarchy_trigger"();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER "update_objects_updated_at" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_oauth_client_id_fkey" FOREIGN KEY ("oauth_client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: bill_sequences bill_sequences_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."bill_sequences"
    ADD CONSTRAINT "bill_sequences_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");


--
-- Name: daily_analytics_snapshots daily_analytics_snapshots_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."daily_analytics_snapshots"
    ADD CONSTRAINT "daily_analytics_snapshots_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");


--
-- Name: laundry_settings laundry_settings_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."laundry_settings"
    ADD CONSTRAINT "laundry_settings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE CASCADE;


--
-- Name: order_items order_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."laundry_items"("id");


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;


--
-- Name: orders orders_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");


--
-- Name: orders orders_closed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_closed_by_fkey" FOREIGN KEY ("closed_by") REFERENCES "auth"."users"("id");


--
-- Name: orders orders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id");


--
-- Name: profiles profiles_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE RESTRICT;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: special_item_rates special_item_rates_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."special_item_rates"
    ADD CONSTRAINT "special_item_rates_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE CASCADE;


--
-- Name: special_item_rates special_item_rates_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."special_item_rates"
    ADD CONSTRAINT "special_item_rates_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."laundry_items"("id") ON DELETE RESTRICT;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."prefixes"
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "storage"."s3_multipart_uploads"("id") ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."vector_indexes"
    ADD CONSTRAINT "vector_indexes_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets_vectors"("id");


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."audit_log_entries" ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."flow_state" ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."identities" ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."instances" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."mfa_amr_claims" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."mfa_challenges" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."mfa_factors" ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."one_time_tokens" ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."refresh_tokens" ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."saml_providers" ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."saml_relay_states" ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."schema_migrations" ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."sessions" ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."sso_domains" ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."sso_providers" ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."users" ENABLE ROW LEVEL SECURITY;

--
-- Name: orders Allow public read access by ID; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access by ID" ON "public"."orders" FOR SELECT TO "anon" USING (true);


--
-- Name: branches Allow public read access to branches; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access to branches" ON "public"."branches" FOR SELECT TO "anon" USING (true);


--
-- Name: customers Allow public read access to customers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access to customers" ON "public"."customers" FOR SELECT TO "anon" USING (true);


--
-- Name: order_items Allow public read access to items; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access to items" ON "public"."order_items" FOR SELECT TO "anon" USING (true);


--
-- Name: customers Auth users full access customers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Auth users full access customers" ON "public"."customers" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: order_items Auth users full access items; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Auth users full access items" ON "public"."order_items" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: orders Auth users full access orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Auth users full access orders" ON "public"."orders" USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: branches Auth users read branches; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Auth users read branches" ON "public"."branches" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: laundry_items Auth users view items; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Auth users view items" ON "public"."laundry_items" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: profiles Insert access for admins only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Insert access for admins only" ON "public"."profiles" FOR INSERT WITH CHECK (("public"."get_my_role"() = 'ADMIN'::"text"));


--
-- Name: branches Public read branches; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read branches" ON "public"."branches" FOR SELECT USING (true);


--
-- Name: profiles Read access for users and admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Read access for users and admins" ON "public"."profiles" FOR SELECT USING ((("auth"."uid"() = "user_id") OR ("public"."get_my_role"() = 'ADMIN'::"text")));


--
-- Name: bill_sequences Staff can manage bill sequences; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Staff can manage bill sequences" ON "public"."bill_sequences" TO "authenticated" USING (true) WITH CHECK (true);


--
-- Name: daily_analytics_snapshots Staff can view analytics; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Staff can view analytics" ON "public"."daily_analytics_snapshots" FOR SELECT TO "authenticated" USING (true);


--
-- Name: special_item_rates Staff view branch rates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Staff view branch rates" ON "public"."special_item_rates" FOR SELECT USING (("branch_id" IN ( SELECT "profiles"."branch_id"
   FROM "public"."profiles"
  WHERE ("profiles"."user_id" = "auth"."uid"()))));


--
-- Name: laundry_settings Staff view branch settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Staff view branch settings" ON "public"."laundry_settings" FOR SELECT USING (("branch_id" IN ( SELECT "profiles"."branch_id"
   FROM "public"."profiles"
  WHERE ("profiles"."user_id" = "auth"."uid"()))));


--
-- Name: profiles Update access for users and admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Update access for users and admins" ON "public"."profiles" FOR UPDATE USING ((("auth"."uid"() = "user_id") OR ("public"."get_my_role"() = 'ADMIN'::"text")));


--
-- Name: bill_sequences; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."bill_sequences" ENABLE ROW LEVEL SECURITY;

--
-- Name: branches; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."branches" ENABLE ROW LEVEL SECURITY;

--
-- Name: customers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;

--
-- Name: daily_analytics_snapshots; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."daily_analytics_snapshots" ENABLE ROW LEVEL SECURITY;

--
-- Name: laundry_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."laundry_items" ENABLE ROW LEVEL SECURITY;

--
-- Name: laundry_settings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."laundry_settings" ENABLE ROW LEVEL SECURITY;

--
-- Name: order_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;

--
-- Name: orders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

--
-- Name: special_item_rates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."special_item_rates" ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."buckets_analytics" ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."buckets_vectors" ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."migrations" ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."prefixes" ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."s3_multipart_uploads" ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."s3_multipart_uploads_parts" ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."vector_indexes" ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA "auth"; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA "auth" TO "anon";
GRANT USAGE ON SCHEMA "auth" TO "authenticated";
GRANT USAGE ON SCHEMA "auth" TO "service_role";
GRANT ALL ON SCHEMA "auth" TO "supabase_auth_admin";
GRANT ALL ON SCHEMA "auth" TO "dashboard_user";
GRANT USAGE ON SCHEMA "auth" TO "postgres";


--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


--
-- Name: SCHEMA "storage"; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA "storage" TO "postgres" WITH GRANT OPTION;
GRANT USAGE ON SCHEMA "storage" TO "anon";
GRANT USAGE ON SCHEMA "storage" TO "authenticated";
GRANT USAGE ON SCHEMA "storage" TO "service_role";
GRANT ALL ON SCHEMA "storage" TO "supabase_storage_admin";
GRANT ALL ON SCHEMA "storage" TO "dashboard_user";


--
-- Name: FUNCTION "email"(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION "auth"."email"() TO "dashboard_user";


--
-- Name: FUNCTION "jwt"(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION "auth"."jwt"() TO "postgres";
GRANT ALL ON FUNCTION "auth"."jwt"() TO "dashboard_user";


--
-- Name: FUNCTION "role"(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION "auth"."role"() TO "dashboard_user";


--
-- Name: FUNCTION "uid"(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION "auth"."uid"() TO "dashboard_user";


--
-- Name: FUNCTION "create_full_order"("p_branch_id" "uuid", "p_customer_phone" "text", "p_customer_name" "text", "p_customer_address" "text", "p_order_details" "jsonb", "p_items" "jsonb"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."create_full_order"("p_branch_id" "uuid", "p_customer_phone" "text", "p_customer_name" "text", "p_customer_address" "text", "p_order_details" "jsonb", "p_items" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."create_full_order"("p_branch_id" "uuid", "p_customer_phone" "text", "p_customer_name" "text", "p_customer_address" "text", "p_order_details" "jsonb", "p_items" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_full_order"("p_branch_id" "uuid", "p_customer_phone" "text", "p_customer_name" "text", "p_customer_address" "text", "p_order_details" "jsonb", "p_items" "jsonb") TO "service_role";


--
-- Name: FUNCTION "generate_bill_id"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."generate_bill_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_bill_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_bill_id"() TO "service_role";


--
-- Name: FUNCTION "generate_daily_snapshot"("target_date" "date"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."generate_daily_snapshot"("target_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_daily_snapshot"("target_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_daily_snapshot"("target_date" "date") TO "service_role";


--
-- Name: FUNCTION "generate_smart_tag"("p_branch_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."generate_smart_tag"("p_branch_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_smart_tag"("p_branch_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_smart_tag"("p_branch_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "get_my_role"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_my_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_my_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_my_role"() TO "service_role";


--
-- Name: FUNCTION "handle_new_user"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


--
-- Name: FUNCTION "mark_bill_as_delivered"("target_bill_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."mark_bill_as_delivered"("target_bill_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."mark_bill_as_delivered"("target_bill_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_bill_as_delivered"("target_bill_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "search_orders_v1"("p_branch_id" "uuid", "p_search_term" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."search_orders_v1"("p_branch_id" "uuid", "p_search_term" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_orders_v1"("p_branch_id" "uuid", "p_search_term" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_orders_v1"("p_branch_id" "uuid", "p_search_term" "text") TO "service_role";


--
-- Name: FUNCTION "update_daily_analytics"("target_date" "date"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."update_daily_analytics"("target_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."update_daily_analytics"("target_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_daily_analytics"("target_date" "date") TO "service_role";


--
-- Name: TABLE "audit_log_entries"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."audit_log_entries" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."audit_log_entries" TO "postgres";
GRANT SELECT ON TABLE "auth"."audit_log_entries" TO "postgres" WITH GRANT OPTION;


--
-- Name: TABLE "flow_state"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."flow_state" TO "postgres";
GRANT SELECT ON TABLE "auth"."flow_state" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."flow_state" TO "dashboard_user";


--
-- Name: TABLE "identities"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."identities" TO "postgres";
GRANT SELECT ON TABLE "auth"."identities" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."identities" TO "dashboard_user";


--
-- Name: TABLE "instances"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."instances" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."instances" TO "postgres";
GRANT SELECT ON TABLE "auth"."instances" TO "postgres" WITH GRANT OPTION;


--
-- Name: TABLE "mfa_amr_claims"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."mfa_amr_claims" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_amr_claims" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_amr_claims" TO "dashboard_user";


--
-- Name: TABLE "mfa_challenges"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."mfa_challenges" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_challenges" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_challenges" TO "dashboard_user";


--
-- Name: TABLE "mfa_factors"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."mfa_factors" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_factors" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_factors" TO "dashboard_user";


--
-- Name: TABLE "oauth_authorizations"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."oauth_authorizations" TO "postgres";
GRANT ALL ON TABLE "auth"."oauth_authorizations" TO "dashboard_user";


--
-- Name: TABLE "oauth_client_states"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."oauth_client_states" TO "postgres";
GRANT ALL ON TABLE "auth"."oauth_client_states" TO "dashboard_user";


--
-- Name: TABLE "oauth_clients"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."oauth_clients" TO "postgres";
GRANT ALL ON TABLE "auth"."oauth_clients" TO "dashboard_user";


--
-- Name: TABLE "oauth_consents"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."oauth_consents" TO "postgres";
GRANT ALL ON TABLE "auth"."oauth_consents" TO "dashboard_user";


--
-- Name: TABLE "one_time_tokens"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."one_time_tokens" TO "postgres";
GRANT SELECT ON TABLE "auth"."one_time_tokens" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."one_time_tokens" TO "dashboard_user";


--
-- Name: TABLE "refresh_tokens"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."refresh_tokens" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."refresh_tokens" TO "postgres";
GRANT SELECT ON TABLE "auth"."refresh_tokens" TO "postgres" WITH GRANT OPTION;


--
-- Name: SEQUENCE "refresh_tokens_id_seq"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE "auth"."refresh_tokens_id_seq" TO "dashboard_user";
GRANT ALL ON SEQUENCE "auth"."refresh_tokens_id_seq" TO "postgres";


--
-- Name: TABLE "saml_providers"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."saml_providers" TO "postgres";
GRANT SELECT ON TABLE "auth"."saml_providers" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."saml_providers" TO "dashboard_user";


--
-- Name: TABLE "saml_relay_states"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."saml_relay_states" TO "postgres";
GRANT SELECT ON TABLE "auth"."saml_relay_states" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."saml_relay_states" TO "dashboard_user";


--
-- Name: TABLE "schema_migrations"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE "auth"."schema_migrations" TO "postgres" WITH GRANT OPTION;


--
-- Name: TABLE "sessions"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."sessions" TO "postgres";
GRANT SELECT ON TABLE "auth"."sessions" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sessions" TO "dashboard_user";


--
-- Name: TABLE "sso_domains"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."sso_domains" TO "postgres";
GRANT SELECT ON TABLE "auth"."sso_domains" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sso_domains" TO "dashboard_user";


--
-- Name: TABLE "sso_providers"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."sso_providers" TO "postgres";
GRANT SELECT ON TABLE "auth"."sso_providers" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sso_providers" TO "dashboard_user";


--
-- Name: TABLE "users"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."users" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."users" TO "postgres";
GRANT SELECT ON TABLE "auth"."users" TO "postgres" WITH GRANT OPTION;


--
-- Name: TABLE "bill_sequences"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."bill_sequences" TO "anon";
GRANT ALL ON TABLE "public"."bill_sequences" TO "authenticated";
GRANT ALL ON TABLE "public"."bill_sequences" TO "service_role";


--
-- Name: TABLE "branches"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."branches" TO "anon";
GRANT ALL ON TABLE "public"."branches" TO "authenticated";
GRANT ALL ON TABLE "public"."branches" TO "service_role";


--
-- Name: TABLE "customers"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";


--
-- Name: TABLE "daily_analytics_snapshots"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."daily_analytics_snapshots" TO "anon";
GRANT ALL ON TABLE "public"."daily_analytics_snapshots" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_analytics_snapshots" TO "service_role";


--
-- Name: TABLE "laundry_items"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."laundry_items" TO "anon";
GRANT ALL ON TABLE "public"."laundry_items" TO "authenticated";
GRANT ALL ON TABLE "public"."laundry_items" TO "service_role";


--
-- Name: TABLE "laundry_settings"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."laundry_settings" TO "anon";
GRANT ALL ON TABLE "public"."laundry_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."laundry_settings" TO "service_role";


--
-- Name: TABLE "order_items"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";


--
-- Name: TABLE "orders"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";


--
-- Name: TABLE "profiles"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";


--
-- Name: TABLE "special_item_rates"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."special_item_rates" TO "anon";
GRANT ALL ON TABLE "public"."special_item_rates" TO "authenticated";
GRANT ALL ON TABLE "public"."special_item_rates" TO "service_role";


--
-- Name: TABLE "buckets"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE "storage"."buckets" FROM "supabase_storage_admin";
GRANT ALL ON TABLE "storage"."buckets" TO "supabase_storage_admin" WITH GRANT OPTION;
GRANT ALL ON TABLE "storage"."buckets" TO "anon";
GRANT ALL ON TABLE "storage"."buckets" TO "authenticated";
GRANT ALL ON TABLE "storage"."buckets" TO "service_role";
GRANT ALL ON TABLE "storage"."buckets" TO "postgres" WITH GRANT OPTION;


--
-- Name: TABLE "buckets_analytics"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE "storage"."buckets_analytics" TO "service_role";
GRANT ALL ON TABLE "storage"."buckets_analytics" TO "authenticated";
GRANT ALL ON TABLE "storage"."buckets_analytics" TO "anon";


--
-- Name: TABLE "buckets_vectors"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE "storage"."buckets_vectors" TO "service_role";
GRANT SELECT ON TABLE "storage"."buckets_vectors" TO "authenticated";
GRANT SELECT ON TABLE "storage"."buckets_vectors" TO "anon";


--
-- Name: TABLE "objects"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE "storage"."objects" FROM "supabase_storage_admin";
GRANT ALL ON TABLE "storage"."objects" TO "supabase_storage_admin" WITH GRANT OPTION;
GRANT ALL ON TABLE "storage"."objects" TO "anon";
GRANT ALL ON TABLE "storage"."objects" TO "authenticated";
GRANT ALL ON TABLE "storage"."objects" TO "service_role";
GRANT ALL ON TABLE "storage"."objects" TO "postgres" WITH GRANT OPTION;


--
-- Name: TABLE "prefixes"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE "storage"."prefixes" TO "service_role";
GRANT ALL ON TABLE "storage"."prefixes" TO "authenticated";
GRANT ALL ON TABLE "storage"."prefixes" TO "anon";


--
-- Name: TABLE "s3_multipart_uploads"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE "storage"."s3_multipart_uploads" TO "service_role";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads" TO "authenticated";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads" TO "anon";


--
-- Name: TABLE "s3_multipart_uploads_parts"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE "storage"."s3_multipart_uploads_parts" TO "service_role";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads_parts" TO "authenticated";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads_parts" TO "anon";


--
-- Name: TABLE "vector_indexes"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE "storage"."vector_indexes" TO "service_role";
GRANT SELECT ON TABLE "storage"."vector_indexes" TO "authenticated";
GRANT SELECT ON TABLE "storage"."vector_indexes" TO "anon";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON SEQUENCES TO "dashboard_user";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON FUNCTIONS TO "dashboard_user";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON TABLES TO "dashboard_user";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES TO "service_role";


--
-- PostgreSQL database dump complete
--

\unrestrict mPI1UEmUAs7yhQTMRGAF1aaq0SQGMSY2AEy7BmAi52xraxKe3dFq4mFFmSrbdwH

