'use client'
import { useState } from 'react'
import { Sparkles, ArrowRight, Loader2, Info, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react'
import { saveSpecialRatesAction } from './actions'

export default function SpecialRatesForm({ branchId, items, services }: { branchId: string, items: any[], services: any[] }) {
  const [loading, setLoading] = useState(false)
  // Track which items are enabled for special rates
  const [enabledItems, setEnabledItems] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setEnabledItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <form action={async (fd) => { setLoading(true); await saveSpecialRatesAction(fd); }} className="space-y-6">
      <input type="hidden" name="branchId" value={branchId} />

      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-600">
          <Sparkles size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Special Rates</h1>
        <p className="text-sm text-slate-500">Toggle items to set specific per-piece or threshold prices.</p>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => {
          const isEnabled = !!enabledItems[item.id]
          return (
            <div key={item.id} className={`border rounded-2xl transition-all ${isEnabled ? 'bg-white border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-700">{item.name}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.category}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-colors ${isEnabled ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}
                >
                  {isEnabled ? <><ToggleRight size={16} /> ON</> : <><ToggleLeft size={16} /> OFF</>}
                  <input type="hidden" name={`enabled_${item.id}`} value={isEnabled ? 'true' : 'false'} />
                </button>
              </div>

              {isEnabled && (
                <div className="p-4 pt-0 space-y-4 border-t border-slate-50 animate-in fade-in slide-in-from-top-1">
                  {services.map((service) => (
                    <div key={service.id} className="pl-4 border-l-2 border-blue-400 py-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">{service.name} Override</span>
                        <div className="flex items-center gap-2">
                           <input 
                             name={`rate_${item.id}_${service.id}`} 
                             type="number" 
                             placeholder="Price" 
                             className="w-20 p-1.5 text-sm border rounded-lg text-right font-bold" 
                           />
                           <span className="text-[10px] font-bold text-slate-400">/{service.unit}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Min Charge (₹)</label>
                          <input name={`minPrice_${item.id}_${service.id}`} type="number" placeholder="Floor Price" className="w-full p-1.5 text-xs border rounded bg-white" />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Min Weight/Qty</label>
                          <input name={`minValue_${item.id}_${service.id}`} type="number" step="0.1" placeholder="Threshold" className="w-full p-1.5 text-xs border rounded bg-white" />
                        </div>
                      </div>
                      <input type="hidden" name={`masterId_${item.id}_${service.id}`} value={service.master_service_id || ''} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
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