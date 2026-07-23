---
name: add-subtitle
description: >
  SRT 字幕叠加到视频的工具。将标准 SRT 字幕以"黑字白底圆角描边标签"
  样式叠加到视频上，输出一个自包含 HTML 播放页。样式固定、单行居中，
  自动适配 16:9 / 4:3 / 3:4 / 9:16 等多种视频比例。约定输入 SRT 每条 ≤12 字
  （超出由上游 text-refine 切分）。当用户要给视频加字幕、字幕叠加、
  生成字幕播放页、srt 转 html、presentation 字幕、注入字幕层时触发此 skill。
  也可给 web-video-presentation
  产出的 presentation（Vite+React 项目）注入字幕层（显示当前 narration，
  随 step 自动切换）。依赖 jinja2（视频模式自动安装）。
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

## 参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `srt_file` | 输入 SRT 文件（视频模式） | 视频模式必需 |
| `--video` | 视频文件（视频模式） | 视频模式必需 |
| `--output`, `-o` | 输出目录（视频模式） | SRT 同目录 |
| `--presentation` | presentation 目录（注入模式） | —— |

`srt_file`/`--video`（视频模式）与 `--presentation`（注入模式）**互斥**。

## 输入约定

每条字幕 **≤12 字**（视频模式），单行显示。超长条由上游 `text-refine` 切分；本 skill 不切分。

presentation 注入模式下，每条 narration **≤18 字**。Subtitle 组件对超长文本做截断兜底（`text.slice(0, 18) + "…"`），但建议在口播稿中提前拆分 step。运行 `--check` 可检测超长文案。

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
