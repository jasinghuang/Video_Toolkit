# add-subtitle: 去掉 presentation 注入模式字数限制

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 去掉 add-subtitle presentation 注入模式的 18 字硬截断，新增句末标点 strip，删除文案合规检测。

**Architecture:** 改动集中在 `presentation.py`（核心逻辑）、`skill_main.py`（入口清理）、`SKILL.md`（文档同步）、两个测试文件（测试更新）。不改 CSS、不改视频模式。

**Tech Stack:** Python 3, pytest, React/TypeScript（生成代码为 TSX/CSS 字符串模板）

## Global Constraints

- 视频模式（SRT + 视频）完全不动
- `Subtitle.css` 样式完全不动
- `narrations.ts` 源文件不修改，标点 strip 仅在 Subtitle 组件渲染时生效
- `--check` 从 4 项检测变 3 项
- 所有改动完成后必须 `pytest` 全绿

---

### Task 1: `build_subtitle_tsx()` — 去掉截断 + 句末去标点

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/presentation.py:195-226`

**Interfaces:**
- Consumes: none
- Produces: `build_subtitle_tsx() -> str` — 返回的 TSX 字符串中 Subtitle 组件不再有 `MAX_CHARS` 截断，改为 `text.replace(/[...]+$/, "")` strip 句末标点

- [ ] **Step 1: 修改 `build_subtitle_tsx()` 函数体**

在 `presentation.py` 第 206 行删除 `const MAX_CHARS = 18;` 这一行，第 218 行 `const display = ...` 改为 strip 逻辑：

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
          const display = text.replace(/[，。！？、；：,.!?;:]+$/, "");
          return (
            <div className="subtitle-layer">
              <span className="subtitle-badge">{display}</span>
            </div>
          );
        }
        """
    )
```

改动点：
- 删除 `const MAX_CHARS = 18;`（原 L206 整行 + 上方空行）
- 将 `const display = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) + "…" : text;` 替换为 `const display = text.replace(/[，。！？、；：,.!?;:]+$/, "");`

- [ ] **Step 2: 验证字符串模板语法**

```bash
cd plugins/video-toolkit/skills/add-subtitle
python -c "from presentation import build_subtitle_tsx; tsx = build_subtitle_tsx(); print('OK:', len(tsx), 'chars')"
```

期望: 正常打印 OK + 字符数，无报错。

- [ ] **Step 3: 检查生成的 TSX 不含 MAX_CHARS 且含 replace**

```bash
python -c "from presentation import build_subtitle_tsx; tsx = build_subtitle_tsx(); assert 'MAX_CHARS' not in tsx; assert 'text.replace' in tsx; print('PASS')"
```

期望: PASS

- [ ] **Step 4: Commit**

```bash
git add plugins/video-toolkit/skills/add-subtitle/presentation.py
git commit -m "feat(add-subtitle): remove 18-char truncation, add trailing punctuation strip in Subtitle component"
```

---

### Task 2: `presentation.py` — 删除 `scan_long_narrations`、`_STRING_RE`、`_is_chinese_text`

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/presentation.py:4-41`

**Interfaces:**
- Consumes: none
- Produces: `_STRING_RE`、`_is_chinese_text`、`scan_long_narrations` 三个符号从模块中删除

- [ ] **Step 1: 删除三个符号**

删除 `presentation.py` 第 4-41 行：

- L4: `import re`（删除，不再需要）
- L7-8: `_STRING_RE = re.compile(...)`（删除）
- L11-14: `def _is_chinese_text(...)`（删除）
- L16 空行
- L17-41: `def scan_long_narrations(...)` 整段（删除）
- 保留 L1-2 的 docstring 和 `from pathlib import Path`

文件开头变为：

```python
"""presentation 注入模式：给 web-video-presentation 产出的 Vite+React
presentation 注入一个字幕层（显示当前 step 的 narration）。"""

from pathlib import Path


