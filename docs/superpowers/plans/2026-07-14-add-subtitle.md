# add-subtitle 重构实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `srt-html` skill 重命名并重构为 `add-subtitle`——单一模板、单一样式（黑字白底圆角描边标签），叠加字幕到视频上输出自包含 HTML。

**Architecture:** 删除式重构。保留 SRT 解析与 jinja2 渲染骨架；移除多模板/多动画/多配色/双语/lyric/拖拽/进度条；模板合并为 1 个自包含 `player.html.j2`，字幕同步改为 `timeupdate` 事件。字幕样式按 spec 固定参数（描边 `1.3px`、圆角 `9px`、padding `6px 20px`、投影、字号 `clamp(12px, 2.4cqw, 28px)`），靠 CSS `container-type: inline-size` + `cqw` 适配多比例。

**Tech Stack:** Python 3（标准库 argparse/re/dataclasses/pathlib）、jinja2、pytest（本计划新引入，仅用于该 skill 的回归测试）。

**参考 spec:** [docs/superpowers/specs/2026-07-14-add-subtitle-design.md](../specs/2026-07-14-add-subtitle-design.md)

---

## File Structure

重构后目录（重命名 `srt-html` → `add-subtitle`）：

```
plugins/video-toolkit/skills/add-subtitle/
├── SKILL.md                       # 改：name/description/示例
├── skill_main.py                  # 改：精简参数、render、--video 必需、文案
├── requirements.txt               # 不变（jinja2>=3.0）
├── templates/
│   └── player.html.j2             # 重写：自包含新模板
└── tests/                         # 新增
    ├── conftest.py                # sys.path 注入，便于 import skill_main
    ├── test_parse_srt.py          # SRT 解析（保留逻辑）回归测试
    └── test_cli_render.py         # CLI 校验 + 渲染产物断言
```

删除的文件：`templates/_base.html.j2`、`templates/lyric.html.j2`、`templates/_karaoke.css.j2`、`templates/_fade.css.j2`、`templates/_typewriter.css.j2`、`templates/_word-karaoke.css.j2`。

仓库根改动：[.claude-plugin/marketplace.json](../../../.claude-plugin/marketplace.json)、[README.md](../../../README.md)。

测试运行约定：在 `plugins/video-toolkit/skills/add-subtitle/` 目录下执行 `python -m pytest tests/ -v`。

---

## Task 1: 重命名目录并更新 marketplace 引用

**Files:**
- Rename: `plugins/video-toolkit/skills/srt-html/` → `plugins/video-toolkit/skills/add-subtitle/`
- Modify: `.claude-plugin/marketplace.json`（第 21 行）

- [ ] **Step 1: 用 git mv 重命名目录（保留历史）**

```bash
git mv plugins/video-toolkit/skills/srt-html plugins/video-toolkit/skills/add-subtitle
```

- [ ] **Step 2: 更新 marketplace.json 的 skill 路径**

把 `.claude-plugin/marketplace.json` 第 21 行：

```json
        "./skills/srt-html"
```

改为：

```json
        "./skills/add-subtitle"
```

- [ ] **Step 3: 验证脚本仍可运行（旧代码原样搬到新目录）**

```bash
python plugins/video-toolkit/skills/add-subtitle/skill_main.py --help
```

Expected: 打印 argparse 帮助（srt-html 旧文案暂时还在，下一步才改），退出码 0。

- [ ] **Step 4: 提交**

```bash
git add plugins/video-toolkit/skills/add-subtitle .claude-plugin/marketplace.json
git commit -m "refactor(add-subtitle): rename srt-html directory to add-subtitle

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: 建测试基础设施 + SRT 解析回归测试

> SRT 解析（`parse_timestamp` / `parse_srt`）是保留逻辑，先加 characterization 测试锁住行为，避免后续精简时改坏。

**Files:**
- Create: `plugins/video-toolkit/skills/add-subtitle/tests/conftest.py`
- Create: `plugins/video-toolkit/skills/add-subtitle/tests/test_parse_srt.py`

- [ ] **Step 1: 安装 pytest**

```bash
python -m pip install pytest
```

- [ ] **Step 2: 写 conftest.py 注入 sys.path**

创建 `plugins/video-toolkit/skills/add-subtitle/tests/conftest.py`：

```python
import sys
from pathlib import Path

