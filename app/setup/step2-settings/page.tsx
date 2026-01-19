'use client'
import { Settings, ArrowRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { saveSettingsAction } from './actions'

export default function Step2Page() {
  const params = useSearchParams()
  const branchId = params.get('branchId')
  
  if (!branchId) return <div>Error: Branch ID missing. Please restart.</div>

  return (
    <form action={async (formData) => { await saveSettingsAction(formData); }} className="space-y-6">
      <input type="hidden" name="branchId" value={branchId} />
      
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-600">
          <Settings size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Preferences</h1>
        <p className="text-sm text-slate-500">Step 2 of 3: How do you work?</p>
      </div>

      <div className="space-y-4">
        {/* Billing Mode */}
        <div className="p-4 border rounded-xl flex items-center justify-between">
           <label className="text-sm font-medium text-slate-700">Billing Mode</label>
           <select name="billingMode" className="bg-slate-50 border p-2 rounded-lg text-sm">
             <option value="MANUAL">Manual (Type Weight/Qty)</option>
             <option value="AUTOMATIC">Auto (Calculated)</option>
           </select>
        </div>

        {/* Delivery Toggle */}
        <div className="p-4 border rounded-xl flex items-center gap-3">
           <input type="checkbox" name="delivery" className="w-5 h-5 text-blue-600 rounded" />
           <label className="text-sm font-medium text-slate-700">Enable Home Delivery?</label>
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
        Next: Services <ArrowRight size={18} />
      </button>
    </form>
  )
}