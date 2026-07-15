# add-subtitle presentation 注入模式 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 给 add-subtitle 新增 `--presentation <path>` 模式——给 web-video-presentation 产出的 Vite+React presentation 注入一个字幕层（显示当前 step 的 narration，黑字白底圆角描边标签样式，舞台内绝对 px，默认显示 + H 键隐藏）。

**Architecture:** 新增 `presentation.py` 模块承载注入逻辑（`validate_presentation` / `build_subtitle_tsx` / `build_subtitle_css` / `patch_app_tsx` / `inject_presentation`）；`skill_main.py` 加 `--presentation` CLI 参数并分发到注入流程（原视频模式保留不动）。字幕样式参数先用真实 presentation mockup 标定，再固化进 `build_subtitle_css`。

**Tech Stack:** Python 3 标准库（`pathlib`/`re`/`textwrap`）、pytest；生成的字幕组件是 React + TS（宿主 presentation 已有 react + typescript）。

## Global Constraints

- 不改 web-video-presentation skill（第三方仓库 ConardLi/garden-skills）。
- 字幕层在 presentation 舞台内（1920×1080 设计坐标 + `transform: scale`），用绝对 px，不用 cqw/vw。
- 字幕样式固定：黑字 `#000` + 白底 `#fff` + 描边 + 圆角 + 柔和投影 + `FZLanTingHei`（回退 PingFang SC / 微软雅黑）字重 600 + 单行 `nowrap` + 居中 + 距底 8%。
- `--presentation` 与 `srt_file + --video` 互斥。
- 注入幂等：重复运行 `--presentation` 不重复 patch、不重复 import。
- patch 前必须先校验 `App.tsx` 含 `stepText` 和 `<Stage`，否则报错退出、不动文件。
- 原"视频 + srt → HTML"模式保留，现有 9 个测试不能破。
- working directory 可能残留子目录，所有 git/path 操作用绝对路径或 `git -C <repo>`。

**参考 spec:** [docs/superpowers/specs/2026-07-15-add-subtitle-presentation-injection-design.md](../specs/2026-07-15-add-subtitle-presentation-injection-design.md)

---

## File Structure

```
plugins/video-toolkit/skills/add-subtitle/
├── skill_main.py              # 改：加 --presentation 参数 + 模式分发
├── presentation.py            # 新增：注入逻辑
├── templates/player.html.j2   # 不变（视频模式）
└── tests/
    ├── conftest.py            # 不变
    ├── test_parse_srt.py      # 不变
    ├── test_cli_render.py     # 不变（视频模式）+ 可能加互斥测试
    ├── test_presentation.py   # 新增：注入逻辑测试
    └── fixtures/
        └── sample-presentation/
            └── src/
                └── App.tsx    # 新增：最小 web-video-presentation 结构副本
```

`presentation.py` 函数接口（后续 task 逐步实现）：

- `validate_presentation(content: str) -> None`：校验 App.tsx 文本含 `stepText` + `<Stage`，否则 `raise ValueError`。
- `build_subtitle_tsx() -> str`：返回 `Subtitle.tsx` 文件内容。
- `build_subtitle_css() -> str`：返回 `Subtitle.css` 文件内容（含 Task 1 标定的参数）。
- `patch_app_tsx(content: str) -> str`：返回 patch 后的 App.tsx 文本（加 import + 挂载），幂等。
- `inject_presentation(presentation_dir: Path) -> None`：串起校验 → 生成 → patch，写文件。

测试运行：`cd plugins/video-toolkit/skills/add-subtitle && python3 -m pytest tests/ -v`。

---

## Task 1: 用真实 presentation mockup 标定舞台字幕样式参数

> 视觉标定任务，不写 Python 代码。产出是一组确定的 CSS 参数值，供 Task 3 的 `build_subtitle_css` 使用。

**Files:**
- 参考（不改）：`/Users/jasing/Documents/Work/Create_knowledge_explanation_videos/video_test_04/episodes/ep00-课程总览/presentation`
- 产出：把最终参数回填到本 plan Task 3 的 `build_subtitle_css` 代码块 + spec 的 CSS 节。

