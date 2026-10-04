# OneTap CV

OneTap CV is a free, privacy-conscious resume builder. It stores resume data in
the browser, renders one of three single-column templates, and exports
ATS-friendly, searchable PDFs. Resume content is sent to the API only when
generating a preview or PDF; the server does not persist it.

## Features

- Contact, summary, experience, education, skills, projects, and optional
  sections, with autosave in browser storage.
- Classic, Modern, and Compact HTML/PDF templates.
- Live preview and validated PDF download.
- Accessible responsive builder with a mobile Edit/Preview view.
- FastAPI endpoints for health, template metadata, preview, and PDF generation.

## Requirements

- Python 3.12.
- Node.js 22.12 or newer (Node.js 24 LTS is recommended).
- Windows users need WeasyPrint's GTK/Pango/Cairo libraries for local PDF
  rendering. Docker builds install the required system libraries and fonts.

## Run locally

Open two terminals from the repository root.

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:ALLOWED_ORIGINS = "http://localhost:5173"
$env:MAX_BODY_BYTES = "1048576"
$env:RATE_LIMIT = "30/minute"

# On Windows, add the MSYS2 GTK libraries if WeasyPrint cannot locate them.
$env:PATH = "C:\msys64\mingw64\bin;$env:PATH"
uvicorn app.main:app --reload
```

On macOS/Linux, activate `.venv` with `source .venv/bin/activate` and omit the
Windows-only GTK `PATH` line. The health endpoint is
`http://localhost:8000/api/health`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal. In development, Vite proxies `/api`
to `http://localhost:8000`; no API URL environment variable is needed. The
frontend uses browser storage and keeps the current route/data across refresh.

## Environment variables

| Variable | Component | Default | Purpose |
|---|---|---|---|
| `ALLOWED_ORIGINS` | Backend | `http://localhost:5173` | Comma-separated allowed browser origins. Set this to the deployed frontend origin. |
| `MAX_BODY_BYTES` | Backend | `1048576` | Maximum accepted request body size (1 MiB). |
| `RATE_LIMIT` | Backend | `30/minute` | Per-client request limit for preview and PDF endpoints. |
| `VITE_API_URL` | Frontend build | Empty | Backend origin, e.g. `https://api.example.com`. Empty uses the Vite development proxy. |

The backend reads these values from its process environment. Example values are
in `backend/.env.example` and `frontend/.env.example`; the app does not load
`.env` files automatically.

## API

- `GET /api/health` — process health.
- `GET /api/templates` — supported template metadata.
- `POST /api/resume/preview?template={id}` — validated resume JSON to HTML.
- `POST /api/resume/pdf?template={id}` — validated resume JSON to PDF.

Supported template IDs are `classic`, `modern`, and `compact`. The resume
contract is defined in `backend/app/schemas/resume.py` and mirrored in
`frontend/src/types/resume.ts`.

## Test and build

Run backend tests from `backend`:

```powershell
.\.venv\Scripts\pytest.exe -q
```

Run frontend checks from `frontend`:

```powershell
npm test -- --run
npm run build
npm run lint
```

The thumbnail generator needs Poppler's `pdftoppm` executable:

```powershell
cd backend
python scripts/make_thumbnails.py
```

It renders the sample resume and updates `frontend/public/thumbnails/`.

## Deployment

### Backend container

Build from the `backend` directory:

```sh
docker build -t onetap-cv-api .
docker run --rm -p 8000:8000 \
  -e ALLOWED_ORIGINS=https://your-frontend.example \
  -e MAX_BODY_BYTES=1048576 \
  -e RATE_LIMIT=30/minute \
  onetap-cv-api
```

The image uses Python 3.12 slim, installs WeasyPrint libraries and fonts, and
runs Uvicorn as a non-root user. Configure your host's HTTPS/domain and health
check at `/api/health`.

### Frontend static hosting

Build the static frontend with the production API URL:

```sh
cd frontend
VITE_API_URL=https://your-api.example npm run build
```

On PowerShell, use `$env:VITE_API_URL = "https://your-api.example"` before
`npm run build`. Publish `frontend/dist/` on a static host. The included
`public/_redirects` file provides SPA fallback for hosts that support
Netlify-style redirects, so refreshing `/build` serves the app. Set backend
`ALLOWED_ORIGINS` to the exact frontend origin.

## Extending the project

### Add a template

1. Add `backend/app/templates_engine/<id>/template.html.j2` and `style.css`.
   Reuse the macros in `base/sections.html.j2` and follow the existing template
   layout conventions.
2. Register its `TemplateMeta` in `backend/app/templates_engine/registry.py`.
   The registry drives template lookup and the API metadata.
3. Add render and text-extraction coverage in `backend/tests/test_render.py`.
   Keep user-provided values escaped and confirm selectable PDF text and
   section ordering.
4. Generate and review its thumbnail with
   `backend/scripts/make_thumbnails.py`; commit
   `frontend/public/thumbnails/<id>.png`.
5. Add the template ID to `TemplateId` and the template metadata validation in
   the frontend (`src/lib/defaults.ts` and `src/lib/api.ts`).

### Add a resume section

1. Define and test the Pydantic item model in
   `backend/app/schemas/resume.py`; include the list or single-section field in
   `ResumeData`.
2. Mirror the model and section ID in `frontend/src/types/resume.ts`, initialize
   it in `frontend/src/lib/defaults.ts`, and update migrations if persisted
   shape or defaults change.
3. Add the section's context transformation and fixed heading in
   `backend/app/services/render_service.py`; update the shared section macro
   dispatcher in `backend/app/templates_engine/base/sections.html.j2`.
4. Add a store-bound form in `frontend/src/features/builder/sections/`, using
   `ListSection` and the shared input components where appropriate.
5. Add one entry in `SECTION_REGISTRY` in
   `frontend/src/features/builder/sections/registry.ts`, then test schema,
   rendering, store behavior, and the form.

### Add a persisted-data migration

1. Increase `CURRENT_VERSION` and add a migration step in
   `frontend/src/lib/migrations.ts`.
2. Preserve unknown user data where practical and transform older shapes
   deterministically.
3. Add tests for each supported source version and the resulting current
   version. Do not rename or remove the `cvbuilder:v1` storage key without a
   deliberate migration plan.

## Release QA (v1.0.0)

- Backend: `pytest -q` — 98 passed. One upstream Starlette/httpx deprecation
  warning remains.
- Frontend: 59 tests passed; `npm run build` and `npm run lint` passed cleanly.
- Local browser flow: the three template PDF requests returned HTTP 200 with
  `application/pdf`; the built `/build` route loaded successfully; no horizontal
  overflow was observed at 360, 390, 768, and 1280 pixel viewport widths.
- Clear-data confirmation and browser-storage removal were checked in the
  browser.
- Public deployment and live-URL checks are deferred; no deployment was
  requested. A Docker build could not be run because Docker/Podman is not
  installed in the development environment. Physical-device and Lighthouse
  checks remain outstanding.

## Assumptions

- Resume content is stored locally under `cvbuilder:v1`; clearing it removes
  that browser's copy. Private browsing may use in-memory fallback storage.
- The API is stateless with respect to resume content. It processes submitted
  data to generate HTML/PDF and does not save the resume.
- Required contact fields are name, valid email, and phone. A real PDF requires
  valid contact data; preview placeholders are never written to the store.
- Dates use `YYYY` or `YYYY-MM`; an empty value represents an unknown date.
- PDFs are designed as single-column, searchable documents with A4 page size.
- The sample resume and its template thumbnails are demonstration content, not
  endorsements or a guarantee of ATS results.
