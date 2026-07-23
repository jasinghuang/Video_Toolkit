# add-subtitle Presentation 同步优化 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 给 add-subtitle 的 presentation 注入模式增加 `--check` 检测能力（4 项诊断：结构兼容、注入完整性、组件新鲜度、文案合规），并在 Subtitle 组件中加入 ≤18 字截断兜底。

**Architecture:** 在 `presentation.py` 新增 `check_presentation()` / `format_check_report()` / `scan_long_narrations()` 三个纯函数；`skill_main.py` 新增 `--check` flag 做只读诊断路由，默认行为保持修复模式。视频模式不变。

**Tech Stack:** Python 3, argparse, re, pathlib, pytest

## Global Constraints

- Python 3.10+ (使用 pathlib.Path, dataclasses)
- 所有检测函数只读不写文件
- `--check` exit code: 0 = 全部通过, 1 = 有 FAIL/WARN
- 每条 narration ≤18 字（中文字符 + 中文标点）
- `--check` 与 srt_file/--video 互斥
- 保持向后兼容：现有 `--presentation` 不加 `--check` 的行为不变

---

### Task 1: 新增 `scan_long_narrations()` + 测试

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/presentation.py`
- Create: `plugins/video-toolkit/skills/add-subtitle/tests/fixtures/sample-presentation/src/chapters/01-intro/narrations.ts`
- Modify: `plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py`

**Interfaces:**
- Produces: `scan_long_narrations(pres_dir: Path, max_chars: int = 18) -> list[dict]`
  - Returns: `[{file, line, text, char_count}, ...]`
  - Empty list if all narrations ≤ max_chars or no narrations.ts found

- [ ] **Step 1: Write fixture narrations.ts**

```ts
// tests/fixtures/sample-presentation/src/chapters/01-intro/narrations.ts
export const narrations: string[] = [
  "这是第一句文案",
  "这一句超过十八个字的限制需要被检测出来并报告给用户",
  "正常短句",
  "另外一句也是超过了十八个字的长文案需要被标记",
];
```

- [ ] **Step 2: Write failing tests for scan_long_narrations**

Add to `tests/test_presentation.py`:

```python
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
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
python3 -m pytest tests/test_presentation.py::test_scan_long_narrations_finds_overlong tests/test_presentation.py::test_scan_long_narrations_empty_when_no_narrations_dir tests/test_presentation.py::test_scan_long_narrations_empty_when_all_short -v
```

Expected: 3 FAIL (ImportError: cannot import scan_long_narrations)

- [ ] **Step 4: Implement scan_long_narrations**

Add to `presentation.py`, after existing imports:

```python
import re
from pathlib import Path

# Matches single/double-quoted and template-literal strings with ≥min_len chars
_STRING_RE = re.compile(r"""['"`]([^'"`\n]{10,})['"`]""")


def _is_chinese_text(text: str) -> bool:
    """Check if text contains CJK characters (vs code identifiers)."""
    return any('一' <= c <= '鿿' or '　' <= c <= '〿'
               for c in text)


def scan_long_narrations(pres_dir: Path, max_chars: int = 18) -> list[dict]:
    """Scan src/chapters/**/narrations.ts for narration strings > max_chars.

    Returns a list of dicts: {file, line, text, char_count}. Empty if all ok.
    """
    chapters_dir = pres_dir / "src" / "chapters"
    if not chapters_dir.is_dir():
        return []

    long_lines = []
    for narr_file in sorted(chapters_dir.rglob("narrations.ts")):
        for lineno, line in enumerate(narr_file.read_text(encoding="utf-8").splitlines(), 1):
            for m in _STRING_RE.finditer(line):
                text = m.group(1)
                if not _is_chinese_text(text):
                    continue
                char_count = len(text)
                if char_count > max_chars:
                    long_lines.append({
                        "file": str(narr_file),
                        "line": lineno,
                        "text": text,
                        "char_count": char_count,
                    })
    return long_lines
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
python3 -m pytest tests/test_presentation.py::test_scan_long_narrations_finds_overlong tests/test_presentation.py::test_scan_long_narrations_empty_when_no_narrations_dir tests/test_presentation.py::test_scan_long_narrations_empty_when_all_short -v
```

Expected: 3 PASS

- [ ] **Step 6: Run full test suite to confirm no regressions**

```bash
python3 -m pytest tests/ -v
```

Expected: 27 passed (24 existing + 3 new)

- [ ] **Step 7: Commit**

```bash
git add plugins/video-toolkit/skills/add-subtitle/presentation.py \
        plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py \
        plugins/video-toolkit/skills/add-subtitle/tests/fixtures/sample-presentation/src/chapters/01-intro/narrations.ts
