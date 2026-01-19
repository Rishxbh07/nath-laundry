'use client'

import { useState, useEffect } from 'react'
import { Shirt, CheckCircle2, Loader2, Plus, Trash2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { finishSetupAction } from './actions'

export default function ServiceForm({ branchId, masters }: { branchId: string, masters: any[] }) {
  const [loading, setLoading] = useState(false)
  // We generate a proper UUID for custom services so the DB doesn't get ""
  const [customServices, setCustomServices] = useState<{ id: string }[]>([])

  // Safety Check: If branchId is missing, show a warning
  if (!branchId || branchId === 'undefined' || branchId === '') {
    return (
      <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
        <h2 className="font-bold text-red-800 text-lg">Setup Error</h2>
        <p className="text-red-600 text-sm mt-1">Branch ID is missing. Please go back to Step 1.</p>
      </div>
    )
  }

  const addCustomService = () => {
    setCustomServices([...customServices, { id: crypto.randomUUID() }])
  }

  const removeCustomService = (id: string) => {
    setCustomServices(customServices.filter(s => s.id !== id))
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    const result = await finishSetupAction(formData)
    
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success("Setup complete!")
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* CRITICAL: This MUST be a valid UUID */}
      <input type="hidden" name="branchId" value={branchId} />

      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
          <Shirt size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Set Your Services</h1>
        <p className="text-sm text-slate-500">Step 3 of 3: Standard & Custom Services</p>
      </div>

      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
        {/* SECTION: MASTER SERVICES */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Standard Services (Overrides)</label>
          {masters.map((service) => (
            <div key={service.id} className="p-4 border rounded-xl bg-slate-50 space-y-3">
               <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">{service.name}</span>
                  <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-500 font-bold uppercase">
                    {service.category}
                  </span>
               </div>
               <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Unit</label>
                    <select name={`unit_${service.id}`} defaultValue={service.unit} className="w-full mt-1 p-2 bg-white border rounded-lg text-sm font-medium">
                      <option value="KG">Per KG</option>
                      <option value="PC">Per PC</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Price (₹)</label>
                    <input name={`price_${service.id}`} defaultValue={service.default_price} type="number" className="w-full mt-1 p-2 border rounded-lg font-bold text-right" />
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* SECTION: CUSTOM SERVICES */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Custom Services</label>
            <button 
              type="button" 
              onClick={addCustomService}
              className="text-[10px] flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold hover:bg-blue-100 transition-colors"
            >
              <Plus size={12} /> Add Custom
            </button>
          </div>

          {customServices.map((custom) => (
            <div key={custom.id} className="p-4 border border-blue-100 rounded-xl bg-blue-50/30 space-y-3 relative">
               <input type="hidden" name={`custom_id_${custom.id}`} value={custom.id} />
               
               <button 
                type="button" 
                onClick={() => removeCustomService(custom.id)}
                className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors"
               >
                 <Trash2 size={16} />
               </button>
               
               <div>
                 <label className="text-[10px] text-slate-400 font-bold uppercase">Service Name</label>
                 <input 
                  name={`custom_name_${custom.id}`} 
                  placeholder="e.g. Steam Press" 
                  required 
                  className="w-full mt-1 p-2 bg-white border rounded-lg text-sm font-bold" 
                 />
               </div>

               <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Unit</label>
                    <select name={`custom_unit_${custom.id}`} className="w-full mt-1 p-2 bg-white border rounded-lg text-sm font-medium">
                      <option value="KG">Per KG</option>
                      <option value="PC">Per PC</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Price (₹)</label>
                    <input name={`custom_price_${custom.id}`} placeholder="0" type="number" required className="w-full mt-1 p-2 border rounded-lg font-bold text-right" />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
      >
        {loading ? <Loader2 className="animate-spin" /> : <>Complete Setup <CheckCircle2 size={18} /></>}
      </button>
    </form>
  )
}