def check_presentation(pres_dir: Path) -> dict:
```

- [ ] **Step 2: 验证模块可正常 import**

```bash
cd plugins/video-toolkit/skills/add-subtitle
python -c "from presentation import check_presentation, format_check_report, inject_presentation, build_subtitle_tsx, build_subtitle_css; print('OK')"
```

期望: OK，无 ImportError

- [ ] **Step 3: Commit**

```bash
git add plugins/video-toolkit/skills/add-subtitle/presentation.py
git commit -m "refactor(add-subtitle): remove scan_long_narrations and related helpers"
```

---

### Task 3: `presentation.py` — 更新 `check_presentation()` 和 `format_check_report()`

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/presentation.py:44-171`

**Interfaces:**
- `check_presentation()` 签名从 `def check_presentation(pres_dir: Path, max_chars: int = 18) -> dict` 变为 `def check_presentation(pres_dir: Path) -> dict`
- `check_presentation()` 返回的 dict 从 4 个 key 变为 3 个（删 `narrations`）
- `format_check_report()` 不再遍历 `narrations` key

- [ ] **Step 1: 更新 `check_presentation()` 函数**

修改函数签名和删除第 4 项检测：

```python
def check_presentation(pres_dir: Path) -> dict:
    """Run 3 checks on a presentation directory. Read-only, no side effects.

    Returns a dict with keys: structure, injection, components.
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

    return {
        "structure": structure,
        "injection": injection,
        "components": components,
    }
```

- [ ] **Step 2: 更新 `format_check_report()` 函数**

```python
def format_check_report(results: dict) -> str:
    """Format check_presentation() results as structured terminal text."""
    labels = {
        "structure": "结构兼容",
        "injection": "注入完整",
        "components": "组件新鲜度",
    }
    status_mark = {"pass": "[PASS]", "warn": "[WARN]", "fail": "[FAIL]"}

    lines = []
    lines.append("=== add-subtitle --check ===")
    for key in ["structure", "injection", "components"]:
        entry = results[key]
        mark = status_mark.get(entry["status"], "[????]")
        label = labels[key]
        lines.append(f"{mark} {label} — {entry['msg']}")

    # 摘要
    statuses = [e["status"] for e in results.values()]
    fail_count = statuses.count("fail")
    warn_count = statuses.count("warn")
    pass_count = statuses.count("pass")
    lines.append("")
    lines.append(f"Summary: {pass_count} PASS, {warn_count} WARN, {fail_count} FAIL")

    return "\n".join(lines)
```

改动点：
- `labels` 字典删除 `"narrations": "文案合规"`
- `for key in [...]` 列表删除 `"narrations"`
- 删除 L155-161 的 `long_lines` 详情打印段
- docstring 不再提具体 key 名

- [ ] **Step 3: 验证模块正常**

```bash
cd plugins/video-toolkit/skills/add-subtitle
python -c "
from presentation import check_presentation, format_check_report
from pathlib import Path
import tempfile, shutil, os

fixture = Path('tests/fixtures/sample-presentation')
with tempfile.TemporaryDirectory() as tmp:
    pres = Path(tmp) / 'pres'
    shutil.copytree(str(fixture), str(pres))
    from presentation import inject_presentation
    inject_presentation(pres)
    result = check_presentation(pres)
    assert 'narrations' not in result, 'narrations key should be gone'
    assert set(result.keys()) == {'structure', 'injection', 'components'}
    report = format_check_report(result)
    assert '文案合规' not in report
    print('PASS')
"
```

期望: PASS

- [ ] **Step 4: Commit**

```bash
git add plugins/video-toolkit/skills/add-subtitle/presentation.py
git commit -m "refactor(add-subtitle): remove narrations check from check_presentation (4→3 checks)"
```

---

### Task 4: `skill_main.py` — 删除 `scan_long_narrations` 引用

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/skill_main.py:118,149-157`

**Interfaces:**
- Consumes: `presentation` 模块（不再导出 `scan_long_narrations`）
- Produces: `--presentation` 修复模式不再在末尾打印超长文案告警

- [ ] **Step 1: 修改 import 行（L118）**

将：
```python
from presentation import check_presentation, format_check_report, inject_presentation, scan_long_narrations
```
改为：
```python
from presentation import check_presentation, format_check_report, inject_presentation
```

- [ ] **Step 2: 删除 fix mode 告警代码块（L149-157）**

删除整个 `scan_long_narrations` 调用和打印块：

删除前（L141-157）：
```python
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
            long_lines = scan_long_narrations(pres_path)
            if long_lines:
                print(f"\n  ⚠ {len(long_lines)} narration(s) exceed 18 chars:")
                for item in long_lines:
                    text_preview = item["text"][:30] + ("..." if len(item["text"]) > 30 else "")
                    print(f"    {item['file']}  L{item['line']}  \"{text_preview}\" ({item['char_count']}字)")
                print("  → 建议在口播稿中将以上文案拆分为多个 step")
            print(f"{'=' * 60}\nDone!\n{'=' * 60}\n")
        return
