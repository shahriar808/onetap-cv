import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { defaultResume } from '../lib/defaults'
import { useResumeStore } from '../store/resumeStore'
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
})