- [ ] **Step 1: 启动 ep00 的 dev server（后台）**

```bash
cd /Users/jasing/Documents/Work/Create_knowledge_explanation_videos/video_test_04/episodes/ep00-课程总览/presentation && npm run dev
```

后台运行；记下端口（通常 `localhost:5173`）。

- [ ] **Step 2: 用 playwright 打开 presentation，注入字幕标签调参**

用 `mcp__plugin_playwright_playwright__browser_navigate` 打开 dev server URL，再用 `browser_evaluate` 注入下面这段 CSS + 一个临时字幕标签到舞台（初步参数来自 spec）：

```js
() => {
  const style = document.createElement("style");
  style.textContent = `
    .subtitle-layer {
      position: absolute; bottom: 86px; left: 50%;
      transform: translateX(-50%); z-index: 50; pointer-events: none;
    }
    .subtitle-badge {
      display: inline-block;
      font-family: "FZLanTingHei","PingFang SC","Microsoft YaHei",sans-serif;
      font-weight: 600; font-size: 40px; line-height: 1.2; letter-spacing: 0.06em;
      color: #000; background: #fff;
      border: 2.5px solid #000; border-radius: 18px; padding: 12px 40px;
      box-shadow: 0 10px 32px rgba(0,0,0,0.28); white-space: nowrap;
    }`;
  document.head.appendChild(style);
  const layer = document.createElement("div");
  layer.className = "subtitle-layer";
  layer.innerHTML = '<span class="subtitle-badge">一个视频，只解决一个问题</span>';
  document.querySelector(".stage, [class*="stage"], main")?.appendChild(layer)
    ?? document.body.appendChild(layer);
  return document.querySelector(".subtitle-badge") ? "injected" : "no-stage-found";
}
```

- [ ] **Step 3: 截图，与用户一起按需微调参数**

用 `browser_take_screenshot` 截图，展示给用户。按反馈调 `font-size` / `border` / `border-radius` / `padding` / `bottom` 等，反复截图直到用户认可。

- [ ] **Step 4: 固化参数**

把用户认可的最终值写回：
1. 本 plan **Task 3 的 `build_subtitle_css` 代码块**（替换初步值）；
2. spec `docs/superpowers/specs/2026-07-15-add-subtitle-presentation-injection-design.md` 的 CSS 节。

- [ ] **Step 5: 关掉 dev server**

```bash
lsof -ti:5173 | xargs kill 2>/dev/null || true
```

> 本 task 无 git commit（参数记录在后续 task 的代码里才落盘）。

---

## Task 2: presentation.py + validate_presentation（TDD）

**Files:**
- Create: `plugins/video-toolkit/skills/add-subtitle/presentation.py`
- Create: `plugins/video-toolkit/skills/add-subtitle/tests/fixtures/sample-presentation/src/App.tsx`
- Create: `plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py`

**Interfaces:**
- Produces: `validate_presentation(content: str) -> None`（不匹配 `raise ValueError`）。

- [ ] **Step 1: 创建 fixture App.tsx（最小 web-video-presentation 结构）**

创建 `plugins/video-toolkit/skills/add-subtitle/tests/fixtures/sample-presentation/src/App.tsx`：

```tsx
import { Stage } from "./components/Stage";
import { useStepper } from "./hooks/useStepper";
import { CHAPTERS } from "./registry/chapters";

export default function App() {
  const stepper = useStepper(CHAPTERS);
  const ch = CHAPTERS[stepper.cursor.chapter]!;
  const Cmp = ch.Component;
  const stepText = ch.narrations[stepper.cursor.step] ?? "";

  return (
    <Stage onAdvance={stepper.next}>
      <div key={ch.id} className="scene">
        <Cmp step={stepper.cursor.step} />
      </div>
    </Stage>
  );
}
```

> 这个 fixture 只用于文本级 patch/validate 测试，不需要真的能跑 React（不跑 tsc）。

- [ ] **Step 2: 写失败测试**

创建 `plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py`：

```python
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
```