```

删除后（L141-157）：
```python
        else:
            # 修复模式
            if args.srt_file or args.video:
                parser.error("--presentation 与 srt_file/--video 互斥")
            print(f"\n{'=' * 60}")
            print("add-subtitle — Inject subtitle layer into presentation")
            print(f"{'=' * 60}")
            print(f"  Target: {pres_path}")
            inject_presentation(pres_path)
            print(f"{'=' * 60}\nDone!\n{'=' * 60}\n")
        return
```

- [ ] **Step 3: 验证 skill_main 可正常 import 和运行 presentation 模式**

```bash
cd plugins/video-toolkit/skills/add-subtitle
python -c "from skill_main import main; print('import OK')"
```

期望: import OK

```bash
# 用临时 fixture 验证 --presentation 修复模式不崩溃
python -c "
from pathlib import Path
import tempfile, shutil, subprocess, sys

fixture = Path('tests/fixtures/sample-presentation')
with tempfile.TemporaryDirectory() as tmp:
    pres = Path(tmp) / 'pres'
    shutil.copytree(str(fixture), str(pres))
    result = subprocess.run(
        [sys.executable, 'skill_main.py', '--presentation', str(pres)],
        capture_output=True, text=True,
    )
    print('STDOUT:', result.stdout[-200:] if len(result.stdout) > 200 else result.stdout)
    print('STDERR:', result.stderr[-200:] if len(result.stderr) > 200 else result.stderr)
    print('exit code:', result.returncode)
    assert result.returncode == 0, f'Expected exit 0, got {result.returncode}'
    assert 'exceed 18 chars' not in result.stdout
    print('PASS')
"
```

期望: PASS, exit code 0, 输出不含 "exceed 18 chars"

- [ ] **Step 4: 验证 --check 模式不崩溃**

```bash
cd plugins/video-toolkit/skills/add-subtitle
python -c "
from pathlib import Path
import tempfile, shutil, subprocess, sys

fixture = Path('tests/fixtures/sample-presentation')
with tempfile.TemporaryDirectory() as tmp:
    pres = Path(tmp) / 'pres'
    shutil.copytree(str(fixture), str(pres))
    # 先注入
    subprocess.run([sys.executable, 'skill_main.py', '--presentation', str(pres)], capture_output=True)
    # 再 check
    result = subprocess.run(
        [sys.executable, 'skill_main.py', '--presentation', str(pres), '--check'],
        capture_output=True, text=True,
    )
    print(result.stdout)
    print('exit code:', result.returncode)
    # fixture 注入后结构+注入+组件 三项都应 pass（无超长文案检测）
    assert result.returncode == 0, f'Expected exit 0, got {result.returncode}'
    assert '文案合规' not in result.stdout
    assert 'Summary: 3 PASS' in result.stdout or 'Summary: 2 PASS' in result.stdout
    print('PASS')
"
```

期望: PASS, exit code 0, 输出不含 "文案合规"

- [ ] **Step 5: Commit**

```bash
git add plugins/video-toolkit/skills/add-subtitle/skill_main.py
git commit -m "fix(add-subtitle): remove scan_long_narrations import and call from skill_main"
```

---

### Task 5: `SKILL.md` — 文档更新

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/SKILL.md`

**Interfaces:**
- Consumes: none
- Produces: 文档不再提 ≤18 字 / 文案合规

- [ ] **Step 1: 修改 description frontmatter（L3-11）**

将 L11 的：
```
（超出由上游 text-refine 切分）。当用户要给视频加字幕、字幕叠加、
```
保留不变（视频模式部分）。

