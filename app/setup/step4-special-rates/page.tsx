import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import SpecialRatesForm from './SpecialRatesForm'

export default async function Step4Page({ searchParams }: { searchParams: Promise<{ branchId: string }> }) {
  const { branchId } = await searchParams
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(v => cookieStore.set(v)) } }
  )

  // 1. Fetch ALL items from item_catalog - removed all category filters
  const { data: items, error: itemError } = await supabase
    .from('item_catalog')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (itemError) console.error("FETCH ERROR [Items]:", itemError)

  // 2. Fetch YOUR branch services configured in Step 3
  const { data: services, error: serviceError } = await supabase
    .from('shop_services')
    .select('*')
    .eq('branch_id', branchId)
    .eq('is_active', true)

  if (serviceError) console.error("FETCH ERROR [Services]:", serviceError)

  return (
    <SpecialRatesForm 
      branchId={branchId} 
      items={items || []} 
      services={services || []} 
    />
  )
}