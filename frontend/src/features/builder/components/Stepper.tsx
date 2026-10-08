const BUILDER_STEPS = [
  'Contact details',
  'Choose your sections',
  'Add your details',
  'Pick a design and download',
] as const

interface StepProgressProps {
  currentStep: number
}

export function StepProgress({ currentStep }: StepProgressProps) {
  const progress = ((currentStep + 1) / BUILDER_STEPS.length) * 100

  return (
    <div className="grid gap-2 lg:hidden">
      <p className="text-sm font-medium text-ink">
        <span className="font-mono text-ink-muted">
          Step {currentStep + 1} of {BUILDER_STEPS.length}
        </span>
        <span aria-hidden="true"> · </span>
        {BUILDER_STEPS[currentStep]}
      </p>
      <div
        role="progressbar"
        aria-label="Builder progress"
        aria-valuemin={1}
        aria-valuemax={BUILDER_STEPS.length}
        aria-valuenow={currentStep + 1}
        className="h-1 overflow-hidden rounded-full bg-line"
      >
        <span
          aria-hidden="true"
          className="block h-full rounded-full bg-accent transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

interface StepperProps {
  currentStep: number
  onStepChange: (step: number) => void
}

export function Stepper({ currentStep, onStepChange }: StepperProps) {
  const completedLineWidth =
    (currentStep / (BUILDER_STEPS.length - 1)) * 75

  return (
    <nav aria-label="CV builder steps" className="hidden lg:block">
      <ol className="relative grid grid-cols-4">
        <span
          aria-hidden="true"
          className="absolute left-[12.5%] right-[12.5%] top-4 h-px bg-line"
        />
        <span
          aria-hidden="true"
          className="absolute left-[12.5%] top-4 h-0.5 bg-accent transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${completedLineWidth}%` }}
        />
        {BUILDER_STEPS.map((label, index) => (
          <li key={label} className="relative z-10">
            <button
              type="button"
              aria-current={index === currentStep ? 'step' : undefined}
              onClick={() => onStepChange(index)}
              className="grid min-h-16 w-full justify-items-center gap-2 rounded-lg px-2 py-1 text-center text-sm text-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span
                aria-hidden="true"
                className={`grid size-8 place-items-center rounded-full border bg-paper text-xs ${
                  index === currentStep
                    ? 'border-accent font-semibold text-ink ring-4 ring-accent/10'
                    : index < currentStep
                      ? 'border-moss bg-moss font-semibold text-white'
                      : 'border-line text-ink-muted'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </span>
              <span
                className={
                  index === currentStep ? 'font-semibold text-ink' : ''
                }
              >
                {label}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
