'use client'
import { createClient } from '@/app/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [branches, setBranches] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBranches = async () => {
      const supabase = createClient()
      
      // Attempt to fetch branches
      const { data, error } = await supabase.from('branches').select('*')
      
      if (error) {
        console.error('Supabase error:', error)
        setError(error.message)
      } else {
        setBranches(data || [])
      }
      setLoading(false)
    }

    fetchBranches()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Connection Test</h1>
        
        {loading && <p className="text-gray-500">Connecting to Supabase...</p>}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700 font-bold">Error:</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && branches.length === 0 && (
          <div className="bg-yellow-50 p-4 rounded text-yellow-700">
            Connected, but no branches found. Did you run the seed script?
          </div>
        )}

        {!loading && branches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <p className="text-green-600 font-semibold">Database Connected!</p>
            </div>
            
            <h2 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-2">Branches Found:</h2>
            <ul className="divide-y divide-gray-100">
              {branches.map((b) => (
                <li key={b.id} className="py-2">
                  <p className="font-medium text-gray-900">{b.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{b.code}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}