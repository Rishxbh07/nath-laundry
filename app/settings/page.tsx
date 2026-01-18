'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2, Save, Wand2, Calculator, ArrowRight, ArrowLeft, ChevronDown, CheckCircle2, Settings2, Scale } from 'lucide-react'
import { toast } from 'sonner'

import { shopSettingsSchema, type ShopSettingsFormValues } from './schema'
import { getShopSettings, updateShopSettings, createCatalogItem } from './actions'

// --- STYLED COMPONENTS ---
const StyledSelect = ({ register, options, ...props }: any) => (
  <div className="relative w-full">
    <select
      {...register}
      {...props}
      className="appearance-none w-full bg-white border border-slate-200 text-slate-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium cursor-pointer text-sm disabled:bg-slate-50 disabled:text-slate-400"
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
  </div>
)

const StyledInput = ({ register, ...props }: any) => (
  <input
    {...register}
    {...props}
    className="w-full bg-white border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-300 text-sm"
  />
)

const Switch = ({ checked, onCheckedChange }: { checked: boolean, onCheckedChange: (c: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={`${checked ? 'bg-blue-600' : 'bg-slate-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
    >
      <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform`}/>
    </button>
)

// --- SPECIAL ITEM CARD ---
const SpecialItemCard = ({ index, field, register, control, remove, services }: any) => {
    const hasThreshold = useWatch({ control, name: `special_items.${index}.has_threshold` });
    const isActive = useWatch({ control, name: `special_items.${index}.is_active` });
    const selectedServiceId = useWatch({ control, name: `special_items.${index}.service_id` });

    // Helper to toggle active state since we can't easily access setValue inside this isolated component without props
    // In a real app, passing `setValue` or using a Controller is cleaner, but this works for the "Card" pattern.
    const toggleActive = () => {
        const checkbox = document.getElementById(`special_items.${index}.is_active_check`) as HTMLInputElement
        if(checkbox) checkbox.click()
    }

    return (
        <div className={`relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isActive ? 'border-slate-200 shadow-sm hover:shadow-md' : 'border-slate-100 opacity-60 bg-slate-50'}`}>
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
                        <Settings2 size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">{field.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                             <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-300'}`} />
                             <span className="text-[10px] font-bold text-slate-400 tracking-wider">{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* 🟢 FIX 1: Add (?? false) to handle undefined */}
                    <Switch 
                        checked={isActive ?? false} 
                        onCheckedChange={toggleActive} 
                    />
                    
                    {/* Hidden Actual Checkbox hooked to Form */}
                    <input 
                        id={`special_items.${index}.is_active_check`}
                        type="checkbox" 
                        className="hidden" 
                        {...register(`special_items.${index}.is_active`)} 
                    />
                     
                     <button type="button" onClick={() => remove(index)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors z-10">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Body */}
            {isActive && (
                <div className="p-5 space-y-5">
                    {/* 1. Service Restriction */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Linked Service</label>
                        <StyledSelect 
                            register={register(`special_items.${index}.service_id`)}
                            options={[
                                { label: 'Select a Service...', value: '' },
                                ...services.map((s: any) => ({ label: s.name, value: s.id }))
                            ]}
                        />
                        {!selectedServiceId && <p className="text-[10px] text-red-400 mt-1">⚠ Please link a service (e.g. Dry Clean)</p>}
                    </div>

                    <div className="h-px bg-slate-100 w-full" />

                    {/* 2. Pricing Logic */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing Logic</label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <span className={`text-xs font-bold transition-colors ${hasThreshold ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>Use Thresholds?</span>
                                <input type="checkbox" className="hidden" {...register(`special_items.${index}.has_threshold`)} />
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${hasThreshold ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${hasThreshold ? 'left-4.5' : 'left-0.5'}`} />
                                </div>
                            </label>
                        </div>

                        {!hasThreshold ? (
                            // SIMPLE MODE
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-[10px] text-slate-400 mb-1 block uppercase">Rate</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                        <StyledInput type="number" register={register(`special_items.${index}.rate`)} style={{paddingLeft: '1.5rem'}} />
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <label className="text-[10px] text-slate-400 mb-1 block uppercase">Unit</label>
                                    <StyledSelect 
                                        register={register(`special_items.${index}.rate_type`)}
                                        options={[
                                            { label: '/ Pc', value: 'FIXED' },
                                            { label: '/ Kg', value: 'PER_UNIT' }
                                        ]}
                                    />
                                </div>
                            </div>
                        ) : (
                            // THRESHOLD MODE
                            <div className="space-y-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-2 text-blue-800 text-xs font-medium mb-1">
                                    <Scale size={14} />
                                    <span>If item weight is...</span>
                                </div>
                                
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-5">
                                        <label className="text-[10px] text-slate-400 uppercase">Less Than</label>
                                        <div className="relative">
                                            <StyledInput type="number" placeholder="1.0" register={register(`special_items.${index}.threshold_weight`)} />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">kg</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex justify-center text-slate-300 pt-4">→</div>
                                    <div className="col-span-5">
                                        <label className="text-[10px] text-slate-400 uppercase">Fixed Cost</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                                            <StyledInput type="number" placeholder="100" register={register(`special_items.${index}.below_threshold_rate`)} style={{paddingLeft: '1rem'}} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-5 pt-2">
                                        <div className="text-xs font-bold text-slate-600">Above Limit</div>
                                    </div>
                                    <div className="col-span-2 flex justify-center text-slate-300 pt-2">→</div>
                                    <div className="col-span-5">
                                        <label className="text-[10px] text-slate-400 uppercase">Rate / Kg</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                                            <StyledInput type="number" placeholder="70" register={register(`special_items.${index}.rate`)} style={{paddingLeft: '1rem'}} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function SettingsWizard({ branchId }: { branchId: string }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState(1)
  const [catalog, setCatalog] = useState<any[]>([])
  
  const form = useForm({
    resolver: zodResolver(shopSettingsSchema),
    defaultValues: {
        branch_id: branchId,
        is_pro_mode: false,
        services: [],
        special_items: []
    }
  })

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({ control: form.control, name: "services" })
  const { fields: specialFields, append: appendSpecial, remove: removeSpecial } = useFieldArray({ control: form.control, name: "special_items" })

  // LOAD DATA
  useEffect(() => {
    async function load() {
      const data = await getShopSettings(branchId)
      
      let services = data.settings.services
      // Default Services if none exist
      if (services.length === 0) {
        services = [
          { name: 'Wash & Fold', category: 'BULK', pricing_unit: 'KG', default_rate: 45, is_active: true, is_default: true },
          { name: 'Wash & Iron', category: 'BULK', pricing_unit: 'KG', default_rate: 60, is_active: true, is_default: true },
          { name: 'Iron Only', category: 'ADDON', pricing_unit: 'PC', default_rate: 8, is_active: true, is_default: true },
          { name: 'Dry Clean', category: 'ADDON', pricing_unit: 'PC', default_rate: 150, is_active: true, is_default: true },
        ]
      }

      form.reset({
        ...data.settings,
        services
      })
      setCatalog(data.catalog)
      setLoading(false)
    }
    load()
  }, [branchId, form])

  // --- ACTIONS ---

  // Standard Save
  const onSubmit = async (data: ShopSettingsFormValues) => {
    setSaving(true)
    const res = await updateShopSettings(data)
    setSaving(false)
    if (res.success) {
      toast.success("Saved successfully!")
      // Reload to get fresh IDs if we just inserted things
      const fresh = await getShopSettings(branchId)
      form.reset({ ...fresh.settings }) 
    } else {
      toast.error(`Failed: ${res.error}`)
    }
    return res.success
  }

  // Handle Step Changes
  const handleNextStep = async () => {
      // IF MOVING FROM SERVICES (STEP 2) -> SPECIALS (STEP 3)
      // WE MUST SAVE TO GENERATE SERVICE IDs
      if (step === 2) {
          toast.info("Saving services first...", { duration: 2000 })
          const success = await onSubmit(form.getValues() as any)
          if (success) {
              setStep(3)
          }
      } else {
          setStep(s => s + 1)
      }
  }

  const handleAddNewCatalogItem = async () => {
    const name = prompt("Enter new Item Name (e.g., Silk Saree)")
    if (!name) return
    try {
      const newItem = await createCatalogItem(name, 'SPECIAL')
      setCatalog(prev => [...prev, newItem])
      
      // Auto-add to list
      const dcService = form.getValues('services').find(s => s.name.toLowerCase().includes('dry')) || form.getValues('services')[0]
      appendSpecial({
        item_catalog_id: newItem.id,
        name: newItem.name,
        service_id: dcService?.id || '', // Safe fallback
        rate: 100,
        rate_type: 'FIXED',
        is_active: true
      })
      toast.success(`Added ${name}`)
    } catch (e) {
      toast.error("Could not create item")
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
             <div>
                <h1 className="text-xl font-bold text-slate-800">Shop Configuration</h1>
                <div className="flex gap-2 text-sm mt-1">
                    <span className={`transition-colors ${step >= 1 ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>1. Preferences</span>
                    <span className="text-slate-300">/</span>
                    <span className={`transition-colors ${step >= 2 ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>2. Services</span>
                    <span className="text-slate-300">/</span>
                    <span className={`transition-colors ${step >= 3 ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>3. Specials</span>
                </div>
             </div>
             {step === 3 && (
                 <div className="hidden md:block">
                    <button 
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 disabled:opacity-70 flex items-center gap-2 transition-all font-medium"
                    >
                        {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                 </div>
             )}
        </div>
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-10 pb-32">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* STEP 1: PREFERENCES */}
            {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-800">Billing Method</h2>
                        <p className="text-slate-500 mt-2 text-lg">How do you want to calculate your bills?</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        <div 
                            onClick={() => form.setValue('is_pro_mode', false)}
                            className={`cursor-pointer border-2 p-8 rounded-2xl flex flex-col items-center text-center space-y-4 transition-all hover:shadow-xl ${!form.watch('is_pro_mode') ? 'border-blue-600 bg-white ring-4 ring-blue-50' : 'border-white bg-white shadow-sm hover:border-blue-200'}`}
                        >
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-2">
                                <Calculator className="w-8 h-8 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-slate-800">Manual Entry</h3>
                                <p className="text-slate-500 mt-2 leading-relaxed">Calculate yourself and just enter the final price.</p>
                            </div>
                            {!form.watch('is_pro_mode') && <div className="text-blue-600 mt-4"><CheckCircle2 className="w-8 h-8" /></div>}
                        </div>

                        <div 
                            onClick={() => form.setValue('is_pro_mode', true)}
                            className={`cursor-pointer border-2 p-8 rounded-2xl flex flex-col items-center text-center space-y-4 transition-all hover:shadow-xl ${form.watch('is_pro_mode') ? 'border-blue-600 bg-white ring-4 ring-blue-50' : 'border-white bg-white shadow-sm hover:border-blue-200'}`}
                        >
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-2">
                                <Wand2 className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-slate-800">Automatic (Pro)</h3>
                                <p className="text-slate-500 mt-2 leading-relaxed">System calculates bills using your rates.</p>
                            </div>
                            {form.watch('is_pro_mode') && <div className="text-blue-600 mt-4"><CheckCircle2 className="w-8 h-8" /></div>}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: SERVICES */}
            {step === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Services & Rates</h2>
                        <p className="text-slate-500">Configure your standard offerings.</p>
                    </div>

                    <div className="space-y-4">
                        {serviceFields.map((field, index) => (
                            <div key={field.id} className="group relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-start md:items-center">
                                <div className="flex-1 w-full">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">{field.category} Service</label>
                                    <input 
                                        {...form.register(`services.${index}.name`)} 
                                        className={`block w-full text-lg font-semibold bg-transparent border-none p-0 focus:ring-0 ${field.is_default ? 'text-slate-800' : 'text-blue-700'}`}
                                        readOnly={field.is_default}
                                        placeholder="Service Name"
                                    />
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <div className="flex-1 md:w-32">
                                        <label className="text-xs text-slate-400 mb-1 block">Rate (₹)</label>
                                        <StyledInput type="number" register={form.register(`services.${index}.default_rate`)} />
                                    </div>
                                    <div className="flex-1 md:w-32">
                                        <label className="text-xs text-slate-400 mb-1 block">Per Unit</label>
                                        <StyledSelect 
                                            register={form.register(`services.${index}.pricing_unit`)}
                                            options={[{label: 'Per Kg', value: 'KG'}, {label: 'Per Piece', value: 'PC'}]}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 pt-2 md:pt-0 pl-2 border-l border-slate-100">
                                    <div className="flex flex-col items-center gap-1">
                                        {/* 🟢 FIX 2: Add (?? false) here too */}
                                        <Switch 
                                            checked={form.watch(`services.${index}.is_active`) ?? false} 
                                            onCheckedChange={(val) => form.setValue(`services.${index}.is_active`, val)} 
                                        />
                                    </div>
                                    {!field.is_default && (
                                        <button type="button" onClick={() => removeService(index)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button 
                            type="button"
                            onClick={() => appendService({ name: '', category: 'ADDON', pricing_unit: 'PC', default_rate: 0, is_active: true, is_default: false })}
                            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 font-medium"
                        >
                            <Plus className="w-5 h-5" /> Add Another Service
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: SPECIAL ITEMS */}
            {step === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Special Items</h2>
                        <p className="text-slate-500 mt-1">Pricing overrides for specific items (like Blankets or Sarees).</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 1. Add Card */}
                        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all min-h-[300px]">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-700">Add Item Rule</h3>
                                <p className="text-xs text-slate-400 mt-1 px-4">Select from catalog to configure</p>
                            </div>
                            <div className="w-full">
                                <StyledSelect 
                                    onChange={(e: any) => {
                                        const item = catalog.find(c => c.id === e.target.value)
                                        // Try to find dry clean, else fallback to first, else empty
                                        const dcService = form.getValues('services').find(s => s.name.toLowerCase().includes('dry') || s.name.toLowerCase().includes('clean')) 
                                        const defaultService = dcService || form.getValues('services')[0]

                                        if (item) {
                                            appendSpecial({
                                                item_catalog_id: item.id,
                                                name: item.name,
                                                service_id: defaultService?.id || '', // Don't crash if empty
                                                rate: 100,
                                                rate_type: 'FIXED',
                                                has_threshold: false,
                                                is_active: true
                                            })
                                            e.target.value = "" 
                                        }
                                    }}
                                    options={[
                                        {label: 'Select Item...', value: ''},
                                        ...catalog.map(c => ({label: c.name, value: c.id}))
                                    ]}
                                />
                                <button 
                                    type="button"
                                    onClick={handleAddNewCatalogItem}
                                    className="text-xs text-blue-600 font-bold mt-3 hover:underline"
                                >
                                    + Create New Item Name
                                </button>
                            </div>
                        </div>

                        {/* 2. Items List */}
                        {specialFields.map((field, index) => (
                            <SpecialItemCard 
                                key={field.id}
                                index={index}
                                field={field}
                                register={form.register}
                                control={form.control}
                                remove={removeSpecial}
                                services={form.getValues('services')}
                            />
                        ))}
                    </div>
                </div>
            )}
        </form>
      </div>
      
      {/* FOOTER NAV */}
      <div className="bg-white border-t border-slate-200 p-4 fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
            {step > 1 ? (
                <button 
                    onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>
            ) : <div />}

            {step < 3 ? (
                <button 
                    onClick={handleNextStep} 
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center gap-2 font-medium transition-transform active:scale-95"
                >
                    {step === 2 && saving ? <Loader2 className="animate-spin w-5 h-5" /> : null}
                    {step === 2 ? 'Save & Continue' : 'Next Step'} <ArrowRight className="w-5 h-5" />
                </button>
            ) : (
                 <button 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={saving}
                    className="md:hidden bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center gap-2 font-medium"
                >
                    {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                    Save Config
                </button>
            )}
        </div>
      </div>
    </div>
  )
}