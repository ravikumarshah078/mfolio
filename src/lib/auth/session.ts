import { SignJWT, jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'mfolio-super-secret-jwt-key-2026-production'
)

export const COOKIE_NAME = 'mfolio_session'

export interface SessionPayload {
  userId: string
  email: string
  slug: string
}

/**
 * Sign a new JWT session token (valid for 7 days)
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET_KEY)
}

/**
 * Verify and decode an incoming JWT session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY)
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      slug: payload.slug as string,
    }
  } catch (error) {
    return null
  }
}

/**
 * Get the session user payload from an incoming NextRequest cookie
 */
export async function getSessionUser(request: NextRequest): Promise<SessionPayload | null> {
  const tokenCookie = request.cookies.get(COOKIE_NAME)
  if (!tokenCookie || !tokenCookie.value) {
    return null
  }
  return await verifySessionToken(tokenCookie.value)
}

/**
 * Attach the mfolio_session HTTP-only cookie to a NextResponse
 */
export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

/**
 * Clear the mfolio_session cookie from a NextResponse
 */
export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}
