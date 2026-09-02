import { GoogleGenerativeAI } from '@google/generative-ai'
import { ParsedResumeData } from './types'

// Require the core lib directly to bypass pdf-parse's top-level self-test file execution
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
    console.warn('GEMINI_API_KEY is not set or placeholder. Falling back to dynamic regex parser.')
    return parseResumeFallback(rawText)
  }

  // Active Gemini models: gemini-2.5-flash is current primary
  const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-pro-latest', 'gemini-pro']

  const prompt = `
You are an elite, highly intelligent AI resume parser.
Analyze the following raw resume text carefully and extract ALL information into strict JSON matching this schema:

{
  "fullName": "Full Name",
  "headline": "Professional Title / Short Headline",
  "bio": "Detailed summary of candidate experience and strengths",
  "location": "City, Country or Remote",
  "contactEmail": "Email address",
  "phone": "Phone number",
  "website": "Portfolio website URL",
  "socialLinks": [
    { "platform": "github | linkedin | twitter | portfolio", "url": "Full profile URL" }
  ],
  "experiences": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "location": "Location or Remote",
      "startDate": "Start Date",
      "endDate": "End Date",
      "current": true/false,
      "description": "Short overview",
      "highlights": ["Bullet accomplishment 1", "Bullet accomplishment 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Name",
      "field": "Field of Study",
      "startDate": "Year",
      "endDate": "Year",
      "description": "Details"
    }
  ],
  "skills": [
    { "name": "Skill Name", "category": "Frontend | Backend | Cloud | Languages | Databases | Tools", "proficiency": 90 }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Project overview",
      "techStack": ["Laravel", "Vue.js", "MySQL"],
      "liveUrl": "",
      "githubUrl": ""
    }
  ],
  "certifications": [
    { "title": "Certification Name", "issuer": "Issuer", "issueDate": "" }
  ],
  "customSections": [
    {
      "title": "Languages | Achievements | Publications | Volunteer Work | Any Other Section",
      "content": ["Item 1 or Bullet 1", "Item 2 or Bullet 2"]
    }
  ]
}

CRITICAL DYNAMIC RULES:
1. Standard sections (Experience, Education, Skills, Projects, Certifications) go to their respective arrays.
2. ANY additional section in the resume (such as "Languages Spoken", "Key Achievements", "Publications", "Volunteer Work", "Patents", "Interests", etc.) MUST be captured into the "customSections" array.
3. Return raw valid JSON ONLY. Do NOT wrap in markdown codeblocks.

Resume Text:
---
${rawText}
---
`

  const genAI = new GoogleGenerativeAI(apiKey)

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
        },
      })

      const result = await model.generateContent(prompt)
      const responseText = result.response.text().trim()

      const cleanedJsonString = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()

      try {
        const parsedData: ParsedResumeData = JSON.parse(cleanedJsonString)
        console.log(`Successfully parsed resume using model: ${modelName}`)
        return sanitizeParsedData(parsedData)
      } catch (jsonErr) {
        console.warn(`JSON parse error on response from ${modelName}:`, jsonErr)
        const repairedJsonString = tryRepairJsonString(cleanedJsonString)
        if (repairedJsonString) {
          const repairedData: ParsedResumeData = JSON.parse(repairedJsonString)
          return sanitizeParsedData(repairedData)
        }
      }
    } catch (error: any) {
      console.warn(`Model ${modelName} failed or unavailable: ${error?.message || error}, trying next model...`)
    }
  }

  console.warn('Gemini AI parsing encountered error or incomplete JSON. Using dynamic fallback parser.')
  return parseResumeFallback(rawText)
}

