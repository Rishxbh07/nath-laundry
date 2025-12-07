import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // This client is safe to use in the browser
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}