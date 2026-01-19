'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createShopAction(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(v => cookieStore.set(v)) } }
  )

  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Please log in first." }

  // 2. Create Branch
  const shopName = formData.get('shopName') as string
  const shopCode = (shopName.substring(0, 3) + Math.floor(Math.random() * 1000)).toUpperCase()

  const { data: branch, error: branchError } = await supabase
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

  if (branchError) {
    console.error("Branch Creation Error:", branchError)
    return { success: false, error: branchError.message }
  }

  // 3. Create Settings (TARGETING NEW TABLE: shop_settings)
  const { error: settingsError } = await supabase
    .from('shop_settings') // <--- FIXED TABLE NAME
    .insert({
      branch_id: branch.id,
      billing_mode: formData.get('billingMode') || 'MANUAL',
      delivery_enabled: formData.get('delivery') === 'on'
    })

  if (settingsError) {
     console.error("Settings Error:", settingsError)
     return { success: false, error: "Failed to save settings" }
  }

  // 4. Create Services (TARGETING NEW TABLE: shop_services)
  const services = [
    { branch_id: branch.id, name: 'Wash & Fold', price: Number(formData.get('price_wf')) || 50, unit: 'KG', category: 'BULK' },
    { branch_id: branch.id, name: 'Iron Only', price: Number(formData.get('price_iron')) || 10, unit: 'PC', category: 'ADDON' },
    { branch_id: branch.id, name: 'Dry Clean', price: Number(formData.get('price_dc')) || 200, unit: 'PC', category: 'ADDON' }
  ]

  const { error: serviceError } = await supabase
    .from('shop_services') // <--- FIXED TABLE NAME
    .insert(services)

  if (serviceError) console.error("Service Error:", serviceError)

  return { success: true, branchId: branch.id }
}