import { z } from 'zod'
import type { ResumeData } from '../types/resume'
import type { TemplateId } from './defaults'

export const API_BASE = import.meta.env.VITE_API_URL ?? ''

const templateSchema = z.object({
  id: z.enum(['classic', 'modern', 'compact']),
  name: z.string(),
  description: z.string(),
  best_for: z.string(),
})

export type TemplateMetadata = z.infer<typeof templateSchema>

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function errorMessage(status: number): string {
  if (status === 413) {
    return 'This resume is too large to process. Please shorten some sections.'
  }
  if (status === 422) {
    return 'Some resume details could not be processed. Please review your information.'
  }
  if (status === 429) {
    return 'Too many requests, please wait a minute.'
  }
  if (status >= 500) {
    return 'The server could not process your request. Please try again.'
  }
  return `The request failed (${status}). Please try again.`
}

async function checkResponse(response: Response): Promise<Response> {
  if (!response.ok) {
    throw new ApiError(errorMessage(response.status), response.status)
  }
  return response
}

function resumeUrl(path: string, template: TemplateId): string {
  return `${API_BASE}/api/resume/${path}?template=${encodeURIComponent(template)}`
}

export async function getHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE}/api/health`)

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`)
  }

  const result: unknown = await response.json()

  if (
    typeof result !== 'object' ||
    result === null ||
    !('status' in result) ||
    typeof result.status !== 'string'
  ) {
    throw new Error('Health check returned an invalid response')
  }

  return { status: result.status }
}

export async function getTemplates(): Promise<TemplateMetadata[]> {
  const response = await checkResponse(await fetch(`${API_BASE}/api/templates`))
  const result: unknown = await response.json()
  return z.array(templateSchema).parse(result)
}

export async function fetchPreview(
  data: ResumeData,
  template: TemplateId,
  signal: AbortSignal,
): Promise<string> {
  const response = await checkResponse(
    await fetch(resumeUrl('preview', template), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal,
    }),
  )
  return response.text()
}

export async function fetchPdf(
  data: ResumeData,
  template: TemplateId,
): Promise<{ blob: Blob; filename: string }> {
  const response = await checkResponse(
    await fetch(resumeUrl('pdf', template), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  )
  const disposition = response.headers.get('Content-Disposition') ?? ''
  const encodedFilename = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1]
  const plainFilename = disposition.match(/filename="?([^";]+)"?/i)?.[1]
  const filename = encodedFilename
    ? decodeURIComponent(encodedFilename)
    : (plainFilename ?? 'Resume.pdf')

  return { blob: await response.blob(), filename }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  try {
    anchor.click()
  } finally {
    anchor.remove()
    URL.revokeObjectURL(url)
  }
}
