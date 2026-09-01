import React from 'react'
import { PortfolioThemeProps } from '@/types/portfolio'
import { MinimalTheme } from './MinimalTheme'
import { CreativeTheme } from './CreativeTheme'
import { ExecutiveTheme } from './ExecutiveTheme'
import { TerminalTheme } from './TerminalTheme'

export interface ThemeDefinition {
  id: string
  name: string
  description: string
  accentColor: string
  previewBadge: string
  component: React.ComponentType<PortfolioThemeProps>
}

/**
 * Extensible Plug-and-Play Theme Registry.
 * To add a new theme in the future:
 * 1. Create a new component in components/themes/
 * 2. Add its entry to themeRegistry object below.
 */
export const themeRegistry: Record<string, ThemeDefinition> = {
  minimal: {
    id: 'minimal',
    name: 'Minimalist Clean',
    description: 'Sleek typography, high readability, and elegant whitespace.',
    accentColor: '#2563eb',
    previewBadge: 'Popular',
    component: MinimalTheme,
  },
  'modern-creative': {
    id: 'modern-creative',
    name: 'Modern Glassmorphism',
    description: 'Vibrant radial gradients, frosted glass cards, and smooth glow effects.',
    accentColor: '#8b5cf6',
    previewBadge: 'Creative',
    component: CreativeTheme,
  },
  executive: {
    id: 'executive',
    name: 'Executive Corporate',
    description: 'Structured 2-column sidebar layout tailored for leadership & consultants.',
    accentColor: '#0f172a',
    previewBadge: 'Classic',
    component: ExecutiveTheme,
  },
  terminal: {
    id: 'terminal',
    name: 'Developer Terminal',
    description: 'Dark-mode hacker & code editor aesthetic for engineers and architects.',
    accentColor: '#10b981',
    previewBadge: 'Tech',
    component: TerminalTheme,
  },
}

export function getTheme(themeId: string): ThemeDefinition {
  return themeRegistry[themeId] || themeRegistry.minimal
}
