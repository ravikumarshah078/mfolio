import { NextResponse, type NextRequest } from 'next/server'
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /dashboard and /onboarding routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
    const sessionCookie = request.cookies.get(COOKIE_NAME)
    const sessionUser = sessionCookie?.value ? await verifySessionToken(sessionCookie.value) : null

    if (!sessionUser) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
