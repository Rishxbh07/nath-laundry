'use server'

import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signOut() {
  const supabase = await createClient()
  
  // Sign out from Supabase (invalidates the session on the server)
  await supabase.auth.signOut()
  
  // Revalidate the layout to update any protected states
  revalidatePath('/', 'layout')
  
  // Redirect back to login
  redirect('/login')
}