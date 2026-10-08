import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Faq } from './Faq'

describe('Faq', () => {
  afterEach(cleanup)

  it('renders all eight native disclosure questions', () => {
    const { container } = render(<Faq />)

    expect(container.querySelectorAll('#faq details')).toHaveLength(8)
    expect(
      screen.getByText("Yes. There's no account, no paywall and no watermark."),
    ).not.toBeNull()
  })

  it('toggles answers through native summary activation', () => {
    render(<Faq />)
    const summary = screen.getByText('Is it really free?')
    const details = summary.closest('details')

    expect(details?.open).toBe(false)
    fireEvent.click(summary)
    expect(details?.open).toBe(true)
    fireEvent.click(summary)
    expect(details?.open).toBe(false)
  })
})
