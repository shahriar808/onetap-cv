import { Input } from '../../../components/ui/Input'
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
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Language"
            value={item.language}
            onChange={(event) =>
              update({ language: event.currentTarget.value })
            }
          />
          <div className="grid gap-1.5">
            <label
              htmlFor={`${item.id}-proficiency`}
              className="text-sm font-medium text-slate-800"
            >
              Proficiency
            </label>
            <select
              id={`${item.id}-proficiency`}
              value={item.proficiency}
              onChange={(event) =>
                update({ proficiency: event.currentTarget.value })
              }
              className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              <option value="">Choose proficiency</option>
              {PROFICIENCY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    />
  )
}