- [ ] **Step 3: 运行测试，确认失败**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python3 -m pytest tests/test_presentation.py -v
```

Expected: 3 FAIL（`ModuleNotFoundError: presentation`）。

- [ ] **Step 4: 实现 presentation.py 的 validate_presentation**

创建 `plugins/video-toolkit/skills/add-subtitle/presentation.py`：

```python
"""presentation 注入模式：给 web-video-presentation 产出的 Vite+React
presentation 注入一个字幕层（显示当前 step 的 narration）。"""

from pathlib import Path


def validate_presentation(content: str) -> None:
    """校验 App.tsx 文本是标准 web-video-presentation 结构。

    必须含 `stepText`（当前 narration 变量）和 `<Stage`（舞台组件）。
    不符合则抛 ValueError——后续 patch 不动文件。
    """
    if "stepText" not in content:
        raise ValueError(
            "App.tsx 未找到 stepText：不是标准 web-video-presentation 结构，"
            "可能模板已变更，拒绝注入"
        )
    if "<Stage" not in content:
        raise ValueError(
            "App.tsx 未找到 <Stage>：不是标准 web-video-presentation 结构，"
            "可能模板已变更，拒绝注入"
        )
```

- [ ] **Step 5: 运行测试，确认通过**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python3 -m pytest tests/test_presentation.py -v
```

Expected: 3 passed。

- [ ] **Step 6: 提交**

```bash
git -C /Users/jasing/Documents/Work/perhapsjas_skill_market add plugins/video-toolkit/skills/add-subtitle/presentation.py plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py plugins/video-toolkit/skills/add-subtitle/tests/fixtures
git -C /Users/jasing/Documents/Work/perhapsjas_skill_market commit -m "feat(add-subtitle): add validate_presentation for injection mode

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: build_subtitle_tsx + build_subtitle_css（TDD）

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/presentation.py`（追加两个函数）
- Modify: `plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py`（追加测试）

**Interfaces:**
- Produces: `build_subtitle_tsx() -> str`、`build_subtitle_css() -> str`。

> CSS 参数用 Task 1 mockup 标定的最终值。下面代码块里的值是 spec 初步值；Task 1 若改了，以 Task 1 固化的值为准。

- [ ] **Step 1: 追加失败测试**

在 `tests/test_presentation.py` 末尾追加：

```python
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
    # Task 1 标定的参数（初步值；Task 1 改了就以最终值为准）
    assert "bottom: 86px" in css
    assert "border: 2.5px solid #000" in css
    assert "border-radius: 18px" in css
    assert "padding: 12px 40px" in css
    assert "font-size: 40px" in css
    assert "box-shadow: 0 10px 32px rgba(0, 0, 0, 0.28)" in css
    assert "white-space: nowrap" in css
    assert "FZLanTingHei" in css
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python3 -m pytest tests/test_presentation.py -v
```

Expected: 2 FAIL（`ImportError: cannot import name build_subtitle_tsx`）。

- [ ] **Step 3: 追加实现到 presentation.py**

在 `plugins/video-toolkit/skills/add-subtitle/presentation.py` 末尾追加：

```python
from textwrap import dedent


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
          return (
            <div className="subtitle-layer">
              <span className="subtitle-badge">{text}</span>
            </div>
          );
        }
        """
    )


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
        }
        """
    )
```

- [ ] **Step 4: 运行测试，确认通过**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python3 -m pytest tests/test_presentation.py -v
```

Expected: 5 passed（Task 2 的 3 个 + 本 task 的 2 个）。

- [ ] **Step 5: 提交**

```bash
git -C /Users/jasing/Documents/Work/perhapsjas_skill_market add plugins/video-toolkit/skills/add-subtitle/presentation.py plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py
git -C /Users/jasing/Documents/Work/perhapsjas_skill_market commit -m "feat(add-subtitle): add build_subtitle_tsx/css for injection mode

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: patch_app_tsx（TDD，幂等）

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/presentation.py`（追加 `patch_app_tsx`）
- Modify: `plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py`（追加测试）

**Interfaces:**
- Produces: `patch_app_tsx(content: str) -> str`（幂等：已含 import 则原样返回）。

- [ ] **Step 1: 追加失败测试**

在 `tests/test_presentation.py` 末尾追加：

```python
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
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python3 -m pytest tests/test_presentation.py -v
```

Expected: 3 FAIL（`ImportError: cannot import name patch_app_tsx`）。

- [ ] **Step 3: 追加 patch_app_tsx 到 presentation.py**

在 `plugins/video-toolkit/skills/add-subtitle/presentation.py` 顶部 import 区加 `import re`，并在末尾追加：

```python
SUBTITLE_IMPORT = 'import { Subtitle } from "./components/Subtitle";'


