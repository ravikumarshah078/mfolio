'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
  Loader2,
  LogOut,
  ChevronDown,
  Upload,
  FileText,
  RefreshCw,
  Award,
} from 'lucide-react'
import { themeRegistry } from '@/components/themes/theme-registry'
import { ThemeRenderer } from '@/components/themes/ThemeRenderer'
import { FullPortfolioData } from '@/types/portfolio'
import { createClient } from '@/lib/supabase/client'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlSlug = searchParams?.get('slug') || 'demo'

  const [activeTab, setActiveTab] = useState<'profile' | 'exp' | 'projects' | 'skills' | 'certs' | 'customization' | 'reupload'>('profile')
  const [showPreview, setShowPreview] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Re-upload state
  const [reuploadFile, setReuploadFile] = useState<File | null>(null)
  const [isReparsing, setIsReparsing] = useState(false)
  const [reparseStatus, setReparseStatus] = useState('')
  const [reparseSuccessMsg, setReparseSuccessMsg] = useState('')

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
    ],
    projects: [
      {
        title: 'mfolio Portfolio Engine',
        description: 'AI-powered resume-to-portfolio platform rendering customized themes.',
        techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
        liveUrl: 'https://mfolio.app',
        githubUrl: 'https://github.com',
      },
    ],
    certifications: [
      {
        title: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        issueDate: '2023',
      },
    ],
  })

  // Check user session & load saved state from localStorage/DB
  useEffect(() => {
    async function loadSession() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          setUserEmail(user.email)
        }
      } catch (e) {
        console.error('Error fetching user session:', e)
      }
    }

    loadSession()

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

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('mfolio_user_slug')
      localStorage.removeItem('mfolio_current_slug')
      localStorage.removeItem('mfolio_current_data')
      router.push('/login')
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/portfolio/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolio),
      })

      const resText = await res.text()
      let json: any
      try {
        json = JSON.parse(resText)
      } catch (e) {
        throw new Error('Server returned an unparseable response when saving.')
      }

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

  // Handle re-uploading latest PDF resume and re-parsing in-memory
  const handleReuploadAndParse = async () => {
    if (!reuploadFile) return

    setIsReparsing(true)
    setReparseStatus('Reading new PDF file in memory...')
    setReparseSuccessMsg('')

    try {
      const formData = new FormData()
      formData.append('file', reuploadFile)

      setReparseStatus('Extracting updated experience, skills, projects & certifications via Gemini AI...')
      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData,
      })

      const resText = await res.text()
      let json: any
      try {
        json = JSON.parse(resText)
      } catch (e) {
        throw new Error('Server returned an unparseable response. Please ensure your PDF file is under 10MB.')
      }

      if (!res.ok) {
        throw new Error(json.error || 'Failed to parse resume.')
      }

      const fresh = json.data

      // Update local portfolio state with newly extracted resume data
      setPortfolio((prev) => ({
        ...prev,
        fullName: fresh.fullName || prev.fullName,
        headline: fresh.headline || prev.headline,
        bio: fresh.bio || prev.bio,
        location: fresh.location || prev.location,
        contactEmail: fresh.contactEmail || prev.contactEmail,
        phone: fresh.phone || prev.phone,
        website: fresh.website || prev.website,
        socialLinks: fresh.socialLinks?.length ? fresh.socialLinks : prev.socialLinks,
        experiences: fresh.experiences?.length ? fresh.experiences : prev.experiences,
        education: fresh.education?.length ? fresh.education : prev.education,
        skills: fresh.skills?.length ? fresh.skills : prev.skills,
        projects: fresh.projects?.length ? fresh.projects : prev.projects,
        certifications: fresh.certifications?.length ? fresh.certifications : prev.certifications,
      }))

      setReparseSuccessMsg('New resume parsed successfully! Review the updated data in the editor and click "Save Portfolio" to publish.')
    } catch (err: any) {
      alert(err.message || 'Failed to parse new resume.')
    } finally {
      setIsReparsing(false)
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

  // Certification handlers
  const addCertification = () => {
    setPortfolio({
      ...portfolio,
      certifications: [
        ...(portfolio.certifications || []),
        { title: 'New Certification', issuer: 'Issuer Name', issueDate: '2024' },
      ],
    })
  }

  const updateCertification = (index: number, field: string, value: any) => {
    const updated = [...(portfolio.certifications || [])]
    updated[index] = { ...updated[index], [field]: value }
    setPortfolio({ ...portfolio, certifications: updated })
  }

  const removeCertification = (index: number) => {
    setPortfolio({
      ...portfolio,
      certifications: (portfolio.certifications || []).filter((_, i) => i !== index),
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      {/* Top Navbar Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center transition-all shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:inline">mfolio</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Public URL Link */}
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 hidden md:inline">URL:</span>
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

        {/* Center/Right Nav Controls: Single Unified Theme Switcher */}
        <div className="flex items-center gap-3">
          {/* Global Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <Palette className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Active Theme:</span>
              <span className="text-white font-bold">{themeRegistry[portfolio.themeId]?.name || portfolio.themeId}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 border-b border-slate-800/80 mb-1">
                  Select Theme Template
                </div>
                {Object.values(themeRegistry).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setPortfolio({ ...portfolio, themeId: t.id })
                      setIsThemeMenuOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                      portfolio.themeId === t.id
                        ? 'bg-blue-600/20 text-blue-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{t.name}</span>
                    {portfolio.themeId === t.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Toggle Live Preview on Mobile */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white lg:hidden cursor-pointer"
            title="Toggle Live Preview"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-semibold text-xs text-white transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Portfolio</span>
              </>
            )}
          </button>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-red-950/50 border border-slate-800 hover:border-red-800/80 text-xs font-semibold text-slate-300 hover:text-red-400 transition-all cursor-pointer ml-1"
            title={userEmail ? `Logged in as ${userEmail}` : 'Log Out'}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Workspace Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form Editor Controls */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-800 bg-slate-950 overflow-y-auto">
          {/* Dashboard Editor Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900/60 sticky top-0 z-10 overflow-x-auto scrollbar-none px-4 pt-2">
            {[
              { id: 'profile', label: 'Profile Header', icon: User },
              { id: 'exp', label: 'Experience', icon: Briefcase },
              { id: 'projects', label: 'Projects', icon: Code2 },
              { id: 'skills', label: 'Skills & Edu', icon: GraduationCap },
              { id: 'certs', label: 'Certifications', icon: Award },
              { id: 'customization', label: 'Accent & Colors', icon: Palette },
              { id: 'reupload', label: 'Re-upload Resume', icon: Upload },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
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
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>

                {portfolio.experiences.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative">
                    <button
                      onClick={() => removeExperience(idx)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 cursor-pointer"
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
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>

                {portfolio.projects.map((project, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative">
                    <button
                      onClick={() => removeProject(idx)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 cursor-pointer"
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
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer"
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
                      <button onClick={() => removeSkill(idx)} className="text-slate-500 hover:text-red-400 cursor-pointer">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Certifications */}
            {activeTab === 'certs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Certifications & Honors</h2>
                  <button
                    onClick={addCertification}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Certification</span>
                  </button>
                </div>

                {(portfolio.certifications || []).length === 0 ? (
                  <p className="text-slate-500 text-xs italic">No certifications added yet. Click &quot;Add Certification&quot; above.</p>
                ) : (
                  (portfolio.certifications || []).map((cert, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative">
                      <button
                        onClick={() => removeCertification(idx)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3 pr-8">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase text-slate-400">Certification Name</label>
                          <input
                            type="text"
                            value={cert.title}
                            onChange={(e) => updateCertification(idx, 'title', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase text-slate-400">Issuer / Organization</label>
                          <input
                            type="text"
                            value={cert.issuer || ''}
                            onChange={(e) => updateCertification(idx, 'issuer', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 6: Accent & Colors */}
            {activeTab === 'customization' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Theme Styles & Primary Accent Color</h2>
                  <p className="text-slate-400 text-xs">
                    Theme template selection is managed globally from the top navbar header (<strong className="text-blue-400">Theme: {themeRegistry[portfolio.themeId]?.name}</strong>). Customize your primary accent color below.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <label className="block text-xs font-semibold uppercase text-slate-400">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center gap-4">
                    {['#2563eb', '#4f46e5', '#7c3aed', '#059669', '#d97706', '#dc2626'].map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setPortfolio({
                            ...portfolio,
                            themeConfig: { ...portfolio.themeConfig, primaryColor: color },
                          })
                        }
                        className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                          portfolio.themeConfig?.primaryColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 7: Re-upload Resume */}
            {activeTab === 'reupload' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Re-upload Latest Resume</h2>
                  <p className="text-slate-400 text-xs">
                    Upload your updated PDF resume. We will extract all updated work history, skills, projects, and certifications in-memory and update your editor form fields.
                  </p>
                </div>

                <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-8 text-center bg-slate-900/50 transition-all">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6" />
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setReuploadFile(e.target.files[0])
                      }
                    }}
                    className="hidden"
                    id="reupload-file-input"
                  />
                  <label
                    htmlFor="reupload-file-input"
                    className="cursor-pointer hover:cursor-pointer inline-block px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white mb-2 transition-all shadow-md active:scale-95"
                  >
                    Choose Updated PDF Resume
                  </label>
                  {reuploadFile ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-emerald-400 font-medium mt-2">
                      <FileText className="w-4 h-4" />
                      <span>{reuploadFile.name} ({(reuploadFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">PDF documents only (Max 10MB)</p>
                  )}
                </div>

                {isReparsing && (
                  <div className="p-4 rounded-xl bg-blue-950/70 border border-blue-800 text-blue-200 text-xs flex items-center gap-3 animate-pulse">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-400 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-semibold text-white">Extracting Resume Data...</p>
                      <p className="text-slate-300">{reparseStatus}</p>
                    </div>
                  </div>
                )}

                {reparseSuccessMsg && (
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                      <Check className="w-4 h-4" />
                      <span>Resume Updated!</span>
                    </div>
                    <p>{reparseSuccessMsg}</p>
                    <button
                      onClick={handleSave}
                      className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Publish Changes Now</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={handleReuploadAndParse}
                  disabled={!reuploadFile || isReparsing}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-bold text-white transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  {isReparsing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Extracting Updated Experience...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Re-parse Resume & Update Form</span>
                    </>
                  )}
                </button>
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
