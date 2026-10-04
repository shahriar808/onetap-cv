import { Input } from '../../../components/ui/Input'
import { BulletsEditor } from '../components/BulletsEditor'
import { ListSection } from '../components/ListSection'
import { MonthYearInput } from '../components/MonthYearInput'

export function VolunteerForm() {
  return (
    <ListSection
      sectionId="volunteer"
      itemTitle={(item) =>
        item.role && item.organization
          ? `${item.role} at ${item.organization}`
          : item.role || item.organization || 'New volunteer experience'
      }
      emptyItem={() => ({
        id: crypto.randomUUID(),
        organization: '',
        role: '',
        start: '',
        end: '',
        bullets: [],
      })}
      addLabel="volunteer experience"
      renderItem={(item, update) => (
        <div className="grid gap-4">
          <Input
            label="Role"
            value={item.role}
            onChange={(event) => update({ role: event.currentTarget.value })}
          />
          <Input
            label="Organization"
            value={item.organization}
            onChange={(event) =>
              update({ organization: event.currentTarget.value })
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
              onChange={(end) => update({ end })}
            />
          </div>
          <BulletsEditor
            label="Highlights"
            bullets={item.bullets}
            onChange={(bullets) => update({ bullets })}
          />
        </div>
      )}
    />
  )
}
