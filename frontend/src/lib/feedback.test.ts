import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from './api'
import { sendFeedback, type FeedbackPayload } from './feedback'

const payload: FeedbackPayload = {
  type: 'idea',
  message: 'Please add more templates.',
  name: 'Taylor',
  email: 'taylor@example.com',
  website: '',
  elapsed_ms: 8421,
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('sendFeedback', () => {
  it('posts the feedback payload to the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(sendFeedback(payload)).resolves.toBeUndefined()

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/feedback',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
    )
  })

  it('uses a specific friendly message for rate limits', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 429 })),
    )

    await expect(sendFeedback(payload)).rejects.toMatchObject({
      name: 'ApiError',
      status: 429,
      message: 'Too many messages for now. Please try again later.',
    })
  })

  it('uses the feedback fallback message for server and network failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 503 })),
    )

    await expect(sendFeedback(payload)).rejects.toMatchObject({
      status: 503,
      message: "That didn't send. Please try again, or email me directly.",
    })

    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Network unavailable')),
    )

    await expect(sendFeedback(payload)).rejects.toBeInstanceOf(ApiError)
    await expect(sendFeedback(payload)).rejects.toMatchObject({
      status: 0,
      message: "That didn't send. Please try again, or email me directly.",
    })
  })
})
