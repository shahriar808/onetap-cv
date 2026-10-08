# Design release QA

This record describes checks performed in the current workspace. Automated
checks are repeatable; device, external-service, and Lighthouse checks require
the production environment and are not claimed here.

## Automated

- [x] Frontend Vitest suite after the current changes: 119 tests passed.
- [x] Frontend lint completed with no warnings.
- [x] Frontend production build passed. `BuilderPage` is emitted as a separate
  lazy chunk; landing code does not import builder page code.
- [x] Backend `pytest -q`: 118 tests passed. Pytest reported a cache-directory
  permission warning and a Starlette/httpx deprecation warning.

## Responsive, visual, and accessibility

- [ ] Verify `/`, `/build` steps, `/privacy`, and 404 at 360, 390, 768, and
  1280px, including no horizontal scroll.
- [ ] Verify all tap targets and input font sizes in browser devtools.
- [ ] Keyboard-only and screen-reader checks, including header menu, parser
  tabs, FAQ, feedback, builder navigation, and dialogs.
- [ ] Test reduced motion and landing reveal behavior in a browser.
- [ ] Run Lighthouse mobile; target 90+ Performance and 95+ for Accessibility,
  Best Practices, and SEO on `/`.
- [ ] Check Chrome, Firefox, and iOS Safari, including a real phone bottom bar.

## Functional and release checks

- [ ] Verify builder preview and PDF download for all three templates.
- [ ] Verify feedback delivery, Reply-To, honeypot, timing drop, and rate limit
  against configured SMTP; SMTP credentials and destination inbox are not in
  this workspace.
- [ ] Verify `/build?template=classic`, browser persistence, and clear-data.
- [ ] Set `VITE_SITE_URL` and confirm canonical URLs, sitemap, and robots output.
- [ ] Confirm owner social links, feedback inbox, domain, and Thanks copy.
- [ ] Confirm PDF templates and CSS have no changes in the design diff.

No Lighthouse score, production email receipt, or cross-browser result is
asserted until those checks are run in their target environments.