git commit -m "feat(add-subtitle): add scan_long_narrations to detect >18 char narration lines"
```

---

### Task 2: 新增 `check_presentation()` + `format_check_report()` + 测试

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/presentation.py`
- Modify: `plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py`

**Interfaces:**
- Produces: `check_presentation(pres_dir: Path, max_chars: int = 18) -> dict`
  - Returns:
    ```python
    {
        "structure":   {"status": "pass"|"fail", "msg": str},
        "injection":   {"status": "pass"|"fail", "msg": str},
        "components":  {"status": "pass"|"warn", "msg": str, "detail": "ok"|"missing"|"stale"},
        "narrations":  {"status": "pass"|"fail", "msg": str, "long_lines": list[dict]},
    }
    ```
- Produces: `format_check_report(results: dict) -> str`
  - Returns multi-line formatted string with `[PASS]`/`[WARN]`/`[FAIL]` markers

- [ ] **Step 1: Write failing tests for check_presentation**

Add to `tests/test_presentation.py`:

```python
from presentation import check_presentation, format_check_report  # noqa: E402


def test_check_passes_clean_presentation():
    pres = Path(__file__).resolve().parent / "fixtures" / "sample-presentation"
    # 先注入确保 injection 通过
    from presentation import inject_presentation
    import shutil, tempfile
    # 复制 fixture 到临时目录避免污染
    with tempfile.TemporaryDirectory() as tmp:
        import shutil
        tmp_pres = Path(tmp) / "pres"
        shutil.copytree(str(pres), str(tmp_pres))
        inject_presentation(tmp_pres)
        result = check_presentation(tmp_pres, max_chars=100)  # high limit to pass narration check
        assert result["structure"]["status"] == "pass"
        assert result["injection"]["status"] == "pass"
        assert result["components"]["status"] == "pass"


def test_check_catches_missing_injection():
    pres = Path(__file__).resolve().parent / "fixtures" / "sample-presentation"
    import tempfile, shutil
    with tempfile.TemporaryDirectory() as tmp:
        tmp_pres = Path(tmp) / "pres"
        shutil.copytree(str(pres), str(tmp_pres))
        # 不注入，直接 check
        result = check_presentation(tmp_pres, max_chars=100)
        assert result["injection"]["status"] == "fail"
        assert result["components"]["status"] == "warn"  # 组件文件不存在


def test_check_rejects_non_standard_structure(tmp_path: Path):
    pres = tmp_path / "presentation"
    (pres / "src").mkdir(parents=True)
    (pres / "src" / "App.tsx").write_text(
        'export default function App() { return <div>no stage</div>; }\n',
        encoding="utf-8",
    )
    result = check_presentation(pres, max_chars=18)
    assert result["structure"]["status"] == "fail"
    assert "stepText" in result["structure"]["msg"]


def test_check_catches_long_narrations():
    pres = Path(__file__).resolve().parent / "fixtures" / "sample-presentation"
    import tempfile, shutil
    with tempfile.TemporaryDirectory() as tmp:
        tmp_pres = Path(tmp) / "pres"
        shutil.copytree(str(pres), str(tmp_pres))
        result = check_presentation(tmp_pres, max_chars=18)
        assert result["narrations"]["status"] == "fail"
        assert len(result["narrations"]["long_lines"]) == 2


def test_format_check_report_all_pass():
    results = {
        "structure":  {"status": "pass", "msg": "App.tsx 含 stepText + <Stage"},
        "injection":  {"status": "pass", "msg": "Subtitle import + 挂载完整"},
        "components": {"status": "pass", "msg": "Subtitle.tsx/.css 与模板一致", "detail": "ok"},
        "narrations": {"status": "pass", "msg": "所有 narration ≤18 字", "long_lines": []},
    }
    report = format_check_report(results)
    assert "[PASS]" in report
    assert "[FAIL]" not in report
    assert "[WARN]" not in report


def test_format_check_report_with_failures():
    results = {
        "structure":  {"status": "pass", "msg": "ok"},
        "injection":  {"status": "fail", "msg": "未找到 Subtitle import"},
        "components": {"status": "warn", "msg": "Subtitle.tsx 版本过旧", "detail": "stale"},
        "narrations": {"status": "fail", "msg": "2 条超长", "long_lines": [
            {"file": "src/chapters/01/narrations.ts", "line": 2, "text": "abc" * 7, "char_count": 21},
        ]},
    }
    report = format_check_report(results)
    assert "[FAIL]" in report
    assert "[WARN]" in report
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python3 -m pytest tests/test_presentation.py -k "check" -v
```

