import { Textarea } from '../../../components/ui/Textarea'
import { useResumeStore } from '../../../store/resumeStore'

export function SummaryForm() {
  const summary = useResumeStore((state) => state.data.summary)
  const updateSingle = useResumeStore((state) => state.updateSingle)

  return (
    <section className="grid gap-4">
      <Textarea
        label="Professional summary"
        value={summary.text}
        maxLength={600}
        onChange={(event) =>
          updateSingle('summary', { text: event.currentTarget.value })
        }
      />
    </section>
  )
}