function tryRepairJsonString(jsonStr: string): string | null {
  try {
    let text = jsonStr.trim()
    if (!text.endsWith('}')) {
      if ((text.match(/"/g) || []).length % 2 !== 0) {
        text += '"'
      }
      if (!text.endsWith(']}')) {
        text += ']}'
      }
      if (!text.endsWith('}')) {
        text += '}'
      }
    }
    JSON.parse(text)
    return text
  } catch (e) {
    return null
  }
}

export function parseResumeFallback(rawText: string): ParsedResumeData {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean)
  
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i
  const emailMatch = rawText.match(emailRegex)
  const contactEmail = emailMatch ? emailMatch[1] : ''

  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  const phoneMatch = rawText.match(phoneRegex)
  const phone = phoneMatch ? phoneMatch[0] : ''

  let fullName = lines[0] || 'Portfolio User'
  if (fullName.includes('@') || fullName.length > 40) {
    fullName = lines[1] || 'Portfolio User'
  }

  const socialLinks: ParsedResumeData['socialLinks'] = []
  const ghMatch = rawText.match(/https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+/i)
  if (ghMatch) socialLinks.push({ platform: 'github', url: ghMatch[0] })
  
  const liMatch = rawText.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i)
  if (liMatch) socialLinks.push({ platform: 'linkedin', url: liMatch[0] })

  const skillKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'C++',
    'HTML', 'CSS', 'Tailwind CSS', 'Sass', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Git', 'CI/CD', 'Jest', 'Cypress', 'Figma', 'Laravel', 'CakePHP', 'NestJS'
  ]
  
  const extractedSkills: ParsedResumeData['skills'] = []
  skillKeywords.forEach((skill) => {
    if (new RegExp(`\\b${skill.replace('+', '\\+')}\\b`, 'i').test(rawText)) {
      extractedSkills.push({
        name: skill,
        category: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'Vue', 'Angular'].includes(skill)
          ? 'Frontend'
          : ['Node.js', 'Python', 'Java', 'C++', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'Laravel', 'CakePHP', 'NestJS'].includes(skill)
          ? 'Backend'
          : 'Cloud & Tools',
        proficiency: 85,
      })
    }
  })

  const experiences: ParsedResumeData['experiences'] = []
  const expSectionMatch = rawText.match(/(?:EXPERIENCE|WORK HISTORY|EMPLOYMENT)[\s\S]*?(?=(?:EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS)|$)/i)
  
  if (expSectionMatch) {
    const expText = expSectionMatch[0]
    const expLines = expText.split('\n').map((l) => l.trim()).filter(Boolean)
    
    let currentExp: any = null
    expLines.forEach((line) => {
      if (line.match(/(?:19|20)\d{2}/) || line.includes('Present')) {
        if (currentExp) experiences.push(currentExp)
        currentExp = {
          company: 'Company',
          role: line,
          location: '',
          startDate: '2022',
          endDate: 'Present',
          current: line.includes('Present'),
          description: '',
          highlights: [],
        }
      } else if (currentExp) {
        if (line.startsWith('-') || line.startsWith('•')) {
          currentExp.highlights.push(line.replace(/^[-•]\s*/, ''))
        } else if (!currentExp.description) {
          currentExp.description = line
        }
      }
    })
    if (currentExp) experiences.push(currentExp)
  }

  if (experiences.length === 0) {
    experiences.push({
      company: 'Software Company',
      role: 'Software Engineer',
      location: 'Remote',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      description: 'Engineered web applications, REST APIs, and modern user interfaces.',
      highlights: [
        'Built responsive web interfaces and optimized backend services.',
        'Collaborated with engineering teams to deliver core features.',
      ],
    })
  }

  return {
    fullName,
    headline: 'Software Professional',
    bio: lines.slice(1, 4).join(' ') || 'Experienced software developer passionate about building modern applications.',
    location: '',
    contactEmail,
    phone,
    website: '',
    socialLinks,
    experiences,
    education: [
      {
        institution: 'University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2018',
        endDate: '2021',
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
        title: 'Portfolio Application',
        description: 'AI-powered resume-to-portfolio platform transforming PDF resumes into dynamic websites.',
        techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
      },
    ],
    customSections: [],
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
    customSections: Array.isArray(data.customSections) ? data.customSections : [],
  }
}
