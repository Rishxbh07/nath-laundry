'use server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function finishSetupAction(formData: FormData) {
  const branchId = formData.get('branchId') as string
  
  // 1. STOPS THE ERROR: Validate UUID Format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!branchId || !uuidRegex.test(branchId)) {
    console.error("BLOCKING: Invalid Branch ID received:", branchId)
    return { error: "Session Expired or Invalid Branch ID. Please restart the setup." }
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(v => cookieStore.set(v)) } }
  )

  const servicesToSave = []

  for (const [key, value] of formData.entries()) {
    // Process Standard Overrides
    if (key.startsWith('price_')) {
      const masterId = key.split('_')[1]
      
      // Ensure masterId is also a valid UUID and not ""
      if (uuidRegex.test(masterId)) {
        const price = parseFloat(value as string)
        const unit = formData.get(`unit_${masterId}`) as string

        if (!isNaN(price) && unit) {
          servicesToSave.push({
            branch_id: branchId,
            master_service_id: masterId,
            price: price,
            unit: unit,
            category: 'BULK',
            is_active: true
          })
        }
      }
    }

    // Process Custom Services
    if (key.startsWith('custom_name_')) {
      const uniqueRef = key.split('custom_name_')[1]
      const name = value as string
      const price = parseFloat(formData.get(`custom_price_${uniqueRef}`) as string)
      const unit = formData.get(`custom_unit_${uniqueRef}`) as string
      const customId = formData.get(`custom_id_${uniqueRef}`) as string // The UUID we generated on client

      if (name && !isNaN(price) && unit && uuidRegex.test(customId)) {
        servicesToSave.push({
          id: customId, // Use the generated UUID as the PK
          branch_id: branchId,
          master_service_id: null, // Custom services have NO master link
          name: name,
          price: price,
          unit: unit,
          category: 'ADDON',
          is_active: true
        })
      }
    }
  }

  if (servicesToSave.length > 0) {
    // Perform Upsert. 
    // Note: 'onConflict' for custom services works differently if you provide the 'id'.
    const { error } = await supabase
      .from('shop_services')
      .upsert(servicesToSave, { 
        onConflict: 'branch_id, master_service_id' 
      })

    if (error) {
      console.error("DATABASE ERROR:", error)
      return { error: `Failed to save: ${error.message}` }
    }
  }

  // Success!
  redirect(`/dashboard?branchId=${branchId}`)
}