/**
 * Industry Standard Role Definitions
 * These match the Postgres ENUM 'public.app_role' exactly.
 */
export enum UserRole {
  ADMIN = 'ADMIN',         // Full access: Owners, High-level managers
  AUTH_USER = 'AUTH_USER', // Verified Staff: Can perform most operations
  USER = 'USER'            // Basic Access: Trainees or limited staff
}

/**
 * Type definition for the Profile table structure
 */
export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  role: UserRole
  branch_code: string | null
  created_at: string
}