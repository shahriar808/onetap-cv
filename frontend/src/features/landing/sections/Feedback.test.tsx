import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Feedback } from './Feedback'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Feedback', () => {
  it('shows a message error on blur and does not submit invalid content', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    render(<Feedback />)
    const message = screen.getByLabelText(/Message/)

    fireEvent.change(message, { target: { value: 'Too short' } })
    fireEvent.blur(message)

    expect(screen.getByRole('alert').textContent).toBe(
      'Please enter at least 10 characters.',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Send feedback' }))

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows success and sends an empty honeypot with elapsed time', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('{"ok":true}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    render(<Feedback />)

    fireEvent.change(screen.getByLabelText(/Message/), {
      target: { value: 'Please add more templates.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send feedback' }))

    expect(await screen.findByText('Thanks, got it.')).not.toBeNull()
    const request = fetchMock.mock.calls[0]?.[1]
    const payload = JSON.parse(String(request?.body)) as {
      website: string
      elapsed_ms: number
      message: string
    }
    expect(payload.website).toBe('')
    expect(typeof payload.elapsed_ms).toBe('number')
    expect(payload.message).toBe('Please add more templates.')
    expect(screen.getByRole('button', { name: 'Send another' })).not.toBeNull()
  })

  it('keeps entered values when the API is unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 503 })),
    )
    render(<Feedback />)
    const message = screen.getByLabelText(/Message/)
    const name = screen.getByLabelText('Name')

    fireEvent.change(message, {
      target: { value: 'Please add more templates.' },
    })
    fireEvent.change(name, { target: { value: 'Taylor Example' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send feedback' }))

    expect(
      await screen.findByText(
        "That didn't send. Please try again, or email me directly.",
      ),
    ).not.toBeNull()
    expect(message).toHaveProperty('value', 'Please add more templates.')
    expect(name).toHaveProperty('value', 'Taylor Example')
    expect(screen.getByRole('button', { name: 'Retry' })).not.toBeNull()
  })
})
