# add-subtitle skill 设计文档

- 日期：2026-07-14
- 状态：待实现
- 背景：由 `srt-html` skill 重构而来

## 背景与动机

现有 `srt-html` skill 功能复杂：2 种模式（player / lyric）、4 种逐字动画（karaoke / fade / typewriter / word-karaoke）、5 种配色预设、双语字幕、进度条、字幕列表、拖拽定位。实际使用中通常只需要"把字幕叠加到视频上"这一核心能力，多余功能增加维护成本、也让样式决策变复杂。

本次重构两件事：

1. **改名** `srt-html` → `add-subtitle`，名称更贴合"给视频加字幕"的定位；
2. **精简**为单一模板、单一样式——即黑字白底圆角描边标签（见 mockup）。

## 目标

- 将 SRT 字幕以固定样式的"黑字 + 白底圆角矩形 + 黑描边 + 柔和投影"标签叠加到视频上，输出自包含 HTML 播放页；
- 适配 16:9 / 4:3 / 3:4 / 9:16 等多种视频比例，同一套样式，无需为各比例单独配置；
- 单一模板、单一样式，无动画 / 配色 / 模式切换。

## 非目标（明确删除，YAGNI）

- lyric 独立模式（纯字幕动画 + 进度条 + 字幕列表导航）
- 逐字高亮动画（karaoke / fade / typewriter / word-karaoke）
- 配色预设（resend / neon / sakura / ocean / fire）
- 双语字幕
- 字幕拖拽定位
- 字幕切分（超长条交给上游 `text-refine`，本 skill 不处理）

## 字幕样式规范

视觉：黑色文字 + 白色填充圆角矩形 + 黑色描边 + 柔和投影，单行居中、距底 8%。

完整 CSS（字幕元素 `.subtitle`）：

```css
.subtitle {
  display: inline-block;
  font-family: "FZLanTingHei", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-weight: 600;
  color: #000;
  background: #fff;
  border: 1.3px solid #000;             /* 描边（固定） */
  border-radius: 9px;                   /* 圆角半径（固定） */
  padding: 6px 20px;                    /* 内边距（固定） */
  box-shadow: 0 5px 16px rgba(0,0,0,0.28);  /* 柔和投影（固定） */
  font-size: clamp(12px, 2.4cqw, 28px); /* 字号：随画面宽度自适应，带上下限 */
  line-height: 1.2;
  letter-spacing: 0.06em;
  white-space: nowrap;                  /* 强制单行 */
  max-width: 90%;                       /* 不超出画面宽度 */
}
```

### 参数分类

| 项 | 值 | 类型 |
|----|----|------|
| 字色 / 底色 | `#000` / `#fff` | 固定 |
| 描边 `border` | `1.3px solid #000` | 固定 |
| 圆角 `border-radius` | `9px` | 固定 |
| 内边距 `padding` | `6px 20px` | 固定 |
| 投影 `box-shadow` | `0 5px 16px rgba(0,0,0,0.28)` | 固定 |
| 字体 | `FZLanTingHei`（回退 PingFang SC / 微软雅黑），字重 600 | 固定 |
| 字号 `font-size` | `clamp(12px, 2.4cqw, 28px)` | **自适应**（随画面宽度） |
| 矩形宽 / 高 | 由字数 × 字号 + padding 撑开 | **自适应**（随内容） |
| 布局 | 单行、居中、距底 8% | 固定 |

> 说明："描边"指圆角矩形的 CSS `border`，**不是**文字描边。因此不需要 `text-shadow`，也不需要原 srt-html 的 stroke-layer / fill-layer 双层 DOM。整条字幕就是一个 `<span class="subtitle">文本</span>`。

## 多比例自适应方案

- 外层容器**不写死** `aspect-ratio`，由 `<video>` 原生宽高比撑开；
- 容器声明 `container-type: inline-size`，使其成为 `cqw` 的查询基准；
- 字幕层绝对定位在容器底部（`bottom: 8%`、`left: 50%` + `translateX(-50%)`）；
- 16:9 / 4:3 / 3:4 / 9:16 同一套 CSS，无需为各比例做分支；
- 字号用 `cqw` + `clamp`：容器宽（横屏）字号大，容器窄（竖屏）字号小，下限 12px 保证可读。