Expected: 6 FAIL (ImportError)

- [ ] **Step 3: Implement check_presentation**

Add to `presentation.py`, after `scan_long_narrations`:

```python
def check_presentation(pres_dir: Path, max_chars: int = 18) -> dict:
    """Run 4 checks on a presentation directory. Read-only, no side effects.

    Returns a dict with keys: structure, injection, components, narrations.
    Each value has 'status' ("pass"|"fail"|"warn") and 'msg'.
    """
    app_path = pres_dir / "src" / "App.tsx"
    components_dir = pres_dir / "src" / "components"
    sub_tsx = components_dir / "Subtitle.tsx"
    sub_css = components_dir / "Subtitle.css"

    # 1) 结构兼容
    if not app_path.exists():
        structure = {"status": "fail", "msg": f"App.tsx 不存在: {app_path}"}
    else:
        app_content = app_path.read_text(encoding="utf-8")
        try:
            validate_presentation(app_content)
            structure = {"status": "pass", "msg": "App.tsx 含 stepText + <Stage"}
        except ValueError as e:
            structure = {"status": "fail", "msg": str(e)}

    # 2) 注入完整性
    if not app_path.exists():
        injection = {"status": "fail", "msg": "App.tsx 不存在，无法检查注入"}
    else:
        has_import = SUBTITLE_IMPORT in app_content
        has_mount = "<Subtitle text={stepText} />" in app_content
        if has_import and has_mount:
            injection = {"status": "pass", "msg": "Subtitle import + 挂载完整"}
        elif has_import:
            injection = {"status": "fail", "msg": "import 存在但缺少 <Subtitle> 挂载"}
        elif has_mount:
            injection = {"status": "fail", "msg": "挂载存在但缺少 import 行"}
        else:
            injection = {"status": "fail", "msg": "未注入：缺少 Subtitle import 和挂载"}

    # 3) 组件新鲜度
    if not sub_tsx.exists() or not sub_css.exists():
        missing = []
        if not sub_tsx.exists():
            missing.append("Subtitle.tsx")
        if not sub_css.exists():
            missing.append("Subtitle.css")
        components = {
            "status": "warn",
            "msg": f"组件缺失: {', '.join(missing)}",
            "detail": "missing",
        }
    else:
        current_tsx = sub_tsx.read_text(encoding="utf-8")
        current_css = sub_css.read_text(encoding="utf-8")
        expected_tsx = build_subtitle_tsx()
        expected_css = build_subtitle_css()
        tsx_match = current_tsx == expected_tsx
        css_match = current_css == expected_css
        if tsx_match and css_match:
            components = {
                "status": "pass",
                "msg": "Subtitle.tsx/.css 与模板一致",
                "detail": "ok",
            }
        else:
            stale = []
            if not tsx_match:
                stale.append("Subtitle.tsx")
            if not css_match:
                stale.append("Subtitle.css")
            components = {
                "status": "warn",
                "msg": f"组件过期: {', '.join(stale)}（内容与最新模板不一致）",
                "detail": "stale",
            }

    # 4) 文案合规
    long_lines = scan_long_narrations(pres_dir, max_chars=max_chars)
    if not long_lines:
        narrations = {"status": "pass", "msg": f"所有 narration ≤{max_chars} 字", "long_lines": []}
    else:
        narrations = {
            "status": "fail",
            "msg": f"{len(long_lines)} 条 narration 超过 {max_chars} 字",
            "long_lines": long_lines,
        }

    return {
        "structure": structure,
        "injection": injection,
        "components": components,
        "narrations": narrations,
    }
```

- [ ] **Step 4: Implement format_check_report**

Add to `presentation.py`, after `check_presentation`:

