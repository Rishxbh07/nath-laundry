// app/setup/step4-special-rates/page.tsx
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

  // 1. Fetch only the relevant "Special" categories to reduce clutter
  const { data: items } = await supabase
    .from('item_catalog')
    .select('*')
    .in('category', ['ETHNIC', 'HOME_LINEN', 'other'])
    .eq('is_active', true)
    .order('category', { ascending: true })

  // 2. Fetch configured branch services
  const { data: services } = await supabase
    .from('shop_services')
    .select('*')
    .eq('branch_id', branchId)
    .eq('is_active', true)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8"> 
      <SpecialRatesForm 
        branchId={branchId} 
        items={items || []} 
        services={services || []} 
      />
    </div>
  )
}