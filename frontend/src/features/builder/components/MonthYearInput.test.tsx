import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MonthYearInput } from './MonthYearInput'

describe('MonthYearInput', () => {
  afterEach(cleanup)

  it('outputs a year alone or a year and month', () => {
    const onChange = vi.fn()
    render(
      <MonthYearInput label="Start date" value="" onChange={onChange} />,
    )

    fireEvent.change(screen.getByLabelText('Year'), {
      target: { value: '2024' },
    })
    expect(onChange).toHaveBeenLastCalledWith('2024')

    fireEvent.change(screen.getByLabelText('Month'), {
      target: { value: '03' },
    })
    expect(onChange).toHaveBeenLastCalledWith('')
  })

  it('outputs month only after receiving the selected year', () => {
    const onChange = vi.fn()
    const view = render(
      <MonthYearInput label="Start date" value="2024" onChange={onChange} />,
    )

    fireEvent.change(screen.getByLabelText('Month'), {
      target: { value: '03' },
    })
    expect(onChange).toHaveBeenCalledWith('2024-03')

    view.rerender(
      <MonthYearInput label="Start date" value="2024-03" onChange={onChange} />,
    )
    const monthSelect = screen.getByLabelText('Month')
    const yearSelect = screen.getByLabelText('Year')
    expect(monthSelect).toBeInstanceOf(HTMLSelectElement)
    expect(yearSelect).toBeInstanceOf(HTMLSelectElement)
    expect((monthSelect as HTMLSelectElement).value).toBe('03')
    expect((yearSelect as HTMLSelectElement).value).toBe('2024')

    fireEvent.change(screen.getByLabelText('Year'), {
      target: { value: '' },
    })
    expect(onChange).toHaveBeenLastCalledWith('')
  })
})