def patch_app_tsx(content: str) -> str:
    """给 App.tsx 文本加 Subtitle 的 import 和挂载。幂等。

    - import 加在连续 import 块的末尾。
    - 挂载点：<Stage ...> 块内、</Stage> 之前插入 <Subtitle text={stepText} />。
    - 已含 import 视为已注入，原样返回。
    """
    if SUBTITLE_IMPORT in content:
        return content

    # 1) 在第一段连续 import 行之后插入 Subtitle import
    content = re.sub(
        r"((?:^import[^\n]*\n)+)",
        lambda m: m.group(1) + SUBTITLE_IMPORT + "\n",
        content,
        count=1,
        flags=re.MULTILINE,
    )

    # 2) 在 <Stage ...>...</Stage> 块的 </Stage> 之前挂载 Subtitle
    content = re.sub(
        r"(<Stage[^>]*>[\s\S]*?)(</Stage>)",
        lambda m: m.group(1) + "      <Subtitle text={stepText} />\n    " + m.group(2),
        content,
        count=1,
    )
    return content
```

> `import re` 加在文件顶部 `from pathlib import Path` 旁边。

- [ ] **Step 4: 运行测试，确认通过**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python3 -m pytest tests/test_presentation.py -v
```

Expected: 8 passed（前 5 + 本 task 3）。

- [ ] **Step 5: 提交**

```bash
git -C /Users/jasing/Documents/Work/perhapsjas_skill_market add plugins/video-toolkit/skills/add-subtitle/presentation.py plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py
git -C /Users/jasing/Documents/Work/perhapsjas_skill_market commit -m "feat(add-subtitle): add idempotent patch_app_tsx

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: inject_presentation 集成（TDD）

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/presentation.py`（追加 `inject_presentation`）
- Modify: `plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py`（追加测试）

**Interfaces:**
- Consumes: `validate_presentation`、`build_subtitle_tsx`、`build_subtitle_css`、`patch_app_tsx`（前几个 task）
- Produces: `inject_presentation(presentation_dir: Path) -> None`。

- [ ] **Step 1: 追加失败测试**

在 `tests/test_presentation.py` 末尾追加：

```python
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
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python3 -m pytest tests/test_presentation.py -v
```

Expected: 4 FAIL（`ImportError: cannot import name inject_presentation`）。

- [ ] **Step 3: 追加 inject_presentation 到 presentation.py**

在 `plugins/video-toolkit/skills/add-subtitle/presentation.py` 末尾追加：

```python
def inject_presentation(presentation_dir: Path) -> None:
    """给 presentation 项目注入字幕层：校验 → 生成组件/CSS → patch App.tsx。

    幂等：重复运行不重复 patch。
    """
    app_path = presentation_dir / "src" / "App.tsx"
    if not app_path.exists():
        raise ValueError(f"未找到 {app_path}：不是 web-video-presentation 项目")

    original = app_path.read_text(encoding="utf-8")
    validate_presentation(original)  # 失败抛 ValueError，下面不执行

    components_dir = presentation_dir / "src" / "components"
    components_dir.mkdir(parents=True, exist_ok=True)
    (components_dir / "Subtitle.tsx").write_text(build_subtitle_tsx(), encoding="utf-8")
    (components_dir / "Subtitle.css").write_text(build_subtitle_css(), encoding="utf-8")
    print(f"  Generated: {components_dir / 'Subtitle.tsx'}")
    print(f"  Generated: {components_dir / 'Subtitle.css'}")

    patched = patch_app_tsx(original)
    if patched != original:
        app_path.write_text(patched, encoding="utf-8")
        print(f"  Patched:   {app_path}")
    else:
        print(f"  Already injected: {app_path}")
```

