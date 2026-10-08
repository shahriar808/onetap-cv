import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import * as Icons from './index'

describe('inline icon set', () => {
  afterEach(cleanup)

  it('renders every icon as decorative, non-focusable SVG', () => {
    const components = Object.values(Icons)
    const { container } = render(
      <>
        {components.map((Icon, index) => (
          <Icon key={index} />
        ))}
      </>,
    )
    const svgs = container.querySelectorAll('svg')

    expect(svgs).toHaveLength(17)
    for (const svg of svgs) {
      expect(svg.getAttribute('aria-hidden')).toBe('true')
      expect(svg.getAttribute('focusable')).toBe('false')
    }
  })
})
