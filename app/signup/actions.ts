'use server'

import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function signUpAction(formData: FormData) {
  // Use Admin Client to bypass RLS for initial user creation
  // Ensure SUPABASE_SERVICE_ROLE_KEY is in your .env
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  )

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string

  // 1. Create Auth User
  const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  })

  if (authError) return { success: false, error: authError.message }
  if (!authData.user) return { success: false, error: "User creation failed" }

  // 2. Create Profile (Empty Branch ID)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      user_id: authData.user.id,
      full_name: fullName,
      email: email,
      role: 'ADMIN', // User is an admin of their future shop
      // phone: phone // Uncomment if column exists
    })

  if (profileError) {
    console.error("Profile Error:", profileError)
    // Don't block success, dashboard can handle missing profiles
  }

  return { success: true }
}