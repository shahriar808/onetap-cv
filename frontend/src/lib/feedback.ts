import { API_BASE, ApiError } from './api'

export const FEEDBACK_TYPES = [
  { value: 'idea', label: 'Idea' },
  { value: 'bug', label: 'Bug' },
  { value: 'compliment', label: 'Compliment' },
  { value: 'other', label: 'Other' },
] as const

export type FeedbackType = (typeof FEEDBACK_TYPES)[number]['value']

export interface FeedbackPayload {
  type: FeedbackType
  message: string
  name: string
  email: string
  website: string
  elapsed_ms: number
}

const FEEDBACK_ERROR =
  "That didn't send. Please try again, or email me directly."

export async function sendFeedback(payload: FeedbackPayload): Promise<void> {
  let response: Response

  try {
    response = await fetch(`${API_BASE}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new ApiError(FEEDBACK_ERROR, 0)
  }

  if (!response.ok) {
    const message =
      response.status === 429
        ? 'Too many messages for now. Please try again later.'
        : FEEDBACK_ERROR
    throw new ApiError(message, response.status)
  }
}
