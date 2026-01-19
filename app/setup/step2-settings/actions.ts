'use server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function saveSettingsAction(formData: FormData) {
  const branchId = formData.get('branchId') as string
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(v => cookieStore.set(v)) } }
  )

  const { error } = await supabase.from('shop_settings').insert({
    branch_id: branchId,
    billing_mode: formData.get('billingMode'),
    delivery_enabled: formData.get('delivery') === 'on'
  })

  if (error) return { error: error.message }
  
  redirect(`/setup/step3-services?branchId=${branchId}`)
}