# 让 tests/ 可以 import 上级目录的 skill_main
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
```

- [ ] **Step 3: 写 SRT 解析测试**

创建 `plugins/video-toolkit/skills/add-subtitle/tests/test_parse_srt.py`：

```python
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
```

- [ ] **Step 4: 运行测试，确认通过（保留逻辑未被改）**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python -m pytest tests/test_parse_srt.py -v
```

Expected: 6 passed。

- [ ] **Step 5: 提交**

```bash
git add plugins/video-toolkit/skills/add-subtitle/tests
git commit -m "test(add-subtitle): add SRT parsing regression tests

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: 重写 player.html.j2 为自包含新模板

> 先就位新模板（覆盖旧 player.html.j2）。此时 skill_main.py 仍是旧的，但 jinja2 会忽略模板未使用的变量，故系统仍可运行。旧模板文件（_base/lyric/_*.css）暂不删，待 Task 5。

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/templates/player.html.j2`（整体覆盖）

- [ ] **Step 1: 覆盖 player.html.j2 为新自包含模板**

把 `plugins/video-toolkit/skills/add-subtitle/templates/player.html.j2` 整体替换为：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ srt_name }} — add-subtitle</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0f; }

  .player-wrap {
    position: relative;
    max-width: 960px;
    margin: 0 auto;
    background: #000;
    border-radius: 10px;
    overflow: hidden;
    container-type: inline-size;
  }
  video { width: 100%; height: auto; display: block; }

  .sub-wrap {
    position: absolute;
    left: 50%;
    bottom: 8%;
    transform: translateX(-50%);
    z-index: 3;
    width: 100%;
    text-align: center;
    pointer-events: none;
  }
  .subtitle {
    display: inline-block;
    font-family: "FZLanTingHei", "PingFang SC", "Microsoft YaHei", sans-serif;
    font-weight: 600;
    color: #000;
    background: #fff;
    border: 1.3px solid #000;
    border-radius: 9px;
    padding: 6px 20px;
    box-shadow: 0 5px 16px rgba(0,0,0,0.28);
    font-size: clamp(12px, 2.4cqw, 28px);
    line-height: 1.2;
    letter-spacing: 0.06em;
    white-space: nowrap;
    max-width: 90%;
  }
</style>
</head>
<body>
<div class="player-wrap">
  <video id="player" src="{{ video_path }}" controls></video>
  <div class="sub-wrap">
    <span class="subtitle" id="subtitle" style="visibility:hidden;"></span>
  </div>
</div>

<script>
const SUBTITLES = {{ subtitles | tojson }};
const subs = SUBTITLES.map(s => ({ start: s.start, end: s.end, text: s.text }));
const video = document.getElementById("player");
const el = document.getElementById("subtitle");

function findSub(t) {
  for (let i = 0; i < subs.length; i++) {
    if (t >= subs[i].start && t < subs[i].end) return subs[i];
  }
  return null;
}

video.addEventListener("timeupdate", () => {
  const found = findSub(video.currentTime);
  if (found) {
    el.textContent = found.text;
    el.style.visibility = "visible";
  } else {
    el.style.visibility = "hidden";
  }
});
</script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add plugins/video-toolkit/skills/add-subtitle/templates/player.html.j2
git commit -m "refactor(add-subtitle): rewrite player template to self-contained subtitle tag

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: 精简 skill_main.py（TDD：--video 必需 + 渲染断言）

**Files:**
- Create: `plugins/video-toolkit/skills/add-subtitle/tests/test_cli_render.py`
- Modify: `plugins/video-toolkit/skills/add-subtitle/skill_main.py`（整体精简）

- [ ] **Step 1: 写失败测试 —— CLI 与渲染产物**

创建 `plugins/video-toolkit/skills/add-subtitle/tests/test_cli_render.py`：

