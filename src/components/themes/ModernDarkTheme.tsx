'use client'

import React from 'react'
import { PortfolioThemeProps } from '@/types/portfolio'
import { Mail, Phone, MapPin, ExternalLink, Sparkles, Code2, Briefcase, GraduationCap, Award, Layers } from 'lucide-react'
import { SocialIcon } from '@/components/common/SocialIcons'

export function ModernDarkTheme({ portfolio }: PortfolioThemeProps) {
  const accentColor = portfolio.themeConfig?.primaryColor || '#06b6d4'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Glow Effects */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[25rem] opacity-20 blur-[120px] pointer-events-none rounded-full"
        style={{ backgroundColor: accentColor }}
      />

      {/* Header */}
      <header className="relative z-10 max-w-5xl mx-auto pt-24 pb-16 px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-slate-800/80">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{portfolio.headline || 'Software Engineer'}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              {portfolio.fullName}
            </h1>
            {portfolio.bio && (
              <p className="text-base md:text-lg text-slate-400 leading-relaxed">
                {portfolio.bio}
              </p>
            )}

            {/* Meta tags */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2 font-mono">
              {portfolio.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {portfolio.location}
                </span>
              )}
              {portfolio.contactEmail && (
                <a href={`mailto:${portfolio.contactEmail}`} className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  {portfolio.contactEmail}
                </a>
              )}
              {portfolio.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  {portfolio.phone}
                </span>
              )}
            </div>
          </div>

          {/* Social Links */}
          {portfolio.socialLinks && portfolio.socialLinks.length > 0 && (
            <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
              {portfolio.socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all shadow-md"
                >
                  <SocialIcon platform={link.platform} className="w-4 h-4 text-cyan-400" />
                  <span className="capitalize">{link.platform}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-24 space-y-16">
        {/* Work Experience */}
        {portfolio.experiences.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Work History</h2>
            </div>

            <div className="space-y-6">
              {portfolio.experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-lg font-bold text-white">
                      {exp.role} <span className="text-cyan-400 font-normal">@ {exp.company}</span>
                    </h3>
                    <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full w-fit">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-slate-300 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-1.5 pt-2">
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="text-xs text-slate-400 flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">›</span>
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

        {/* Projects */}
        {portfolio.projects.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                <Code2 className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Featured Projects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="font-bold text-white text-lg">{project.title}</h3>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">{project.description}</p>
                  </div>
                  {project.techStack && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
                      {project.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 text-xs rounded-md bg-cyan-950/60 text-cyan-300 font-mono border border-cyan-800/30"
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

        {/* Skills */}
        {portfolio.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold tracking-tight text-white mb-6">Skills & Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-medium hover:border-cyan-500/50 hover:text-white transition-all"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {portfolio.education.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                <GraduationCap className="w-5 h-5" />
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
                    <h3 className="font-bold text-white text-base">{edu.institution}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Honors */}
        {portfolio.certifications && portfolio.certifications.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Certifications & Honors</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-white text-sm">{cert.title}</h3>
                    {cert.issuer && <p className="text-xs text-cyan-400 mt-0.5">{cert.issuer}</p>}
                  </div>
                  {cert.issueDate && <span className="text-xs font-mono text-slate-400">{cert.issueDate}</span>}
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
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">{sec.title}</h2>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  {Array.isArray(sec.content) ? (
                    <ul className="space-y-2">
                      {sec.content.map((item: any, iIdx: number) => (
                        <li key={iIdx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-cyan-400">✦</span>
                          <span>{typeof item === 'string' ? item : item.title || JSON.stringify(item)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-300">{sec.content}</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      <footer className="relative z-10 py-8 text-center text-xs text-slate-500 border-t border-slate-900 font-mono">
        <p>Built with <span className="text-cyan-400">mfolio Modern Dark</span></p>
      </footer>
    </div>
  )
}
