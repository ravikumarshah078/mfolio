'use client'

import React from 'react'
import { FullPortfolioData } from '@/types/portfolio'
import { ExternalLink, Layers, Globe } from 'lucide-react'
import { SocialIcon } from '@/components/common/SocialIcons'

export type SectionType = 'experience' | 'projects' | 'skills' | 'education' | 'certifications' | 'custom'

export interface NormalizedSection<T = any> {
  id: string
  type: SectionType
  title: string
  items: T[]
}

export function getNormalizedSections(portfolio: FullPortfolioData): NormalizedSection[] {
  const sections: NormalizedSection[] = []

  if (portfolio.experiences && portfolio.experiences.length > 0) {
    sections.push({
      id: 'experience',
      type: 'experience',
      title: 'Work Experience',
      items: portfolio.experiences,
    })
  }

  if (portfolio.projects && portfolio.projects.length > 0) {
    sections.push({
      id: 'projects',
      type: 'projects',
      title: 'Featured Projects',
      items: portfolio.projects,
    })
  }

  if (portfolio.skills && portfolio.skills.length > 0) {
    sections.push({
      id: 'skills',
      type: 'skills',
      title: 'Skills & Expertise',
      items: portfolio.skills,
    })
  }

  if (portfolio.education && portfolio.education.length > 0) {
    sections.push({
      id: 'education',
      type: 'education',
      title: 'Education',
      items: portfolio.education,
    })
  }

  if (portfolio.certifications && portfolio.certifications.length > 0) {
    sections.push({
      id: 'certifications',
      type: 'certifications',
      title: 'Certifications & Honors',
      items: portfolio.certifications,
    })
  }

  if (portfolio.customSections && portfolio.customSections.length > 0) {
    portfolio.customSections.forEach((cSec, idx) => {
      sections.push({
        id: `custom_${idx}`,
        type: 'custom',
        title: cSec.title || 'Additional Information',
        items: Array.isArray(cSec.content) ? cSec.content : [cSec.content],
      })
    })
  }

  return sections
}

export interface ThemeStyleConfig {
  accentColor: string
  sectionTitleClass: string
  cardClass: string
  badgeClass: string
  textPrimaryClass: string
  textSecondaryClass: string
}

export function ModularSectionCard({
  sectionType,
  item,
  styleConfig,
}: {
  sectionType: SectionType
  item: any
  styleConfig: ThemeStyleConfig
}) {
  switch (sectionType) {
    case 'experience':
      return (
        <div className={styleConfig.cardClass}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <h3 className={`text-lg font-bold ${styleConfig.textPrimaryClass}`}>
              {item.role} <span className="font-normal text-slate-500">@ {item.company}</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {item.startDate} – {item.current ? 'Present' : item.endDate}
            </span>
          </div>
          {item.description && (
            <p className={`text-sm ${styleConfig.textSecondaryClass} leading-relaxed`}>
              {item.description}
            </p>
          )}
          {item.highlights && item.highlights.length > 0 && (
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pt-2">
              {item.highlights.map((h: string, hIdx: number) => (
                <li key={hIdx}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      )

    case 'projects':
      return (
        <div className={`${styleConfig.cardClass} flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-bold text-lg ${styleConfig.textPrimaryClass}`}>{item.title}</h3>
              <div className="flex items-center gap-2">
                {item.githubUrl && (
                  <a href={item.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                    <SocialIcon platform="github" className="w-4 h-4" />
                  </a>
                )}
                {item.liveUrl && (
                  <a href={item.liveUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
            <p className={`text-sm ${styleConfig.textSecondaryClass} leading-relaxed mb-4`}>
              {item.description}
            </p>
          </div>
          {item.techStack && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/50">
              {item.techStack.map((tech: string, tIdx: number) => (
                <span key={tIdx} className={styleConfig.badgeClass}>
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      )

    case 'skills':
      return (
        <span className={styleConfig.badgeClass}>
          {item.name}
          {item.category && <span className="ml-1.5 text-[10px] opacity-75">({item.category})</span>}
        </span>
      )

    case 'education':
      return (
        <div className={`${styleConfig.cardClass} flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
          <div>
            <h3 className={`font-bold ${styleConfig.textPrimaryClass}`}>{item.institution}</h3>
            <p className={`text-sm ${styleConfig.textSecondaryClass}`}>
              {item.degree} {item.field ? `in ${item.field}` : ''}
            </p>
          </div>
          {(item.startDate || item.endDate) && (
            <span className="text-xs font-mono text-slate-400">
              {item.startDate} {item.endDate ? `- ${item.endDate}` : ''}
            </span>
          )}
        </div>
      )

    case 'certifications':
      return (
        <div className={`${styleConfig.cardClass} flex items-center justify-between gap-3`}>
          <div>
            <h3 className={`font-bold text-sm ${styleConfig.textPrimaryClass}`}>{item.title}</h3>
            {item.issuer && <p className="text-xs text-slate-400">{item.issuer}</p>}
          </div>
          {item.issueDate && <span className="text-xs font-mono text-slate-400">{item.issueDate}</span>}
        </div>
      )

    case 'custom':
      return (
        <div className="text-xs text-slate-300 flex items-start gap-2">
          <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
          <span>{typeof item === 'string' ? item : item.title || JSON.stringify(item)}</span>
        </div>
      )

    default:
      return null
  }
}
