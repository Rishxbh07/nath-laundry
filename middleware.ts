import { type NextRequest } from 'next/server'
import { updateSession } from '@/app/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     * - auth
     * - manifest.json (PWA Manifest)  <-- ADDED
     * - icons/ (PWA Icons)            <-- ADDED
     * - sw.js (Service Worker)        <-- ADDED
     * - workbox- (Workbox Files)      <-- ADDED
     * - images with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/|sw.js|workbox-|login|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}