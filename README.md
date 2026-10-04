# OneTap CV

A free, privacy-conscious CV builder that creates ATS-friendly PDF resumes.

## Run

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# If WeasyPrint cannot find GTK libraries on Windows:
$env:PATH = "C:\msys64\mingw64\bin;$env:PATH"
uvicorn app.main:app --reload
```

The backend health endpoint is available at `http://localhost:8000/api/health`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal. The page checks the backend through the
development proxy and displays `API: ok` when it is reachable.

Run frontend checks with `npm run build` and `npm test -- --run`. Run backend
tests from `backend` with `pytest -q`.

## Assumptions

- Local development uses Python 3.12 and Node.js LTS.
- Windows PDF rendering requires WeasyPrint's GTK/Pango/Cairo DLLs on `PATH`.
