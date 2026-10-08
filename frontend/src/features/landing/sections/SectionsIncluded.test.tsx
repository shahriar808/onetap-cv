import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SECTION_REGISTRY } from '../../builder/sections/registry'
import { SectionsIncluded } from './SectionsIncluded'

describe('SectionsIncluded', () => {
  afterEach(cleanup)

  it('renders labels from the section registry and the contact note', () => {
    render(<SectionsIncluded />)
    const list = screen.getByRole('list', { name: 'Available CV sections' })

    expect(list.querySelectorAll('li')).toHaveLength(12)
    expect([...list.querySelectorAll('li')].map((item) => item.textContent)).toEqual(
      SECTION_REGISTRY.map((section) => section.label),
    )
    expect(screen.getByText('Contact details are always included.')).not.toBeNull()
  })
})
