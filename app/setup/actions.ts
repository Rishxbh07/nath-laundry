'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// ... existing imports

export async function saveSettingsAction(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(v => cookieStore.set(v)) } }
  )

  // 1. Get Billing Preferences from Form
  const billingMode = formData.get('billingMode') as string // 'MANUAL' or 'AUTOMATIC'
  
  // Call Function 1: Save Settings
  const { error: settingsError } = await supabase.rpc('save_shop_settings', {
    p_billing_mode: billingMode,
    p_delivery_enabled: true // Example
  })

  if (settingsError) return { success: false, error: settingsError.message }

  // 2. Get Services (Assuming you pass them as a stringified JSON or structured form fields)
  // For standard form fields, you might loop through them:
  const services = [
    { name: 'Wash & Fold', price: Number(formData.get('price_wf')), unit: 'kg' },
    { name: 'Iron Only', price: Number(formData.get('price_iron')), unit: 'piece' },
    // ... add others
  ]

  // Call Function 2: Loop and Save Services
  for (const service of services) {
    const { error: serviceError } = await supabase.rpc('save_shop_service', {
      p_service_name: service.name,
      p_price: service.price,
      p_unit: service.unit
    })
    
    if (serviceError) {
      console.error('Service Save Error:', service.name, serviceError)
      return { success: false, error: `Failed to save ${service.name}` }
    }
  }

  return { success: true }
}