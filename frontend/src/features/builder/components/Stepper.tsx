const BUILDER_STEPS = [
  'Contact',
  'Sections',
  'Details',
  'Template & Download',
] as const

interface StepProgressProps {
  currentStep: number
}

export function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className="flex items-center justify-between lg:hidden">
      <p className="font-semibold text-slate-900">
        {BUILDER_STEPS[currentStep]}
      </p>
      <p className="text-sm text-slate-600">
        Step {currentStep + 1} of {BUILDER_STEPS.length}
      </p>
    </div>
  )
}

interface StepperProps {
  currentStep: number
  onStepChange: (step: number) => void
}

export function Stepper({ currentStep, onStepChange }: StepperProps) {
  return (
    <nav aria-label="CV builder steps" className="h-full">
      <p className="mb-4 hidden text-xs font-semibold uppercase tracking-wide text-slate-500 lg:block">
        Build your CV
      </p>
      <ol className="grid gap-2">
        {BUILDER_STEPS.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              aria-current={index === currentStep ? 'step' : undefined}
              onClick={() => onStepChange(index)}
              className={`flex min-h-12 w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 ${
                index === currentStep
                  ? 'border-blue-200 bg-blue-50 text-blue-900'
                  : 'border-transparent bg-transparent text-slate-700 hover:border-slate-200 hover:bg-white'
              }`}
            >
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full text-xs ${
                  index === currentStep
                    ? 'bg-blue-700 font-semibold text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {index + 1}
              </span>
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
