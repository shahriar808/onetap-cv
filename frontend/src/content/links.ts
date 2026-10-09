export const LINKS = {
  instagram: {
    label: 'Instagram',
    handle: '@shahriarhasan808',
    url: 'https://www.instagram.com/shahriarhasan808/',
  },
  facebook: {
    label: 'Facebook',
    handle: 'ShahriarHasan808',
    url: 'https://www.facebook.com/ShahriarHasan808',
  },
  linkedin: {
    label: 'LinkedIn',
    handle: 'in/shahriarhasan808',
    url: 'https://www.linkedin.com/in/shahriarhasan808/',
  },
  github: {
    label: 'GitHub',
    handle: '@shahriar808',
    url: 'https://github.com/shahriar808',
  },
} as const

export const FEEDBACK_EMAIL = import.meta.env.VITE_FEEDBACK_EMAIL ?? ''