```python
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "skill_main.py"


def _write_srt(path: Path) -> None:
    path.write_text(
        "1\n00:00:01,000 --> 00:00:02,500\n测试字幕\n",
        encoding="utf-8",
    )


def test_video_is_required(tmp_path: Path):
    srt = tmp_path / "a.srt"
    _write_srt(srt)
    result = subprocess.run(
        [sys.executable, str(SCRIPT), str(srt)],
        capture_output=True,
        text=True,
    )
    # 不传 --video 应非零退出
    assert result.returncode != 0


def test_render_outputs_subtitle_html_with_spec_css(tmp_path: Path):
    srt = tmp_path / "a.srt"
    _write_srt(srt)
    video = tmp_path / "v.mp4"
    video.write_text("dummy")  # 渲染只取路径，不校验视频有效性

    result = subprocess.run(
        [
            sys.executable, str(SCRIPT), str(srt),
            "--video", str(video),
            "-o", str(tmp_path),
        ],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stderr

    out = tmp_path / "a_subtitle.html"
    assert out.exists(), f"输出文件未生成: {out}"
    html = out.read_text(encoding="utf-8")

    # spec 规定的固定样式参数
    assert "border: 1.3px solid #000" in html
    assert "border-radius: 9px" in html
    assert "padding: 6px 20px" in html
    assert "box-shadow: 0 5px 16px rgba(0,0,0,0.28)" in html
    assert "font-size: clamp(12px, 2.4cqw, 28px)" in html
    # 同步用 timeupdate，不再有逐帧动画
    assert "timeupdate" in html
    assert "requestAnimationFrame" not in html
    # 字幕文本被渲染
    assert "测试字幕" in html


def test_no_palette_or_style_params_in_help(tmp_path: Path):
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--help"],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0
    help_text = result.stdout
    for removed in ["--palette", "--style", "--srt2", "--lyric", "--highlight-color"]:
        assert removed not in help_text, f"已废弃参数仍出现在 --help: {removed}"
    assert "--video" in help_text
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python -m pytest tests/test_cli_render.py -v
```

Expected: 3 个测试 FAIL（`--video` 当前非必需、输出名是 `_player.html`、`--help` 仍含废弃参数）。

- [ ] **Step 3: 整体精简 skill_main.py**

把 `plugins/video-toolkit/skills/add-subtitle/skill_main.py` 整体替换为：

```python
#!/usr/bin/env python3
"""
add-subtitle — 把 SRT 字幕以"黑字白底圆角描边标签"样式叠加到视频上，
输出自包含 HTML 播放页。约定输入 SRT 每条 ≤12 字（超出由上游 text-refine 切分）。
"""

import argparse
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

TEMPLATES_DIR = Path(__file__).parent / "templates"


def check_jinja2():
    try:
        import jinja2  # noqa: F401
        return True
    except ImportError:
        return False


def install_jinja2():
    print("Installing jinja2...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "jinja2"])


@dataclass
class Subtitle:
    index: int
    start: float
    end: float
    text: str

    def __post_init__(self):
        self.text = self.text.replace("\n", " ")


def parse_timestamp(ts: str) -> float:
    m = re.match(r"(\d+):(\d+):(\d+)[,.](\d+)", ts.strip())
    if not m:
        raise ValueError(f"Invalid timestamp: {ts}")
    h, mi, s, ms = m.groups()
    ms = ms.ljust(3, "0")[:3]
    return int(h) * 3600 + int(mi) * 60 + int(s) + int(ms) / 1000


def parse_srt(srt_path: Path) -> list[Subtitle]:
    content = srt_path.read_text(encoding="utf-8")
    blocks = re.split(r"\n\s*\n", content.strip())
    subtitles = []

    for block in blocks:
        lines = block.strip().split("\n")
        if len(lines) < 3:
            continue
        try:
            index = int(lines[0].strip())
        except ValueError:
            continue
        time_match = re.match(
            r"(\d+:\d+:\d+[,.]\d+)\s*-->\s*(\d+:\d+:\d+[,.]\d+)", lines[1].strip()
        )
        if not time_match:
            continue
        start = parse_timestamp(time_match.group(1))
        end = parse_timestamp(time_match.group(2))
        text = "\n".join(lines[2:]).strip()
        if text:
            subtitles.append(Subtitle(index=index, start=start, end=end, text=text))
    return subtitles


def ensure_relative(video_path: Path, output_dir: Path) -> str:
    try:
        return video_path.relative_to(output_dir).as_posix()
    except ValueError:
        return video_path.name


def render_html(subtitles, output_path: Path, srt_name: str, video_path: str):
    from dataclasses import asdict

    from jinja2 import Environment, FileSystemLoader

    env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)), autoescape=True)
    template = env.get_template("player.html.j2")
    html = template.render(
        subtitles=[asdict(s) for s in subtitles],
        srt_name=srt_name,
        video_path=video_path,
    )
    output_path.write_text(html, encoding="utf-8")
    print(f"  Saved: {output_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Overlay SRT subtitles onto a video as a self-contained HTML page",
    )
    parser.add_argument("srt_file", type=str, help="Input SRT file path")
    parser.add_argument("--video", type=str, required=True, help="Video file path (required)")
    parser.add_argument("--output", "-o", type=str, help="Output directory")
    args = parser.parse_args()

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

    print(f"\n{'=' * 60}")
    print("Done!")
    print(f"{'=' * 60}\n")


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: 运行全部测试，确认通过**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python -m pytest tests/ -v
```

