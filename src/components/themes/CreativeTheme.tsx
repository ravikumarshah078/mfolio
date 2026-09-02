'use client'

import React from 'react'
import { PortfolioThemeProps } from '@/types/portfolio'
import { Mail, MapPin, ExternalLink, Sparkles, Code2, Briefcase, GraduationCap, Award } from 'lucide-react'
import { GithubIcon, SocialIcon } from '@/components/common/SocialIcons'

export function CreativeTheme({ portfolio }: PortfolioThemeProps) {
  const accentColor = portfolio.themeConfig?.primaryColor || '#8b5cf6'

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Radial Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-1/3 w-[30rem] h-[30rem] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Hero Header */}
      <header className="relative z-10 max-w-5xl mx-auto pt-20 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{portfolio.availability || 'Creative Portfolio'}</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent mb-4">
          {portfolio.fullName}
        </h1>

        {portfolio.headline && (
          <p className="text-xl md:text-2xl text-purple-200/80 max-w-2xl mx-auto font-medium mb-6">
            {portfolio.headline}
          </p>
        )}

        {portfolio.location && (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-8">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span>{portfolio.location}</span>
          </div>
        )}

        {/* Contact CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {portfolio.contactEmail && (
            <a
              href={`mailto:${portfolio.contactEmail}`}
              style={{ backgroundColor: accentColor }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Get In Touch</span>
            </a>
          )}

          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-full border border-slate-800">
            {portfolio.socialLinks?.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full hover:bg-purple-500/20 text-slate-300 hover:text-purple-300 transition-colors"
                title={link.platform}
              >
                <SocialIcon platform={link.platform} className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Bio Glass Box */}
        {portfolio.bio && (
          <div className="mt-12 p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl max-w-3xl mx-auto text-slate-300 text-lg leading-relaxed text-left shadow-2xl">
            {portfolio.bio}
          </div>
        )}
      </header>

      {/* Main Grid Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-24 space-y-16">
        {/* Work Experience */}
        {portfolio.experiences.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white">Experience</h2>
            </div>

            <div className="space-y-6">
              {portfolio.experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                      <p className="text-purple-400 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 w-fit">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-slate-400 text-sm mt-3 leading-relaxed">{exp.description}</p>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-purple-400 mt-1">✦</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Showcase */}
        {portfolio.projects.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Code2 className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white">Crafted Projects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {portfolio.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 p-8 border border-slate-800/80 hover:border-purple-500/50 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 shadow-xl"
                >
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-white"
                        >
                          <GithubIcon className="w-5 h-5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {project.techStack && (
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3 py-1 rounded-full text-xs font-mono bg-purple-950/60 border border-purple-800/40 text-purple-300"
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

        {/* Skills Pills */}
        {portfolio.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-6">Skills & Technologies</h2>
            <div className="flex flex-wrap gap-3">
              {portfolio.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-sm font-medium hover:border-purple-500/50 hover:bg-purple-950/30 transition-all"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {portfolio.education.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Education</h2>
            </div>
            <div className="space-y-4">
              {portfolio.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white">{edu.institution}</h3>
                    <p className="text-sm text-purple-400">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {portfolio.certifications && portfolio.certifications.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Certifications & Honors</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-base font-bold text-white">{cert.title}</h3>
                    {cert.issuer && <p className="text-xs text-purple-400 mt-0.5">{cert.issuer}</p>}
                  </div>
                  {cert.issueDate && <span className="text-xs font-mono text-slate-400">{cert.issueDate}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="relative z-10 py-8 text-center text-xs text-slate-500 border-t border-slate-900">
        <p>Crafted with <span className="text-purple-400">mfolio</span></p>
      </footer>
    </div>
  )
}
