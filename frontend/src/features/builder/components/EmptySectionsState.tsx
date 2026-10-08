import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'

interface EmptySectionsStateProps {
  onChooseSections: () => void
}

export function EmptySectionsState({
  onChooseSections,
}: EmptySectionsStateProps) {
  return (
    <Card className="grid justify-items-start gap-4 border-dashed">
      <div
        aria-hidden="true"
        className="grid aspect-[4/3] w-28 content-start gap-2 rounded-sm border-2 border-dashed border-line bg-paper p-3"
      >
        <span className="h-2 w-3/5 rounded bg-paper-2" />
        <span className="h-1.5 w-full rounded bg-paper-2" />
        <span className="h-1.5 w-4/5 rounded bg-paper-2" />
        <span className="mt-2 h-1.5 w-full rounded bg-paper-2" />
        <span className="h-1.5 w-2/3 rounded bg-paper-2" />
      </div>
      <div className="grid gap-1">
        <h3 className="font-display text-lg font-semibold text-ink">
          No optional sections yet
        </h3>
        <p className="text-sm text-ink-soft">
          Add a section to start filling in your experience.
        </p>
      </div>
      <Button variant="secondary" onClick={onChooseSections}>
        Go to Sections to add some
      </Button>
    </Card>
  )
}
