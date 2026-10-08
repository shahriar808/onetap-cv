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
          <div className="grid items-start gap-4 md:grid-cols-2">
            <MonthYearInput
              label="Start date"
              value={item.start}
              onChange={(start) => update({ start })}
            />
            <div className="grid content-start gap-2">
              <MonthYearInput
                label="End date"
                value={item.end}
                disabled={item.is_current}
                onChange={(end) => update({ end })}
              />
              <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={item.is_current}
                  onChange={(event) =>
                    update({
                      is_current: event.currentTarget.checked,
                      ...(event.currentTarget.checked ? { end: '' } : {}),
                    })
                  }
                  className="size-5 rounded border-line accent-ink"
                />
                Present
              </label>
            </div>
          </div>
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
          <p className="flex items-center gap-2 rounded-md bg-paper-2 px-3 py-2 text-sm text-ink-soft">
            <span className="font-mono text-xs font-semibold tracking-wide text-ink-muted">
              TIP
            </span>
            <span>Add numbers where possible (users, speed, time saved).</span>
          </p>
        </div>
      )}
    />
  )
}
