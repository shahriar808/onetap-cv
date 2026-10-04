import re

MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
]


def fmt_date(value: str) -> str:
    """Format YYYY-MM dates while leaving year-only and empty values unchanged."""
    if not value:
        return ""

    if re.fullmatch(r"\d{4}-(0[1-9]|1[0-2])", value):
        year, month = value.split("-")
        return f"{MONTHS[int(month) - 1]} {year}"

    return value


def date_range(start: str, end: str, is_current: bool = False) -> str:
    """Format date endpoints, using Present when the role is current."""
    formatted_start = fmt_date(start)
    formatted_end = "Present" if is_current else fmt_date(end)
    if formatted_start and formatted_end:
        return f"{formatted_start} – {formatted_end}"
    return formatted_start or formatted_end


def display_url(url: str) -> str:
    """Strip the scheme, www prefix, and trailing slash for display."""
    value = re.sub(r"^https?://", "", url.strip())
    value = re.sub(r"^www\.", "", value)
    return value.rstrip("/")


def href_url(url: str) -> str:
    """Ensure a URL has a scheme for use in an href."""
    value = url.strip()
    return value if re.match(r"^https?://", value) else f"https://{value}"


def safe_filename(full_name: str) -> str:
    """Return a filesystem-safe resume filename."""
    name = re.sub(r"[^A-Za-z0-9]+", "_", full_name).strip("_")
    return f"{name}_Resume.pdf" if name else "Resume.pdf"
