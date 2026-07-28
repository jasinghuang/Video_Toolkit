---
name: add-subtitle
description: >
  SRT 字幕叠加到视频的工具。将标准 SRT 字幕以"黑字白底圆角描边标签"
  样式叠加到视频上，输出一个自包含 HTML 播放页。样式固定、**严格单行**、居中，
  自动适配 16:9 / 4:3 / 3:4 / 9:16 等多种视频比例。约定输入 SRT 每条 ≤12 字
  （超出由上游 text-refine 切分）。当用户要给视频加字幕、字幕叠加、
  生成字幕播放页、srt 转 html 时触发此 skill。依赖 jinja2（自动安装）。
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
| `srt_file` | 输入 SRT 文件 | 必需 |
| `--video` | 视频文件 | 必需 |
| `--output`, `-o` | 输出目录 | SRT 同目录 |

## 输入约定

每条字幕 **≤12 字**，单行显示。超长条由上游 `text-refine` 切分；本 skill 不切分。CSS `white-space: nowrap !important` 阻止自动换行，Subtitle 组件主动去除文本中的换行符。超长文本由 `text-overflow: ellipsis` 截断，不换行。

## 输出

```
{srt名}_subtitle.html
```

引用视频用相对路径，把 HTML 和视频放一起即可直接播放。

## 字幕样式（固定）

- **强制单行** — CSS `white-space: nowrap !important` + `overflow: hidden`，多层防御
- 黑字 `#000` + 白底 `#fff`
- 描边 `1.3px solid #000`、圆角 `9px`、内边距 `6px 20px`、柔和外投影
- 字体 `FZLanTingHei`（回退 PingFang SC / 微软雅黑），字重 600
- 字号 `clamp(12px, 2.4cqw, 28px)`——随视频宽度自适应，竖屏保底 12px
- **严格单行**：CSS `white-space: nowrap !important` + JS 主动 strip `\n`，任何情况下都不允许换行
- 居中、距底 8%

## 多比例自适应

容器 `container-type: inline-size`，`<video>` 用原生宽高比撑开，字幕用 `cqw` 自适应。
16:9 / 4:3 / 3:4 / 9:16 同一套样式，无需为各比例单独配置。

## 与其他 skill 配合

视频模式：

```
video-downloader → audio-transcribe → text-refine → add-subtitle
    下载视频          转录字幕         校准/切分字幕   叠加字幕到视频
```

## 示例

**视频模式：**

```
用户: 给这个视频加上字幕 subtitle.srt --video clip.mp4
用户: add-subtitle video.srt --video video.mp4 -o ~/Desktop
```

