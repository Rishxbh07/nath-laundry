import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // FIX: request.cookies.set takes a SINGLE object argument
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({
              name,
              value,
              ...options,
            })
          )
          
          supabaseResponse = NextResponse.next({
            request,
          })
          
          // NextResponse.cookies.set can take 3 arguments
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Get User
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 2. Public Route Logic (Login/Auth/Bill Links are always allowed)
  const isPublicRoute = 
    request.nextUrl.pathname.startsWith('/login') || 
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/bill'); 

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 3. ADMIN Route Protection (Dashboard)
  if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
    
    // Fetch Profile Role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    // STRICT CHECK: If not ADMIN, kick them back to Home
    if (profile?.role !== 'ADMIN') {
      const url = request.nextUrl.clone()
      url.pathname = '/' // Redirect to Order Page
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}