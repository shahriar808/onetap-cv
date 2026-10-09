import { Input } from '../../../components/ui/Input'
import { normalizeUrl } from '../../../lib/validation'
import { ListSection } from '../components/ListSection'
import { MonthYearInput } from '../components/MonthYearInput'

export function CertificationsForm() {
  return (
    <ListSection
      sectionId="certifications"
      itemTitle={(item) => item.name || 'New certification'}
      emptyItem={() => ({
        id: crypto.randomUUID(),
        name: '',
        issuer: '',
        date: '',
        is_ongoing: false,
        link: '',
      })}
      addLabel="certification"
      renderItem={(item, update) => (
        <div className="grid gap-4">
          <Input
            label="Certification name"
            value={item.name}
            onChange={(event) => update({ name: event.currentTarget.value })}
          />
          <Input
            label="Issuer"
            value={item.issuer}
            onChange={(event) => update({ issuer: event.currentTarget.value })}
          />
          <MonthYearInput
            label="Date"
            value={item.date}
            disabled={item.is_ongoing}
            onChange={(date) => update({ date })}
          />
          <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={item.is_ongoing}
              onChange={(event) =>
                update({
                  is_ongoing: event.currentTarget.checked,
                  ...(event.currentTarget.checked ? { date: '' } : {}),
                })
              }
              className="h-5 w-5 rounded border-line accent-accent"
            />
            In progress / ongoing
          </label>
          <Input
            label="Credential URL"
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
