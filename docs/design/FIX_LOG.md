# V1 fix measurements

## V1.1 follow-up — 2026-10-09

- Replaced the native HTML drag operation in the section picker with pointer
  capture and a single reorder on pointer release. The position selector remains
  available for keyboard and touch input.
- Removed the `Core` badges from the section picker.
- Hid the timeline rule on mobile, where the steps stack in one column, while
  preserving the divider between columns on desktop.
- Verified with 129 frontend tests, Oxlint, a production frontend build, and
  Playwright at 360, 390, 768, and 1280px. The Playwright flow now drags a
  section with the six-dot handle, checks the resulting order, and changes its
  position with the selector.

## Numbering and builder transition follow-up — 2026-10-09

- Corrected the final home page call to action to `11 / Start`, following
  `10 / Feedback` in page order.
- Removed the extra outer cards from builder steps 1 and 2 so their headings
  align with the later steps. The section selection instructions now describe
  reordering without referring to the removed arrow buttons.
- Reset the editor's scroll position to the top whenever the builder step
  changes. Playwright now scrolls to the bottom before changing steps and checks
  that both transitions reset to the top.

Date: 2026-10-09. Browser checks ran in Chromium at viewport widths 360, 390,
768, and 1280px. Final screenshots are in `docs/design/qa-shots/`.

| Check | Width | Before | After |
|---|---:|---:|---:|
| Contact input vertical movement after empty-name blur | 360px | Not recorded | 0px across 5 inputs |
| Contact input vertical movement after empty-name blur | 1280px | Not recorded | 0px across 5 inputs |
| Feedback Name/Email top alignment | 768px | Not recorded | 0px difference before and after blur |
| Feedback Name/Email top alignment | 1280px | Not recorded | 0px difference before and after blur |
| Feedback input height | 768px, 1280px | Not recorded | 44px for both fields |
| Footer height | 360px | Not recorded | 447px |
| Footer height | 390px | Not recorded | 427px |
| Footer height | 768px | Not recorded | 363px |
| Footer height | 1280px | Not recorded | 312px |

The contact and feedback measurements are post-fix browser results. No matching
pre-fix browser run was captured, so the before column is intentionally marked
as not recorded.
