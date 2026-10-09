import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
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
            <Select
                label="GPA label"
                id={`${item.id}-gpa-label`}
                value={item.gpa_label}
                onChange={(event) => {
                  const label = event.currentTarget.value
                  if (isGpaLabel(label)) {
                    update({ gpa_label: label })
                  }
                }}
              >
                <option value="GPA">GPA</option>
                <option value="CGPA">CGPA</option>
            </Select>
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
