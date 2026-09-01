import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPDF, parseResumeWithGemini } from '@/lib/parser/resume-parser'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No resume file uploaded.' }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload a PDF file.' },
        { status: 400 }
      )
    }

    // Convert file stream to in-memory Buffer (NO SERVER DISK STORAGE)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text in memory
    const rawText = await extractTextFromPDF(buffer)

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from the PDF. The file may be image-based or scanned.' },
        { status: 422 }
      )
    }

    // Parse text using Gemini AI (with dynamic fallback)
    const parsedData = await parseResumeWithGemini(rawText)

    return NextResponse.json({
      success: true,
      message: 'Resume parsed successfully in-memory.',
      data: parsedData,
    })
  } catch (error: any) {
    console.error('Error in /api/resume/parse:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred while parsing the resume.' },
      { status: 500 }
    )
  }
}
