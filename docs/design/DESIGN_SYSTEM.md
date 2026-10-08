# OneTap CV design system

The site uses the Paper & Ink direction: warm paper surfaces, dark ink text,
vermilion accents, hairline separators, and real CV pages as the main visuals.
The builder's three PDF templates and their CSS remain separate from the site
design system.

## Tokens and type

CSS tokens are defined in `frontend/src/index.css` and exposed through Tailwind:

- `paper #F6F1E7`, `paper-2 #EFE8DA`, and `desk #E4DCCB` for surfaces.
- `ink #17202A`, `ink-soft #4A5260`, and `ink-muted #5F6773` for text.
- `accent #C23B1E` for small highlights and focus; `moss #2F5D50` for success;
  `danger #9B1C1C` for errors.
- Fraunces for display headings, Instrument Sans for body/UI, and JetBrains Mono
  for labels. Fonts are self-hosted Latin variable files with swap behavior.
- Display sizes and lead text use CSS `clamp`; body copy starts at 16px.

The page container is capped at 1160px with 20px mobile and 32px desktop side
gutters. Controls use small radii, sheet imagery uses 3px corners, and paper
shadows are reserved for CV sheets. Inputs and buttons have 44px minimum height.

## Components and motion

- `SectionHeader` provides numbered editorial labels, a hairline, a display
  heading, and optional lead text.
- `Button`, `Input`, and `Textarea` are shared accessible controls. Inputs use
  16px text, explicit labels, and visible error descriptions.
- `Reveal` and `useReveal` reveal section headings once at 15% intersection.
  Reduced-motion preferences and browsers without `IntersectionObserver` show
  content immediately. The global reduced-motion rule removes transitions,
  animation, and transforms.
- Social rows, template cards, and buttons use brief hover movement. No motion
  repeats automatically.

## Anti-generated look checklist

- Uses paper, ink, neutral muted text, vermilion, and moss only for success.
- Uses three font families and no gradient text, blur cards, or glowing shadows.
- Uses real CV sheets and numbered editorial rows, not emoji icons or fake stats.
- Uses asymmetrical section layouts and hairline borders rather than repeated
  rounded icon cards.
- Keeps the product copy specific and avoids testimonials or invented claims.

## Adding a landing section

Add copy to `frontend/src/features/landing/content.ts`, create a section under
`frontend/src/features/landing/sections/`, and compose it in `LandingPage.tsx`.
Use `container-page`, `SectionHeader`, shared controls, semantic headings, and
44px tap targets. Add an anchor id when it is linked from navigation. Check the
layout at 360px and test keyboard focus and reduced motion.