```python
def format_check_report(results: dict) -> str:
    """Format check_presentation() results as structured terminal text."""
    labels = {
        "structure": "结构兼容",
        "injection": "注入完整",
        "components": "组件新鲜度",
        "narrations": "文案合规",
    }
    status_mark = {"pass": "[PASS]", "warn": "[WARN]", "fail": "[FAIL]"}

    lines = []
    lines.append("=== add-subtitle --check ===")
    for key in ["structure", "injection", "components", "narrations"]:
        entry = results[key]
        mark = status_mark.get(entry["status"], "[????]")
        label = labels[key]
        lines.append(f"{mark} {label} — {entry['msg']}")

    # 文案超长详情
    long_lines = results["narrations"].get("long_lines", [])
    if long_lines:
        lines.append("")
        for item in long_lines:
            text_preview = item["text"][:30] + ("..." if len(item["text"]) > 30 else "")
            lines.append(f"  {item['file']}  L{item['line']}  \"{text_preview}\" ({item['char_count']}字)")

    # 摘要
    statuses = [e["status"] for e in results.values()]
    fail_count = statuses.count("fail")
    warn_count = statuses.count("warn")
    pass_count = statuses.count("pass")
    lines.append("")
    lines.append(f"Summary: {pass_count} PASS, {warn_count} WARN, {fail_count} FAIL")

    return "\n".join(lines)
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
python3 -m pytest tests/test_presentation.py -k "check" -v
```

Expected: 6 PASS

- [ ] **Step 6: Run full test suite to confirm no regressions**

```bash
python3 -m pytest tests/ -v
```

Expected: 33 passed (27 previous + 6 new)

- [ ] **Step 7: Commit**

```bash
git add plugins/video-toolkit/skills/add-subtitle/presentation.py \
        plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py
git commit -m "feat(add-subtitle): add check_presentation + format_check_report (4 diagnostics)"
```

---

### Task 3: 更新 `build_subtitle_tsx()` / `build_subtitle_css()` 加入截断逻辑

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/presentation.py`
- Modify: `plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py`

**Interfaces:**
- Modifies: `build_subtitle_tsx()` — adds MAX_CHARS=18 truncation
- Modifies: `build_subtitle_css()` — adds text-overflow: ellipsis

- [ ] **Step 1: Update existing test assertions**

Modify `test_build_subtitle_tsx_contains_component_and_hide_key` to also verify truncation logic:

```python
def test_build_subtitle_tsx_contains_component_and_hide_key():
    tsx = build_subtitle_tsx()
    assert "export function Subtitle" in tsx
    assert 'text: string' in tsx
    assert '"h"' in tsx and '"H"' in tsx  # H 键隐藏
    assert "subtitle-layer" in tsx
    assert "subtitle-badge" in tsx
    assert "useState" in tsx  # hidden state
    # NEW: truncation
    assert "MAX_CHARS = 18" in tsx
    assert "text.slice(0, MAX_CHARS)" in tsx


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
    # NEW: overflow protection
    assert "overflow: hidden" in css
    assert "text-overflow: ellipsis" in css
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python3 -m pytest tests/test_presentation.py::test_build_subtitle_tsx_contains_component_and_hide_key tests/test_presentation.py::test_build_subtitle_css_contains_fixed_params -v
```

Expected: 2 FAIL (assertion errors for missing MAX_CHARS / overflow)

- [ ] **Step 3: Update build_subtitle_tsx**

Replace the return value of `build_subtitle_tsx()`:

```python
def build_subtitle_tsx() -> str:
    """返回 Subtitle.tsx 文件内容。"""
    return dedent(
        """\
        import { useEffect, useState } from "react";
        import "./Subtitle.css";

        interface SubtitleProps {
          text: string;
        }

        const MAX_CHARS = 18;

        export function Subtitle({ text }: SubtitleProps) {
          const [hidden, setHidden] = useState(false);
          useEffect(() => {
            const onKey = (e: KeyboardEvent) => {
              if (e.key === "h" || e.key === "H") setHidden((v) => !v);
            };
            window.addEventListener("keydown", onKey);
            return () => window.removeEventListener("keydown", onKey);
          }, []);
          if (!text || hidden) return null;
          const display = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) + "…" : text;
          return (
            <div className="subtitle-layer">
              <span className="subtitle-badge">{display}</span>
            </div>
          );
        }
        """
    )
