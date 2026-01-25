'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createShopAction(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: { 
        getAll: () => cookieStore.getAll(), 
        setAll: (c) => c.forEach(v => cookieStore.set(v)) 
      } 
    }
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
      code: shopCode,
      status: 'ACTIVE' // Explicitly set status
    })
    .select('id')
    .single()

  if (branchError) {
    console.error("Branch Creation Error:", branchError)
    return { success: false, error: branchError.message }
  }

  // 3. Link Creator as OWNER in branch_staff
  const { error: staffError } = await supabase
    .from('branch_staff')
    .insert({
      branch_id: branch.id,
      user_id: user.id,
      role: 'OWNER'
    })

  if (staffError) {
     console.error("Staff Creation Error:", staffError)
     // Not returning fail here because branch is already created, 
     // but in a production app you might want to handle this rollback.
  }

  // 4. Create Settings
  const { error: settingsError } = await supabase
    .from('shop_settings') 
    .insert({
      branch_id: branch.id,
      billing_mode: formData.get('billingMode') || 'MANUAL',
      delivery_enabled: formData.get('delivery') === 'on'
    })

  if (settingsError) {
     console.error("Settings Error:", settingsError)
     return { success: false, error: "Failed to save settings" }
  }

  // 5. Update Profile with active branch_id for recognition
  await supabase
    .from('profiles')
    .update({ branch_id: branch.id })
    .eq('user_id', user.id)

  return { success: true, branchId: branch.id }
}