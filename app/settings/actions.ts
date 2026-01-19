'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ShopSettingsFormValues } from './schema'

// --- 1. FETCH SETTINGS ---
export async function getShopSettings(branchId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  // A. Fetch Basic Settings
  const { data: settings } = await supabase
    .from('shop_settings')
    .select('*')
    .eq('branch_id', branchId)
    .single()

  // B. Fetch Services
  const { data: servicesRaw } = await supabase
    .from('shop_services')
    .select('*')
    .eq('branch_id', branchId)
    .order('name')

  // C. Fetch Item Rules (JSONB)
  const { data: rules } = await supabase
    .from('shop_item_rules')
    .select(`
      *,
      item_catalog ( name )
    `)
    .eq('branch_id', branchId)

  // D. Fetch Catalog (Global + Custom)
  const { data: catalog } = await supabase
    .from('item_catalog')
    .select('*')
    .or(`branch_id.is.null,branch_id.eq.${branchId}`)
    .order('name')

  // --- MAPPING ---

  // 1. Map Services (DB columns -> Form fields)
  const services = (servicesRaw || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    category: s.category || 'ADDON',
    pricing_unit: s.unit || 'PC',      // DB 'unit' -> Form 'pricing_unit'
    default_rate: s.price || 0,        // DB 'price' -> Form 'default_rate'
    is_active: s.is_active,
    is_default: false 
  }))

  // 2. Map Special Items (JSONB -> Flat Form Array)
  // We unpack the 'services_config' JSON array into individual rows for the UI
  const special_items = (rules || []).flatMap((r: any) => {
    const configs = Array.isArray(r.services_config) ? r.services_config : [];
    
    return configs.map((conf: any) => ({
      // We generate a composite ID or leave undefined so the form handles it
      item_catalog_id: r.item_catalog_id,
      name: r.item_catalog?.name || 'Unknown',
      service_id: conf.service_id,
      rate: conf.rate,
      rate_type: conf.rate_type,
      has_threshold: conf.has_threshold,
      threshold_weight: conf.threshold_weight,
      below_threshold_rate: conf.below_threshold_rate,
      is_active: r.is_active
    }));
  });

  return {
    settings: {
      branch_id: branchId,
      billing_mode: settings?.billing_mode || 'MANUAL',
      delivery_enabled: settings?.delivery_enabled || false,
      services: services,
      special_items: special_items
    },
    catalog: catalog || []
  }
}

// --- 2. SAVE SETTINGS ---
export async function updateShopSettings(data: ShopSettingsFormValues) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  try {
    // A. Update Shop Settings
    const { error: settingsError } = await supabase
      .from('shop_settings') 
      .upsert({
        branch_id: data.branch_id,
        billing_mode: data.billing_mode, 
        delivery_enabled: data.delivery_enabled
      }, { onConflict: 'branch_id' })
    
    if (settingsError) throw new Error(`Settings Error: ${settingsError.message}`)

    // B. Update Services
    for (const service of data.services) {
        const payload = {
             branch_id: data.branch_id,
             name: service.name,
             price: service.default_rate, // Map Form 'default_rate' -> DB 'price'
             unit: service.pricing_unit,  // Map Form 'pricing_unit' -> DB 'unit'
             category: service.category || 'ADDON',
             is_active: service.is_active
        }

        if (service.id && service.id.length > 10) {
            await supabase.from('shop_services').update(payload).eq('id', service.id)
        } else {
            await supabase.from('shop_services').insert(payload)
        }
    }

    // C. Update Special Rules (Flat Form Array -> JSONB)
    
    // 1. Group the flat rules by Item ID
    const groupedRules = new Map<string, any[]>();

    for (const rule of data.special_items) {
        if (!rule.service_id) continue; // Skip invalid rows

        if (!groupedRules.has(rule.item_catalog_id)) {
            groupedRules.set(rule.item_catalog_id, []);
        }

        groupedRules.get(rule.item_catalog_id)?.push({
            service_id: rule.service_id,
            rate: rule.rate,
            rate_type: rule.rate_type,
            has_threshold: rule.has_threshold,
            threshold_weight: rule.threshold_weight || 0,
            below_threshold_rate: rule.below_threshold_rate || 0
        });
    }

    // 2. Upsert each Item's configuration as one JSONB row
    for (const [itemId, configs] of groupedRules) {
        const payload = {
            branch_id: data.branch_id,
            item_catalog_id: itemId,
            services_config: configs, // Save the array as JSON
            is_active: true
        }

        const { error } = await supabase
            .from('shop_item_rules')
            .upsert(payload, { onConflict: 'branch_id, item_catalog_id' })
        
        if (error) throw new Error(`Rule Error: ${error.message}`)
    }

    return { success: true }
  } catch (error: any) {
    console.error("Save Error:", error)
    return { success: false, error: error.message }
  }
}

// --- 3. CREATE CATALOG ITEM ---
export async function createCatalogItem(name: string, category: string) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
        { cookies: { getAll: () => cookieStore.getAll() } }
    )
    
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get Branch
    const { data: branch } = await supabase
        .from('branches')
        .select('id')
        .eq('owner_id', user?.id)
        .single()

    if (!branch) throw new Error("Branch not found")

    // Create Item (Linked to Branch)
    const { data, error } = await supabase
        .from('item_catalog')
        .insert({ 
            name, 
            category, 
            branch_id: branch.id 
        })
        .select()
        .single()
        
    if(error) throw error;
    return data;
}