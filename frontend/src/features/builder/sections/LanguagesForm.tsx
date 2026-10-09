import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { ListSection } from '../components/ListSection'

const PROFICIENCY_LEVELS = [
  'Native',
  'Fluent',
  'Proficient',
  'Intermediate',
  'Basic',
]

export function LanguagesForm() {
  return (
    <ListSection
      sectionId="languages"
      itemTitle={(item) => item.language || 'New language'}
      emptyItem={() => ({
        id: crypto.randomUUID(),
        language: '',
        proficiency: '',
      })}
      addLabel="language"
      renderItem={(item, update) => (
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Language"
            value={item.language}
            onChange={(event) =>
              update({ language: event.currentTarget.value })
            }
          />
          <Select
              label="Proficiency"
              id={`${item.id}-proficiency`}
              value={item.proficiency}
              onChange={(event) =>
                update({ proficiency: event.currentTarget.value })
              }
            >
              <option value="">Choose proficiency</option>
              {PROFICIENCY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
          </Select>
        </div>
      )}
    />
  )
}
