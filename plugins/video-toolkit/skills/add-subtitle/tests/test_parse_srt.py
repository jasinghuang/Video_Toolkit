from pathlib import Path

from skill_main import parse_timestamp, parse_srt


def test_parse_timestamp_uses_comma_ms_separator():
    assert parse_timestamp("00:01:02,500") == 62.5


def test_parse_timestamp_accepts_dot_separator():
    assert parse_timestamp("00:00:05.200") == 5.2


def test_parse_timestamp_zero():
    assert parse_timestamp("00:00:00,000") == 0.0


def test_parse_srt_single_entry(tmp_path: Path):
    srt = tmp_path / "a.srt"
    srt.write_text(
        "1\n" "00:00:01,000 --> 00:00:02,500\n" "你好世界\n",
        encoding="utf-8",
    )
    subs = parse_srt(srt)
    assert len(subs) == 1
    assert subs[0].index == 1
    assert subs[0].start == 1.0
    assert subs[0].end == 2.5
    assert subs[0].text == "你好世界"


def test_parse_srt_multiple_entries(tmp_path: Path):
    srt = tmp_path / "a.srt"
    srt.write_text(
        "1\n00:00:01,000 --> 00:00:02,000\n第一句\n\n"
        "2\n00:00:03,000 --> 00:00:04,000\n第二句\n",
        encoding="utf-8",
    )
    subs = parse_srt(srt)
    assert len(subs) == 2
    assert [s.text for s in subs] == ["第一句", "第二句"]


def test_parse_srt_skips_malformed_blocks(tmp_path: Path):
    srt = tmp_path / "a.srt"
    srt.write_text(
        "not a number\n00:00:01,000 --> 00:00:02,000\n丢弃\n\n"
        "1\n00:00:03,000 --> 00:00:04,000\n保留\n",
        encoding="utf-8",
    )
    subs = parse_srt(srt)
    assert len(subs) == 1
    assert subs[0].text == "保留"
