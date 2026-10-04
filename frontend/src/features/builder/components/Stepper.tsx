export const BUILDER_STEPS = [
  'Contact',
  'Sections',
  'Details',
  'Template & Download',
] as const

interface StepperProps {
  currentStep: number
  onStepChange: (step: number) => void
}

export function Stepper({ currentStep, onStepChange }: StepperProps) {
  return (
    <nav aria-label="CV builder steps">
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BUILDER_STEPS.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              aria-current={index === currentStep ? 'step' : undefined}
              onClick={() => onStepChange(index)}
              className={`min-h-11 w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 ${
                index === currentStep
                  ? 'border-blue-700 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="mr-2 text-xs text-slate-500">{index + 1}</span>
              {label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
