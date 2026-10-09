import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const mergeClasses = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        'paper', 'paper-2', 'desk', 'ink', 'ink-soft', 'ink-muted', 'line',
        'accent', 'accent-ink', 'moss', 'danger',
      ],
      text: ['display-xl', 'display-lg', 'display-md', 'lead', 'small', 'label'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return mergeClasses(clsx(inputs))
}
