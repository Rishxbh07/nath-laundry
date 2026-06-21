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

  // Fetch branch profile information using correct schema alignments
  if (authData?.user) {
    // A. Match on user_id, select branch_id from the profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('branch_id')
      .eq('user_id', authData.user.id)
      .single()

    if (profile?.branch_id) {
      // B. Match on id to retrieve the branch name and code from the branches table
      const { data: branch } = await supabase
        .from('branches')
        .select('name, code')
        .eq('id', profile.branch_id)
        .single()

      if (branch) {
        // C. Cache accurate values inside the user session token metadata metadata container
        await supabase.auth.updateUser({
          data: {
            branch_id: profile.branch_id,
            branch_code: branch.code,
            branch_name: branch.name, 
          },
        })
      }
    }
  }

  // 3. Redirect on success
  revalidatePath('/', 'layout')
  redirect('/')
}