Expected: 9 passed（6 解析 + 3 CLI/渲染）。

- [ ] **Step 5: 提交**

```bash
git add plugins/video-toolkit/skills/add-subtitle/skill_main.py plugins/video-toolkit/skills/add-subtitle/tests/test_cli_render.py
git commit -m "refactor(add-subtitle): slim skill_main to single-template, require --video

删除 PALETTES/--style/--palette/--srt2/--lyric 等参数与双语、逐字高亮逻辑；
--video 必需；输出改为 {srt}_subtitle.html。

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: 删除旧模板文件

> skill_main.py 已不再引用这些模板，删除安全。

**Files:**
- Delete: `plugins/video-toolkit/skills/add-subtitle/templates/_base.html.j2`
- Delete: `plugins/video-toolkit/skills/add-subtitle/templates/lyric.html.j2`
- Delete: `plugins/video-toolkit/skills/add-subtitle/templates/_karaoke.css.j2`
- Delete: `plugins/video-toolkit/skills/add-subtitle/templates/_fade.css.j2`
- Delete: `plugins/video-toolkit/skills/add-subtitle/templates/_typewriter.css.j2`
- Delete: `plugins/video-toolkit/skills/add-subtitle/templates/_word-karaoke.css.j2`

- [ ] **Step 1: 删除文件**

```bash
cd plugins/video-toolkit/skills/add-subtitle/templates && \
git rm _base.html.j2 lyric.html.j2 _karaoke.css.j2 _fade.css.j2 _typewriter.css.j2 _word-karaoke.css.j2
```

- [ ] **Step 2: 确认 templates/ 只剩 player.html.j2**

```bash
ls plugins/video-toolkit/skills/add-subtitle/templates/
```

Expected: 只输出 `player.html.j2`。

- [ ] **Step 3: 运行测试确认未破坏**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python -m pytest tests/ -v
```

Expected: 9 passed。

- [ ] **Step 4: 提交**

```bash
git commit -m "refactor(add-subtitle): remove obsolete lyric/base/css templates

Co-Authored-By: Claude <noreply@anthropic.com>"
```

> `git rm` 已暂存删除，直接 commit 即可。

---

## Task 6: 更新 SKILL.md

**Files:**
- Modify: `plugins/video-toolkit/skills/add-subtitle/SKILL.md`（整体重写）

- [ ] **Step 1: 整体重写 SKILL.md**

把 `plugins/video-toolkit/skills/add-subtitle/SKILL.md` 整体替换为（下面 4 反引号围栏内的全部内容，即文件最终内容，照原样写入、不要保留任何反斜杠转义）：

````markdown
---
name: add-subtitle
description: >
  SRT 字幕叠加到视频的工具。将标准 SRT 字幕以"黑字白底圆角描边标签"
  样式叠加到视频上，输出一个自包含 HTML 播放页。样式固定、单行居中，
  自动适配 16:9 / 4:3 / 3:4 / 9:16 等多种视频比例。约定输入 SRT 每条 ≤12 字
  （超出由上游 text-refine 切分）。当用户要给视频加字幕、字幕叠加、
  生成字幕播放页、srt 转 html 时触发此 skill。依赖 jinja2，脚本自动安装。
