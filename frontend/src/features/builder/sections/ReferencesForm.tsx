import { Input } from '../../../components/ui/Input'
import { ListSection } from '../components/ListSection'

export function ReferencesForm() {
  return (
    <ListSection
      sectionId="references"
      itemTitle={(item) => item.name || 'New reference'}
      emptyItem={() => ({
        id: crypto.randomUUID(),
        name: '',
        position: '',
        company: '',
        email: '',
        phone: '',
      })}
      addLabel="reference"
      renderItem={(item, update) => (
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Name"
            value={item.name}
            onChange={(event) => update({ name: event.currentTarget.value })}
          />
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
            label="Email"
            type="email"
            value={item.email}
            onChange={(event) => update({ email: event.currentTarget.value })}
          />
          <Input
            label="Phone"
            type="tel"
            value={item.phone}
            onChange={(event) => update({ phone: event.currentTarget.value })}
          />
        </div>
      )}
    />
  )
}
