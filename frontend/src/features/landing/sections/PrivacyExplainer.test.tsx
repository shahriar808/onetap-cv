import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { LANDING_CONTENT } from '../content'
import { PrivacyExplainer } from './PrivacyExplainer'

describe('PrivacyExplainer', () => {
  afterEach(cleanup)

  it('renders the copy deck steps and links to the privacy policy', () => {
    render(
      <MemoryRouter>
        <PrivacyExplainer />
      </MemoryRouter>,
    )

    for (const step of LANDING_CONTENT.privacy.steps) {
      expect(screen.getByText(step.label)).not.toBeNull()
      expect(screen.getByText(step.title)).not.toBeNull()
      expect(screen.getByText(step.text)).not.toBeNull()
    }
    expect(screen.getByText('Not stored')).not.toBeNull()
    expect(screen.getByText(LANDING_CONTENT.privacy.footnote)).not.toBeNull()
    expect(
      screen.getByRole('link', { name: 'Read the privacy policy' }).getAttribute('href'),
    ).toBe('/privacy')
  })
})
