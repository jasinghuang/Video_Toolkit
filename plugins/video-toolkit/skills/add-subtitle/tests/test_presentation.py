import sys
from pathlib import Path
from textwrap import dedent

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from presentation import validate_presentation  # noqa: E402

FIXTURE_DIR = Path(__file__).resolve().parent / "fixtures" / "sample-presentation"
FIXTURE_APP = (FIXTURE_DIR / "src" / "App.tsx").read_text(encoding="utf-8")


def test_validate_accepts_standard_structure():
    # 标准 web-video-presentation 结构应通过校验，不抛异常
    validate_presentation(FIXTURE_APP)


def test_validate_rejects_missing_step_text():
    bad = FIXTURE_APP.replace("stepText", "narrationText")
    with pytest.raises(ValueError, match="stepText"):
        validate_presentation(bad)


def test_validate_rejects_missing_stage():
    bad = FIXTURE_APP.replace("Stage", "Canvas")
    with pytest.raises(ValueError, match="Stage"):
        validate_presentation(bad)
