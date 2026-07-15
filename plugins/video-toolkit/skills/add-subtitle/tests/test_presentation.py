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


from presentation import build_subtitle_tsx, build_subtitle_css  # noqa: E402


def test_build_subtitle_tsx_contains_component_and_hide_key():
    tsx = build_subtitle_tsx()
    assert "export function Subtitle" in tsx
    assert 'text: string' in tsx
    assert '"h"' in tsx and '"H"' in tsx  # H 键隐藏
    assert "subtitle-layer" in tsx
    assert "subtitle-badge" in tsx
    assert "useState" in tsx  # hidden state


def test_build_subtitle_css_contains_fixed_params():
    css = build_subtitle_css()
    assert ".subtitle-layer" in css
    assert ".subtitle-badge" in css
    assert "bottom: 86px" in css
    assert "border: 2.5px solid #000" in css
    assert "border-radius: 18px" in css
    assert "padding: 12px 40px" in css
    assert "font-size: 40px" in css
    assert "box-shadow: 0 10px 32px rgba(0, 0, 0, 0.28)" in css
    assert "white-space: nowrap" in css
    assert "FZLanTingHei" in css


from presentation import patch_app_tsx  # noqa: E402


def test_patch_adds_import_and_mounts_subtitle():
    patched = patch_app_tsx(FIXTURE_APP)
    assert 'import { Subtitle } from "./components/Subtitle";' in patched
    assert "<Subtitle text={stepText} />" in patched
    # 原 Stage 内容保留
    assert "<Stage" in patched and "</Stage>" in patched


def test_patch_is_idempotent():
    once = patch_app_tsx(FIXTURE_APP)
    twice = patch_app_tsx(once)
    assert once == twice


def test_patch_only_one_import_line():
    once = patch_app_tsx(FIXTURE_APP)
    twice = patch_app_tsx(once)
    # 第二次不重复加 import
    assert twice.count('import { Subtitle }') == 1
    assert twice.count("<Subtitle text={stepText} />") == 1
