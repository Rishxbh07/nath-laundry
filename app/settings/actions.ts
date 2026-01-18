'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ShopSettingsFormValues } from './schema'

// --- FETCH SETTINGS ---
export async function getShopSettings(branchId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data: settings } = await supabase
    .from('saas_shop_settings')
    .select('*')
    .eq('branch_id', branchId)
    .single()

  const { data: services } = await supabase
    .from('saas_shop_services')
    .select('*')
    .eq('branch_id', branchId)
    .order('priority', { ascending: true }) // Ensure priority column exists or remove order

  const { data: rules } = await supabase
    .from('saas_pricing_rules')
    .select(`*, saas_item_catalog ( name )`)
    .eq('branch_id', branchId)

  const { data: catalog } = await supabase
    .from('saas_item_catalog')
    .select('*')
    .order('name')

  return {
    settings: {
      branch_id: branchId,
      is_pro_mode: settings?.is_pro_mode ?? false,
      services: services || [],
      special_items: rules?.map(r => ({
        id: r.id,
        item_catalog_id: r.item_catalog_id,
        name: r.saas_item_catalog?.name,
        service_id: r.service_id,
        rate: r.rate,
        rate_type: r.rate_type || 'PER_UNIT',
        has_threshold: r.has_threshold || false,
        threshold_weight: r.threshold_weight || 0,
        below_threshold_rate: r.below_threshold_rate || 0,
        is_active: r.is_active
      })) || []
    },
    catalog: catalog || []
  }
}

// --- SAVE SETTINGS (FIXED) ---
export async function updateShopSettings(data: ShopSettingsFormValues) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  try {
    // 1. Settings (Use explicit Conflict target)
    const { error: settingsError } = await supabase
      .from('saas_shop_settings')
      .upsert({
        branch_id: data.branch_id,
        is_pro_mode: data.is_pro_mode,
        global_unit: 'KG', 
      }, { onConflict: 'branch_id' })
    
    if (settingsError) throw new Error(`Settings Error: ${settingsError.message}`)

    // 2. Services
    for (const service of data.services) {
        const payload = {
             branch_id: data.branch_id,
             name: service.name,
             category: service.category,
             pricing_unit: service.pricing_unit,
             default_rate: service.default_rate,
             is_active: service.is_active
        }

        if (service.id && service.id.length > 10) {
            // Update Existing
            const { error } = await supabase
              .from('saas_shop_services')
              .update(payload)
              .eq('id', service.id)
            if (error) throw new Error(`Service Update Error: ${error.message}`)
        } else {
            // Insert New
            const { error } = await supabase
              .from('saas_shop_services')
              .insert(payload)
            if (error) throw new Error(`Service Insert Error: ${error.message}`)
        }
    }

    // 3. Special Rules (Clean Empty Strings!)
    for (const rule of data.special_items) {
      
      // SANITIZE: Convert empty strings to undefined so DB doesn't crash on UUID check
      const cleanServiceId = (rule.service_id && rule.service_id.length > 5) ? rule.service_id : null;
      
      if (!cleanServiceId) {
         // Skip rules that have no service linked (prevents crash)
         console.warn("Skipping rule because Service ID is missing:", rule.name);
         continue; 
      }

      const { error } = await supabase
        .from('saas_pricing_rules')
        .upsert({
          id: (rule.id && rule.id.length > 10) ? rule.id : undefined,
          branch_id: data.branch_id,
          service_id: cleanServiceId, // use clean ID
          item_catalog_id: rule.item_catalog_id,
          rate: rule.rate,
          rate_type: rule.rate_type,
          has_threshold: rule.has_threshold,
          threshold_weight: rule.threshold_weight,
          below_threshold_rate: rule.below_threshold_rate,
          is_active: rule.is_active,
        })
       
       if (error) throw new Error(`Rule Error (${rule.name}): ${error.message}`)
    }

    return { success: true }
  } catch (error: any) {
    console.error("Save Error:", error)
    // Return the actual error message to the UI
    return { success: false, error: error.message || "Unknown Database Error" }
  }
}

// --- CATALOG ITEM ---
export async function createCatalogItem(name: string, category: string) {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll: () => cookieStore.getAll() } })
    
    const { data, error } = await supabase
        .from('saas_item_catalog')
        .insert({ name, category, is_special_suggestion: true })
        .select()
        .single()
        
    if(error) throw error;
    return data;
}