L9-10 的 presentation 描述中去掉字数相关：
```
也可给 web-video-presentation 产出的 presentation（Vite+React 项目）
注入字幕层（显示当前 narration，随 step 自动切换），运行 --check 可诊断
presentation 项目的字幕注入状态与文案合规性。依赖 jinja2（视频模式自动安装）。
```
改为：
```
也可给 web-video-presentation 产出的 presentation（Vite+React 项目）
注入字幕层（显示当前 narration，随 step 自动切换），运行 --check 可诊断
presentation 项目的字幕注入状态。依赖 jinja2（视频模式自动安装）。
```

- [ ] **Step 2: 修改 `--check` 检测项表格（L54-61）**

将 4 行表格改为 3 行，删除「文案合规」行：

```markdown
| 检测项 | 严重度 | 说明 |
|--------|--------|------|
| 结构兼容 | FAIL | App.tsx 是否含 `stepText` + `<Stage` |
| 注入完整 | FAIL | App.tsx 是否已有 Subtitle import + 挂载 |
| 组件新鲜度 | WARN | Subtitle.tsx/.css 是否存在且与模板一致 |
```

- [ ] **Step 3: 修改输出示例（L63-76）**

删除 `[FAIL] 文案合规` 行和后面的超长详情，Summary 更新：

```markdown
输出示例：

```
=== add-subtitle --check ===
  Target: /path/to/presentation

[PASS] 结构兼容 — App.tsx 含 stepText + <Stage
[FAIL] 注入完整 — 未注入：缺少 Subtitle import 和挂载
[WARN] 组件新鲜度 — 组件缺失: Subtitle.tsx, Subtitle.css

Summary: 1 PASS, 1 WARN, 1 FAIL
```
```

- [ ] **Step 4: 修改 L77-78**

删除 `（文案超长除外，需手动拆分 step）`：

原来：
```
重复运行 `--presentation`（不加 `--check`）即可修复所有 FAIL/WARN（文案超长除外，需手动拆分 step）。
```
改为：
```
重复运行 `--presentation`（不加 `--check`）即可修复所有 FAIL/WARN。
```

- [ ] **Step 5: 修改 L92-97 整个 presentation 字数限制段落**

将：
```markdown
presentation 注入模式下，每条 narration **≤18 字**。Subtitle 组件对超长文本做截断兜底（`text.slice(0, 18) + "…"`），但建议在口播稿中提前拆分 step。运行 `--check` 可检测超长文案。
```
改为：
```markdown
presentation 注入模式下，字幕文本直接取自 `narrations.ts`，不做字数限制。超长文本由 CSS `text-overflow: ellipsis` 兜底（约 38 字后触发省略号），正常 step 口播不会触发。
```

- [ ] **Step 6: 修改配合关系图（L130-133）**

将：
```
web-video-presentation → add-subtitle --presentation → add-subtitle --check
     制作项目                注入/更新字幕层                诊断检测
```
保持（这段没有字数相关内容，不动）。

- [ ] **Step 7: Commit**

```bash
git add plugins/video-toolkit/skills/add-subtitle/SKILL.md
git commit -m "docs(add-subtitle): remove 18-char limit and narrations check from docs"
```

---

### Task 6: `tests/test_presentation.py` — 更新/删除/新增测试

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py`

**Interfaces:**
- Consumes: `presentation.build_subtitle_tsx()`, `presentation.check_presentation()`, `presentation.format_check_report()`
- Produces: 所有测试通过

- [ ] **Step 1: 更新 `test_build_subtitle_tsx_contains_component_and_hide_key`**

删除 `MAX_CHARS` 断言（L44-45），新增 strip 断言：

```python
def test_build_subtitle_tsx_contains_component_and_hide_key():
    tsx = build_subtitle_tsx()
    assert "export function Subtitle" in tsx
    assert 'text: string' in tsx
    assert '"h"' in tsx and '"H"' in tsx  # H 键隐藏
    assert "subtitle-layer" in tsx
    assert "subtitle-badge" in tsx
    assert "useState" in tsx  # hidden state
    # 句末标点 strip
    assert "text.replace" in tsx
    assert "，。！？、；：,.!?;:" in tsx
    # 确认不再有截断
    assert "MAX_CHARS" not in tsx
    assert "text.slice" not in tsx
