import { useId, useState } from 'react'
import { Select } from '../../../components/ui/Select'

interface MonthYearInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function parseValue(value: string): { year: string; month: string } {
  const match = /^(\d{4})(?:-(\d{2}))?$/.exec(value)
  if (!match || (match[2] && (Number(match[2]) < 1 || Number(match[2]) > 12))) {
    return { year: '', month: '' }
  }
  return { year: match[1], month: match[2] ?? '' }
}

export function MonthYearInput({
  label,
  value,
  onChange,
  disabled = false,
}: MonthYearInputProps) {
  const id = useId()
  const { year, month } = parseValue(value)
  const [currentYear] = useState(() => new Date().getFullYear())

  return (
    <fieldset className="grid gap-1.5">
      <legend className="text-sm font-medium text-ink">{label}</legend>
      <div className="grid grid-cols-2 gap-3">
        <Select
            label="Month"
            id={`${id}-month`}
            value={month}
            disabled={disabled}
            onChange={(event) => {
              const selectedMonth = event.currentTarget.value
              onChange(year ? (selectedMonth ? `${year}-${selectedMonth}` : year) : '')
            }}
          >
            <option value="">Month</option>
            {MONTHS.map((monthName, index) => {
              const monthValue = String(index + 1).padStart(2, '0')
              return (
                <option key={monthValue} value={monthValue}>
                  {monthName}
                </option>
              )
            })}
        </Select>
        <Select
            label="Year"
            id={`${id}-year`}
            value={year}
            disabled={disabled}
            onChange={(event) => {
              const selectedYear = event.currentTarget.value
              onChange(selectedYear ? (month ? `${selectedYear}-${month}` : selectedYear) : '')
            }}
          >
            <option value="">Year</option>
            {Array.from({ length: currentYear + 2 - 1970 }, (_, index) => {
              const yearValue = String(currentYear + 1 - index)
              return (
                <option key={yearValue} value={yearValue}>
                  {yearValue}
                </option>
              )
            })}
        </Select>
      </div>
    </fieldset>
  )
}
