from pathlib import Path

from PIL import Image

PUBLIC = Path(__file__).parents[1] / "public" / "thumbnails"


def save_responsive(source: Path, name: str) -> None:
    with Image.open(source) as original:
        image = original.convert("RGB")
        for width in (480, 900):
            target_width = min(width, image.width)
            height = round(image.height * target_width / image.width)
            resized = image.resize((target_width, height), Image.Resampling.LANCZOS)
            resized.save(PUBLIC / f"{name}-{width}.webp", "WEBP", quality=82, method=6)


def main() -> None:
    for template in ("classic", "modern", "compact"):
        save_responsive(PUBLIC / f"landing-{template}.png", f"landing-{template}")
        save_responsive(PUBLIC / f"{template}.png", template)


if __name__ == "__main__":
    main()
