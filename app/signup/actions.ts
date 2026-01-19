'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function signUpAction(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c) => c.forEach((v) => cookieStore.set(v)),
      },
    }
  )

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string

  // 1. Standard Sign Up
  // We pass 'full_name' and 'phone' in metadata so the Database Trigger picks them up
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone, // Passed to metadata
      },
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // 2. Success
  // No need to manually create a profile. The DB Trigger does it for us.
  return { success: true }
}