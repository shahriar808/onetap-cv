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
