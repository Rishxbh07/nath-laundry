'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createShopAction(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(v => cookieStore.set(v)) } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const shopName = formData.get('shopName') as string
  const address = formData.get('address') as string
  const phone1 = formData.get('phone1') as string
  const phone2 = formData.get('phone2') as string

  // 1. Format Phone (As per schema data: "8793741220/8767537734")
  const combinedPhone = phone2 ? `${phone1}/${phone2}` : phone1

  // 2. Generate Branch Code (Schema requires a UNIQUE 'code' column)
  // Logic: First 3 letters of name (uppercase) + random 4 digits
  const codePrefix = shopName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'SHP')
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  const generatedCode = `${codePrefix}-${randomNum}`

  // 3. Insert Branch
  const { data: branch, error: branchError } = await supabase
    .from('branches')
    .insert({ 
        name: shopName, 
        address: address, // Correct column name
        phone: combinedPhone,
        code: generatedCode, // Required by schema
        is_active: true
    })
    .select('id')
    .single()

  if (branchError) return { success: false, error: branchError.message }

  // 4. Update User Profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ branch_id: branch.id })
    .eq('user_id', user.id)

  if (profileError) return { success: false, error: "Profile update failed" }

  return { success: true, branchId: branch.id }
}