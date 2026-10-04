import json
import shutil
import subprocess
import tempfile
from pathlib import Path

from app.schemas.resume import ResumeData
from app.services.render_service import render_pdf
from app.templates_engine.registry import TEMPLATES

BACKEND_DIR = Path(__file__).parents[1]
REPOSITORY_ROOT = BACKEND_DIR.parent
SAMPLE_PATH = BACKEND_DIR / "tests" / "fixtures" / "sample_resume.json"
OUTPUT_DIR = REPOSITORY_ROOT / "frontend" / "public" / "thumbnails"


def main() -> None:
    pdftoppm = shutil.which("pdftoppm")
    if pdftoppm is None:
        raise RuntimeError("pdftoppm is required to generate template thumbnails")

    data = ResumeData.model_validate_json(SAMPLE_PATH.read_text(encoding="utf-8"))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as temporary_directory:
        temporary_path = Path(temporary_directory)
        for template_id in TEMPLATES:
            pdf_path = temporary_path / f"{template_id}.pdf"
            prefix = temporary_path / template_id
            pdf_path.write_bytes(render_pdf(data, template_id))
            subprocess.run(
                [
                    pdftoppm,
                    "-png",
                    "-r",
                    "60",
                    "-f",
                    "1",
                    "-l",
                    "1",
                    str(pdf_path),
                    str(prefix),
                ],
                check=True,
                capture_output=True,
                text=True,
            )
            generated = temporary_path / f"{template_id}-1.png"
            shutil.copyfile(generated, OUTPUT_DIR / f"{template_id}.png")


if __name__ == "__main__":
    main()
