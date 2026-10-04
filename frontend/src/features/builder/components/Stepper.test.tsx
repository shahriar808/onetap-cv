import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Stepper } from './Stepper'

describe('Stepper', () => {
  afterEach(cleanup)

  it('allows the user to jump freely between steps', () => {
    const onStepChange = vi.fn()
    render(<Stepper currentStep={0} onStepChange={onStepChange} />)

    fireEvent.click(
      screen.getByRole('button', { name: /Template & Download/ }),
    )
    expect(onStepChange).toHaveBeenCalledWith(3)
  })
})