```

- [ ] **Step 4: Update build_subtitle_css**

Replace the return value of `build_subtitle_css()`:

```python
def build_subtitle_css() -> str:
    """返回 Subtitle.css 文件内容（舞台坐标 1920×1080，参数经真实画面 mockup 标定）。"""
    return dedent(
        """\
        .subtitle-layer {
          position: absolute;
          bottom: 86px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          pointer-events: none;
        }

        .subtitle-badge {
          display: inline-block;
          font-family: "FZLanTingHei", "PingFang SC", "Microsoft YaHei", sans-serif;
          font-weight: 600;
          font-size: 40px;
          line-height: 1.2;
          letter-spacing: 0.06em;
          color: #000;
          background: #fff;
          border: 2.5px solid #000;
          border-radius: 18px;
          padding: 12px 40px;
          box-shadow: 0 10px 32px rgba(0, 0, 0, 0.28);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
        }
        """
    )
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
python3 -m pytest tests/test_presentation.py::test_build_subtitle_tsx_contains_component_and_hide_key tests/test_presentation.py::test_build_subtitle_css_contains_fixed_params -v
```

Expected: 2 PASS

- [ ] **Step 6: Run full test suite to confirm no regressions**

```bash
python3 -m pytest tests/ -v
```

Expected: 33 passed

- [ ] **Step 7: Commit**

```bash
git add plugins/video-toolkit/skills/add-subtitle/presentation.py \
        plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py
git commit -m "feat(add-subtitle): add 18-char truncation in Subtitle component + CSS overflow protection"
```

---

### Task 4: 更新 `skill_main.py` — 新增 `--check` flag

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/skill_main.py`
- Modify: `plugins/video-toolkit/skills/add-subtitle/tests/test_cli_render.py`

**Interfaces:**
- Consumes: `check_presentation()`, `format_check_report()` from `presentation.py`
- Modifies: CLI argparse to add `--check` flag, routes to check vs fix

- [ ] **Step 1: Write failing tests for --check CLI**

Add to `tests/test_cli_render.py`:

```python
def test_check_mode_reports_pass_on_clean_presentation():
    """干净的已注入 project 应该 report all pass"""
    import shutil, tempfile
    fixture_pres = Path(__file__).resolve().parent / "fixtures" / "sample-presentation"
    with tempfile.TemporaryDirectory() as tmp:
        tmp_pres = Path(tmp) / "pres"
        shutil.copytree(str(fixture_pres), str(tmp_pres))
        # 先注入
        subprocess.run(
            [sys.executable, str(SCRIPT), "--presentation", str(tmp_pres)],
            capture_output=True, text=True,
        )
        # check（设置很高的 max_chars 以免超长文案导致 fail）
        # 注意：cli 层暂不开放 --max-chars，我们用 presentation 的默认 18
        # 所以 fixture 里的超长文案会导致 narration FAIL——我们要确认 exit code != 0
        result = subprocess.run(
            [sys.executable, str(SCRIPT), "--presentation", str(tmp_pres), "--check"],
            capture_output=True, text=True,
        )
        # exit code 1 因为有超长文案
        assert result.returncode == 1
        assert "[PASS] 结构兼容" in result.stdout
        assert "[PASS] 注入完整" in result.stdout
        assert "[FAIL] 文案合规" in result.stdout


def test_check_rejects_srt_with_check():
    """--check 与 srt_file 互斥"""
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "sub.srt", "--video", "v.mp4", "--check"],
        capture_output=True, text=True,
    )
    assert result.returncode != 0


def test_check_help_shows_check_flag():
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--help"], capture_output=True, text=True,
    )
    assert result.returncode == 0
    assert "--check" in result.stdout
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python3 -m pytest tests/test_cli_render.py::test_check_mode_reports_pass_on_clean_presentation tests/test_cli_render.py::test_check_rejects_srt_with_check tests/test_cli_render.py::test_check_help_shows_check_flag -v
```

Expected: test_check_mode... exits 0 (no --check yet, so it runs inject → succeeds), test_check_rejects... exits 0 (--check ignored), test_check_help... fails assertion

- [ ] **Step 3: Implement --check in skill_main.py**

Modify `skill_main.py`:

