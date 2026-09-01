import React from 'react'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ThemeRenderer } from '@/components/themes/ThemeRenderer'
import { FullPortfolioData } from '@/types/portfolio'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPortfolioData(slug: string): Promise<FullPortfolioData | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { slug: slug.toLowerCase() },
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

    if (!user || !user.portfolio) {
      return null
    }

    const p = user.portfolio

    return {
      id: p.id,
      userId: p.userId,
      slug: user.slug,
      fullName: p.fullName,
      headline: p.headline,
      bio: p.bio,
      avatarUrl: user.avatarUrl,
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
  } catch (error) {
    console.error('Error fetching portfolio for slug:', slug, error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const portfolio = await getPortfolioData(resolvedParams.slug)

  if (!portfolio) {
    return {
      title: 'Portfolio Reserved or Available | mfolio',
      description: 'Create your public portfolio with mfolio in 60 seconds.',
    }
  }

  const title = `${portfolio.fullName} - ${portfolio.headline || 'Portfolio'}`
  const description = portfolio.bio || `Public portfolio of ${portfolio.fullName}. Created with mfolio.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function PublicSlugPage({ params }: PageProps) {
  const resolvedParams = await params
  const portfolio = await getPortfolioData(resolvedParams.slug)

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="p-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold mb-3">Portfolio Available or Not Found</h1>
        <p className="text-slate-400 max-w-md mb-8">
          The URL slug <span className="text-blue-400 font-mono">/{resolvedParams.slug}</span> is available to claim. Create your account to claim it.
        </p>
        <Link
          href={`/signup?slug=${resolvedParams.slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/25"
        >
          <span>Claim /{resolvedParams.slug} Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return <ThemeRenderer portfolio={portfolio} />
}
