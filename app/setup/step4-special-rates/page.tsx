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

  // 1. Fetch items that typically need special rates (Saree, Blanket, etc.)
  const { data: specialItems } = await supabase
    .from('item_catalog')
    .select('*')
    .eq('is_special_suggestion', true)

  // 2. Fetch available services (Master + any custom ones the user just created)
  const { data: services } = await supabase
    .from('master_services')
    .select('*')
    .eq('is_active', true)

  return (
    <SpecialRatesForm 
      branchId={branchId} 
      items={specialItems || []} 
      services={services || []} 
    />
  )
}