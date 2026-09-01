'use client'

import React from 'react'
import { PortfolioThemeProps } from '@/types/portfolio'
import { Mail, MapPin, Globe, ExternalLink } from 'lucide-react'
import { GithubIcon, LinkedinIcon, SocialIcon } from '@/components/common/SocialIcons'

export function MinimalTheme({ portfolio }: PortfolioThemeProps) {
  const accentColor = portfolio.themeConfig?.primaryColor || '#2563eb'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
      {/* Header Container */}
      <header className="max-w-4xl mx-auto pt-16 pb-12 px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-full mb-3">
              {portfolio.availability || 'Available for projects'}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {portfolio.fullName}
            </h1>
            {portfolio.headline && (
              <p className="mt-2 text-xl text-slate-600 dark:text-slate-400 font-medium">
                {portfolio.headline}
              </p>
            )}
            {portfolio.location && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mt-3">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{portfolio.location}</span>
              </div>
            )}
          </div>

          {/* Social Links & Contact buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {portfolio.contactEmail && (
              <a
                href={`mailto:${portfolio.contactEmail}`}
                style={{ backgroundColor: accentColor }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:opacity-90 transition-opacity"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Me</span>
              </a>
            )}
            {portfolio.socialLinks?.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 transition-all"
                title={link.platform}
              >
                <SocialIcon platform={link.platform} className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Bio */}
        {portfolio.bio && (
          <div className="py-8">
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              {portfolio.bio}
            </p>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pb-24 space-y-16">
        {/* Experience Section */}
        {portfolio.experiences.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-2 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
              Work Experience
            </h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {portfolio.experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-10 group">
                  <div
                    className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full -translate-x-1/2 bg-white dark:bg-slate-950 border-2"
                    style={{ borderColor: accentColor }}
                  />
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {exp.role} <span className="text-slate-400 font-normal">at</span> {exp.company}
                      </h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-fit">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {exp.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
                  className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          >
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}
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
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
        <p>Powered by <span className="font-bold text-slate-600 dark:text-slate-300">mfolio</span></p>
      </footer>
    </div>
  )
}