---

# add-subtitle

把 SRT 字幕以固定样式的标签叠加到视频上，输出自包含 HTML。

## 首次依赖检查

脚本自动检测并安装 jinja2：

```bash
pip install jinja2
```

## 使用方法

```bash
# 必须同时提供 SRT 和视频
python ${CLAUDE_PLUGIN_ROOT}/skills/add-subtitle/skill_main.py subtitle.srt --video video.mp4

# 指定输出目录
python ${CLAUDE_PLUGIN_ROOT}/skills/add-subtitle/skill_main.py subtitle.srt --video video.mp4 -o ~/Desktop
```

## 参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `srt_file` | 输入 SRT 文件路径 | 必需 |
| `--video` | 视频文件路径 | 必需 |
| `--output`, `-o` | 输出目录 | SRT 同目录 |

## 输入约定

每条字幕 **≤12 字**、单行显示。超长条由上游 `text-refine` 切分；本 skill 不切分。

## 输出

```
{srt名}_subtitle.html
```

引用视频用相对路径，把 HTML 和视频放一起即可直接播放。

## 字幕样式（固定）

- 黑字 `#000` + 白底 `#fff`
- 描边 `1.3px solid #000`、圆角 `9px`、内边距 `6px 20px`、柔和外投影
- 字体 `FZLanTingHei`（回退 PingFang SC / 微软雅黑），字重 600
- 字号 `clamp(12px, 2.4cqw, 28px)`——随视频宽度自适应，竖屏保底 12px
- 居中、距底 8%，单行

## 多比例自适应

容器 `container-type: inline-size`，`<video>` 用原生宽高比撑开，字幕用 `cqw` 自适应。
16:9 / 4:3 / 3:4 / 9:16 同一套样式，无需为各比例单独配置。

## 与其他 skill 配合

```
video-downloader → audio-transcribe → text-refine → add-subtitle
    下载视频          转录字幕         校准/切分字幕   叠加字幕到视频
```

## 示例

```
用户: 给这个视频加上字幕 subtitle.srt --video clip.mp4
用户: add-subtitle video.srt --video video.mp4 -o ~/Desktop
```
````

- [ ] **Step 2: 提交**

```bash
git add plugins/video-toolkit/skills/add-subtitle/SKILL.md
git commit -m "docs(add-subtitle): rewrite SKILL.md for the slimmed skill

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 7: 更新 README.md

**Files:**
- Modify: `README.md`（多处引用与示例）

- [ ] **Step 1: 更新总览表的 skill 名**

把 README.md 中：

```markdown
| **video-toolkit** | 视频下载、转录、校准、字幕动画 | `video-downloader` `audio-transcribe` `text-refine` `srt-html` |
```

改为：

```markdown
| **video-toolkit** | 视频下载、转录、校准、字幕叠加 | `video-downloader` `audio-transcribe` `text-refine` `add-subtitle` |
```

- [ ] **Step 2: 更新流水线描述**

把 README.md 中：

```markdown
四个 skill 串起来：`video-downloader` 拉视频 → `audio-transcribe` 出字幕 → `text-refine` 纠错润色 → `srt-html` 生成带动画的 HTML。
```

改为：

```markdown
四个 skill 串起来：`video-downloader` 拉视频 → `audio-transcribe` 出字幕 → `text-refine` 纠错润色并切分到每条 ≤12 字 → `add-subtitle` 把字幕叠加到视频上输出 HTML。
```

- [ ] **Step 3: 更新 srt-html 小节标题与内容**

把 README.md 中标题为 `#### \`srt-html\` — 字幕转 HTML 动画` 的整段小节（含其下的示例命令 `--style fade --palette neon`、`--srt2 en.srt` 等）替换为：

````markdown
#### `add-subtitle` — 字幕叠加到视频

