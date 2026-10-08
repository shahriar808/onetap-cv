import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { BulletsEditor } from './BulletsEditor'

function Harness({ initial = [''] }: { initial?: string[] }) {
  const [bullets, setBullets] = useState(initial)
  return (
    <BulletsEditor
      label="Highlights"
      bullets={bullets}
      onChange={setBullets}
      max={2}
    />
  )
}

describe('BulletsEditor', () => {
  afterEach(cleanup)

  it('adds, edits and removes bullets', () => {
    render(<Harness />)
    fireEvent.change(screen.getByLabelText('Highlights 1'), {
      target: { value: 'Improved delivery time' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add bullet' }))

    const firstBullet = screen.getByLabelText('Highlights 1')
    const secondBullet = screen.getByLabelText('Highlights 2')
    const addButton = screen.getByRole('button', { name: 'Add bullet' })
    expect(firstBullet).toBeInstanceOf(HTMLTextAreaElement)
    expect(secondBullet).toBeInstanceOf(HTMLTextAreaElement)
    expect(screen.getByRole('button', { name: 'Remove highlights 1' }).textContent)
      .toBe('')
    expect((firstBullet as HTMLTextAreaElement).value).toBe(
      'Improved delivery time',
    )
    expect((secondBullet as HTMLTextAreaElement).value).toBe('')
    expect((addButton as HTMLButtonElement).disabled).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: 'Remove highlights 1' }))
    const remainingBullet = screen.getByLabelText('Highlights 1')
    expect((remainingBullet as HTMLTextAreaElement).value).toBe('')
  })

  it('shows a muted counter that becomes explicit at the limit', () => {
    render(<Harness initial={['a'.repeat(250)]} />)
    const counter = screen.getByText('250 / 300 characters')
    expect(counter.className).toContain('text-ink-muted')

    cleanup()
    render(<Harness initial={['a'.repeat(300)]} />)
    const limitCounter = screen.getByText(
      '300 / 300 characters — limit reached',
    )
    expect(limitCounter.className).toContain('text-danger')
  })
})
