'use client'

import React from 'react'
import { PortfolioThemeProps } from '@/types/portfolio'
import { Mail, Phone, MapPin, ExternalLink, Layers } from 'lucide-react'
import { SocialIcon } from '@/components/common/SocialIcons'

export function CompactPaperTheme({ portfolio }: PortfolioThemeProps) {
  return (
    <div className="min-h-screen bg-amber-50/40 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-serif selection:bg-stone-900 selection:text-white p-6 md:p-16">
      <div className="max-w-4xl mx-auto bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-8 md:p-14 shadow-xl space-y-12">
        {/* Editorial Header */}
        <header className="border-b-2 border-stone-900 dark:border-stone-200 pb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-stone-900 dark:text-white font-serif uppercase">
              {portfolio.fullName}
            </h1>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500">
              {portfolio.headline || 'Resume & Portfolio'}
            </span>
          </div>

          {portfolio.bio && (
            <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed max-w-3xl pt-2">
              {portfolio.bio}
            </p>
          )}

          {/* Contact Details */}
          <div className="flex flex-wrap gap-4 text-xs font-sans font-medium text-stone-600 dark:text-stone-400 pt-3 border-t border-stone-200 dark:border-stone-800">
            {portfolio.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-900 dark:text-stone-200" />
                {portfolio.location}
              </span>
            )}
            {portfolio.contactEmail && (
              <a href={`mailto:${portfolio.contactEmail}`} className="flex items-center gap-1 hover:underline">
                <Mail className="w-3.5 h-3.5 text-stone-900 dark:text-stone-200" />
                {portfolio.contactEmail}
              </a>
            )}
            {portfolio.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-900 dark:text-stone-200" />
                {portfolio.phone}
              </span>
            )}
          </div>

          {/* Social links */}
          {portfolio.socialLinks && portfolio.socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2 font-sans text-xs">
              {portfolio.socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-stone-800 dark:text-stone-200 font-bold hover:underline"
                >
                  <SocialIcon platform={link.platform} className="w-3.5 h-3.5" />
                  <span className="capitalize">{link.platform}</span>
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Experience Section */}
        {portfolio.experiences.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-sans font-extrabold uppercase tracking-widest text-stone-900 dark:text-stone-100 border-b border-stone-900 dark:border-stone-100 pb-1">
              Work Experience
            </h2>

            <div className="space-y-8">
              {portfolio.experiences.map((exp, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-baseline">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                      {exp.role} <span className="font-normal text-stone-600 dark:text-stone-400">/ {exp.company}</span>
                    </h3>
                    <span className="text-xs font-mono text-stone-500">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-stone-700 dark:text-stone-300 space-y-1 font-sans">
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
          <section className="space-y-6">
            <h2 className="text-xs font-sans font-extrabold uppercase tracking-widest text-stone-900 dark:text-stone-100 border-b border-stone-900 dark:border-stone-100 pb-1">
              Key Projects
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {portfolio.projects.map((project, idx) => (
                <div key={idx} className="border border-stone-200 dark:border-stone-800 p-5 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-stone-900 dark:text-white text-base">{project.title}</h3>
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-stone-500 hover:text-stone-900 dark:hover:text-white">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{project.description}</p>
                  {project.techStack && (
                    <p className="text-[11px] font-mono text-stone-500 pt-2">
                      Tech: {project.techStack.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {portfolio.skills.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-sans font-extrabold uppercase tracking-widest text-stone-900 dark:text-stone-100 border-b border-stone-900 dark:border-stone-100 pb-1">
              Technical Expertise
            </h2>
            <div className="flex flex-wrap gap-2 font-sans">
              {portfolio.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-stone-700"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {portfolio.education.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-sans font-extrabold uppercase tracking-widest text-stone-900 dark:text-stone-100 border-b border-stone-900 dark:border-stone-100 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {portfolio.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline text-sm">
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white">{edu.institution}</span>
                    <span className="text-stone-600 dark:text-stone-400"> — {edu.degree} {edu.field ? `in ${edu.field}` : ''}</span>
                  </div>
                  <span className="text-xs font-mono text-stone-500">{edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {portfolio.certifications && portfolio.certifications.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-sans font-extrabold uppercase tracking-widest text-stone-900 dark:text-stone-100 border-b border-stone-900 dark:border-stone-100 pb-1">
              Certifications & Honors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
              {portfolio.certifications.map((cert, idx) => (
                <div key={idx} className="p-3 border border-stone-200 dark:border-stone-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white">{cert.title}</span>
                    {cert.issuer && <p className="text-[11px] text-stone-500">{cert.issuer}</p>}
                  </div>
                  {cert.issueDate && <span className="text-stone-500 font-mono text-[10px]">{cert.issueDate}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dynamic Custom Sections */}
        {portfolio.customSections && portfolio.customSections.length > 0 && (
          <section className="space-y-6">
            {portfolio.customSections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-3">
                <h2 className="text-xs font-sans font-extrabold uppercase tracking-widest text-stone-900 dark:text-stone-100 border-b border-stone-900 dark:border-stone-100 pb-1">
                  {sec.title}
                </h2>
                <div className="p-4 border border-stone-200 dark:border-stone-800 font-sans text-xs">
                  {Array.isArray(sec.content) ? (
                    <ul className="space-y-1.5 list-disc list-inside">
                      {sec.content.map((item: any, iIdx: number) => (
                        <li key={iIdx}>{typeof item === 'string' ? item : item.title || JSON.stringify(item)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{sec.content}</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Editorial Footer */}
        <footer className="pt-6 border-t border-stone-300 dark:border-stone-800 text-center text-xs text-stone-500 font-sans">
          Published with <span className="font-bold text-stone-900 dark:text-white">mfolio Editorial Print</span>
        </footer>
      </div>
    </div>
  )
}
