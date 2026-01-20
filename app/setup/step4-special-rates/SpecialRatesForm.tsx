// app/setup/step4-special-rates/SpecialRatesForm.tsx

'use client'
import { useState } from 'react'
import { Sparkles, ArrowRight, Loader2, ChevronRight, Check, ToggleLeft, ToggleRight, Zap } from 'lucide-react'
import { saveSpecialRatesAction } from './actions'

export default function SpecialRatesForm({ branchId, items, services }: { branchId: string, items: any[], services: any[] }) {
  const [loading, setLoading] = useState(false)
  const [enabledItems, setEnabledItems] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setEnabledItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <form action={async (fd) => { setLoading(true); await saveSpecialRatesAction(fd); }} className="w-full">
      <input type="hidden" name="branchId" value={branchId} />

      {/* Spacious Header Section */}
      <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-amber-500 font-bold uppercase tracking-widest text-[10px] mb-1">
            <Sparkles size={14} /> Final Step
          </div>
          <h1 className="text-3xl font-black text-slate-800">Special Item Rates</h1>
          <p className="text-slate-500 text-sm mt-1">Configure premium overrides for Ethnic and Home Linen items.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <Zap className="text-blue-500" size={20} />
          <span className="text-xs font-bold text-slate-600">Onboarding nearly complete</span>
        </div>
      </div>

      {/* Vertical List Layout - Utilizing full width */}
      <div className="p-10 space-y-8">
        {items.map((item) => {
          const isEnabled = !!enabledItems[item.id]
          return (
            <div key={item.id} className={`transition-all duration-300 ${isEnabled ? 'scale-[1.01]' : 'opacity-70'}`}>
              <div className={`border-2 rounded-3xl p-8 flex flex-col md:flex-row gap-8 transition-all ${isEnabled ? 'bg-white border-blue-500 shadow-xl' : 'bg-slate-50/50 border-slate-100'}`}>
                
                {/* Left Side: Item Info & Toggle */}
                <div className="md:w-1/3 space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{item.category}</span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{item.name}</h3>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${isEnabled ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
                  >
                    {isEnabled ? <><ToggleRight size={20} /> Override Enabled</> : <><ToggleLeft size={20} /> Set Override</>}
                    <input type="hidden" name={`enabled_${item.id}`} value={isEnabled ? 'true' : 'false'} />
                  </button>
                </div>

                {/* Right Side: Service Inputs (Only if enabled) */}
                <div className="flex-1">
                  {isEnabled ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                      {services.map((service) => (
                        <div key={service.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <div className="flex items-center justify-between mb-4 px-1">
                            <span className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                               <ChevronRight size={14} className="text-blue-500" /> {service.name}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">Default: ₹{service.price}/{service.unit}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-1">New Rate (₹)</label>
                              <input 
                                name={`rate_${item.id}_${service.id}`} 
                                type="number" 
                                placeholder="0" 
                                className="w-full p-3 text-sm font-black border-2 border-slate-200 rounded-xl bg-white focus:border-blue-500 outline-none transition-all" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-1">Min {service.unit}</label>
                              <input 
                                name={`minValue_${item.id}_${service.id}`} 
                                type="number" 
                                step="0.1" 
                                placeholder="Threshold" 
                                className="w-full p-3 text-sm font-bold border-2 border-slate-200 rounded-xl bg-white focus:border-blue-500 outline-none transition-all" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-1">Min Charge (₹)</label>
                              <input 
                                name={`minPrice_${item.id}_${service.id}`} 
                                type="number" 
                                placeholder="Flat Fee" 
                                className="w-full p-3 text-sm font-black border-2 border-slate-200 rounded-xl bg-blue-50/50 text-blue-600 focus:border-blue-500 outline-none transition-all" 
                              />
                            </div>
                          </div>
                          <input type="hidden" name={`masterId_${item.id}_${service.id}`} value={service.master_service_id || ''} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-white/30">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No active override</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Final Action Bar */}
      <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-4 shadow-xl hover:bg-black active:scale-[0.98] transition-all disabled:bg-slate-400"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : <>Complete Setup <ArrowRight size={24} /></>}
        </button>
      </div>
    </form>
  )
}