# Design release QA

Checks recorded for the V1 fix pass on 2026-10-09. Automated browser checks use
Chromium and mock `/api/**`; backend integration behavior is covered separately
by pytest. Screenshots are in `docs/design/qa-shots/`.

## V1.1 follow-up — 2026-10-09

- [x] Frontend Vitest: 129 tests passed across 58 files.
- [x] Frontend Oxlint and production build passed.
- [x] Playwright: 5 tests passed at 360, 390, 768, and 1280px. The builder
  flow verified pointer based drag reordering with the six-dot handle, then
  changed the position with the accessible selector.
- [x] Reviewed the 360px full page screenshot: the How it works timeline is
  hidden on mobile and remains in place at desktop widths.
- [x] The section picker no longer displays `Core` badges.

## Mobile timeline follow-up — 2026-10-09

- [x] The How it works timeline pseudo-element is hidden below 1024px and shown
  at desktop widths; Playwright checks both breakpoint behaviors.
- [x] Refreshed the home screenshots at 360, 390, 768, and 1280px.

## Numbering and builder transition follow-up — 2026-10-09

- [x] Browser checks confirm the home page ends with `10 / Feedback` followed
  by `11 / Start`.
- [x] Playwright confirms the builder editor scrolls to the top when entering
  step 2 and when leaving it, after scrolling the prior step to the bottom.
- [x] Playwright confirms editor viewport width and heading alignment remain
  unchanged across steps 1, 2, and 3 at 360px, 390px, 768px, and 1280px.
- [x] Frontend build and Oxlint passed; the full Vitest and Playwright suites
  are recorded below.

## Automated

- [x] Frontend Vitest: 129 tests passed across 58 files.
- [x] Frontend lint: `npm run lint` passed.
- [x] Frontend build: `VITE_SITE_URL=https://example.com npm run build` passed.
  The generated `dist/index.html` contains absolute Open Graph, Twitter, and
  canonical URLs. The build also generated `sitemap.xml` and `robots.txt`.
- [x] Source `frontend/index.html` has no UTF-8 BOM.
- [x] Backend `pytest -q`: 118 tests passed. Pytest emitted a cache-directory
  permission warning; Starlette emitted an httpx deprecation warning.
- [x] Playwright: 5 tests passed at 360, 390, 768, and 1280px. The suite checks
  home, privacy, builder steps 1–4, horizontal overflow, contact field layout,
  feedback alignment, section reordering, active privacy navigation, completed
  step color, and step navigation surface color.
- [x] The builder and site screenshots were saved at all four widths.

## Browser measurements

- Contact form: 5 inputs measured at 360px and 1280px. Maximum vertical
  displacement after blurring an empty name field: **0px** at both widths.
- Feedback Name and Email fields: matched top positions and heights before and
  after blur at 768px and 1280px. Input height: **44px**.
- Footer height: **447px** at 360px, **427px** at 390px, **363px** at 768px,
  and **312px** at 1280px.

## Not run

- SMTP delivery, Reply-To, and live feedback throttling; no SMTP account was
  configured.
- PDF downloads through a live backend from the browser. PDF render and API
  behavior are covered by backend tests.
- Firefox, Safari, iOS Safari, a physical phone, keyboard-only and
  screen-reader review, reduced-motion review, and Lighthouse.
- Real-domain share preview validation. The example.com build only verifies the
  generated metadata; use the deployed domain in the LinkedIn/Facebook
  debuggers after deployment.
- Production deployment checks. `VITE_SITE_URL` remains unset in the source
  environment because the production domain has not been provided.
