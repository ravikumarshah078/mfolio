export interface SocialLink {
  platform: string
  url: string
}

export interface ExperienceItem {
  id?: string
  company: string
  role: string
  location?: string | null
  startDate: string
  endDate?: string | null
  current?: boolean
  description?: string | null
  highlights?: string[] | null
  order?: number
}

export interface EducationItem {
  id?: string
  institution: string
  degree: string
  field?: string | null
  startDate?: string | null
  endDate?: string | null
  description?: string | null
  order?: number
}

export interface SkillItem {
  id?: string
  name: string
  category?: string | null
  proficiency?: number | null
  order?: number
}

export interface ProjectItem {
  id?: string
  title: string
  description?: string | null
  techStack?: string[] | null
  liveUrl?: string | null
  githubUrl?: string | null
  imageUrl?: string | null
  featured?: boolean
  order?: number
}

export interface CertificationItem {
  id?: string
  title: string
  issuer: string
  issueDate?: string | null
  credentialUrl?: string | null
}

export interface CustomSectionItem {
  id?: string
  title: string
  content: any
  order?: number
}

export interface ThemeConfig {
  primaryColor?: string
  fontFamily?: string
  hiddenSections?: string[]
  customCss?: string
}

export interface FullPortfolioData {
  id?: string
  userId?: string
  slug: string
  fullName: string
  headline?: string | null
  bio?: string | null
  avatarUrl?: string | null
  location?: string | null
  contactEmail?: string | null
  phone?: string | null
  website?: string | null
  availability?: string | null
  socialLinks?: SocialLink[] | null
  themeId: string
  themeConfig?: ThemeConfig | null
  isPublished?: boolean
  experiences: ExperienceItem[]
  education: EducationItem[]
  skills: SkillItem[]
  projects: ProjectItem[]
  certifications?: CertificationItem[]
  customSections?: CustomSectionItem[]
}

export interface PortfolioThemeProps {
  portfolio: FullPortfolioData
}
