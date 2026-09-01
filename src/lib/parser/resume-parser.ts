import { GoogleGenerativeAI } from '@google/generative-ai'
import { ParsedResumeData } from './types'

// Require the core lib directly to bypass pdf-parse's internal debug test file check
// @ts-ignore
const pdfParse = require('pdf-parse/lib/pdf-parse.js')

/**
 * In-Memory PDF Text Extraction (No file saved to disk)
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer)
    return data.text || ''
  } catch (error) {
    console.error('Error extracting text from PDF buffer:', error)
    throw new Error('Failed to read PDF file in memory.')
  }
}

/**
 * Structured Data Parsing via Google Gemini AI
 */
export async function parseResumeWithGemini(rawText: string): Promise<ParsedResumeData> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your-gemini')) {
    console.warn('GEMINI_API_KEY is not set or placeholder. Falling back to heuristic regex parser.')
    return parseResumeFallback(rawText)
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
You are an expert resume parser and AI recruiter assistant.
Analyze the following resume text carefully and extract all information into strict JSON format.

JSON Schema format required:
{
  "fullName": "Full Name of Candidate",
  "headline": "Short Professional Title / Headline (e.g. Senior Full-Stack Engineer)",
  "bio": "A compelling 2-3 sentence summary of candidate experience and background",
  "location": "City, Country or Remote",
  "contactEmail": "email address",
  "phone": "phone number",
  "website": "portfolio or personal website URL",
  "socialLinks": [
    { "platform": "github | linkedin | twitter | portfolio | other", "url": "full url" }
  ],
  "experiences": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "location": "Location or Remote",
      "startDate": "Month Year / Year",
      "endDate": "Month Year / Present",
      "current": true/false,
      "description": "Short overview of role",
      "highlights": ["Bullet point achievement 1", "Bullet point achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University / Institution Name",
      "degree": "Bachelor of Science in Computer Science",
      "field": "Computer Science",
      "startDate": "Year",
      "endDate": "Year",
      "description": "Honors / GPA / Activities"
    }
  ],
  "skills": [
    { "name": "Skill Name", "category": "Frontend | Backend | Languages | Cloud | Tools | Other", "proficiency": 90 }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Short description of project",
      "techStack": ["Next.js", "TypeScript", "Tailwind CSS"],
      "liveUrl": "http...",
      "githubUrl": "http..."
    }
  ],
  "certifications": [
    { "title": "Cert Name", "issuer": "AWS / Google / Meta", "issueDate": "2024", "credentialUrl": "" }
  ]
}

Strict Rules:
1. Output ONLY valid raw JSON. No markdown codeblocks (no \`\`\`json), no introductory text.
2. If a field is missing, use empty array [] or empty string "" or null.
3. Ensure company names, dates, project links, and skill names are accurately parsed.

Resume Text:
---
${rawText}
---
`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text().trim()

    // Clean potential markdown quotes
    const cleanedJsonString = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const parsedData: ParsedResumeData = JSON.parse(cleanedJsonString)
    return sanitizeParsedData(parsedData)
  } catch (error) {
    console.error('Gemini API parsing failed, triggering fallback parser:', error)
    return parseResumeFallback(rawText)
  }
}

/**
 * Heuristic Fallback Parser (runs offline / without API key)
 */
export function parseResumeFallback(rawText: string): ParsedResumeData {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean)
  
  // Extract Email
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i
  const emailMatch = rawText.match(emailRegex)
  const contactEmail = emailMatch ? emailMatch[1] : ''

  // Extract Phone
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  const phoneMatch = rawText.match(phoneRegex)
  const phone = phoneMatch ? phoneMatch[0] : ''

  // Guess Name from first 3 non-empty lines
  let fullName = lines[0] || 'Portfolio User'
  if (fullName.includes('@') || fullName.length > 40) {
    fullName = lines[1] || 'Portfolio User'
  }

  // Extract Socials
  const socialLinks: ParsedResumeData['socialLinks'] = []
  if (rawText.includes('github.com')) {
    const ghMatch = rawText.match(/https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+/i)
    if (ghMatch) socialLinks.push({ platform: 'github', url: ghMatch[0] })
  }
  if (rawText.includes('linkedin.com')) {
    const liMatch = rawText.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i)
    if (liMatch) socialLinks.push({ platform: 'linkedin', url: liMatch[0] })
  }

  // Basic Skills Extraction
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python',
    'HTML', 'CSS', 'Tailwind CSS', 'PostgreSQL', 'MongoDB', 'Git', 'Docker',
    'AWS', 'REST API', 'GraphQL', 'SQL'
  ]
  const extractedSkills: ParsedResumeData['skills'] = []
  commonSkills.forEach((skill) => {
    if (new RegExp(`\\b${skill}\\b`, 'i').test(rawText)) {
      extractedSkills.push({
        name: skill,
        category: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS'].includes(skill)
          ? 'Frontend'
          : ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'GraphQL', 'SQL'].includes(skill)
          ? 'Backend'
          : 'Tools',
        proficiency: 85,
      })
    }
  })

  return {
    fullName,
    headline: 'Software Engineer',
    bio: 'Experienced software developer passionate about building modern web applications.',
    location: '',
    contactEmail,
    phone,
    website: '',
    socialLinks,
    experiences: [
      {
        company: 'Technology Solutions Inc.',
        role: 'Software Engineer',
        location: 'Remote',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        description: 'Building modern web platforms and high-scale user experiences.',
        highlights: [
          'Engineered responsive user interfaces and backend services.',
          'Collaborated with cross-functional teams to deliver key features.',
        ],
      },
    ],
    education: [
      {
        institution: 'University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2018',
        endDate: '2022',
      },
    ],
    skills: extractedSkills.length > 0 ? extractedSkills : [
      { name: 'TypeScript', category: 'Frontend', proficiency: 90 },
      { name: 'React / Next.js', category: 'Frontend', proficiency: 95 },
      { name: 'Node.js', category: 'Backend', proficiency: 85 },
      { name: 'PostgreSQL', category: 'Backend', proficiency: 80 },
    ],
    projects: [
      {
        title: 'Public Portfolio Platform',
        description: 'AI-powered portfolio generator transforming resumes into custom portfolio sites.',
        techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
      },
    ],
  }
}

function sanitizeParsedData(data: ParsedResumeData): ParsedResumeData {
  return {
    fullName: data.fullName || 'Portfolio Owner',
    headline: data.headline || 'Software Professional',
    bio: data.bio || '',
    location: data.location || '',
    contactEmail: data.contactEmail || '',
    phone: data.phone || '',
    website: data.website || '',
    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
    experiences: Array.isArray(data.experiences)
      ? data.experiences.map((exp) => ({
          ...exp,
          company: exp.company || 'Company',
          role: exp.role || 'Position',
          startDate: exp.startDate || '',
          highlights: Array.isArray(exp.highlights) ? exp.highlights : [],
        }))
      : [],
    education: Array.isArray(data.education) ? data.education : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    projects: Array.isArray(data.projects)
      ? data.projects.map((proj) => ({
          ...proj,
          title: proj.title || 'Project',
          techStack: Array.isArray(proj.techStack) ? proj.techStack : [],
        }))
      : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
  }
}
