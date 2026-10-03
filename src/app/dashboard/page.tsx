'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
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
  Copy,
  Laptop,
  Tablet,
  Smartphone,
  ArrowUp,
  ArrowDown,
  PanelLeftClose,
  PanelLeftOpen,
  Download,
  Globe,
  Layers,
  Type,
} from 'lucide-react'
import { themeRegistry } from '@/components/themes/theme-registry'
import { ThemeRenderer } from '@/components/themes/ThemeRenderer'
import { FullPortfolioData, CustomSectionItem } from '@/types/portfolio'

// Auto-Expanding Textarea Component (Grows with content, zero internal scrollbar)
function AutoExpandingTextarea({
  value,
  onChange,
  placeholder,
  minRows = 3,
  className = '',
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  minRows?: number
  className?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.max(el.scrollHeight, minRows * 24)}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onChange(e.target.value)
        adjustHeight()
      }}
      placeholder={placeholder}
      rows={minRows}
      className={`w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none overflow-hidden transition-all ${className}`}
    />
  )
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlSlug = searchParams?.get('slug') || 'demo'

  // Navigation & Workspace Layout State
  const [activeTab, setActiveTab] = useState<'profile' | 'exp' | 'projects' | 'skills' | 'certs' | 'custom' | 'customization' | 'seo' | 'reupload'>('profile')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  // Action Loading & Feedback States
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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
    themeConfig: { primaryColor: '#2563eb', fontFamily: 'system-ui' },
    seoConfig: {
      metaTitle: 'Alex Morgan | Senior Full-Stack Engineer',
      metaDescription: 'Personal portfolio of Alex Morgan. Specialized in Next.js, TypeScript, PostgreSQL and scalable microservices.',
    },
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
        techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
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
    customSections: [
      {
        title: 'Languages',
        content: ['English (Native)', 'Spanish (Professional)'],
      },
    ],
  })

  // Check user session & load saved state from DB / localStorage
  useEffect(() => {
    async function loadSession() {
      try {
        const authRes = await fetch('/api/auth/me')
        const authJson = await authRes.json()
        if (authJson.authenticated && authJson.user?.email) {
          setUserEmail(authJson.user.email)
        }

        // Try auto-loading portfolio from database
        const fetchUrl = urlSlug && urlSlug !== 'demo' ? `/api/portfolio/get?slug=${urlSlug}` : '/api/portfolio/get'
        const res = await fetch(fetchUrl)
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.portfolio) {
            setPortfolio(json.portfolio)
            localStorage.setItem('mfolio_current_data', JSON.stringify(json.portfolio))
            return
          }
        }
      } catch (e) {
        console.error('Error fetching user session or portfolio:', e)
      }

      const saved = localStorage.getItem('mfolio_current_data')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setPortfolio((prev) => ({ ...prev, ...parsed }))
        } catch (err) {
          console.error('Failed parsing cached portfolio data:', err)
        }
      }
    }

    loadSession()
  }, [urlSlug])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCopyUrl = () => {
    const fullUrl = `${window.location.origin}/${portfolio.slug}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedUrl(true)
    showToast('Public portfolio URL copied to clipboard!')
    setTimeout(() => setCopiedUrl(false), 2500)
  }

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(portfolio, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `mfolio-${portfolio.slug}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showToast('Portfolio JSON data backup exported!')
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('mfolio_user_slug')
      localStorage.removeItem('mfolio_current_slug')
      localStorage.removeItem('mfolio_current_data')
      router.push('/login')
      setIsLoggingOut(false)
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
      showToast('Portfolio changes published successfully!')
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
        customSections: fresh.customSections?.length ? fresh.customSections : prev.customSections,
      }))

      setReparseSuccessMsg('New resume parsed successfully! Review the updated data in the editor and click "Save Portfolio" to publish.')
      showToast('Resume parsed! Extracted updated experience & skills.')
    } catch (err: any) {
      alert(err.message || 'Failed to parse new resume.')
    } finally {
      setIsReparsing(false)
    }
  }

  // Item re-ordering helpers
  const moveItem = <T,>(arr: T[], index: number, direction: 'up' | 'down'): T[] => {
    const newArr = [...arr]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= newArr.length) return arr
    const temp = newArr[index]
    newArr[index] = newArr[targetIdx]
    newArr[targetIdx] = temp
    return newArr
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

  // Education handlers
  const addEducation = () => {
    setPortfolio({
      ...portfolio,
      education: [
        ...portfolio.education,
        {
          institution: 'University / Institute',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2020',
          endDate: '2024',
        },
      ],
    })
  }

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...portfolio.education]
    updated[index] = { ...updated[index], [field]: value }
    setPortfolio({ ...portfolio, education: updated })
  }

  const removeEducation = (index: number) => {
    setPortfolio({
      ...portfolio,
      education: portfolio.education.filter((_, i) => i !== index),
    })
  }

  // Social Links helper
  const getSocialUrl = (platform: string) => {
    const link = (portfolio.socialLinks || []).find((l) => l.platform.toLowerCase() === platform.toLowerCase())
    return link ? link.url : ''
  }

  const updateSocialUrl = (platform: string, url: string) => {
    const links = [...(portfolio.socialLinks || [])]
    const idx = links.findIndex((l) => l.platform.toLowerCase() === platform.toLowerCase())
    if (idx >= 0) {
      if (!url.trim()) {
        links.splice(idx, 1)
      } else {
        links[idx] = { ...links[idx], url }
      }
    } else if (url.trim()) {
      links.push({ platform, url })
    }
    setPortfolio({ ...portfolio, socialLinks: links })
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

  // Custom Section handlers
  const addCustomSection = () => {
    const newSection: CustomSectionItem = {
      title: 'New Custom Section',
      content: ['Custom bullet point detail...'],
    }
    setPortfolio({
      ...portfolio,
      customSections: [...(portfolio.customSections || []), newSection],
    })
  }

  const updateCustomSectionTitle = (index: number, title: string) => {
    const updated = [...(portfolio.customSections || [])]
    updated[index] = { ...updated[index], title }
    setPortfolio({ ...portfolio, customSections: updated })
  }

  const updateCustomSectionContent = (index: number, contentStr: string) => {
    const updated = [...(portfolio.customSections || [])]
    const lines = contentStr.split('\n').map((l) => l.trim()).filter(Boolean)
    updated[index] = { ...updated[index], content: lines }
    setPortfolio({ ...portfolio, customSections: updated })
  }

  const removeCustomSection = (index: number) => {
    setPortfolio({
      ...portfolio,
      customSections: (portfolio.customSections || []).filter((_, i) => i !== index),
    })
  }

  // Sidebar navigation menu items
  const sidebarItems = [
    { id: 'profile', label: 'Profile Header', subtitle: 'Name, bio & contact details', icon: User, count: null },
    { id: 'exp', label: 'Work Experience', subtitle: 'Roles & accomplishments', icon: Briefcase, count: portfolio.experiences.length },
    { id: 'projects', label: 'Featured Projects', subtitle: 'Code & live demos', icon: Code2, count: portfolio.projects.length },
    { id: 'skills', label: 'Skills & Education', subtitle: 'Tech stack & degrees', icon: GraduationCap, count: portfolio.skills.length },
    { id: 'certs', label: 'Certifications', subtitle: 'Licenses & honors', icon: Award, count: (portfolio.certifications || []).length },
    { id: 'custom', label: 'Custom Sections', subtitle: 'Languages, speaking, awards', icon: Layers, count: (portfolio.customSections || []).length },
    { id: 'customization', label: 'Accent & Fonts', subtitle: 'Color palette & typography', icon: Palette, count: null },
    { id: 'seo', label: 'SEO & Sharing', subtitle: 'Meta tags & Google preview', icon: Globe, count: null },
    { id: 'reupload', label: 'Re-upload Resume', subtitle: 'Gemini AI in-memory parse', icon: Upload, count: null },
  ]

  const fontOptions = [
    { name: 'System Sans', value: 'system-ui, -apple-system, sans-serif' },
    { name: 'Inter (Modern Clean)', value: "'Inter', sans-serif" },
    { name: 'Roboto Mono (Developer)', value: "'Roboto Mono', monospace" },
    { name: 'Outfit (Geometric UI)', value: "'Outfit', sans-serif" },
    { name: 'Playfair (Editorial Serif)', value: "'Playfair Display', serif" },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-blue-500/50 shadow-2xl px-4 py-3 rounded-xl flex items-center gap-3 text-xs text-blue-200 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="font-semibold text-white">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar Header */}
      <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          <Link href={`/dashboard${portfolio.slug ? `?slug=${portfolio.slug}` : ''}`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 group-hover:brightness-110 flex items-center justify-center transition-all shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight hidden sm:inline">mfolio</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Interactive Public URL Widget with Copy Button */}
          <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-950 px-2.5 py-1.2 rounded-lg border border-slate-800">
            <span className="text-slate-500 hidden md:inline">URL:</span>
            <Link
              href={`/${portfolio.slug}`}
              target="_blank"
              className="text-blue-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>/{portfolio.slug}</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </Link>
            <button
              onClick={handleCopyUrl}
              className="ml-1.5 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Copy Public Link"
            >
              {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Center/Right Nav Controls */}
        <div className="flex items-center gap-3">
          {/* Export JSON Button */}
          <button
            onClick={handleExportJson}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
            title="Export JSON Portfolio Backup"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export JSON</span>
          </button>

          {/* Global Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <Palette className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Theme:</span>
              <span className="text-white font-bold">{themeRegistry[portfolio.themeId]?.name || portfolio.themeId}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2">
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

          {/* Toggle Live Preview Pane on Mobile */}
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-semibold text-xs text-white transition-all shadow-lg shadow-blue-500/20 cursor-pointer disabled:cursor-not-allowed"
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
            disabled={isLoggingOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-red-950/50 border border-slate-800 hover:border-red-800/80 text-xs font-semibold text-slate-300 hover:text-red-400 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ml-1"
            title={userEmail ? `Logged in as ${userEmail}` : 'Log Out'}
          >
            {isLoggingOut ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{isLoggingOut ? 'Logging Out...' : 'Log Out'}</span>
          </button>
        </div>
      </header>

      {/* Workspace Main Area: 3-Pane SaaS Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar Dock */}
        <aside
          className={`${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          } shrink-0 bg-slate-900/60 border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-20`}
        >
          <div className="py-4 space-y-1 px-2">
            {!isSidebarCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Portfolio Builder Sections
              </div>
            )}
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                    {!isSidebarCollapsed && (
                      <div className="text-left truncate">
                        <div className="text-xs tracking-tight truncate">{item.label}</div>
                      </div>
                    )}
                  </div>

                  {!isSidebarCollapsed && item.count !== null && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* User Footer Profile Badge */}
          {!isSidebarCollapsed && userEmail && (
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 m-2 rounded-xl text-xs text-slate-400 truncate">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Logged In As</span>
              <span className="font-mono text-slate-300 truncate block">{userEmail}</span>
            </div>
          )}
        </aside>

        {/* Center Form Editor Panel */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-y-auto border-r border-slate-800/80">
          {/* Active Section Header */}
          <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white capitalize">
                {sidebarItems.find((i) => i.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-slate-400">
                {sidebarItems.find((i) => i.id === activeTab)?.subtitle}
              </p>
            </div>

            {/* Contextual Action Button */}
            {activeTab === 'exp' && (
              <button
                onClick={addExperience}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Experience</span>
              </button>
            )}
            {activeTab === 'projects' && (
              <button
                onClick={addProject}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            )}
            {activeTab === 'skills' && (
              <button
                onClick={addSkill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            )}
            {activeTab === 'certs' && (
              <button
                onClick={addCertification}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Certification</span>
              </button>
            )}
            {activeTab === 'custom' && (
              <button
                onClick={addCustomSection}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Section</span>
              </button>
            )}
          </div>

          {/* Form Content Body */}
          <div className="p-6 space-y-6 flex-1 max-w-3xl">
            {/* Tab 1: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={portfolio.fullName}
                      onChange={(e) => setPortfolio({ ...portfolio, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Bio Summary (Auto-Expanding Height)
                  </label>
                  <AutoExpandingTextarea
                    value={portfolio.bio || ''}
                    onChange={(val) => setPortfolio({ ...portfolio, bio: val })}
                    placeholder="Write your professional bio..."
                    minRows={4}
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Social Links & Web Profiles */}
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Social & Web Profiles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                        GitHub Profile URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={getSocialUrl('github')}
                        onChange={(e) => updateSocialUrl('github', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={getSocialUrl('linkedin')}
                        onChange={(e) => updateSocialUrl('linkedin', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                        Twitter / X URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://x.com/username"
                        value={getSocialUrl('twitter')}
                        onChange={(e) => updateSocialUrl('twitter', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                        Personal Website URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://mywebsite.com"
                        value={portfolio.website || ''}
                        onChange={(e) => setPortfolio({ ...portfolio, website: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Work Experience */}
            {activeTab === 'exp' && (
              <div className="space-y-4">
                {portfolio.experiences.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/40 text-slate-400 text-xs">
                    No work experiences added yet. Click &quot;Add Experience&quot; above to get started.
                  </div>
                ) : (
                  portfolio.experiences.map((exp, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative group">
                      <div className="absolute top-4 right-4 flex items-center gap-1">
                        <button
                          onClick={() => setPortfolio({ ...portfolio, experiences: moveItem(portfolio.experiences, idx, 'up') })}
                          disabled={idx === 0}
                          className="p-1 rounded bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPortfolio({ ...portfolio, experiences: moveItem(portfolio.experiences, idx, 'down') })}
                          disabled={idx === portfolio.experiences.length - 1}
                          className="p-1 rounded bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeExperience(idx)}
                          className="p-1 rounded bg-slate-950 text-slate-400 hover:text-red-400 cursor-pointer"
                          title="Remove Experience"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pr-24">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase text-slate-400">Job Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase text-slate-400">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
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
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase text-slate-400">End Date</label>
                          <input
                            type="text"
                            value={exp.endDate || ''}
                            onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                            placeholder="Present or 2023"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-400">Overview & Key Accomplishments</label>
                        <AutoExpandingTextarea
                          value={exp.description || ''}
                          onChange={(val) => updateExperience(idx, 'description', val)}
                          minRows={2}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                {portfolio.projects.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/40 text-slate-400 text-xs">
                    No featured projects added yet. Click &quot;Add Project&quot; above.
                  </div>
                ) : (
                  portfolio.projects.map((project, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative">
                      <div className="absolute top-4 right-4 flex items-center gap-1">
                        <button
                          onClick={() => setPortfolio({ ...portfolio, projects: moveItem(portfolio.projects, idx, 'up') })}
                          disabled={idx === 0}
                          className="p-1 rounded bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPortfolio({ ...portfolio, projects: moveItem(portfolio.projects, idx, 'down') })}
                          disabled={idx === portfolio.projects.length - 1}
                          className="p-1 rounded bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeProject(idx)}
                          className="p-1 rounded bg-slate-950 text-slate-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="pr-24">
                        <label className="block text-[10px] font-semibold uppercase text-slate-400">Project Title</label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => updateProject(idx, 'title', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-400">Description</label>
                        <AutoExpandingTextarea
                          value={project.description || ''}
                          onChange={(val) => updateProject(idx, 'description', val)}
                          minRows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase text-slate-400">Live Demo URL</label>
                          <input
                            type="text"
                            placeholder="https://myproject.com"
                            value={project.liveUrl || ''}
                            onChange={(e) => updateProject(idx, 'liveUrl', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase text-slate-400">GitHub Repo URL</label>
                          <input
                            type="text"
                            placeholder="https://github.com/..."
                            value={project.githubUrl || ''}
                            onChange={(e) => updateProject(idx, 'githubUrl', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-400">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          placeholder="React, TypeScript, Tailwind CSS"
                          value={Array.isArray(project.techStack) ? project.techStack.join(', ') : ''}
                          onChange={(e) => updateProject(idx, 'techStack', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 4: Skills & Education */}
            {activeTab === 'skills' && (
              <div className="space-y-8">
                {/* Skills Section */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {portfolio.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white shadow-sm"
                      >
                        <span className="font-medium">{skill.name}</span>
                        <button onClick={() => removeSkill(idx)} className="text-slate-500 hover:text-red-400 cursor-pointer ml-1 font-bold">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education Section */}
                <div className="pt-6 border-t border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Education History</h3>
                    <button
                      onClick={addEducation}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Education</span>
                    </button>
                  </div>

                  {portfolio.education.length === 0 ? (
                    <p className="text-slate-500 text-xs italic">No education added yet. Click &quot;Add Education&quot; above.</p>
                  ) : (
                    portfolio.education.map((edu, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 relative">
                        <button
                          onClick={() => removeEducation(idx)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="grid grid-cols-2 gap-3 pr-8">
                          <div>
                            <label className="block text-[10px] font-semibold uppercase text-slate-400">Institution</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold uppercase text-slate-400">Degree & Field</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                              placeholder="BS Computer Science"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold uppercase text-slate-400">Start Date</label>
                            <input
                              type="text"
                              value={edu.startDate || ''}
                              onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                              placeholder="2020"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold uppercase text-slate-400">End Date</label>
                            <input
                              type="text"
                              value={edu.endDate || ''}
                              onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                              placeholder="2024"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 5: Certifications */}
            {activeTab === 'certs' && (
              <div className="space-y-4">
                {(portfolio.certifications || []).length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/40 text-slate-400 text-xs">
                    No certifications added yet. Click &quot;Add Certification&quot; above.
                  </div>
                ) : (
                  (portfolio.certifications || []).map((cert, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 relative">
                      <button
                        onClick={() => removeCertification(idx)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-3 pr-8">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase text-slate-400">Certification Name</label>
                          <input
                            type="text"
                            value={cert.title}
                            onChange={(e) => updateCertification(idx, 'title', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase text-slate-400">Issuer / Organization</label>
                          <input
                            type="text"
                            value={cert.issuer || ''}
                            onChange={(e) => updateCertification(idx, 'issuer', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 6: Custom Sections Engine */}
            {activeTab === 'custom' && (
              <div className="space-y-6">
                {(portfolio.customSections || []).length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/40 text-slate-400 text-xs space-y-3">
                    <p>No custom sections created yet (e.g. Languages, Publications, Speaking, Volunteering).</p>
                    <button
                      onClick={addCustomSection}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer shadow-md"
                    >
                      + Add Your First Custom Section
                    </button>
                  </div>
                ) : (
                  (portfolio.customSections || []).map((sec, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 relative">
                      <button
                        onClick={() => removeCustomSection(idx)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Remove Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="pr-12">
                        <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">Section Title</label>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => updateCustomSectionTitle(idx, e.target.value)}
                          placeholder="e.g. Languages, Publications, Volunteer Work"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                          Bullet Points / Items (1 per line)
                        </label>
                        <AutoExpandingTextarea
                          value={Array.isArray(sec.content) ? sec.content.join('\n') : typeof sec.content === 'string' ? sec.content : ''}
                          onChange={(val) => updateCustomSectionContent(idx, val)}
                          placeholder="English (Native)&#10;Spanish (Professional)&#10;German (Basic)"
                          minRows={3}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 7: Accent & Fonts */}
            {activeTab === 'customization' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <label className="block text-xs font-semibold uppercase text-slate-400">
                    Primary Accent Palette
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
                        className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer ${
                          portfolio.themeConfig?.primaryColor === color ? 'border-white scale-110 shadow-lg shadow-blue-500/30' : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-blue-400" />
                    <label className="block text-xs font-semibold uppercase text-slate-400">
                      Typography & Font Family
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {fontOptions.map((font) => (
                      <button
                        key={font.value}
                        onClick={() =>
                          setPortfolio({
                            ...portfolio,
                            themeConfig: { ...portfolio.themeConfig, fontFamily: font.value },
                          })
                        }
                        className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          portfolio.themeConfig?.fontFamily === font.value
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        style={{ fontFamily: font.value }}
                      >
                        <div className="font-semibold text-sm">{font.name}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">The quick brown fox jumps over the lazy dog.</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 8: SEO & Social Sharing */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Google Search Meta Title
                    </label>
                    <input
                      type="text"
                      value={portfolio.seoConfig?.metaTitle || `${portfolio.fullName} | ${portfolio.headline}`}
                      onChange={(e) =>
                        setPortfolio({
                          ...portfolio,
                          seoConfig: { ...portfolio.seoConfig, metaTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Meta Description (Search & Social Preview)
                    </label>
                    <AutoExpandingTextarea
                      value={portfolio.seoConfig?.metaDescription || portfolio.bio || ''}
                      onChange={(val) =>
                        setPortfolio({
                          ...portfolio,
                          seoConfig: { ...portfolio.seoConfig, metaDescription: val },
                        })
                      }
                      placeholder="Summary snippet displayed on Google search results..."
                      minRows={3}
                    />
                  </div>
                </div>

                {/* Google Search Card Preview */}
                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Google Search Preview Snippet</div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-xs text-slate-400 truncate">https://mfolio.app/{portfolio.slug}</div>
                    <div className="text-sm font-semibold text-blue-400 truncate hover:underline cursor-pointer">
                      {portfolio.seoConfig?.metaTitle || `${portfolio.fullName} | ${portfolio.headline}`}
                    </div>
                    <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {portfolio.seoConfig?.metaDescription || portfolio.bio || 'Public professional portfolio page created with mfolio.'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 9: Re-upload Resume */}
            {activeTab === 'reupload' && (
              <div className="space-y-6">
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
                      disabled={isSaving}
                      className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs cursor-pointer transition-all shadow-md"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Saving Portfolio...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save & Publish Changes Now</span>
                        </>
                      )}
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

        {/* Right Live Preview Pane with Responsive Device Frame Switcher */}
        {showPreview && (
          <div className="hidden lg:flex w-1/2 flex-col bg-slate-900/90 border-l border-slate-800/80 overflow-hidden">
            {/* Viewport Control Bar */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 px-6 shrink-0">
              <span className="flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Real-Time Render</span>
              </span>

              {/* Responsive Device Viewport Selector */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop View (Full)"
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    previewDevice === 'tablet' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tablet View (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile Smartphone View (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <Link
                href={`/${portfolio.slug}`}
                target="_blank"
                className="text-blue-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Full Tab</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Device Container Preview Area */}
            <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-slate-950/60">
              <div
                className={`transition-all duration-300 w-full ${
                  previewDevice === 'desktop'
                    ? 'w-full'
                    : previewDevice === 'tablet'
                    ? 'max-w-[768px] my-4 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden'
                    : 'max-w-[375px] my-6 rounded-[2.5rem] border-8 border-slate-800 shadow-2xl overflow-hidden'
                }`}
              >
                <ThemeRenderer portfolio={portfolio} />
              </div>
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
