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
  
  // We look for keys like "rate_{itemId}_{serviceId}"
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('rate_')) {
      const [_, itemId, serviceId] = key.split('_')
      const rateValue = parseFloat(value as string)
      
      if (!isNaN(rateValue)) {
        // Find associated unit and thresholds for this specific item/service combo
        const unit = formData.get(`unit_${itemId}_${serviceId}`) as string
        const minPrice = parseFloat(formData.get(`minPrice_${itemId}_${serviceId}`) as string) || 0
        const minValue = parseFloat(formData.get(`minValue_${itemId}_${serviceId}`) as string) || 0

        ratesToSave.push({
          branch_id: branchId,
          item_catalog_id: itemId,
          master_service_id: serviceId, // Assuming master service for setup simplicity
          rate: rateValue,
          unit: unit,
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
      .upsert(ratesToSave, { 
        onConflict: 'branch_id, item_catalog_id, master_service_id' 
      })

    if (error) return { error: error.message }
  }

  // Final redirection to the Dashboard
 redirect(`/setup/step4-special-rates?branchId=${branchId}`)
}