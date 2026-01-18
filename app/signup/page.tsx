'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Building2, User, MapPin, Phone, Mail, Lock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { signUpAction } from './actions'

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    const res = await signUpAction(formData)
    setLoading(false)

    if (res.success) {
      toast.success("Account created! Redirecting to setup...")
      // Redirect to settings with the new branch ID
      router.push(`/settings?branchId=${res.branchId}`)
    } else {
      toast.error(res.error || "Failed to create account")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Start your Laundry Business</h1>
          <p className="text-blue-100 text-sm mt-2">Create your account and shop profile in seconds.</p>
        </div>

        <form action={handleSubmit} className="p-8 space-y-5">
          
          {/* Section: User Info */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <User className="w-4 h-4" /> Your Details
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <input name="fullName" required placeholder="Full Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                <input name="phone" required placeholder="Phone Number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
             </div>

             <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input name="email" type="email" required placeholder="Email Address" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
             </div>
             
             <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input name="password" type="password" required placeholder="Password" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
             </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Shop Info */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Building2 className="w-4 h-4" /> Shop Details
             </div>

             <input name="shopName" required placeholder="Laundry Shop Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
             
             <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input name="location" required placeholder="City / Location (e.g. Pune)" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
             </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Get Started <ArrowRight className="w-5 h-5" /></>}
          </button>

          <p className="text-center text-slate-500 text-sm">
            Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}