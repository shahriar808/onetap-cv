import { Input } from '../../../components/ui/Input'
import { ListSection } from '../components/ListSection'
import { MonthYearInput } from '../components/MonthYearInput'

export function AchievementsForm() {
  return (
    <ListSection
      sectionId="achievements"
      itemTitle={(item) => item.title || 'New achievement'}
      emptyItem={() => ({
        id: crypto.randomUUID(),
        title: '',
        description: '',
        date: '',
      })}
      addLabel="achievement"
      renderItem={(item, update) => (
        <div className="grid gap-4">
          <Input
            label="Achievement title"
            value={item.title}
            onChange={(event) => update({ title: event.currentTarget.value })}
          />
          <Input
            label="Description"
            value={item.description}
            onChange={(event) =>
              update({ description: event.currentTarget.value })
            }
          />
          <MonthYearInput
            label="Date (optional)"
            value={item.date}
            onChange={(date) => update({ date })}
          />
        </div>
      )}
    />
  )
}
