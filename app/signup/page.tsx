'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, User, Mail, Lock, ArrowRight, Phone } from 'lucide-react'
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
      toast.success("Account created! Please log in.")
      router.push('/login')
    } else {
      toast.error(res.error || "Failed to create account")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-blue-100 text-sm mt-2">Join Nath Laundry SaaS</p>
        </div>

        <form action={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <input name="fullName" required placeholder="Full Name" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" />
                </div>
                <div className="relative">
                    <Phone className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <input name="phone" required placeholder="Phone" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" />
                </div>
             </div>

             <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input name="email" type="email" required placeholder="Email Address" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" />
             </div>
             
             <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input name="password" type="password" required placeholder="Create Password" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" />
             </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
          </button>

          <p className="text-center text-slate-500 text-sm">
            Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}