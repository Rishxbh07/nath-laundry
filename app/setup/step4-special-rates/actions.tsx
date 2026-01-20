'use server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function saveSpecialRatesAction(formData: FormData) {
  const branchId = formData.get('branchId') as string
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(v => cookieStore.set(v)) } }
  )

  const ratesToSave = []
  
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('rate_')) {
      const [_, itemId, serviceId] = key.split('_')
      
      // Check if the item's toggle was actually ON
      const isEnabled = formData.get(`enabled_${itemId}`) === 'true'
      const rateValue = parseFloat(value as string)

      if (isEnabled && !isNaN(rateValue)) {
        const masterId = formData.get(`masterId_${itemId}_${serviceId}`) as string
        const minPrice = parseFloat(formData.get(`minPrice_${itemId}_${serviceId}`) as string) || 0
        const minValue = parseFloat(formData.get(`minValue_${itemId}_${serviceId}`) as string) || 0

        ratesToSave.push({
          branch_id: branchId,
          item_catalog_id: itemId,
          master_service_id: masterId || null,
          custom_shop_service_id: masterId ? null : serviceId,
          rate: rateValue,
          unit: 'PC', // Defaulting to industry standard per PC for special items
          min_price: minPrice,
          min_value: minValue,
          is_active: true
        })
      }
    }
  }

  if (ratesToSave.length > 0) {
    const { error } = await supabase
      .from('shop_special_item_rates')
      .upsert(ratesToSave)

    if (error) return { error: error.message }
  }

  redirect(`/dashboard?branchId=${branchId}`)
}