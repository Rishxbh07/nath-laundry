import { type NextRequest } from 'next/server'
import { updateSession } from '@/app/utils/supabase/middleware'

// Rename function to 'proxy' to match Next.js 16+ convention
export async function proxy(request: NextRequest) {
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
     * - manifest.json (PWA Manifest)
     * - icons/ (PWA Icons)
     * - sw.js (Service Worker)
     * - workbox- (Workbox Files)
     * - images with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/|sw.js|workbox-|login|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}