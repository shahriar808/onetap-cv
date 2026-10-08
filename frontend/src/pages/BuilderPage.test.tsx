import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { defaultResume } from '../lib/defaults'
import { useResumeStore } from '../store/resumeStore'
import { getHealth } from '../lib/api'
import { BuilderPage } from './BuilderPage'

vi.mock('../lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/api')>()
  return {
    ...actual,
    getHealth: vi.fn().mockResolvedValue({ status: 'down' }),
  }
})

function LocationProbe() {
  const location = useLocation()
  return (
    <output data-testid="location">
      {location.pathname}
      {location.search}
    </output>
  )
}

function renderBuilder(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocationProbe />
      <Routes>
        <Route path="/build" element={<BuilderPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('BuilderPage template query', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
    vi.mocked(getHealth).mockClear().mockResolvedValue({ status: 'down' })
  })

  afterEach(cleanup)

  it('selects a valid template and removes only that query parameter', async () => {
    renderBuilder('/build?template=compact&source=designs')

    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).toBe(
        '/build?source=designs',
      ),
    )
    expect(useResumeStore.getState().selectedTemplate).toBe('compact')
  })

  it('ignores an invalid template and removes the invalid parameter', async () => {
    renderBuilder('/build?template=unknown')

    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).toBe('/build'),
    )
    expect(useResumeStore.getState().selectedTemplate).toBe('modern')
  })

  it('shows a slim retry banner immediately below the app bar when offline', async () => {
    renderBuilder('/build')

    const message = await screen.findByText(
      "Can't reach the server. Preview and download are unavailable.",
    )
    const alert = message.closest('[role="alert"]')
    expect(alert).not.toBeNull()
    expect(alert?.textContent).toContain(
      "Can't reach the server. Preview and download are unavailable.",
    )
    expect(alert?.className).toContain('py-2')
    expect(alert?.previousElementSibling?.tagName).toBe('HEADER')

    fireEvent.click(screen.getByRole('button', { name: 'Retry connection' }))
    await waitFor(() => expect(vi.mocked(getHealth).mock.calls.length).toBeGreaterThan(1))
  })
})
