export interface ParsedExperience {
  company: string
  role: string
  location?: string
  startDate: string
  endDate?: string
  current?: boolean
  description?: string
  highlights?: string[]
}

export interface ParsedEducation {
  institution: string
  degree: string
  field?: string
  startDate?: string
  endDate?: string
  description?: string
}

export interface ParsedSkill {
  name: string
  category?: string
  proficiency?: number
}

export interface ParsedProject {
  title: string
  description?: string
  techStack?: string[]
  liveUrl?: string
  githubUrl?: string
}

export interface ParsedCertification {
  title: string
  issuer: string
  issueDate?: string
  credentialUrl?: string
}

export interface ParsedSocialLink {
  platform: string
  url: string
}

export interface ParsedCustomSection {
  title: string
  content: string[] | string
}

export interface ParsedResumeData {
  fullName: string
  headline?: string
  bio?: string
  location?: string
  contactEmail?: string
  phone?: string
  website?: string
  socialLinks?: ParsedSocialLink[]
  experiences: ParsedExperience[]
  education: ParsedEducation[]
  skills: ParsedSkill[]
  projects: ParsedProject[]
  certifications?: ParsedCertification[]
  customSections?: ParsedCustomSection[]
}
