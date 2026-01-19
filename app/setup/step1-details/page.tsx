'use client'
import { Building2, MapPin, Phone, ArrowRight } from 'lucide-react'
import { createBranchAction } from './actions'

export default function Step1Page() {
  return (
    <form action={async (formData) => { await createBranchAction(formData); }} className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
          <Building2 size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Shop Details</h1>
        <p className="text-sm text-slate-500">Step 1 of 3: The Basics</p>
      </div>

      {/* Inputs (Simplified for brevity, keep your styling) */}
      <div className="space-y-4">
        <div>
           <label className="block text-xs font-bold text-slate-500 uppercase">Shop Name</label>
           <input name="shopName" required className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="e.g. Nath Drycleaners" />
        </div>
        <div>
           <label className="block text-xs font-bold text-slate-500 uppercase">Address</label>
           <input name="address" required className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="Pune, Maharashtra" />
        </div>
        <div>
           <label className="block text-xs font-bold text-slate-500 uppercase">Phone</label>
           <input name="phone1" required className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="9876543210" />
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
        Next: Settings <ArrowRight size={18} />
      </button>
    </form>
  )
}