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
        primaryLabel="Next"
        onPrimaryAction={onPrimaryAction}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Preview' }))
    expect(onTabChange).toHaveBeenCalledWith('preview')
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(onPrimaryAction).toHaveBeenCalledOnce()
  })
})
