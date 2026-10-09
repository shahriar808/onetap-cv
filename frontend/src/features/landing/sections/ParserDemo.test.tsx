import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ParserDemo } from './ParserDemo'

describe('ParserDemo', () => {
  afterEach(cleanup)

  it('switches the extracted text with the tabs', () => {
    render(<ParserDemo />)
    const panel = screen.getByRole('tabpanel')

    expect(panel.textContent).toContain('SKILLS  EXPERIENCE')
    expect(panel.querySelector('pre')?.className).toContain('max-h-80')
    expect(
      screen.getByRole('tab', { name: 'Two-column layout' }).className,
    ).toContain('min-h-11')
    fireEvent.click(screen.getByRole('tab', { name: 'OneTap CV' }))
    expect(panel.textContent).toContain('SHAHRIAR HASAN')
    expect(panel.textContent).toContain('EXPERIENCE')
    expect(panel.textContent).not.toContain('SKILLS  EXPERIENCE')
    expect(panel.textContent).not.toMatch(/@|555|Ternary|Rahman|Software Engineer|Java|Python/)
  })

  it('supports arrow-key navigation between tabs', () => {
    render(<ParserDemo />)
    const twoColumnTab = screen.getByRole('tab', { name: 'Two-column layout' })
    const oneTapTab = screen.getByRole('tab', { name: 'OneTap CV' })

    twoColumnTab.focus()
    fireEvent.keyDown(twoColumnTab, { key: 'ArrowRight' })

    expect(oneTapTab.getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(oneTapTab)
    fireEvent.keyDown(oneTapTab, { key: 'ArrowLeft' })

    expect(twoColumnTab.getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(twoColumnTab)
  })
})
