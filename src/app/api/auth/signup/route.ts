import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signSessionToken, setSessionCookie } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, slug } = await request.json()

    if (!email || !password || !fullName || !slug) {
      return NextResponse.json(
        { error: 'Email, password, full name, and URL slug are required.' },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()
    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      )
    }

    // Check if email already registered
    const existingEmail = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })
    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 }
      )
    }

    // Check if slug already claimed
    const existingSlug = await prisma.user.findUnique({
      where: { slug: cleanSlug },
    })
    if (existingSlug) {
      return NextResponse.json(
        { error: `The URL slug /${cleanSlug} is already claimed by another user.` },
        { status: 400 }
      )
    }

    // Hash password with bcryptjs
    const passwordHash = await bcrypt.hash(password, 10)

    // Create User & initial Portfolio record in database
    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        name: fullName,
        slug: cleanSlug,
        portfolio: {
          create: {
            fullName,
            headline: 'Software Professional',
            bio: 'Welcome to my mfolio portfolio.',
            themeId: 'minimal',
          },
        },
      },
    })

    // Sign JWT session token
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      slug: user.slug,
    })

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully.',
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
    console.error('Error in /api/auth/signup:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create account.' },
      { status: 500 }
    )
  }
}
