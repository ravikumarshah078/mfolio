'use client'

import React, { useState } from 'react'
import { PortfolioThemeProps } from '@/types/portfolio'
import { Terminal, Copy, Check, ExternalLink, Mail, MapPin } from 'lucide-react'
import { GithubIcon, SocialIcon } from '@/components/common/SocialIcons'

export function TerminalTheme({ portfolio }: PortfolioThemeProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'exp' | 'projects' | 'skills'>('all')

  const copySlug = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-emerald-400 font-mono selection:bg-emerald-900 selection:text-emerald-100 p-4 md:p-12">
      {/* Terminal Window Frame */}
      <div className="max-w-4xl mx-auto rounded-lg border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
        {/* Terminal Header Bar */}
        <div className="bg-neutral-800/80 px-4 py-3 border-b border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            <span className="text-xs text-neutral-400 ml-2 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>mfolio://{portfolio.slug}</span>
            </span>
          </div>

          <button
            onClick={copySlug}
            className="text-xs text-neutral-400 hover:text-emerald-400 flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy URL'}</span>
          </button>
        </div>

        {/* Terminal Body */}
        <div className="p-6 md:p-8 space-y-8 text-sm leading-relaxed">
          {/* Welcome Prompt */}
          <div>
            <p className="text-neutral-500">
              <span className="text-emerald-500">guest@mfolio</span>:<span className="text-blue-400">~</span>$ cat profile.json
            </p>
            <div className="mt-3 p-4 rounded bg-neutral-950/80 border border-neutral-800/60 text-emerald-300">
              <h1 className="text-2xl font-bold text-emerald-400">{portfolio.fullName}</h1>
              <p className="text-neutral-400 mt-1">{portfolio.headline || 'Developer / Architect'}</p>
              {portfolio.location && (
                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{portfolio.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {portfolio.bio && (
            <div>
              <p className="text-neutral-500">
                <span className="text-emerald-500">guest@mfolio</span>:<span className="text-blue-400">~</span>$ ./summary.sh
              </p>
              <p className="mt-2 text-neutral-300 pl-4 border-l-2 border-emerald-500/50">
                {portfolio.bio}
              </p>
            </div>
          )}

          {/* Contact & Social Links */}
          <div>
            <p className="text-neutral-500">
              <span className="text-emerald-500">guest@mfolio</span>:<span className="text-blue-400">~</span>$ echo $CONTACT_INFO
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-xs">
              {portfolio.contactEmail && (
                <a
                  href={`mailto:${portfolio.contactEmail}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{portfolio.contactEmail}</span>
                </a>
              )}
              {portfolio.socialLinks?.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-emerald-400 transition-colors"
                >
                  <SocialIcon platform={link.platform} className="w-3.5 h-3.5" />
                  <span className="capitalize">{link.platform}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Filter Navigation */}
          <div className="flex items-center gap-2 pt-4 border-t border-neutral-800">
            <span className="text-xs text-neutral-500 mr-2">Views:</span>
            {(['all', 'exp', 'projects', 'skills'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs rounded uppercase font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                [{tab}]
              </button>
            ))}
          </div>

          {/* Work Experience */}
          {(activeTab === 'all' || activeTab === 'exp') && portfolio.experiences.length > 0 && (
            <div>
              <p className="text-neutral-500 mb-4">
                <span className="text-emerald-500">guest@mfolio</span>:<span className="text-blue-400">~</span>$ git log --experiences
              </p>
              <div className="space-y-4 pl-2">
                {portfolio.experiences.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded bg-neutral-950/60 border border-neutral-800">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs mb-2">
                      <span className="text-yellow-400 font-bold">{exp.role} @ {exp.company}</span>
                      <span className="text-neutral-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    {exp.description && <p className="text-neutral-300 text-xs">{exp.description}</p>}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="mt-2 space-y-1 text-xs text-neutral-400">
                        {exp.highlights.map((h, hIdx) => (
                          <li key={hIdx}>&gt; {h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {(activeTab === 'all' || activeTab === 'projects') && portfolio.projects.length > 0 && (
            <div>
              <p className="text-neutral-500 mb-4">
                <span className="text-emerald-500">guest@mfolio</span>:<span className="text-blue-400">~</span>$ ls -la ./projects/
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.projects.map((project, idx) => (
                  <div key={idx} className="p-4 rounded bg-neutral-950/60 border border-neutral-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-emerald-400">{project.title}</span>
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mb-3">{project.description}</p>
                    </div>
                    {project.techStack && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {project.techStack.map((tech, tIdx) => (
                          <span key={tIdx} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-emerald-400">
                            #{tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {(activeTab === 'all' || activeTab === 'skills') && portfolio.skills.length > 0 && (
            <div>
              <p className="text-neutral-500 mb-3">
                <span className="text-emerald-500">guest@mfolio</span>:<span className="text-blue-400">~</span>$ npm list --depth=0
              </p>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 rounded bg-neutral-800 text-xs text-neutral-200">
                    {skill.name} <span className="text-neutral-500 text-[10px]">@latest</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Prompt cursor footer */}
          <div className="pt-4 flex items-center gap-2 text-xs">
            <span className="text-emerald-500">guest@mfolio</span>:<span className="text-blue-400">~</span>$
            <span className="w-2.5 h-4 bg-emerald-400 animate-pulse inline-block" />
          </div>
        </div>
      </div>
    </div>
  )
}