## 输入约定（切分策略：交给上游）

- 约定输入 SRT **每条字幕 ≤12 字**；
- 超长条由上游 `text-refine` 负责切分；
- 本 skill **不做切分**；遇到超长条照原样单行渲染（`white-space: nowrap` + `max-width: 90%`，可能被约束），不主动断行。

## CLI

```bash
python ${CLAUDE_PLUGIN_ROOT}/skills/add-subtitle/skill_main.py <srt_file> --video <video_file> [-o <output_dir>]
```

| 参数 | 必需 | 说明 |
|------|------|------|
| `srt_file` | 是 | 输入 SRT 文件路径 |
| `--video` | 是 | 视频文件路径；未提供则报错退出 |
| `-o` / `--output` | 否 | 输出目录，默认 SRT 同目录 |

移除的参数：`--lyric`、`--style`、`--palette`、`--highlight-color`、`--unhighlight-color`、`--bar-bg`、`--font-family`、`--srt2`。

## 字幕同步

- 监听 `<video>` 的 `timeupdate` 事件；
- 线性查找 `currentTime` 落在 `[start, end)` 区间的字幕条；
- 命中则把文本写入 `.subtitle` 并显示，未命中则隐藏；
- **不使用** `requestAnimationFrame` 逐帧高亮（无逐字动画需求）。

## 模板结构 → 1 个自包含模板

当前 `templates/` 含 8 个文件。重构后只保留 1 个：

```
templates/
└── player.html.j2   # 内联全部 CSS/JS，不再 extends _base，不 include 任何 _*.css.j2
```

删除：`_base.html.j2`、`lyric.html.j2`、`_karaoke.css.j2`、`_fade.css.j2`、`_typewriter.css.j2`、`_word-karaoke.css.j2`。

## 输出

- 文件名：`{srt名}_subtitle.html`（原 `{srt名}_player.html`）；
- 输出位置：`-o` 指定目录或 SRT 同目录；
- HTML 引用视频用相对路径（沿用现有 `ensure_relative` 逻辑）。

## skill_main.py 改动

- 删除 `PALETTES` 字典；
- 删除参数：`--lyric`、`--style`、`--palette`、`--highlight-color`、`--unhighlight-color`、`--bar-bg`、`--font-family`、`--srt2`；
- `--video` 改为**必需**：未提供则报错退出（不再 fallback 到 lyric 模式）；
- `render_html` 简化：移除 `style_name`、`theme`、`subtitles2`、`font_family` 参数；模板固定为 `player.html.j2`，输出名 `{srt名}_subtitle.html`；
- 文件头 docstring 与横幅文案改为 `add-subtitle`；
- `Subtitle` dataclass 的 `chars` 字段不再需要（无逐字渲染），可移除。

## 改名影响范围

| 位置 | 改动 |
|------|------|
| 目录 | `plugins/video-toolkit/skills/srt-html/` → `add-subtitle/` |
| [marketplace.json](../../../.claude-plugin/marketplace.json) 第 21 行 | `./skills/srt-html` → `./skills/add-subtitle` |
| [README.md](../../../README.md) | 第 11 / 51 / 103 / 113-115 / 162 / 174 / 180 行的名称、示例命令、目录树 |
| `SKILL.md` | `name` 字段、`description`、使用示例路径 |
| `skill_main.py` | docstring、横幅文案 |
| 旧 spec | `docs/superpowers/specs/2026-05-16-srt-html-design.md` 保留为历史，不动 |

## 依赖

- `jinja2`（保留，autoescape 安全处理字幕文本）；
- `requirements.txt` 不变。

## 与其他 skill 的配合

```
video-downloader → audio-transcribe → text-refine → add-subtitle
    下载视频          转录字幕         校准/切分字幕   叠加字幕到视频
```

`text-refine` 需新增职责：保证输出 SRT 每条 ≤12 字（满足 add-subtitle 的输入约定）。该改动不在本 spec 范围内，仅作为约定记录。
