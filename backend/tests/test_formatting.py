import pytest

from app.services.formatting import (
    date_range,
    display_url,
    fmt_date,
    href_url,
    safe_filename,
)


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


def test_display_url_strips_scheme_www_and_trailing_slash() -> None:
    assert display_url("https://www.github.com/x/") == "github.com/x"


def test_href_url_adds_missing_scheme() -> None:
    assert href_url("github.com/x") == "https://github.com/x"
    assert href_url("https://github.com/x") == "https://github.com/x"


@pytest.mark.parametrize(
    ("full_name", "expected"),
    [
        ("Shahriar Hasan", "Shahriar_Hasan_Resume.pdf"),
        ("", "Resume.pdf"),
        ("A/B<script>", "A_B_script_Resume.pdf"),
        ("!!!", "Resume.pdf"),
    ],
)
def test_safe_filename(full_name: str, expected: str) -> None:
    assert safe_filename(full_name) == expected