- [ ] **Step 4: 运行测试，确认通过**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python3 -m pytest tests/test_presentation.py -v
```

Expected: 12 passed（前 8 + 本 task 4）。

- [ ] **Step 5: 提交**

```bash
git -C /Users/jasing/Documents/Work/perhapsjas_skill_market add plugins/video-toolkit/skills/add-subtitle/presentation.py plugins/video-toolkit/skills/add-subtitle/tests/test_presentation.py
git -C /Users/jasing/Documents/Work/perhapsjas_skill_market commit -m "feat(add-subtitle): add inject_presentation integration

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 6: skill_main.py CLI 分发 + 模式互斥（TDD）

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/skill_main.py`（加 `--presentation` + 分发）
- Modify: `plugins/video-toolkit/skills/add-subtitle/tests/test_cli_render.py`（加互斥/注入测试）

**Interfaces:**
- Consumes: `inject_presentation`（Task 5）
- 保留：原视频模式（`srt_file` + `--video`）。

- [ ] **Step 1: 追加失败测试**

在 `tests/test_cli_render.py` 末尾追加：

```python
def test_presentation_mode_injects_subtitle(tmp_path: Path):
    # 构造最小 presentation（复用 fixture App.tsx）
    fixture_app = (
        Path(__file__).resolve().parent / "fixtures" / "sample-presentation" / "src" / "App.tsx"
    ).read_text(encoding="utf-8")
    pres = tmp_path / "presentation"
    (pres / "src").mkdir(parents=True)
    (pres / "src" / "App.tsx").write_text(fixture_app, encoding="utf-8")

    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--presentation", str(pres)],
        capture_output=True, text=True,
    )
    assert result.returncode == 0, result.stderr
    assert (pres / "src" / "components" / "Subtitle.tsx").exists()
    assert (pres / "src" / "components" / "Subtitle.css").exists()
    assert "Subtitle" in (pres / "src" / "App.tsx").read_text(encoding="utf-8")


def test_presentation_and_video_are_mutually_exclusive(tmp_path: Path):
    srt = tmp_path / "a.srt"
    _write_srt(srt)
    result = subprocess.run(
        [sys.executable, str(SCRIPT), str(srt), "--video", "v.mp4", "--presentation", str(tmp_path)],
        capture_output=True, text=True,
    )
    assert result.returncode != 0