```python
def main():
    parser = argparse.ArgumentParser(
        description="Overlay SRT subtitles onto a video OR inject subtitle layer into a presentation",
    )
    parser.add_argument("srt_file", nargs="?", type=str, help="Input SRT file (video mode)")
    parser.add_argument("--video", type=str, help="Video file path (video mode, required with srt_file)")
    parser.add_argument("--presentation", type=str, help="Presentation directory (inject subtitle layer)")
    parser.add_argument("--output", "-o", type=str, help="Output directory (video mode)")
    parser.add_argument("--check", action="store_true", help="Check mode: diagnose presentation only, no writes")
    args = parser.parse_args()

    # --check + srt/video 互斥
    if args.check and (args.srt_file or args.video):
        parser.error("--check 与 srt_file/--video 互斥")

    # presentation 模式
    if args.presentation:
        from presentation import check_presentation, format_check_report, inject_presentation

        pres_path = Path(args.presentation).expanduser()
        if not pres_path.is_dir():
            print(f"Error: Presentation directory not found: {pres_path}")
            sys.exit(1)

        if args.check:
            # 只读诊断模式
            print(f"\n{'=' * 60}")
            print("add-subtitle --check")
            print(f"{'=' * 60}")
            print(f"  Target: {pres_path}")
            print()
            results = check_presentation(pres_path)
            print(format_check_report(results))
            print(f"\n{'=' * 60}\n")
            # exit 0 if all pass, 1 otherwise
            has_issues = any(
                e["status"] in ("fail", "warn") for e in results.values()
            )
            sys.exit(1 if has_issues else 0)
        else:
            # 修复模式（原逻辑 + 末尾文案扫描告警）
            if args.srt_file or args.video:
                parser.error("--presentation 与 srt_file/--video 互斥")
            print(f"\n{'=' * 60}")
            print("add-subtitle — Inject subtitle layer into presentation")
            print(f"{'=' * 60}")
            print(f"  Target: {pres_path}")
            inject_presentation(pres_path)
            # 文案扫描告警
            from presentation import scan_long_narrations
            long_lines = scan_long_narrations(pres_path)
            if long_lines:
                print(f"\n  ⚠ {len(long_lines)} narration(s) exceed 18 chars:")
                for item in long_lines:
                    text_preview = item["text"][:30] + ("..." if len(item["text"]) > 30 else "")
                    print(f"    {item['file']}  L{item['line']}  \"{text_preview}\" ({item['char_count']}字)")
                print("  → 建议在口播稿中将以上文案拆分为多个 step")
            print(f"{'=' * 60}\nDone!\n{'=' * 60}\n")
        return

    # 视频模式（原有逻辑不变）
    if not args.srt_file:
        parser.error("需要 srt_file（视频模式）或 --presentation（注入模式）")
    if not args.video:
        parser.error("视频模式需要 --video")

    # ... 原有视频模式逻辑保持不变 ...
```

Note: Keep the rest of `main()` (jinja2 check, srt parse, render) exactly as-is.

- [ ] **Step 4: Run new tests to verify they pass**

```bash
python3 -m pytest tests/test_cli_render.py::test_check_mode_reports_pass_on_clean_presentation tests/test_cli_render.py::test_check_rejects_srt_with_check tests/test_cli_render.py::test_check_help_shows_check_flag -v
```

Expected: 3 PASS

- [ ] **Step 5: Run full test suite to confirm no regressions**

```bash
python3 -m pytest tests/ -v
```

Expected: 36 passed (33 previous + 3 new)

- [ ] **Step 6: Commit**

```bash
git add plugins/video-toolkit/skills/add-subtitle/skill_main.py \
        plugins/video-toolkit/skills/add-subtitle/tests/test_cli_render.py
git commit -m "feat(add-subtitle): add --check flag for presentation diagnosis mode"
```

---

### Task 5: 更新 SKILL.md 文档

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/SKILL.md`

- [ ] **Step 1: Update SKILL.md**

Rewrite the "presentation 注入模式" section and add --check documentation. Changes:

1. Update the `--presentation` usage section to include `--check`
2. Add a `--check` detection items section
3. Add the ≤18字 truncation note in the 输入约定 section

Replace in SKILL.md:

The section starting from `## presentation 注入模式` to `## 参数` should be updated to:

