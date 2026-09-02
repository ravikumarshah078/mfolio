'use client'

import React from 'react'
import { FullPortfolioData } from '@/types/portfolio'
import { Globe, Mail, Phone, MapPin, ExternalLink, Layers } from 'lucide-react'

export function MinimalTheme({ portfolio }: { portfolio: FullPortfolioData }) {
  const accentColor = portfolio.themeConfig?.primaryColor || '#2563eb'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Hero Header Section */}
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-12">
        <div className="space-y-4">
          <div className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {portfolio.headline || 'Software Professional'}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {portfolio.fullName}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            {portfolio.bio}
          </p>

          {/* Contact Details */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
            {portfolio.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {portfolio.location}
              </span>
            )}
            {portfolio.contactEmail && (
              <a href={`mailto:${portfolio.contactEmail}`} className="flex items-center gap-1.5 hover:text-blue-500">
                <Mail className="w-3.5 h-3.5" />
                {portfolio.contactEmail}
              </a>
            )}
            {portfolio.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {portfolio.phone}
              </span>
            )}
            {portfolio.website && (
              <a href={portfolio.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-500">
                <Globe className="w-3.5 h-3.5" />
                {portfolio.website}
              </a>
            )}
          </div>

          {/* Social Links */}
          {portfolio.socialLinks && portfolio.socialLinks.length > 0 && (
            <div className="flex items-center gap-3 pt-4">
              {portfolio.socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 flex items-center gap-1.5 transition-all text-xs text-slate-700 dark:text-slate-300 font-medium"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="capitalize">{link.platform}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-4xl mx-auto px-6 pb-24 space-y-16">
        {/* Experience Section */}
        {portfolio.experiences.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-2 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
              Work Experience
            </h2>
            <div className="space-y-8">
              {portfolio.experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-2">
                  <div
                    className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-950"
                    style={{ backgroundColor: accentColor }}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {exp.role} <span className="text-slate-500 font-normal">@ {exp.company}</span>
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-1">
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

        {/* Projects Section */}
        {portfolio.projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-2 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{project.title}</h3>
                      <div className="flex items-center gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-blue-600"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>
                  {project.techStack && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {project.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {portfolio.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-2 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium shadow-xs"
                >
                  {skill.name}
                  {skill.category && (
                    <span className="ml-2 text-xs text-slate-400 font-normal">({skill.category})</span>
                  )}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {portfolio.education.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-2 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
              Education
            </h2>
            <div className="space-y-4">
              {portfolio.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{edu.institution}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </p>
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-xs text-slate-500 font-medium px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full w-fit">
                      {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {portfolio.certifications && portfolio.certifications.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-2 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
              Certifications & Honors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {portfolio.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{cert.title}</h3>
                    {cert.issuer && <p className="text-xs text-slate-500">{cert.issuer}</p>}
                  </div>
                  {cert.issueDate && (
                    <span className="text-xs text-slate-400 font-mono shrink-0">{cert.issueDate}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dynamic Custom Sections */}
        {portfolio.customSections && portfolio.customSections.length > 0 && (
          <section className="space-y-8">
            {portfolio.customSections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                  <span className="w-2 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
                  {sec.title}
                </h2>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                  {Array.isArray(sec.content) ? (
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
                      {sec.content.map((item: any, iIdx: number) => (
                        <li key={iIdx}>{typeof item === 'string' ? item : item.title || JSON.stringify(item)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-400">{sec.content}</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
        <p>Powered by <span className="font-bold text-slate-600 dark:text-slate-300">mfolio</span></p>
      </footer>
    </div>
  )
}
