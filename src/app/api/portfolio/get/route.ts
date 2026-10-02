import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const querySlug = searchParams.get('slug')

    // 1. Check if user is authenticated via Supabase Auth
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    let portfolioRecord = null
    let userRecord = null

    if (authUser) {
      userRecord = await prisma.user.findFirst({
        where: { id: authUser.id },
        include: {
          portfolio: {
            include: {
              experiences: { orderBy: { order: 'asc' } },
              education: { orderBy: { order: 'asc' } },
              skills: { orderBy: { order: 'asc' } },
              projects: { orderBy: { order: 'asc' } },
              certifications: true,
              customSections: { orderBy: { order: 'asc' } },
            },
          },
        },
      })
    }

    // 2. If authenticated user has no portfolio yet or not logged in, search by slug
    if (!userRecord?.portfolio && querySlug) {
      userRecord = await prisma.user.findUnique({
        where: { slug: querySlug.toLowerCase().trim() },
        include: {
          portfolio: {
            include: {
              experiences: { orderBy: { order: 'asc' } },
              education: { orderBy: { order: 'asc' } },
              skills: { orderBy: { order: 'asc' } },
              projects: { orderBy: { order: 'asc' } },
              certifications: true,
              customSections: { orderBy: { order: 'asc' } },
            },
          },
        },
      })
    }

    if (!userRecord || !userRecord.portfolio) {
      return NextResponse.json({ success: false, portfolio: null }, { status: 404 })
    }

    const p = userRecord.portfolio

    const formattedPortfolio = {
      id: p.id,
      userId: p.userId,
      slug: userRecord.slug,
      fullName: p.fullName,
      headline: p.headline,
      bio: p.bio,
      avatarUrl: userRecord.avatarUrl,
      location: p.location,
      contactEmail: p.contactEmail,
      phone: p.phone,
      website: p.website,
      availability: p.availability,
      socialLinks: (p.socialLinks as any) || [],
      themeId: p.themeId || 'minimal',
      themeConfig: (p.themeConfig as any) || {},
      isPublished: p.isPublished,
      experiences: p.experiences.map((e: any) => ({
        ...e,
        highlights: (e.highlights as any) || [],
      })),
      education: p.education,
      skills: p.skills,
      projects: p.projects.map((pr: any) => ({
        ...pr,
        techStack: (pr.techStack as any) || [],
      })),
      certifications: p.certifications,
      customSections: p.customSections,
    }

    return NextResponse.json({
      success: true,
      portfolio: formattedPortfolio,
    })
  } catch (error: any) {
    console.error('Error fetching portfolio in GET /api/portfolio/get:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch portfolio data.' },
      { status: 500 }
    )
  }
}
