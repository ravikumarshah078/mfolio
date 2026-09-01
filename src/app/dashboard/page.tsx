'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles,
  Save,
  ExternalLink,
  Plus,
  Trash2,
  Palette,
  User,
  Briefcase,
  Code2,
  GraduationCap,
  Eye,
  Check,
  Mail,
  MapPin,
  Loader2,
} from 'lucide-react'
import { themeRegistry } from '@/components/themes/theme-registry'
import { ThemeRenderer } from '@/components/themes/ThemeRenderer'
import { FullPortfolioData } from '@/types/portfolio'

function DashboardContent() {
  const searchParams = useSearchParams()
  const urlSlug = searchParams?.get('slug') || 'demo'

  const [activeTab, setActiveTab] = useState<'profile' | 'exp' | 'projects' | 'skills' | 'theme'>('profile')
  const [showPreview, setShowPreview] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Portfolio State
  const [portfolio, setPortfolio] = useState<FullPortfolioData>({
    slug: urlSlug,
    fullName: 'Alex Morgan',
    headline: 'Senior Full-Stack Engineer & Designer',
    bio: 'Passionate software developer with 6+ years of experience building high-performance web applications, serverless architecture, and user-centric interfaces.',
    location: 'San Francisco, CA (Remote)',
    contactEmail: 'alex.morgan@example.com',
    phone: '+1 (555) 019-2834',
    website: 'https://alexmorgan.dev',
    availability: 'Open for consulting & full-time roles',
    socialLinks: [
      { platform: 'github', url: 'https://github.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
    themeId: 'minimal',
    themeConfig: { primaryColor: '#2563eb' },
    experiences: [
      {
        company: 'Veloce Tech',
        role: 'Lead Frontend Engineer',
        location: 'San Francisco, CA',
        startDate: '2023',
        endDate: 'Present',
        current: true,
        description: 'Architected Next.js micro-frontends serving over 2M monthly active users.',
        highlights: [
          'Reduced initial page load latency by 45% using React Server Components.',
          'Mentored 6 junior engineers and established automated E2E testing workflows.',
        ],
      },
      {
        company: 'Nexus Software',
        role: 'Full-Stack Developer',
        location: 'Remote',
        startDate: '2020',
        endDate: '2023',
        current: false,
        description: 'Developed scalable REST APIs and responsive dashboards.',
        highlights: [
          'Migrated legacy database queries to PostgreSQL, cutting p99 query latency by 60%.',
        ],
      },
    ],
    education: [
      {
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016',
        endDate: '2020',
      },
    ],
    skills: [
      { name: 'TypeScript', category: 'Frontend', proficiency: 95 },
      { name: 'React / Next.js', category: 'Frontend', proficiency: 95 },
      { name: 'Node.js', category: 'Backend', proficiency: 85 },
      { name: 'PostgreSQL', category: 'Backend', proficiency: 90 },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 90 },
      { name: 'Docker / AWS', category: 'Cloud & DevOps', proficiency: 80 },
    ],
    projects: [
      {
        title: 'mfolio Portfolio Engine',
        description: 'AI-powered resume-to-portfolio platform rendering customized themes.',
        techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
        liveUrl: 'https://mfolio.app',
        githubUrl: 'https://github.com',
      },
      {
        title: 'Real-time Analytics Dashboard',
        description: 'High-throughput event streaming dashboard for cloud infrastructure monitoring.',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'WebSockets'],
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com',
      },
    ],
  })

  // Load saved state from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('mfolio_current_data')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPortfolio((prev) => ({ ...prev, ...parsed }))
      } catch (err) {
        console.error('Failed parsing cached portfolio data:', err)
      }
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/portfolio/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolio),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Save failed')
      }

      localStorage.setItem('mfolio_current_data', JSON.stringify(portfolio))
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err: any) {
      alert(err.message || 'Failed saving portfolio to database.')
    } finally {
      setIsSaving(false)
    }
  }

  // Experience handlers
  const addExperience = () => {
    setPortfolio({
      ...portfolio,
      experiences: [
        ...portfolio.experiences,
        {
          company: 'New Company',
          role: 'Role / Position',
          location: 'Location',
          startDate: '2024',
          endDate: 'Present',
          current: true,
          description: 'Description of key responsibilities...',
          highlights: ['Key accomplishment bullet point'],
        },
      ],
    })
  }

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...portfolio.experiences]
    updated[index] = { ...updated[index], [field]: value }
    setPortfolio({ ...portfolio, experiences: updated })
  }

  const removeExperience = (index: number) => {
    setPortfolio({
      ...portfolio,
      experiences: portfolio.experiences.filter((_, i) => i !== index),
    })
  }

  // Project handlers
  const addProject = () => {
    setPortfolio({
      ...portfolio,
      projects: [
        ...portfolio.projects,
        {
          title: 'New Project',
          description: 'Project summary description...',
          techStack: ['React', 'TypeScript'],
          liveUrl: '',
          githubUrl: '',
        },
      ],
    })
  }

  const updateProject = (index: number, field: string, value: any) => {
    const updated = [...portfolio.projects]
    updated[index] = { ...updated[index], [field]: value }
    setPortfolio({ ...portfolio, projects: updated })
  }

  const removeProject = (index: number) => {
    setPortfolio({
      ...portfolio,
      projects: portfolio.projects.filter((_, i) => i !== index),
    })
  }

  // Skill handlers
  const addSkill = () => {
    setPortfolio({
      ...portfolio,
      skills: [...portfolio.skills, { name: 'New Skill', category: 'General', proficiency: 85 }],
    })
  }

  const removeSkill = (index: number) => {
    setPortfolio({
      ...portfolio,
      skills: portfolio.skills.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:inline">mfolio</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500">Public URL:</span>
            <Link
              href={`/${portfolio.slug}`}
              target="_blank"
              className="text-blue-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>/{portfolio.slug}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white lg:hidden"
            title="Toggle Live Preview"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white transition-all shadow-lg shadow-blue-500/20"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Portfolio'}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Workspace Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form Editor Controls */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-800 bg-slate-950 overflow-y-auto">
          {/* Dashboard Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900/60 sticky top-0 z-10 overflow-x-auto scrollbar-none px-4 pt-2">
            {[
              { id: 'profile', label: 'Profile Header', icon: User },
              { id: 'exp', label: 'Experience', icon: Briefcase },
              { id: 'projects', label: 'Projects', icon: Code2 },
              { id: 'skills', label: 'Skills & Edu', icon: GraduationCap },
              { id: 'theme', label: 'Theme Picker', icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Form Content Area */}
          <div className="p-6 space-y-6 flex-1">
            {/* Tab 1: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Personal Header & Bio</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={portfolio.fullName}
                      onChange={(e) => setPortfolio({ ...portfolio, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      value={portfolio.headline || ''}
                      onChange={(e) => setPortfolio({ ...portfolio, headline: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Bio Summary
                  </label>
                  <textarea
                    rows={4}
                    value={portfolio.bio || ''}
                    onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={portfolio.location || ''}
                      onChange={(e) => setPortfolio({ ...portfolio, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={portfolio.contactEmail || ''}
                      onChange={(e) => setPortfolio({ ...portfolio, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Work Experience */}
            {activeTab === 'exp' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Work Experience</h2>
                  <button
                    onClick={addExperience}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>

                {portfolio.experiences.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative">
                    <button
                      onClick={() => removeExperience(idx)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-400">Job Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-400">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-400">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-400">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate || ''}
                          onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                          placeholder="Present or 2023"
                          className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-slate-400">Overview / Highlights</label>
                      <textarea
                        rows={2}
                        value={exp.description || ''}
                        onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Featured Projects</h2>
                  <button
                    onClick={addProject}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>

                {portfolio.projects.map((project, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative">
                    <button
                      onClick={() => removeProject(idx)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="pr-8">
                      <label className="block text-[10px] font-semibold uppercase text-slate-400">Project Title</label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateProject(idx, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-slate-400">Description</label>
                      <textarea
                        rows={2}
                        value={project.description || ''}
                        onChange={(e) => updateProject(idx, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Skills */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Skills & Technologies</h2>
                  <button
                    onClick={addSkill}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {portfolio.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    >
                      <span>{skill.name}</span>
                      <button onClick={() => removeSkill(idx)} className="text-slate-500 hover:text-red-400">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Theme Customizer */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Select Active Theme</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.values(themeRegistry).map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => setPortfolio({ ...portfolio, themeId: theme.id })}
                      className={`cursor-pointer rounded-xl p-4 border transition-all ${
                        portfolio.themeId === theme.id
                          ? 'bg-blue-950/40 border-blue-500'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{theme.name}</span>
                        {portfolio.themeId === theme.id && (
                          <Check className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{theme.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Live Preview Pane */}
        {showPreview && (
          <div className="hidden lg:block w-1/2 bg-slate-900 border-l border-slate-800 overflow-y-auto">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 px-6">
              <span className="flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Preview (Real-Time Render)
              </span>
              <Link
                href={`/${portfolio.slug}`}
                target="_blank"
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div>
              <ThemeRenderer portfolio={portfolio} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
