'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Zap,
  Palette,
  ExternalLink,
} from 'lucide-react'
import { themeRegistry } from '@/components/themes/theme-registry'
import { ThemeRenderer } from '@/components/themes/ThemeRenderer'
import { FullPortfolioData } from '@/types/portfolio'

export default function LandingPage() {
  const [demoTheme, setDemoTheme] = useState('minimal')

  const samplePortfolio: FullPortfolioData = {
    slug: 'alex-morgan',
    fullName: 'Alex Morgan',
    headline: 'Senior Full-Stack Engineer & Architect',
    bio: 'Building modern web platforms, distributed APIs, and high-converting user interfaces with clean architecture.',
    location: 'San Francisco, CA',
    contactEmail: 'alex@example.com',
    socialLinks: [
      { platform: 'github', url: 'https://github.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
    themeId: demoTheme,
    experiences: [
      {
        company: 'Veloce Tech',
        role: 'Lead Engineer',
        startDate: '2023',
        endDate: 'Present',
        current: true,
        description: 'Architected high-scale web platforms serving 2M+ active users.',
        highlights: ['Boosted application speed by 45% using Server Components.'],
      },
    ],
    education: [
      { institution: 'UC Berkeley', degree: 'BS Computer Science', endDate: '2020' },
    ],
    skills: [
      { name: 'TypeScript' },
      { name: 'Next.js' },
      { name: 'Tailwind CSS' },
      { name: 'PostgreSQL' },
    ],
    projects: [
      {
        title: 'mfolio SaaS Platform',
        description: 'AI-powered resume extraction and dynamic theme rendering platform.',
        techStack: ['Next.js', 'Supabase', 'Gemini AI'],
        liveUrl: '#',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[25rem] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Bar */}
      <nav className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">mfolio</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Banner */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span>Turn PDF Resumes into Websites in 60 Seconds</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-[1.1] mb-6">
          Your Resume, Re-imagined as a Public Portfolio.
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Upload your resume PDF. We extract your experience in-memory via AI and map it dynamically across stunning, custom-styled portfolio theme templates.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-white text-base transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Create Your Portfolio Now</span>
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 font-semibold text-slate-300 text-base transition-all flex items-center justify-center gap-2"
          >
            <span>Live Editor Demo</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Feature Pill Tags */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero Disk File Storage</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Google Gemini AI Structured Extraction</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-purple-400" />
            <span>Custom Public URL Slugs</span>
          </span>
        </div>
      </header>

      {/* Interactive Theme Showcase Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">Extensible Theme Templates</h2>
          <p className="text-slate-400 text-sm">
            Click any theme below to preview how your extracted resume data automatically adapts in real-time.
          </p>
        </div>

        {/* Theme Picker Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {Object.values(themeRegistry).map((t) => (
            <button
              key={t.id}
              onClick={() => setDemoTheme(t.id)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 ${
                demoTheme === t.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{t.name}</span>
            </button>
          ))}
        </div>

        {/* Live Preview Container */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden min-h-[500px]">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 px-6">
            <span className="font-mono text-emerald-400">Live Preview: {themeRegistry[demoTheme].name}</span>
            <span className="text-slate-500">mfolio.app/{samplePortfolio.slug}</span>
          </div>
          <ThemeRenderer portfolio={samplePortfolio} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>mfolio &copy; 2026. Built with Next.js, Tailwind CSS, Prisma PostgreSQL & Google Gemini AI.</p>
      </footer>
    </div>
  )
}