def test_help_lists_presentation_flag():
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--help"], capture_output=True, text=True,
    )
    assert result.returncode == 0
    assert "--presentation" in result.stdout
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python3 -m pytest tests/test_cli_render.py -v
```

Expected: 3 FAIL（`--presentation` 未识别 / 互斥未实现）。

- [ ] **Step 3: 改 skill_main.py 的 main()**

把 `plugins/video-toolkit/skills/add-subtitle/skill_main.py` 的 `main()` 改成下面这样（保留 `render_html` 等视频模式函数不动，只改 `main` 和参数定义；`srt_file` 改为可选 `nargs="?"`）：

```python
def main():
    parser = argparse.ArgumentParser(
        description="Overlay SRT subtitles onto a video OR inject subtitle layer into a presentation",
    )
    parser.add_argument("srt_file", nargs="?", type=str, help="Input SRT file (video mode)")
    parser.add_argument("--video", type=str, help="Video file path (video mode, required with srt_file)")
    parser.add_argument("--presentation", type=str, help="Presentation directory (inject subtitle layer)")
    parser.add_argument("--output", "-o", type=str, help="Output directory (video mode)")
    args = parser.parse_args()

    # presentation 注入模式
    if args.presentation:
        if args.srt_file or args.video:
            parser.error("--presentation 与 srt_file/--video 互斥")
        from presentation import inject_presentation

        pres_path = Path(args.presentation).expanduser()
        if not pres_path.is_dir():
            print(f"Error: Presentation directory not found: {pres_path}")
            sys.exit(1)

        print(f"\n{'=' * 60}")
        print("add-subtitle — Inject subtitle layer into presentation")
        print(f"{'=' * 60}")
        print(f"  Target: {pres_path}")
        inject_presentation(pres_path)
        print(f"{'=' * 60}\nDone!\n{'=' * 60}\n")
        return

    # 视频模式（原有逻辑）
    if not args.srt_file:
        parser.error("需要 srt_file（视频模式）或 --presentation（注入模式）")
    if not args.video:
        parser.error("视频模式需要 --video")

    if not check_jinja2():
        install_jinja2()

    srt_path = Path(args.srt_file).expanduser()
    if not srt_path.exists():
        print(f"Error: SRT file not found: {srt_path}")
        sys.exit(1)

    video_path = Path(args.video).expanduser()
    if not video_path.exists():
        print(f"Error: Video file not found: {video_path}")
        sys.exit(1)

    output_dir = Path(args.output).expanduser() if args.output else srt_path.parent
    output_dir.mkdir(parents=True, exist_ok=True)

    base_name = srt_path.stem
    subtitles = parse_srt(srt_path)
    if not subtitles:
        print("Error: No valid subtitles found in SRT file")
        sys.exit(1)

    video_rel = ensure_relative(video_path, output_dir)

    print(f"\n{'=' * 60}")
    print("add-subtitle — Overlay subtitles onto video")
    print(f"{'=' * 60}")
    print(f"  Input:     {srt_path.name}")
    print(f"  Video:     {video_path.name}")
    print(f"  Subtitles: {len(subtitles)} entries")
    print(f"  Output:    {base_name}_subtitle.html")
    print(f"{'=' * 60}\n")

    render_html(
        subtitles=subtitles,
        srt_name=base_name,
        video_path=video_rel,
        output_path=output_dir / f"{base_name}_subtitle.html",
    )

    print(f"\n{'=' * 60}\nDone!\n{'=' * 60}\n")
```

> 关键改动：`srt_file` 加 `nargs="?"`、新增 `--presentation`、`if args.presentation:` 分支优先处理、原视频逻辑保留。

- [ ] **Step 4: 运行全部测试，确认通过**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python3 -m pytest tests/ -v
```

Expected: 原有 9 + Task 2-5 的 12 + 本 task 的 3 = 24 passed（`test_cli_render.py` 的 `test_video_is_required` 仍需通过——`srt_file` 现在是 `nargs="?"`，不传 srt 也不传 --presentation 时走 `parser.error("需要 srt_file...")` 退出非 0）。

> 若 `test_video_is_required` 因为 `nargs="?"` 行为变化而失败，检查：不传 srt + 不传 --presentation 时应进入 `if not args.srt_file: parser.error(...)` 分支退出非 0——这正是该测试的预期。

- [ ] **Step 5: 提交**

```bash
git -C /Users/jasing/Documents/Work/perhapsjas_skill_market add plugins/video-toolkit/skills/add-subtitle/skill_main.py plugins/video-toolkit/skills/add-subtitle/tests/test_cli_render.py
git -C /Users/jasing/Documents/Work/perhapsjas_skill_market commit -m "feat(add-subtitle): add --presentation CLI flag with mutual exclusion

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 7: 更新 SKILL.md 增加 presentation 模式

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/SKILL.md`

- [ ] **Step 1: 更新 SKILL.md 的 frontmatter description 与使用方法**

把 `SKILL.md` 的 frontmatter `description` 末尾的触发词扩展，并在"使用方法"节加 presentation 模式。

frontmatter description 末尾改为（保留原有触发词，追加 presentation 相关）：

```
  生成字幕播放页、srt 转 html 时触发此 skill。也可给 web-video-presentation
  产出的 presentation（Vite+React 项目）注入字幕层（显示当前 narration，
  随 step 自动切换）。依赖 jinja2（视频模式自动安装）。
```

在"使用方法"节末尾加：

````markdown
## presentation 注入模式

