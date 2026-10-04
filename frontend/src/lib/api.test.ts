import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, fetchPdf, fetchPreview, getTemplates } from './api'
import { defaultResume } from './defaults'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('API client', () => {
  it('loads and validates templates', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify([
            {
              id: 'modern',
              name: 'Modern',
              description: 'A modern template',
              best_for: 'Technology',
            },
          ]),
          { status: 200 },
        ),
      ),
    )

    await expect(getTemplates()).resolves.toMatchObject([
      { id: 'modern', name: 'Modern' },
    ])
  })

  it('parses the PDF filename from response headers', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(new Blob(['%PDF']), {
          status: 200,
          headers: {
            'Content-Disposition':
              'attachment; filename="Taylor_Example_Resume.pdf"',
          },
        }),
      ),
    )

    const result = await fetchPdf(defaultResume(), 'modern')

    expect(result.filename).toBe('Taylor_Example_Resume.pdf')
    expect(result.blob.size).toBeGreaterThan(0)
  })

  it('uses a friendly message for rate-limit responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 429 })),
    )

    await expect(fetchPdf(defaultResume(), 'modern')).rejects.toMatchObject({
      name: 'ApiError',
      status: 429,
      message: 'Too many requests, please wait a minute.',
    })
  })

  it('passes the abort signal to preview requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('<p>Preview</p>'))
    vi.stubGlobal('fetch', fetchMock)
    const controller = new AbortController()

    await fetchPreview(defaultResume(), 'modern', controller.signal)

    expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal)
  })

  it('throws ApiError for other API failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 413 })),
    )

    await expect(getTemplates()).rejects.toBeInstanceOf(ApiError)
  })
})
