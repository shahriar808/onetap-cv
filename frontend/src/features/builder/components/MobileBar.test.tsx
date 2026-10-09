import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MobileBar } from './MobileBar'

describe('MobileBar', () => {
  afterEach(cleanup)

  it('switches between edit and preview and triggers the primary action', () => {
    const onTabChange = vi.fn()
    const onPrimaryAction = vi.fn()
    render(
      <MobileBar
        activeTab="edit"
        onTabChange={onTabChange}
        previousDisabled={false}
        onPrevious={vi.fn()}
        primaryLabel="Next"
        onPrimaryAction={onPrimaryAction}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Preview' }))
    expect(onTabChange).toHaveBeenCalledWith('preview')
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(onPrimaryAction).toHaveBeenCalledOnce()
  })

  it('keeps Previous available in the fixed mobile controls', () => {
    const onPrevious = vi.fn()
    render(
      <MobileBar
        activeTab="edit"
        onTabChange={vi.fn()}
        previousDisabled={false}
        onPrevious={onPrevious}
        primaryLabel="Next"
        onPrimaryAction={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(onPrevious).toHaveBeenCalledOnce()
  })

  it('uses the paper-and-ink mobile bar with accessible touch targets', () => {
    render(
      <MobileBar
        activeTab="edit"
        onTabChange={vi.fn()}
        previousDisabled={false}
        onPrevious={vi.fn()}
        primaryLabel="Next"
        onPrimaryAction={vi.fn()}
      />,
    )

    const navigation = screen.getByRole('navigation', {
      name: 'Mobile builder controls',
    })
    expect(navigation.className).toContain('bg-paper')
    expect(navigation.className).toContain('border-line')
    expect(
      screen.getByRole('group', { name: 'Builder view' }).className,
    ).toContain('bg-paper-2')
    expect(screen.getByRole('button', { name: 'Next' }).className).toContain(
      '!min-h-12',
    )
    const backButton = screen.getByRole('button', { name: 'Back' })
    expect(backButton.className).toContain('bg-paper-2')
    expect(backButton.className).toContain('border-line')
  })
})
