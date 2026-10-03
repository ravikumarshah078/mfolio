import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signSessionToken, setSessionCookie } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()

    // Find user in Prisma database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    // Compare password with bcrypt hash
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    // Sign JWT session token
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      slug: user.slug,
    })

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        slug: user.slug,
      },
    })

    // Set HTTP-only cookie
    setSessionCookie(response, token)

    return response
  } catch (error: any) {
    console.error('Error in /api/auth/login:', error)
    return NextResponse.json(
      { error: error.message || 'Login failed.' },
      { status: 500 }
    )
  }
}
