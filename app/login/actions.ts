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
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // 3. Redirect on success
  revalidatePath('/', 'layout')
  redirect('/')
}