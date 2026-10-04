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
})
