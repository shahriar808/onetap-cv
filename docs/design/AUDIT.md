# Frontend audit and baseline

## Stack and routing

- Tailwind CSS `^4.3.3`, loaded from `src/index.css` with `@import "tailwindcss"` and configured through the v4-compatible `@config "../tailwind.config.js"` directive.
- React 19, TypeScript, Vite, and React Router DOM 7.
- `src/App.tsx` uses `BrowserRouter`, `Routes`, and `Route`. `/` renders `HomePage`, `/build` renders `BuilderPage`, and the wildcard currently redirects to `/`.
- `BuilderPage` is currently imported eagerly. There is no shared site layout, privacy route, or 404 page yet.
- Global styles are in `src/index.css`; `src/App.css` still contains starter styles from the Vite scaffold.
- Baseline commit: `9aa2bbb` (`Keep CV builder workspace within viewport`).

## Existing UI component files

Files in `frontend/src/components/ui/`:

- `Button.tsx`
- `Card.tsx`
- `Dialog.tsx`
- `Input.tsx`
- `Textarea.tsx`
- `Toggle.tsx`
- `controls.test.tsx`
- `Dialog.test.tsx`
- `fields.test.tsx`

Public component props to preserve while restyling:

- `Button`: native button attributes, `variant` (`primary | secondary | danger | ghost`), `loading`, and required `children`. It forwards its ref.
- `Input`: native input attributes plus required `label`, optional `error` and `hint`.
- `Textarea`: native textarea attributes plus required `label`, optional `error` and `hint`.
- `Card`: native div attributes and required `children`.
- `Toggle`: `label`, optional `description`, `checked`, `onChange(checked)`, and optional `disabled`.
- `Dialog`: `open`, `title`, `message`, optional `confirmLabel` and `cancelLabel`, `onConfirm`, and `onCancel`.

## Pages

Files in `frontend/src/pages/`:

- `BuilderPage.tsx`
- `HomePage.tsx`

`HomePage` owns the current landing content and template loading. It reads the saved name from the resume store to choose the primary CTA label. `BuilderPage` owns the four-step flow, preview, mobile view switch, download action, server health state, and clear-data action.

## Builder component files

Files in `frontend/src/features/builder/components/`:

- `BulletsEditor.tsx`, `BulletsEditor.test.tsx`
- `BuilderLayout.tsx`
- `ClearDataButton.tsx`, `ClearDataButton.test.tsx`
- `DownloadButton.tsx`, `DownloadButton.test.tsx`
- `LinksEditor.tsx`, `LinksEditor.test.tsx`
- `ListSection.tsx`, `ListSection.test.tsx`
- `MobileBar.tsx`, `MobileBar.test.tsx`
- `MonthYearInput.tsx`, `MonthYearInput.test.tsx`
- `PreviewPane.tsx`, `PreviewPane.test.tsx`
- `SectionPicker.tsx`, `SectionPicker.test.tsx`
- `Stepper.tsx`, `Stepper.test.tsx`
- `TemplatePicker.tsx`, `TemplatePicker.test.tsx`

Builder forms are in `frontend/src/features/builder/sections/`; section definitions are in `registry.ts`.

## Tests that assert rendered UI

Visible labels, button names, roles, or rendered text are asserted in:

- `src/components/ui/controls.test.tsx`
- `src/components/ui/Dialog.test.tsx`
- `src/components/ui/fields.test.tsx`
- `src/components/ErrorBoundary.test.tsx`
- `src/features/builder/components/BulletsEditor.test.tsx`
- `src/features/builder/components/ClearDataButton.test.tsx`
- `src/features/builder/components/DownloadButton.test.tsx`
- `src/features/builder/components/LinksEditor.test.tsx`
- `src/features/builder/components/ListSection.test.tsx`
- `src/features/builder/components/MobileBar.test.tsx`
- `src/features/builder/components/MonthYearInput.test.tsx`
- `src/features/builder/components/PreviewPane.test.tsx`
- `src/features/builder/components/SectionPicker.test.tsx`
- `src/features/builder/components/Stepper.test.tsx`
- `src/features/builder/components/TemplatePicker.test.tsx`
- `src/features/builder/sections/CertificationsAchievementsForm.test.tsx`
- `src/features/builder/sections/ContactForm.test.tsx`
- `src/features/builder/sections/EducationForm.test.tsx`
- `src/features/builder/sections/ExperienceForm.test.tsx`
- `src/features/builder/sections/ProjectsForm.test.tsx`
- `src/features/builder/sections/RemainingForms.test.tsx`
- `src/features/builder/sections/SkillsForm.test.tsx`
- `src/features/builder/sections/SummaryInterestsForm.test.tsx`

## Baseline verification

Captured in `baseline/` at 360px and 1280px: the landing page and all four builder steps.

Mobile Lighthouse baseline using Edge and Lighthouse 13.5.0 on the local Vite server:

| Route | Performance | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|---:|
| `/` | 55 | 100 | 96 | 100 |
| `/build` | 55 | 100 | 96 | 100 |

Frontend baseline: `npm test -- --run` passed (61 tests), `npm run build` passed, and `npm run lint` passed.

Backend baseline: `pytest -q` could not collect `tests/test_api.py` in this Windows environment. Importing WeasyPrint reached a FontTools native extension that Windows Application Control blocked (`DLL load failed while importing bezierTools`). No backend source was changed during the audit.
