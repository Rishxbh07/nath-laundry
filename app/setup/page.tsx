// app/setup/page.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2, Settings, Shirt, Plus, ArrowRight, Sparkles } from 'lucide-react'

export default async function SetupDashboard() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(v => cookieStore.set(v)) } }
  )

  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Fetch User's Branches
  const { data: branches } = await supabase
    .from('branches')
    .select('id, name, code, created_at')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  // 3. Smart Redirect: If they have absolutely no branches, send them to create one immediately.
  if (!branches || branches.length === 0) {
    redirect('/setup/step1-details')
  }

  // 4. Render the "Resume Setup" Dashboard
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Your Shops</h1>
        <p className="text-slate-500">Continue setup for an existing shop or create a new one.</p>
      </div>

      <div className="space-y-4">
        {/* Create New Button */}
        <Link 
          href="/setup/step1-details" 
          className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium"
        >
          <Plus size={20} />
          Register a New Branch
        </Link>

        {/* Existing Branches List */}
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{branch.name}</h3>
                <p className="text-xs text-slate-400 font-mono">CODE: {branch.code}</p>
              </div>
              <Link 
                href={`/dashboard?branchId=${branch.id}`}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                Go to Dashboard <ArrowRight size={12}/>
              </Link>
            </div>

            {/* The "Jump To Step" Grid */}
            <div className="grid grid-cols-3 gap-3">
              <Link 
                href={`/setup/step1-details?branchId=${branch.id}&mode=edit`} // You can add edit logic later if you want
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <Building2 size={20} className="text-slate-400 group-hover:text-blue-600 mb-2" />
                <span className="text-xs font-medium text-slate-600">Edit Details</span>
              </Link>

              <Link 
                href={`/setup/step2-settings?branchId=${branch.id}`}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <Settings size={20} className="text-slate-400 group-hover:text-purple-600 mb-2" />
                <span className="text-xs font-medium text-slate-600">Settings</span>
              </Link>

              <Link 
                href={`/setup/step3-services?branchId=${branch.id}`}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-green-300 hover:bg-green-50 transition-all group"
              >
                <Shirt size={20} className="text-slate-400 group-hover:text-green-600 mb-2" />
                <span className="text-xs font-medium text-slate-600">Prices</span>
              </Link>
              <Link 
                href={`/setup/step4-special-rates?branchId=${branch.id}`}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-amber-300 hover:bg-amber-50 transition-all group"
              >
                <Sparkles size={20} className="text-slate-400 group-hover:text-amber-600 mb-2" />
                <span className="text-xs font-medium text-slate-600">Special</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}