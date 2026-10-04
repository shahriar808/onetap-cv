import { Input } from '../../../components/ui/Input'
import { BulletsEditor } from '../components/BulletsEditor'
import { ListSection } from '../components/ListSection'
import { MonthYearInput } from '../components/MonthYearInput'

export function ExperienceForm() {
  return (
    <ListSection
      sectionId="experience"
      itemTitle={(item) =>
        item.position && item.company
          ? `${item.position} at ${item.company}`
          : item.position || item.company || 'New experience'
      }
      emptyItem={() => ({
        id: crypto.randomUUID(),
        company: '',
        position: '',
        location: '',
        start: '',
        end: '',
        is_current: false,
        summary: '',
        bullets: [],
      })}
      addLabel="experience"
      renderItem={(item, update) => (
        <div className="grid gap-4">
          <Input
            label="Position"
            value={item.position}
            onChange={(event) =>
              update({ position: event.currentTarget.value })
            }
          />
          <Input
            label="Company"
            value={item.company}
            onChange={(event) =>
              update({ company: event.currentTarget.value })
            }
          />
          <Input
            label="Location"
            value={item.location}
            onChange={(event) =>
              update({ location: event.currentTarget.value })
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <MonthYearInput
              label="Start date"
              value={item.start}
              onChange={(start) => update({ start })}
            />
            <MonthYearInput
              label="End date"
              value={item.end}
              disabled={item.is_current}
              onChange={(end) => update({ end })}
            />
          </div>
          <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-slate-800">
            <input
              type="checkbox"
              checked={item.is_current}
              onChange={(event) =>
                update({
                  is_current: event.currentTarget.checked,
                  ...(event.currentTarget.checked ? { end: '' } : {}),
                })
              }
              className="h-5 w-5 rounded border-slate-300 accent-blue-700"
            />
            I currently work here
          </label>
          <Input
            label="Summary"
            value={item.summary}
            maxLength={300}
            onChange={(event) =>
              update({ summary: event.currentTarget.value })
            }
          />
          <BulletsEditor
            label="Highlights"
            bullets={item.bullets}
            onChange={(bullets) => update({ bullets })}
            max={15}
            maxLength={300}
          />
          <p className="-mt-2 text-sm text-slate-600">
            Add numbers where possible (users, speed, time saved).
          </p>
        </div>
      )}
    />
  )
}
