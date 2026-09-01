'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, ArrowRight, Mail, Lock, User, Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function SignupFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSlug = searchParams?.get('slug') || ''

  const [fullName, setFullName] = useState('')
  const [slug, setSlug] = useState(initialSlug)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successInfo, setSuccessInfo] = useState('')

  useEffect(() => {
    if (initialSlug && !slug) {
      setSlug(initialSlug.toLowerCase().replace(/[^a-z0-9-]/g, ''))
    }
  }, [initialSlug])

  const handleSlugChange = (val: string) => {
    setSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !slug || !email || !password) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    setIsLoading(true)
    setErrorMsg('')
    setSuccessInfo('')

    try {
      const supabase = createClient()
      
      // 1. Sign up user via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            slug: slug,
          },
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      // Store current target slug in localStorage for onboarding step
      localStorage.setItem('mfolio_user_slug', slug)
      localStorage.setItem('mfolio_user_name', fullName)

      if (data.session) {
        // Instant login session created (Email confirmation disabled or auto-confirmed)
        router.push(`/onboarding?slug=${slug}`)
      } else {
        // Email confirmation is required by Supabase project settings
        setSuccessInfo(
          'Account created successfully! If email confirmation is enabled in your Supabase project, check your email inbox to confirm, or turn off "Confirm email" in Supabase Auth settings for instant login.'
        )
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl space-y-6 relative z-10">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">mfolio</span>
        </Link>
        <h1 className="text-2xl font-bold">Create Your Account</h1>
        <p className="text-slate-400 text-xs">
          {slug ? (
            <span>Claiming portfolio URL: <strong className="text-blue-400">/{slug}</strong></span>
          ) : (
            'Claim your public portfolio URL and start building.'
          )}
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs leading-relaxed">
          {errorMsg}
        </div>
      )}

      {successInfo && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Account Created!</span>
          </div>
          <p>{successInfo}</p>
          <div className="pt-2">
            <Link
              href={`/onboarding?slug=${slug}`}
              className="inline-block px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
            >
              Continue to Onboarding &rarr;
            </Link>
          </div>
        </div>
      )}

      {!successInfo && (
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Public Portfolio URL Slug
            </label>
            <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 focus-within:border-blue-500">
              <span className="text-slate-500 text-xs font-mono mr-1">mfolio.app/</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="alex-morgan"
                className="w-full bg-transparent focus:outline-none text-white text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-white transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign Up & Claim URL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-400 font-semibold hover:underline">
          Log In
        </Link>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <Suspense
        fallback={
          <div className="text-slate-400 flex items-center gap-2 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span>Loading...</span>
          </div>
        }
      >
        <SignupFormContent />
      </Suspense>
    </div>
  )
}
