'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Building2, MapPin, ArrowRight, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { createShopAction } from './actions'

export default function SetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    const res = await createShopAction(formData)
    
    if (res.success) {
      toast.success("Shop created successfully!")
      router.push(`/settings?branchId=${res.branchId}`)
    } else {
      toast.error(res.error || "Failed to create shop")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Building2 size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Setup your Laundry</h1>
            <p className="text-slate-500 mt-2">One last step! Tell us about your shop.</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
            {/* Shop Name */}
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Shop Name</label>
                <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <input name="shopName" required placeholder="e.g. Nath Drycleaners" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" />
                </div>
            </div>

            {/* Address (Corrected from Location) */}
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Address</label>
                <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <textarea 
                        name="address" 
                        required 
                        rows={2}
                        placeholder="e.g. Shop No. 4, College Road, Pune" 
                        className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none" 
                    />
                </div>
            </div>

            {/* Contact Numbers (Split inputs) */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Primary Contact</label>
                    <div className="relative mt-1">
                        <Phone className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                        <input name="phone1" required placeholder="9876543210" className="w-full pl-9 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Secondary (Optional)</label>
                    <div className="relative mt-1">
                        <Phone className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                        <input name="phone2" placeholder="Alternate Number" className="w-full pl-9 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" />
                    </div>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
                {loading ? <Loader2 className="animate-spin" /> : <>Configure & Finish <ArrowRight className="w-5 h-5" /></>}
            </button>
        </form>
      </div>
    </div>
  )
}