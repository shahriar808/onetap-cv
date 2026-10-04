import { Input } from '../../../components/ui/Input'
import { normalizeUrl } from '../../../lib/validation'
import { ListSection } from '../components/ListSection'
import { MonthYearInput } from '../components/MonthYearInput'

export function PublicationsForm() {
  return (
    <ListSection
      sectionId="publications"
      itemTitle={(item) => item.title || 'New publication'}
      emptyItem={() => ({
        id: crypto.randomUUID(),
        title: '',
        publisher: '',
        date: '',
        link: '',
      })}
      addLabel="publication"
      renderItem={(item, update) => (
        <div className="grid gap-4">
          <Input
            label="Title"
            value={item.title}
            onChange={(event) => update({ title: event.currentTarget.value })}
          />
          <Input
            label="Publisher"
            value={item.publisher}
            onChange={(event) =>
              update({ publisher: event.currentTarget.value })
            }
          />
          <MonthYearInput
            label="Date"
            value={item.date}
            onChange={(date) => update({ date })}
          />
          <Input
            label="Publication URL"
            inputMode="url"
            value={item.link}
            onChange={(event) => update({ link: event.currentTarget.value })}
            onBlur={() => update({ link: normalizeUrl(item.link) })}
          />
        </div>
      )}
    />
  )
}
