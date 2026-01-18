import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Settings, LogOut, User, Store, ChevronRight } from 'lucide-react'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch basic profile info if you have a profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, branch_id')
    .eq('user_id', user.id)
    .single()

  const signOut = async () => {
    'use server'
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    )
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-sm text-gray-500">Manage your account and shop preferences</p>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        
        {/* User Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={24} />
            </div>
            <div>
                <h2 className="font-semibold text-lg">{profile?.full_name || 'Laundry Owner'}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {profile?.role || 'Admin'}
                </span>
            </div>
        </div>

        {/* Action Menu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* SETTINGS LINK - THIS IS WHAT YOU MISSED */}
            <Link href={`/settings?branchId=${profile?.branch_id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Settings size={18} />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-gray-700">Shop Configuration</h3>
                    <p className="text-xs text-gray-400">Manage prices, services & defaults</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
            </Link>

            {/* Other links can go here (e.g. Subscription, Printers) */}
            <div className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors cursor-not-allowed opacity-50">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Store size={18} />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-gray-700">Manage Branch</h3>
                    <p className="text-xs text-gray-400">Branch details & staff (Coming Soon)</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
            </div>
        </div>

        {/* Logout Button */}
        <form action={signOut}>
            <button className="w-full bg-white p-4 rounded-xl shadow-sm border border-red-100 text-red-600 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors font-medium">
                <LogOut size={18} />
                Sign Out
            </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
            Nath Laundry SaaS • Version 2.0.1
        </p>
      </div>
    </div>
  )
}