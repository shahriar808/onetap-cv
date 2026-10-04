import { useId, useState } from 'react'

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
      <legend className="text-sm font-medium text-slate-800">{label}</legend>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1">
          <label htmlFor={`${id}-month`} className="text-xs text-slate-600">
            Month
          </label>
          <select
            id={`${id}-month`}
            value={month}
            disabled={disabled}
            onChange={(event) => {
              const selectedMonth = event.currentTarget.value
              onChange(year ? (selectedMonth ? `${year}-${selectedMonth}` : year) : '')
            }}
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:bg-slate-100"
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
          </select>
        </div>
        <div className="grid gap-1">
          <label htmlFor={`${id}-year`} className="text-xs text-slate-600">
            Year
          </label>
          <select
            id={`${id}-year`}
            value={year}
            disabled={disabled}
            onChange={(event) => {
              const selectedYear = event.currentTarget.value
              onChange(selectedYear ? (month ? `${selectedYear}-${month}` : selectedYear) : '')
            }}
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:bg-slate-100"
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
          </select>
        </div>
      </div>
    </fieldset>
  )
}
