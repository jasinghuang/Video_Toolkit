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


from presentation import inject_presentation  # noqa: E402


def _make_fixture_presentation(tmp_path: Path) -> Path:
    pres = tmp_path / "presentation"
    (pres / "src").mkdir(parents=True)
    (pres / "src" / "App.tsx").write_text(FIXTURE_APP, encoding="utf-8")
    return pres


def test_inject_creates_subtitle_files_and_patches_app(tmp_path: Path):
    pres = _make_fixture_presentation(tmp_path)
    inject_presentation(pres)

    sub_tsx = pres / "src" / "components" / "Subtitle.tsx"
    sub_css = pres / "src" / "components" / "Subtitle.css"
    assert sub_tsx.exists() and sub_css.exists()
    assert "export function Subtitle" in sub_tsx.read_text(encoding="utf-8")
    assert ".subtitle-badge" in sub_css.read_text(encoding="utf-8")

    app = (pres / "src" / "App.tsx").read_text(encoding="utf-8")
    assert 'import { Subtitle }' in app
    assert "<Subtitle text={stepText} />" in app


def test_inject_is_idempotent(tmp_path: Path):
    pres = _make_fixture_presentation(tmp_path)
    inject_presentation(pres)
    app_after_first = (pres / "src" / "App.tsx").read_text(encoding="utf-8")
    inject_presentation(pres)  # 第二次不应破坏
    app_after_second = (pres / "src" / "App.tsx").read_text(encoding="utf-8")
    assert app_after_first == app_after_second
    assert app_after_second.count('import { Subtitle }') == 1


def test_inject_refuses_non_standard_app(tmp_path: Path):
    pres = tmp_path / "presentation"
    (pres / "src").mkdir(parents=True)
    (pres / "src" / "App.tsx").write_text(
        'export default function App() { return <div>no stage</div>; }\n',
        encoding="utf-8",
    )
    with pytest.raises(ValueError):
        inject_presentation(pres)
    # 校验失败时不生成任何文件
    assert not (pres / "src" / "components").exists()
    # App.tsx 不被改动
    assert "Subtitle" not in (pres / "src" / "App.tsx").read_text(encoding="utf-8")


def test_inject_refuses_missing_app_tsx(tmp_path: Path):
    pres = tmp_path / "presentation"
    (pres / "src").mkdir(parents=True)  # 没有 App.tsx
    with pytest.raises(ValueError, match="App.tsx"):
        inject_presentation(pres)


from presentation import scan_long_narrations  # noqa: E402


def test_scan_long_narrations_finds_overlong():
    pres = Path(__file__).resolve().parent / "fixtures" / "sample-presentation"
    long_lines = scan_long_narrations(pres, max_chars=18)
    assert len(long_lines) == 2
    # 按文件行号排序，第一段超长在 line 3（0-index 数组索引 1 → narrations.ts line 2+1+1）
    assert long_lines[0]["text"].startswith("这一句")
    assert long_lines[0]["char_count"] > 18
    assert long_lines[1]["text"].startswith("另外一句")
    assert "narrations.ts" in str(long_lines[0]["file"])


def test_scan_long_narrations_empty_when_no_narrations_dir(tmp_path: Path):
    pres = tmp_path / "presentation"
    (pres / "src").mkdir(parents=True)
    (pres / "src" / "App.tsx").write_text("// empty", encoding="utf-8")
    result = scan_long_narrations(pres, max_chars=18)
    assert result == []


def test_scan_long_narrations_empty_when_all_short(tmp_path: Path):
    pres = tmp_path / "presentation"
    chapters_dir = pres / "src" / "chapters" / "01-intro"
    chapters_dir.mkdir(parents=True)
    (chapters_dir / "narrations.ts").write_text(
        'export const narrations = ["短句一", "短句二", "短句三"];\n',
        encoding="utf-8",
    )
    result = scan_long_narrations(pres, max_chars=18)
    assert result == []
