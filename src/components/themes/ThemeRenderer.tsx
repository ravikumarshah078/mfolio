'use client'

import React from 'react'
import { FullPortfolioData } from '@/types/portfolio'
import { getTheme } from './theme-registry'

interface ThemeRendererProps {
  portfolio: FullPortfolioData
}

export function ThemeRenderer({ portfolio }: ThemeRendererProps) {
  const themeDef = getTheme(portfolio.themeId)
  const ThemeComponent = themeDef.component
  const fontStyle = portfolio.themeConfig?.fontFamily ? { fontFamily: portfolio.themeConfig.fontFamily } : {}

  return (
    <div style={fontStyle} className="transition-all duration-300">
      <ThemeComponent portfolio={portfolio} />
    </div>
  )
}