```

- [ ] **Step 2: 新增 `test_build_subtitle_tsx_strips_trailing_punctuation`**

在 `test_build_subtitle_css_contains_fixed_params` 之后添加：

```python
def test_build_subtitle_tsx_strips_trailing_punctuation():
    """验证生成的 Subtitle 组件会 strip 句末标点。"""
    tsx = build_subtitle_tsx()
    # 提取 render 逻辑验证：正则应覆盖中英文常见句末标点
    assert "text.replace(/[，。！？、；：,.!?;:]+$/, \"\")" in tsx
    # 确认只 strip 尾部（$ 锚定），不处理句中
    # 正则末尾 $ 确保只匹配句末
    assert "+$/, " in tsx
```

- [ ] **Step 3: 删除 `scan_long_narrations` 相关测试**

删除以下 3 个测试函数（L150-178）：
- `test_scan_long_narrations_finds_overlong`
- `test_scan_long_narrations_empty_when_no_narrations_dir`
- `test_scan_long_narrations_empty_when_all_short`

同时删除文件顶部的 `from presentation import scan_long_narrations`（如果存在单独 import）。

- [ ] **Step 4: 更新 `check_presentation` 相关测试**

删除 `test_check_catches_long_narrations`（L225-233）。

更新 `test_check_passes_clean_presentation`（L186-198），删除 `max_chars=100`：

```python
def test_check_passes_clean_presentation():
    pres = Path(__file__).resolve().parent / "fixtures" / "sample-presentation"
    from presentation import inject_presentation
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        tmp_pres = Path(tmp) / "pres"
        shutil.copytree(str(pres), str(tmp_pres))
        inject_presentation(tmp_pres)
        result = check_presentation(tmp_pres)
        assert result["structure"]["status"] == "pass"
        assert result["injection"]["status"] == "pass"
        assert result["components"]["status"] == "pass"
```

更新 `test_check_catches_missing_injection`（L201-210），删除 `max_chars=100`：

```python
def test_check_catches_missing_injection():
    pres = Path(__file__).resolve().parent / "fixtures" / "sample-presentation"
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        tmp_pres = Path(tmp) / "pres"
        shutil.copytree(str(pres), str(tmp_pres))
        result = check_presentation(tmp_pres)
        assert result["injection"]["status"] == "fail"
        assert result["components"]["status"] == "warn"
```

更新 `test_check_rejects_non_standard_structure`（L213-222），删除 `max_chars=18`：

```python
def test_check_rejects_non_standard_structure(tmp_path: Path):
    pres = tmp_path / "presentation"
    (pres / "src").mkdir(parents=True)
    (pres / "src" / "App.tsx").write_text(
        'export default function App() { return <div>no stage</div>; }\n',
        encoding="utf-8",
    )
    result = check_presentation(pres)
    assert result["structure"]["status"] == "fail"
    assert "stepText" in result["structure"]["msg"]
```

- [ ] **Step 5: 更新 `format_check_report` 测试**

更新 `test_format_check_report_all_pass`（L236-247），results 字典删除 `"narrations"` key：

```python
def test_format_check_report_all_pass():
    results = {
        "structure":  {"status": "pass", "msg": "App.tsx 含 stepText + <Stage"},
        "injection":  {"status": "pass", "msg": "Subtitle import + 挂载完整"},
        "components": {"status": "pass", "msg": "Subtitle.tsx/.css 与模板一致", "detail": "ok"},
    }
    report = format_check_report(results)
    assert "[PASS]" in report
    assert "[FAIL]" not in report
    assert "[WARN]" not in report
```

更新 `test_format_check_report_with_failures`（L249-260），删除 `"narrations"` key：

```python
def test_format_check_report_with_failures():
    results = {
        "structure":  {"status": "pass", "msg": "ok"},
        "injection":  {"status": "fail", "msg": "未找到 Subtitle import"},
        "components": {"status": "warn", "msg": "Subtitle.tsx 版本过旧", "detail": "stale"},
    }
    report = format_check_report(results)
    assert "[FAIL]" in report
    assert "[WARN]" in report
