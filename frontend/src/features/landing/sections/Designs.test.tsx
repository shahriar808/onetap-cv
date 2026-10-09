import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Designs } from './Designs'

describe('Designs', () => {
  afterEach(cleanup)

  it('links each safe design sample to its matching builder template', () => {
    render(
      <MemoryRouter>
        <Designs />
      </MemoryRouter>,
    )

    for (const template of ['classic', 'modern', 'compact']) {
      const link = screen.getByRole('link', { name: `Use ${template[0].toUpperCase()}${template.slice(1)}` })
      expect(link.getAttribute('href')).toBe(`/build?template=${template}`)
      expect(
        screen.getByRole('img', {
          name: new RegExp(`${template} CV design sample for Shahriar Hasan`, 'i'),
        }),
      ).not.toBeNull()
    }
  })
})
