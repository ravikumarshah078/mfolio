import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: sessionUser.userId },
      select: {
        id: true,
        email: true,
        name: true,
        slug: true,
        avatarUrl: true,
      },
    })

    if (!dbUser) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: dbUser,
    })
  } catch (error: any) {
    console.error('Error in /api/auth/me:', error)
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 })
  }
}
