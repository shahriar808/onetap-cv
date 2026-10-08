import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ToastProvider } from '../../components/ui/ToastProvider'
import { LandingPage } from './LandingPage'

describe('LandingPage skeleton', () => {
  afterEach(cleanup)

  it('renders every planned landing-page anchor', () => {
    const { container } = render(
      <MemoryRouter>
        <ToastProvider>
          <LandingPage />
        </ToastProvider>
      </MemoryRouter>,
    )

    for (const id of [
      'top',
      'how',
      'see',
      'designs',
      'sections',
      'privacy',
      'faq',
      'thanks',
      'feedback',
    ]) {
      expect(container.querySelector(`#${id}`)).not.toBeNull()
    }
  })
})