把 SRT 字幕以"黑字白底圆角描边标签"样式叠加到视频上，输出自包含 HTML 播放页，自动适配横竖屏。

```bash
python ${CLAUDE_PLUGIN_ROOT}/skills/add-subtitle/skill_main.py subtitle.srt --video video.mp4
python ${CLAUDE_PLUGIN_ROOT}/skills/add-subtitle/skill_main.py subtitle.srt --video video.mp4 -o ~/Desktop
```
````

- [ ] **Step 4: 更新依赖表与目录树**

把 README.md 依赖表里：

```markdown
| `srt-html` | 无（jinja2 自动安装） |
```

改为：

```markdown
| `add-subtitle` | 无（jinja2 自动安装） |
```

把 README.md 目录树中：

```
    │   └── srt-html/             # templates/ 内置动画与配色模板
```

改为：

```
    │   └── add-subtitle/         # 单一模板：字幕标签叠加到视频
```

> 如果 README 中还有其他出现的 `srt-html`，一并改为 `add-subtitle`。可用 `grep -n srt-html README.md` 复查。

- [ ] **Step 5: 复查无残留 srt-html 引用**

```bash
grep -n "srt-html\|srt_html" README.md
```

Expected: 无输出（README.md 不再出现旧名）。

- [ ] **Step 6: 提交**

```bash
git add README.md
git commit -m "docs: update README for srt-html → add-subtitle rename

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 8: 端到端验证

> 用真实 SRT + 视频运行脚本，浏览器打开产物确认视觉与同步。

- [ ] **Step 1: 准备测试素材**

找一个已有的短视频（如之前 `video-downloader` 下过的），或用一个公开样例视频。准备一个每条 ≤12 字的 SRT（可用 `audio-transcribe` + `text-refine` 产出，或手写）。下面假设素材在 `~/Downloads/sample.mp4` 与 `~/Downloads/sample.srt`，按实际路径替换。

- [ ] **Step 2: 运行脚本生成 HTML**

```bash
python plugins/video-toolkit/skills/add-subtitle/skill_main.py \
  ~/Downloads/sample.srt --video ~/Downloads/sample.mp4 -o /tmp/add-sub-e2e
```

Expected: 打印横幅 `add-subtitle — Overlay subtitles onto video`，`Saved: .../sample_subtitle.html`，`Done!`，退出码 0。

- [ ] **Step 3: 浏览器打开验证**

```bash
open /tmp/add-sub-e2e/sample_subtitle.html
```

逐项核对：

- 字幕是黑字 + 白底圆角矩形 + 黑描边 + 柔和投影，单行居中、距底约 8%。
- 播放视频，字幕按时间出现/消失，跟语音基本对齐。
- 拖动浏览器窗口，视频与字幕等比缩放，字幕不溢出、不换行。
- 字幕文本中的特殊字符（如 `<`、`&`、引号）被正确转义，不被当成 HTML 执行（autoescape 生效）。

- [ ] **Step 4: 跑一次全量测试收尾**

```bash
cd plugins/video-toolkit/skills/add-subtitle && python -m pytest tests/ -v
```

Expected: 9 passed。

> 端到端验证无代码改动，无需提交。

---

## Task 9: 清理临时产物

- [ ] **Step 1: 删除 mockup 截图**

```bash
rm -f add-subtitle-mockup.png
```

- [ ] **Step 2: 确认工作树干净**

```bash
git status --short
```

Expected: 无输出（或仅 untracked 的 `.DS_Store` 等系统文件）。

> 之前用于预览的本地 HTTP 服务（端口 8765）在后台运行，如需关闭：`lsof -ti:8765 | xargs kill`。

---

## 完成标准

- 目录已重命名为 `add-subtitle`，`marketplace.json` 与 `README.md` 一致。
- `skill_main.py` 只剩 `srt_file` / `--video`（必需）/ `-o` 三个参数，无 PALETTES/style/lyric/双语残留。
- `templates/` 只剩自包含 `player.html.j2`。
- `pytest tests/` 9 passed。
- 端到端运行生成的 HTML 视觉、同步、转义、自适应均符合 spec。
- 工作树干净，无 `srt-html` 残留引用，无临时 mockup 文件。