```

- [ ] **Step 6: 清理 import**

检查文件顶部 import，删除所有对 `scan_long_narrations` 的 import（如有）：

```python
from presentation import scan_long_narrations  # 删除这行
```

检查 test_presentation.py L147：`from presentation import scan_long_narrations, check_presentation, format_check_report` — 删除 `scan_long_narrations, `。

- [ ] **Step 7: 运行 test_presentation.py 全部测试**

```bash
cd plugins/video-toolkit/skills/add-subtitle
python -m pytest tests/test_presentation.py -v
```

期望: 全部 PASS，无 FAIL/ERROR

- [ ] **Step 8: Commit**

```bash
git add plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py
git commit -m "test(add-subtitle): update tests — remove scan/18-char tests, add strip test"
```

---

### Task 7: `tests/test_cli_render.py` — 删除失效测试

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/tests/test_cli_render.py:111-136`

**Interfaces:**
- Consumes: `skill_main.py` CLI
- Produces: `test_check_mode_reports_fail_on_long_narrations` 不存在

- [ ] **Step 1: 删除 `test_check_mode_reports_fail_on_long_narrations`**

删除 L111-136 整个测试函数。该测试验证 `--check` 返回 exit code 1 + `[FAIL] 文案合规`，但 narrations check 已删除，fixture 注入后再 `--check` 应该是 3 PASS + exit 0，原断言会失败。

同时检查文件中是否有其他对 `scan_long_narrations` 或 "文案合规" 的引用。当前 L111-136 是唯一的 — 仅删这一处。

- [ ] **Step 2: 运行 test_cli_render.py 全部测试**

```bash
cd plugins/video-toolkit/skills/add-subtitle
python -m pytest tests/test_cli_render.py -v
```

期望: 全部 PASS。特别注意 `test_check_rejects_srt_with_check` 和 `test_check_help_shows_check_flag` 仍然通过。

- [ ] **Step 3: Commit**

```bash
git add plugins/video-toolkit/skills/add-subtitle/tests/test_cli_render.py
git commit -m "test(add-subtitle): remove test_check_mode_reports_fail_on_long_narrations"
```

---

### Task 8: 全量测试 + 最终验证

**Files:**
- 无新修改（验证 + 可能有遗漏修复）

- [ ] **Step 1: 运行完整测试套件**

```bash
cd plugins/video-toolkit/skills/add-subtitle
python -m pytest tests/ -v
```

期望: 全部 PASS

- [ ] **Step 2: 验证 `skill_main.py --help` 输出正确**

```bash
cd plugins/video-toolkit/skills/add-subtitle
python skill_main.py --help
```

期望: 正常输出帮助，包含 `--presentation` 和 `--check`，不含 `--palette` 等废弃参数。

- [ ] **Step 3: 端到端验证 presentation 注入 + check**

```bash
cd plugins/video-toolkit/skills/add-subtitle
python -c "
from pathlib import Path
import tempfile, shutil, subprocess, sys

fixture = Path('tests/fixtures/sample-presentation')
with tempfile.TemporaryDirectory() as tmp:
    pres = Path(tmp) / 'pres'
    shutil.copytree(str(fixture), str(pres))
    
    # 1. 注入
    r = subprocess.run([sys.executable, 'skill_main.py', '--presentation', str(pres)], capture_output=True, text=True)
    assert r.returncode == 0, f'Inject failed: {r.stderr}'
    
    # 2. check（应该全 PASS）
    r = subprocess.run([sys.executable, 'skill_main.py', '--presentation', str(pres), '--check'], capture_output=True, text=True)
    print(r.stdout)
    assert r.returncode == 0, f'Check failed: exit {r.returncode}'
    assert '文案合规' not in r.stdout
    assert 'Summary:' in r.stdout
    
    # 3. 验证 Subtitle.tsx 内容不含 MAX_CHARS
    tsx = (pres / 'src' / 'components' / 'Subtitle.tsx').read_text()
    assert 'MAX_CHARS' not in tsx
    assert 'text.replace' in tsx
    print('E2E PASS')
"
```

期望: E2E PASS

- [ ] **Step 4: 最终 commit（如有遗漏修复）**

```bash
git status
# 如果测试发现任何问题，修复后：
git add -A
git commit -m "fix(add-subtitle): final adjustments from integration testing"
```

如果 Step 1-3 全部通过且无修改，则跳过此 commit。
