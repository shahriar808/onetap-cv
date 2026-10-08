import { Input } from '../../../components/ui/Input'
import { BulletsEditor } from '../components/BulletsEditor'
import { ListSection } from '../components/ListSection'
import { MonthYearInput } from '../components/MonthYearInput'

function isGpaLabel(value: string): value is 'GPA' | 'CGPA' {
  return value === 'GPA' || value === 'CGPA'
}

export function EducationForm() {
  return (
    <ListSection
      sectionId="education"
      itemTitle={(item) => item.institution || 'New education'}
      emptyItem={() => ({
        id: crypto.randomUUID(),
        institution: '',
        degree: '',
        field: '',
        location: '',
        start: '',
        end: '',
        gpa: '',
        gpa_label: 'GPA',
        details: [],
      })}
      addLabel="education"
      renderItem={(item, update) => (
        <div className="grid gap-4">
          <Input
            label="Institution"
            value={item.institution}
            onChange={(event) =>
              update({ institution: event.currentTarget.value })
            }
          />
          <Input
            label="Degree"
            value={item.degree}
            onChange={(event) => update({ degree: event.currentTarget.value })}
          />
          <Input
            label="Field of study"
            value={item.field}
            onChange={(event) => update({ field: event.currentTarget.value })}
          />
          <Input
            label="Location"
            value={item.location}
            onChange={(event) => update({ location: event.currentTarget.value })}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <MonthYearInput
              label="Start date"
              value={item.start}
              onChange={(start) => update({ start })}
            />
            <MonthYearInput
              label="End date"
              value={item.end}
              onChange={(end) => update({ end })}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_9rem]">
            <Input
              label="GPA"
              value={item.gpa}
              onChange={(event) => update({ gpa: event.currentTarget.value })}
            />
            <div className="grid gap-1.5">
              <label
                htmlFor={`${item.id}-gpa-label`}
                className="text-sm font-medium text-slate-800"
              >
                GPA label
              </label>
              <select
                id={`${item.id}-gpa-label`}
                value={item.gpa_label}
                onChange={(event) => {
                  const label = event.currentTarget.value
                  if (isGpaLabel(label)) {
                    update({ gpa_label: label })
                  }
                }}
                className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
              >
                <option value="GPA">GPA</option>
                <option value="CGPA">CGPA</option>
              </select>
            </div>
          </div>
          <BulletsEditor
            label="Additional details"
            bullets={item.details}
            onChange={(details) => update({ details })}
            max={10}
          />
        </div>
      )}
    />
  )
}
