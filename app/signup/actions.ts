'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function signUpAction(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const shopName = formData.get('shopName') as string
  const location = formData.get('location') as string

  // 1. Create Supabase User
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  })

  if (authError) return { success: false, error: authError.message }
  if (!authData.user) return { success: false, error: "No user created" }

  const userId = authData.user.id

  // 2. Create the Branch
  const { data: branchData, error: branchError } = await supabase
    .from('branches')
    .insert({ name: shopName, location: location })
    .select('id')
    .single()

  if (branchError) {
    console.error("Branch Error:", branchError)
    return { success: false, error: "Could not create shop." }
  }

  // 3. Link User to Branch in Profile
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      user_id: userId,
      branch_id: branchData.id,
      full_name: fullName,
      role: 'ADMIN'
    })

  if (profileError) {
     return { success: false, error: "Profile setup failed." }
  }

  return { success: true, branchId: branchData.id }
}