import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation' // Added for safety
import ServiceForm from './ServiceForm' 

export default async function Step3Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ branchId?: string }> 
}) {
  // 1. Correctly await the searchParams promise
  const { branchId } = await searchParams 

  // 2. Safety Check: If no branchId, don't even try to load the page
  if (!branchId) {
    console.error("Step3Page: No branchId provided in URL")
    // Option A: Redirect back to step 1 or a selection page
    redirect('/setup') 
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(v => cookieStore.set(v)) } }
  )

  // 3. Fetch Master Services
  const { data: masters, error } = await supabase
    .from('master_services')
    .select('*')
    .order('name')
    
  if (error || !masters) {
    return <div className="p-4 text-red-500 text-center">Failed to load services. Please refresh.</div>
  }

  // 4. Pass the validated branchId to the Client Component
  return <ServiceForm branchId={branchId} masters={masters} />
}