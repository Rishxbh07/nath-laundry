'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createBranchAction(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(v => cookieStore.set(v)) } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Please log in" }

  const shopName = formData.get('shopName') as string
  const shopCode = (shopName.substring(0, 3) + Math.floor(Math.random() * 1000)).toUpperCase()

  const { data: branch, error } = await supabase
    .from('branches')
    .insert({
      owner_id: user.id,
      name: shopName,
      address: formData.get('address'),
      phone: formData.get('phone1'),
      code: shopCode
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  // Redirect to Step 2 with the ID
  redirect(`/setup/step2-settings?branchId=${branch.id}`)
}