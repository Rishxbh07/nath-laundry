'use client'
import { useState } from 'react'
import { Sparkles, ArrowRight, Loader2, Info } from 'lucide-react'
import { saveSpecialRatesAction } from './actions'

export default function SpecialRatesForm({ branchId, items, services }: { branchId: string, items: any[], services: any[] }) {
  const [loading, setLoading] = useState(false)

  return (
    <form action={async (fd) => { setLoading(true); await saveSpecialRatesAction(fd); }} className="space-y-6">
      <input type="hidden" name="branchId" value={branchId} />

      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-600">
          <Sparkles size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Special Pricing</h1>
        <p className="text-sm text-slate-500">Optional: Set specific rates for items like Blankets or Sarees.</p>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="p-4 border rounded-xl bg-slate-50 border-slate-200">
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              {item.name} <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{item.category}</span>
            </h3>
            
            <div className="space-y-4">
              {/* Only show relevant services for setup speed, e.g., Dry Clean or Wash & Fold */}
              {services.map((service) => (
                <div key={service.id} className="pl-4 border-l-2 border-slate-200 py-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">{service.name} Rate</span>
                    <div className="flex items-center gap-2">
                       <input 
                         name={`rate_${item.id}_${service.id}`} 
                         type="number" 
                         placeholder="Override Price" 
                         className="w-24 p-1.5 text-sm border rounded-lg text-right" 
                       />
                       <select name={`unit_${item.id}_${service.id}`} defaultValue={service.unit} className="text-xs p-1.5 border rounded-lg bg-white">
                         <option value="PC">PC</option>
                         <option value="KG">KG</option>
                         <option value="FLAT">FLAT</option>
                       </select>
                    </div>
                  </div>

                  {/* Thresholds (Hidden by default or shown as "Advanced") */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Min Price (₹)</label>
                      <input name={`minPrice_${item.id}_${service.id}`} type="number" placeholder="0" className="w-full p-1 text-xs border rounded bg-white" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Min Value (Qty/Kg)</label>
                      <input name={`minValue_${item.id}_${service.id}`} type="number" placeholder="0" className="w-full p-1 text-xs border rounded bg-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-start">
        <Info className="text-blue-500 shrink-0" size={16} />
        <p className="text-[10px] text-blue-700">
          Leave prices empty to use the standard shop rates you set in the previous step.
        </p>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
      >
        {loading ? <Loader2 className="animate-spin" /> : <>Complete Onboarding <ArrowRight size={18} /></>}
      </button>
    </form>
  )
}