给 [web-video-presentation](https://github.com/ConardLi/garden-skills) 产出的 presentation（Vite+React 项目）注入字幕层：在舞台底部显示当前 step 的 narration，随 step 推进自动切换、和口播音频天然同步（step 驱动，无需 srt/时间戳）。默认显示，按 `H` 键临时隐藏。

```bash
python ${CLAUDE_PLUGIN_ROOT}/skills/add-subtitle/skill_main.py --presentation /path/to/presentation
```

注入内容：
- 生成 `src/components/Subtitle.tsx` + `Subtitle.css`（黑字白底圆角描边标签，舞台 1920×1080 坐标 px）
- patch `src/App.tsx` 挂载 `<Subtitle text={stepText} />`（幂等，可重复运行）

要求 presentation 是标准 web-video-presentation 结构（`App.tsx` 含 `stepText` 和 `<Stage>`），否则报错不动文件。
````

- [ ] **Step 2: 提交**

```bash
git -C /Users/jasing/Documents/Work/perhapsjas_skill_market add plugins/video-toolkit/skills/add-subtitle/SKILL.md
git -C /Users/jasing/Documents/Work/perhapsjas_skill_market commit -m "docs(add-subtitle): document --presentation injection mode

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 8: 真实 ep00 端到端验证

> 无代码改动，验证注入在真实 presentation 上工作 + 字幕在浏览器里显示正确。

- [ ] **Step 1: 在 ep00 副本上跑注入（避免污染原项目）**

```bash
cp -R /Users/jasing/Documents/Work/Create_knowledge_explanation_videos/video_test_04/episodes/ep00-课程总览/presentation /tmp/ep00-sub-test
python3 /Users/jasing/Documents/Work/perhapsjas_skill_market/plugins/video-toolkit/skills/add-subtitle/skill_main.py --presentation /tmp/ep00-sub-test
```

Expected：打印注入日志（Generated Subtitle.tsx/css + Patched App.tsx），退出码 0。

- [ ] **Step 2: tsc 类型检查**

```bash
cd /tmp/ep00-sub-test && npx tsc --noEmit
```

Expected：无错误（生成的 Subtitle.tsx 合法 TS）。

- [ ] **Step 3: 浏览器验证字幕**

```bash
cd /tmp/ep00-sub-test && npm run dev   # 后台，记端口
```

playwright 打开 dev server URL，用 `?auto=1` 自动播放或手动点击推进，确认：
- 舞台底部出现黑字白底圆角描边字幕标签，内容是当前 narration
- step 推进时字幕切换
- 按 `H` 字幕消失、再按恢复
- 字号/位置与 Task 1 mockup 标定一致

- [ ] **Step 4: 验证幂等（再跑一次注入不破坏）**

```bash
python3 /Users/jasing/Documents/Work/perhapsjas_skill_market/plugins/video-toolkit/skills/add-subtitle/skill_main.py --presentation /tmp/ep00-sub-test
cd /tmp/ep00-sub-test && npx tsc --noEmit
```

Expected：第二次打印 "Already injected"，tsc 仍通过，App.tsx 的 Subtitle import 只有一份。

- [ ] **Step 5: 跑全量测试收尾**

```bash
cd /Users/jasing/Documents/Work/perhapsjas_skill_market/plugins/video-toolkit/skills/add-subtitle && python3 -m pytest tests/ -q
```

Expected：24 passed。

- [ ] **Step 6: 清理**

```bash
rm -rf /tmp/ep00-sub-test
lsof -ti:5173 | xargs kill 2>/dev/null || true
```

> 端到端验证无代码改动，无需 commit。

---

## 完成标准

- `presentation.py` 含 `validate_presentation` / `build_subtitle_tsx` / `build_subtitle_css` / `patch_app_tsx` / `inject_presentation`，全部有测试覆盖。
- `skill_main.py` 支持 `--presentation`，与视频模式互斥；原视频模式 + 9 个旧测试不破。
- `pytest tests/ -q` 24 passed。
- 真实 ep00 副本注入后 `tsc --noEmit` 通过，浏览器里字幕显示/切换/H 隐藏正常。
- 注入幂等。
- `SKILL.md` 记录了 presentation 模式。
- 字幕样式参数（舞台 px）经 Task 1 mockup 标定并固化进 `build_subtitle_css` 与 spec。
