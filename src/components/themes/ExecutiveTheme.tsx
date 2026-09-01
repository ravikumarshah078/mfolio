'use client'

import React from 'react'
import { PortfolioThemeProps } from '@/types/portfolio'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, ExternalLink } from 'lucide-react'
import { SocialIcon } from '@/components/common/SocialIcons'

export function ExecutiveTheme({ portfolio }: PortfolioThemeProps) {
  const accentColor = portfolio.themeConfig?.primaryColor || '#0f172a'

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-serif">
      <div className="max-w-6xl mx-auto min-h-screen bg-white dark:bg-slate-950 border-x border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col md:flex-row">
        {/* Left Column / Sidebar */}
        <aside className="w-full md:w-80 bg-slate-900 text-slate-100 p-8 flex flex-col justify-between shrink-0">
          <div className="space-y-8 font-sans">
            {/* User Identity */}
            <div>
              <h1 className="text-3xl font-serif font-extrabold text-white tracking-tight mb-2">
                {portfolio.fullName}
              </h1>
              {portfolio.headline && (
                <p className="text-sm font-medium text-slate-300 uppercase tracking-wider leading-snug">
                  {portfolio.headline}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-3 pt-6 border-t border-slate-800 text-xs">
              {portfolio.location && (
                <div className="flex items-center gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{portfolio.location}</span>
                </div>
              )}
              {portfolio.contactEmail && (
                <div className="flex items-center gap-2.5 text-slate-300 truncate">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={`mailto:${portfolio.contactEmail}`} className="hover:text-white truncate">
                    {portfolio.contactEmail}
                  </a>
                </div>
              )}
              {portfolio.phone && (
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{portfolio.phone}</span>
                </div>
              )}
            </div>

            {/* Social Channels */}
            {portfolio.socialLinks && portfolio.socialLinks.length > 0 && (
              <div className="space-y-2 pt-6 border-t border-slate-800 text-xs font-sans">
                <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-3">Links</p>
                {portfolio.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between text-slate-300 hover:text-emerald-400 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <SocialIcon platform={link.platform} className="w-3.5 h-3.5" />
                      <span className="capitalize">{link.platform}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            )}

            {/* Core Competencies / Skills */}
            {portfolio.skills.length > 0 && (
              <div className="pt-6 border-t border-slate-800 font-sans">
                <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-4">Competencies</p>
                <div className="flex flex-wrap gap-1.5">
                  {portfolio.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-xs font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-10 text-xs text-slate-500 font-sans">
            <p>mfolio Executive</p>
          </div>
        </aside>

        {/* Right Main Column */}
        <main className="flex-1 p-8 md:p-12 space-y-12 font-sans">
          {/* Executive Summary */}
          {portfolio.bio && (
            <section className="pb-8 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                Executive Profile
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
                {portfolio.bio}
              </p>
            </section>
          )}

          {/* Professional Experience */}
          {portfolio.experiences.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                Professional History
              </h2>

              <div className="space-y-8">
                {portfolio.experiences.map((exp, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                        {exp.role}
                      </h3>
                      <span className="text-xs font-medium text-slate-500">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </p>

                    {exp.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                        {exp.description}
                      </p>
                    )}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1 pt-2">
                        {exp.highlights.map((h, hIdx) => (
                          <li key={hIdx}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Projects */}
          {portfolio.projects.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Key Initiatives & Projects
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {portfolio.projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-white">{project.title}</h3>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {portfolio.education.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                Education & Credentials
              </h2>

              <div className="space-y-3">
                {portfolio.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-baseline text-sm">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{edu.institution}</span>
                      <span className="text-slate-500"> — {edu.degree}</span>
                    </div>
                    <span className="text-xs text-slate-400">{edu.endDate}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
