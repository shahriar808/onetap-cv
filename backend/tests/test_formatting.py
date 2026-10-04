import pytest

from app.services.formatting import date_range, fmt_date


@pytest.mark.parametrize(
    ("value", "expected"),
    [
        ("2025-12", "Dec 2025"),
        ("2024", "2024"),
        ("", ""),
    ],
)
def test_fmt_date(value: str, expected: str) -> None:
    assert fmt_date(value) == expected


def test_date_range_with_current_role() -> None:
    assert date_range("2022-01", "", is_current=True) == "Jan 2022 – Present"


def test_date_range_with_year_only_dates() -> None:
    assert date_range("2020", "2024") == "2020 – 2024"


def test_date_range_with_only_start_or_end() -> None:
    assert date_range("2024-03", "") == "Mar 2024"
    assert date_range("", "2024") == "2024"


def test_date_range_with_no_dates() -> None:
    assert date_range("", "") == ""
