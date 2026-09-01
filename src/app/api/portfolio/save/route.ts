import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, fullName, headline, bio, location, contactEmail, phone, website, availability, socialLinks, themeId, themeConfig, experiences, education, skills, projects } = body

    if (!slug || !fullName) {
      return NextResponse.json(
        { error: 'Slug and full name are required.' },
        { status: 400 }
      )
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')

    // Upsert demo user for testing/MVP
    const demoUser = await prisma.user.upsert({
      where: { slug: cleanSlug },
      update: {
        name: fullName,
      },
      create: {
        id: `user_${cleanSlug}_${Date.now()}`,
        email: contactEmail || `${cleanSlug}@mfolio.app`,
        name: fullName,
        slug: cleanSlug,
      },
    })

    // Upsert Portfolio record
    const portfolio = await prisma.portfolio.upsert({
      where: { userId: demoUser.id },
      update: {
        fullName,
        headline,
        bio,
        location,
        contactEmail,
        phone,
        website,
        availability,
        socialLinks: socialLinks || [],
        themeId: themeId || 'minimal',
        themeConfig: themeConfig || {},
        updatedAt: new Date(),
      },
      create: {
        userId: demoUser.id,
        fullName,
        headline,
        bio,
        location,
        contactEmail,
        phone,
        website,
        availability,
        socialLinks: socialLinks || [],
        themeId: themeId || 'minimal',
        themeConfig: themeConfig || {},
      },
    })

    // Update Experiences relation
    if (Array.isArray(experiences)) {
      await prisma.experience.deleteMany({ where: { portfolioId: portfolio.id } })
      if (experiences.length > 0) {
        await prisma.experience.createMany({
          data: experiences.map((exp: any, order: number) => ({
            portfolioId: portfolio.id,
            company: exp.company || 'Company',
            role: exp.role || 'Position',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: Boolean(exp.current),
            description: exp.description || '',
            highlights: exp.highlights || [],
            order,
          })),
        })
      }
    }

    // Update Education relation
    if (Array.isArray(education)) {
      await prisma.education.deleteMany({ where: { portfolioId: portfolio.id } })
      if (education.length > 0) {
        await prisma.education.createMany({
          data: education.map((edu: any, order: number) => ({
            portfolioId: portfolio.id,
            institution: edu.institution || 'University',
            degree: edu.degree || 'Degree',
            field: edu.field || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            description: edu.description || '',
            order,
          })),
        })
      }
    }

    // Update Skills relation
    if (Array.isArray(skills)) {
      await prisma.skill.deleteMany({ where: { portfolioId: portfolio.id } })
      if (skills.length > 0) {
        await prisma.skill.createMany({
          data: skills.map((sk: any, order: number) => ({
            portfolioId: portfolio.id,
            name: sk.name || 'Skill',
            category: sk.category || 'General',
            proficiency: sk.proficiency || 85,
            order,
          })),
        })
      }
    }

    // Update Projects relation
    if (Array.isArray(projects)) {
      await prisma.project.deleteMany({ where: { portfolioId: portfolio.id } })
      if (projects.length > 0) {
        await prisma.project.createMany({
          data: projects.map((proj: any, order: number) => ({
            portfolioId: portfolio.id,
            title: proj.title || 'Project',
            description: proj.description || '',
            techStack: proj.techStack || [],
            liveUrl: proj.liveUrl || '',
            githubUrl: proj.githubUrl || '',
            order,
          })),
        })
      }
    }

    return NextResponse.json({
      success: true,
      slug: cleanSlug,
      message: 'Portfolio saved successfully.',
    })
  } catch (error: any) {
    console.error('Error saving portfolio:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save portfolio.' },
      { status: 500 }
    )
  }
}
