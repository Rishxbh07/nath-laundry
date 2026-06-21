'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // 1. Get data from form
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 2. Attempt Sign In
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Fetch branch profile information, then fetch the human-readable branch name from the branches table
  if (authData?.user) {
    // A. Get the user's branch code from their profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('branch_code')
      .eq('id', authData.user.id)
      .single()

    if (profile?.branch_code) {
      // B. Look up the actual branch name from the branches table using the code
      const { data: branch } = await supabase
        .from('branches')
        .select('name')
        .eq('branch_code', profile.branch_code)
        .single()

      // C. Cache both secure code and display name into the session token metadata
      await supabase.auth.updateUser({
        data: {
          branch_code: profile.branch_code,
          branch_name: branch?.name || `Branch ${profile.branch_code}`, 
        },
      })
    }
  }

  // 3. Redirect on success
  revalidatePath('/', 'layout')
  redirect('/')
}