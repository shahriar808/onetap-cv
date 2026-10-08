import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Badge } from './Badge'
import { Chip } from './Chip'
import { Eyebrow } from './Eyebrow'
import { SectionHeader } from './SectionHeader'

describe('editorial UI primitives', () => {
  afterEach(cleanup)

  it('renders a numbered section header and lead', () => {
    render(
      <SectionHeader
        index={1}
        label="How it works"
        title="Three steps. No account."
        lead="A short introduction."
      />,
    )

    expect(screen.getByText('01 / How it works')).not.toBeNull()
    expect(
      screen.getByRole('heading', { name: 'Three steps. No account.' }),
    ).not.toBeNull()
    expect(screen.getByText('A short introduction.')).not.toBeNull()
  })

  it('renders badge, chip, and eyebrow text', () => {
    render(
      <>
        <Badge variant="moss">Ready</Badge>
        <Chip>Education</Chip>
        <Eyebrow>Contact</Eyebrow>
      </>,
    )

    expect(screen.getByText('Ready')).not.toBeNull()
    expect(screen.getByText('Education')).not.toBeNull()
    expect(screen.getByText('Contact')).not.toBeNull()
  })
})
