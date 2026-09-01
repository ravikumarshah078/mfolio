'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sparkles, Upload, FileText, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'
import { themeRegistry } from '@/components/themes/theme-registry'
import { createClient } from '@/lib/supabase/client'

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paramSlug = searchParams?.get('slug') || ''

  const [step, setStep] = useState<1 | 2>(1)
  const [fullName, setFullName] = useState('')
  const [slug, setSlug] = useState(paramSlug)
  const [selectedTheme, setSelectedTheme] = useState('minimal')
  const [accentColor, setAccentColor] = useState('#2563eb')
  
  const [file, setFile] = useState<File | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [parseStatus, setParseStatus] = useState('')
  const [parsedData, setParsedData] = useState<any>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  // Auth Guard: Require active Supabase user session before allowing Onboarding
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        // Fallback check from localStorage for MVP dev mode
        const localSlug = localStorage.getItem('mfolio_user_slug') || paramSlug
        const localName = localStorage.getItem('mfolio_user_name') || ''

        if (user) {
          setFullName(user.user_metadata?.full_name || localName || 'Portfolio Owner')
          setSlug(user.user_metadata?.slug || localSlug || 'my-portfolio')
        } else if (localSlug) {
          setSlug(localSlug)
          setFullName(localName || 'Portfolio Owner')
        } else {
          // No user session or claimed slug -> redirect directly to /signup!
          router.push('/signup')
          return
        }
      } catch (err) {
        console.error('Session check error:', err)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkAuth()
  }, [router, paramSlug])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUploadAndParse = async () => {
    if (!file) return

    setIsParsing(true)
    setParseStatus('Reading PDF file in memory...')

    try {
      const formData = new FormData()
      formData.append('file', file)

      setParseStatus('Analyzing text & extracting structure via Gemini AI...')
      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to parse resume.')
      }

      setParsedData(json.data)
      if (json.data.fullName) {
        setFullName(json.data.fullName)
      }
      setParseStatus('Success! Structure extracted.')
      setStep(2)
    } catch (err: any) {
      alert(err.message || 'Error parsing resume. You can still proceed and edit data manually.')
      setStep(2)
    } finally {
      setIsParsing(false)
    }
  }

  const handleFinalSubmit = async () => {
    if (!slug || !fullName) {
      alert('Please fill in your name and URL slug.')
      return
    }

    try {
      const payload = {
        slug,
        fullName,
        headline: parsedData?.headline || 'Software Professional',
        bio: parsedData?.bio || '',
        location: parsedData?.location || '',
        contactEmail: parsedData?.contactEmail || '',
        phone: parsedData?.phone || '',
        website: parsedData?.website || '',
        socialLinks: parsedData?.socialLinks || [],
        themeId: selectedTheme,
        themeConfig: { primaryColor: accentColor },
        experiences: parsedData?.experiences || [],
        education: parsedData?.education || [],
        skills: parsedData?.skills || [],
        projects: parsedData?.projects || [],
      }

      const res = await fetch('/api/portfolio/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to generate portfolio.')
      }

      localStorage.setItem('mfolio_current_slug', slug)
      localStorage.setItem('mfolio_current_data', JSON.stringify(payload))

      router.push(`/dashboard?slug=${slug}`)
    } catch (err: any) {
      alert(err.message || 'Failed to save portfolio.')
    }
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-xs text-slate-400">Verifying session...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">mfolio</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 text-slate-300">
          <span>Claimed:</span>
          <span className="text-blue-400 font-bold">/{slug}</span>
        </div>
      </div>

      {/* Main Wizard */}
      <div className="max-w-xl mx-auto w-full py-12">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">Upload Your Resume</h1>
              <p className="text-slate-400 text-sm">
                We parse your PDF <span className="text-blue-400 font-medium">in-memory</span> using Gemini AI to extract work history, skills, and projects for <strong className="text-white">/{slug}</strong>.
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-8 text-center bg-slate-900/50 transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6" />
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume-file-input"
              />
              <label
                htmlFor="resume-file-input"
                className="cursor-pointer inline-block px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white mb-2 transition-all"
              >
                Choose PDF File
              </label>
              {file ? (
                <div className="flex items-center justify-center gap-2 text-sm text-emerald-400 font-medium mt-2">
                  <FileText className="w-4 h-4" />
                  <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ) : (
                <p className="text-xs text-slate-500">PDF documents only (Max 10MB)</p>
              )}
            </div>

            {isParsing && (
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center gap-3 text-sm text-blue-300">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                <span>{parseStatus}</span>
              </div>
            )}

            <button
              onClick={handleUploadAndParse}
              disabled={!file || isParsing}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-semibold text-white transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm"
            >
              {isParsing ? 'Processing Resume...' : 'Parse Resume & Pick Theme'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">Choose Your Portfolio Theme</h1>
              <p className="text-slate-400 text-sm">Select a starting template. You can switch themes anytime in your dashboard.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.values(themeRegistry).map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all text-left flex flex-col justify-between ${
                    selectedTheme === theme.id
                      ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-base">{theme.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        {theme.previewBadge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{theme.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className="w-4 h-4 rounded-full inline-block border border-white/20"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                    {selectedTheme === theme.id && (
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleFinalSubmit}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-white transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 text-base"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Portfolio Now</span>
            </button>
          </div>
        )}
      </div>

      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500">
        mfolio &copy; 2026 — Zero server disk file storage guarantee.
      </footer>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  )
}
