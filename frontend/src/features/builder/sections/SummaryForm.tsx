import { Textarea } from '../../../components/ui/Textarea'
import { useResumeStore } from '../../../store/resumeStore'

export function SummaryForm() {
  const summary = useResumeStore((state) => state.data.summary)
  const updateSingle = useResumeStore((state) => state.updateSingle)

  return (
    <section className="grid gap-3">
      <Textarea
        label="Professional summary"
        value={summary.text}
        maxLength={600}
        hint={`${summary.text.length} / 600 characters`}
        onChange={(event) =>
          updateSingle('summary', { text: event.currentTarget.value })
        }
      />
    </section>
  )
}
