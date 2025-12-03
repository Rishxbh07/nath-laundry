'use client'

import { login } from './actions'
import { useActionState } from 'react'
import { Lock } from 'lucide-react'

const initialState = {
  error: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await login(formData);
    if (result?.error) {
      return { error: result.error };
    }
    return { error: '' };
  }, initialState);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-(family-name:--font-comfortaa) mb-2">
          <span className="bg-linear-to-r from-blue-700 via-blue-500 to-sky-400 bg-clip-text text-transparent">
            Nath Drycleaners
          </span>
        </h1>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
          Staff Access Only
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-white p-8">
        
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Lock size={32} />
          </div>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
              Employee Email
            </label>
            <input 
              name="email"
              type="email" 
              required
              placeholder="staff@nath.com"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block p-4 outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
              Password
            </label>
            <input 
              name="password"
              type="password" 
              required
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block p-4 outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          {state?.error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium text-center border border-red-100">
              {state.error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-semibold rounded-xl text-sm px-5 py-4 text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
          >
            {isPending ? 'Verifying...' : 'Authenticate'}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-300 leading-relaxed">
          Unauthorized access is prohibited.<br/>
          IP addresses are monitored for security.
        </p>
      </div>
    </div>
  )
}