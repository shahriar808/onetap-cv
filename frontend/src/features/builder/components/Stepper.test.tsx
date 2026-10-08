import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { StepProgress, Stepper } from './Stepper'

describe('Stepper', () => {
  afterEach(cleanup)

  it('allows the user to jump freely between steps', () => {
    const onStepChange = vi.fn()
    render(<Stepper currentStep={0} onStepChange={onStepChange} />)

    fireEvent.click(
      screen.getByRole('button', { name: /Pick a design and download/ }),
    )
    expect(onStepChange).toHaveBeenCalledWith(3)
  })

  it('shows the compact mobile progress text and bar', () => {
    render(<StepProgress currentStep={1} />)

    expect(
      screen
        .getByText('Choose your sections')
        .closest('p')
        ?.textContent?.replace(/\s+/g, ' ')
        .trim(),
    ).toBe('Step 2 of 4 · Choose your sections')
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe(
      '2',
    )
  })
})