```markdown
## presentation 注入模式

给 [web-video-presentation](https://github.com/ConardLi/garden-skills) 产出的 presentation（Vite+React 项目）注入字幕层：在舞台底部显示当前 step 的 narration，随 step 推进自动切换、和口播音频天然同步（step 驱动，无需 srt/时间戳）。默认显示，按 `H` 键临时隐藏。

```bash
# 修复模式：注入/更新字幕层（覆盖组件文件，幂等 patch App.tsx）
python ${CLAUDE_PLUGIN_ROOT}/skills/add-subtitle/skill_main.py --presentation /path/to/presentation

# 检测模式：只诊断，不动文件（exit code 0 = 全部通过，1 = 有问题）
python ${CLAUDE_PLUGIN_ROOT}/skills/add-subtitle/skill_main.py --presentation /path/to/presentation --check
```

注入内容：
- 生成 `src/components/Subtitle.tsx` + `Subtitle.css`（黑字白底圆角描边标签，舞台 1920×1080 坐标 px）
- patch `src/App.tsx` 挂载 `<Subtitle text={stepText} />`（幂等，可重复运行）

要求 presentation 是标准 web-video-presentation 结构（`App.tsx` 含 `stepText` 和 `<Stage>`），否则报错不动文件。

### --check 检测项（4 项）

| 检测项 | 严重度 | 说明 |
|--------|--------|------|
| 结构兼容 | FAIL | App.tsx 是否含 `stepText` + `<Stage` |
| 注入完整 | FAIL | App.tsx 是否已有 Subtitle import + 挂载 |
| 组件新鲜度 | WARN | Subtitle.tsx/.css 是否存在且与模板一致 |
| 文案合规 | FAIL | 扫描 `src/chapters/*/narrations.ts`，narration ≤18 字 |

输出示例：

```
=== add-subtitle --check ===
  Target: /path/to/presentation

[PASS] 结构兼容 — App.tsx 含 stepText + <Stage
[FAIL] 注入完整 — 未注入：缺少 Subtitle import 和挂载
[WARN] 组件新鲜度 — 组件缺失: Subtitle.tsx, Subtitle.css
[FAIL] 文案合规 — 2 条 narration 超过 18 字
  src/chapters/01-intro/narrations.ts  L2  "这一句超过十八个字的限制需要被检测..." (22字)

Summary: 1 PASS, 1 WARN, 2 FAIL
```

重复运行 `--presentation`（不加 `--check`）即可修复所有 FAIL/WARN（文案超长除外，需手动拆分 step）。
```

And update the 输入约定 section to add:

```markdown
## 输入约定

每条字幕 **≤12 字**（视频模式），单行显示。超长条由上游 `text-refine` 切分；本 skill 不切分。

presentation 注入模式下，每条 narration **≤18 字**。Subtitle 组件对超长文本做截断兜底（`text.slice(0, 18) + "…"`），但建议在口播稿中提前拆分 step。运行 `--check` 可检测超长文案。
```

- [ ] **Step 2: Commit**

```bash
git add plugins/video-toolkit/skills/add-subtitle/SKILL.md
git commit -m "docs(add-subtitle): document --check mode and 18-char truncation"
```

---

### Task 6: 最终验证 + 端到端测试

- [ ] **Step 1: Run full test suite**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python3 -m pytest tests/ -v
```

Expected: 36 passed, 0 failed

- [ ] **Step 2: Manual smoke test — --check on fixture**

```bash
python3 skill_main.py --presentation tests/fixtures/sample-presentation --check
```

Expected: Prints check report with at least 1 FAIL (文案超长), exit code 1

- [ ] **Step 3: Manual smoke test — default mode on temp copy**

```bash
cp -r tests/fixtures/sample-presentation /tmp/test-pres
python3 skill_main.py --presentation /tmp/test-pres
# Verify components exist
ls /tmp/test-pres/src/components/Subtitle.tsx /tmp/test-pres/src/components/Subtitle.css
# Verify App.tsx patched
grep "Subtitle" /tmp/test-pres/src/App.tsx
# Now --check should show injection PASS
python3 skill_main.py --presentation /tmp/test-pres --check
rm -rf /tmp/test-pres
```

Expected: Components created, App.tsx patched, check shows injection PASS

- [ ] **Step 4: Commit final verification**

```bash
git add -A
git diff --cached --stat
# Only if any change from smoke test
git commit -m "chore(add-subtitle): final verification pass"
```
