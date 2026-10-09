import { Input } from '../../../components/ui/Input'
import { useResumeStore } from '../../../store/resumeStore'

function parseInterests(value: string): string[] {
  return value
    .split(',')
    .map((interest) => interest.trim())
    .filter(Boolean)
}

export function InterestsForm() {
  const interests = useResumeStore((state) => state.data.interests)
  const updateSingle = useResumeStore((state) => state.updateSingle)
  const value = interests.items.join(', ')

  return (
    <section className="grid gap-4">
      <Input
        label="Interests"
        value={value}
        hint="Separate each interest with a comma."
        onChange={(event) =>
          updateSingle('interests', {
            items: parseInterests(event.currentTarget.value),
          })
        }
      />
      {interests.items.length > 0 && (
        <p className="text-sm text-ink-soft" aria-live="polite">
          Preview: {interests.items.join(' · ')}
        </p>
      )}
    </section>
  )
}
