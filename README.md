# perhapsjas_skill_market

面向内容创作者的 Claude Code 插件集。一条龙覆盖：**视频下载转录 → 文案创作 → 图文卡片排版 → 封面概念图提示词**。装好之后直接用大白话跟 Claude 说需求，不用记命令。

共 **3 个插件、8 个 skill**。

## 插件与 Skill 一览

| 插件 | 定位 | 包含 Skill |
|------|------|-----------|
| **video-toolkit** | 视频下载、转录、校准、字幕动画 | `video-downloader` `audio-transcribe` `text-refine` `srt-html` |
| **writting-assistant** | 小红书文案全自动创作 + 爆款标题 | `writting-assistant` `golden-title` |
| **xiaohongshu-card** | 图文卡片排版 + 封面概念图提示词 | `make-html-card` `cover-image-prompt` |

## 安装

### 装整个市场（推荐）

所有插件一次性装好，按需使用。

```bash
# 方式一：npx
npx skills add jasinghuang/perhapsjas_skill_market -g

# 方式二：市场命令
/plugin marketplace add jasinghuang/perhapsjas_skill_market
/plugin install perhapsjas_skill_market@perhapsjas_skill_market
```

### 只装某一个插件

```bash
npx skills add jasinghuang/perhapsjas_skill_market -g --plugin video-toolkit      # 视频
npx skills add jasinghuang/perhapsjas_skill_market -g --plugin writting-assistant # 文案
npx skills add jasinghuang/perhapsjas_skill_market -g --plugin xiaohongshu-card   # 图文卡片
```

## 三条使用主线

装好后直接跟 Claude 说话，skill 会按关键词自动触发。

### 主线一 · 视频：下载 → 转录 → 校准 → 字幕动画

```text
下载这个视频 https://www.bilibili.com/video/BV1xx411c7mD
把刚下的 video.mp4 转录成字幕
帮我校准这个字幕，有错别字
把字幕做成卡拉OK动画效果
```

四个 skill 串起来：`video-downloader` 拉视频 → `audio-transcribe` 出字幕 → `text-refine` 纠错润色 → `srt-html` 生成带动画的 HTML。

### 主线二 · 小红书图文：文案 → 标题 → 卡片 → 封面

```text
帮我写一篇关于 ETF 定投的小红书文案
给这篇文案起几个爆款标题
把文案排版成小红书图文卡片
再生成一个封面概念图提示词
```

`writting-assistant` 全自动出文案 → `golden-title` 起标题 → `make-html-card` 排成图文卡片 → `cover-image-prompt` 出封面图提示词。

### 主线三 · 单独用任意一个

每个 skill 都能独立触发，比如只想转录、只想做卡片、只想起标题。

## Skill 详解

### video-toolkit

#### `video-downloader` — 视频下载

用 yt-dlp 下载 B 站 / YouTube，支持批量、Cookie 会员视频、aria2 加速、指定画质、只下音频。

```bash
# 下载单个视频（默认最高画质）
python ${CLAUDE_PLUGIN_ROOT}/skills/video-downloader/skill_main.py "URL"

# 批量 / 从文件读 URL
python ${CLAUDE_PLUGIN_ROOT}/skills/video-downloader/skill_main.py "URL1" "URL2"
python ${CLAUDE_PLUGIN_ROOT}/skills/video-downloader/skill_main.py --file urls.txt

# 只下音频（适合转录）/ 指定画质 / Cookie / aria2
python ${CLAUDE_PLUGIN_ROOT}/skills/video-downloader/skill_main.py --audio-only "URL"
python ${CLAUDE_PLUGIN_ROOT}/skills/video-downloader/skill_main.py --quality high "URL"
python ${CLAUDE_PLUGIN_ROOT}/skills/video-downloader/skill_main.py --cookies ~/video-cookies.txt "URL"
python ${CLAUDE_PLUGIN_ROOT}/skills/video-downloader/skill_main.py --aria2 "URL"
```

画质预设：`best`（默认）/ `high`(1080p) / `medium`(720p) / `low`(480p) / `audio-only`。yt-dlp 自动安装，无需预装。

#### `audio-transcribe` — 音视频转录

自动按平台选最优后端：**Mac 用 MLX-Whisper**（Apple Silicon 原生加速），**Windows 用 Faster-Whisper**（CUDA 加速 / CPU 回退）。输出 SRT 或 Markdown，接受 mp4/mp3/wav/m4a 等格式。

每次转录前会询问模型（`small` 快速预览 / `large-v3-turbo` 推荐 / `large-v3` 最高准确率）和输出格式；若指令里已指定（如"用 large-v3 转成 SRT"）则跳过询问。

#### `text-refine` — 字幕校准与翻译

Claude 直接校对 ASR 文本：修正错别字/同音字/专业术语、删除 Whisper 冗余词和重复伪影、清理平台水印广告和幻觉内容、补标点。非中文先翻译成中文再校准。输入 SRT/MD/TXT，输出 `{原名}_refined.md`。**无需额外依赖**，Claude 自身就是校准引擎。

#### `srt-html` — 字幕转 HTML 动画

把 SRT 转成带动画效果的网页，可视频叠加或纯字幕播放。

- **动画样式**：`karaoke`（逐字高亮，默认）/ `fade`（淡入淡出）/ `typewriter`（打字机）/ `word-karaoke`（按词高亮，适合英文）
- **配色预设**：`resend`（暖橙，默认）/ `neon`（赛博）/ `sakura`（樱粉）/ `ocean`（海洋）/ `fire`（火焰）
- **两种模式**：`--video` 生成视频+字幕叠加播放器；`--lyric` 生成纯字幕动画（含进度条和字幕列表导航）
- **双语字幕**：`--srt2` 传入第二语言 SRT；支持自定义颜色、字体

```bash
python ${CLAUDE_PLUGIN_ROOT}/skills/srt-html/skill_main.py subtitle.srt --video video.mp4
python ${CLAUDE_PLUGIN_ROOT}/skills/srt-html/skill_main.py subtitle.srt --style fade --palette neon
python ${CLAUDE_PLUGIN_ROOT}/skills/srt-html/skill_main.py zh.srt --srt2 en.srt
```

依赖 jinja2，脚本自动安装。

### writting-assistant

#### `writting-assistant` — 小红书文案全自动创作

给定主题即跑完整流程：**需求分析 → 联网资料研究 → 爆款风格习得 → 撰写文案 → 质量检测 → 去AI味检测 → 存档 → 人工校验 → 素材搜集 → 飞书同步**。

- 内置四大分类，每类有独立文风标准（`standards.md`）：`economy`（经济）/ `investing`（投资）/ `tech`（科技）/ `insurance`（保险）
- 可传入参考资料（作为信息源）和参考文案（作为爆款对标）
- 质检循环 + 13 类"AI 味"检测，命中会生成修改报告
- 成稿自动存档到 `口播文案/YYYY-MM/XX-标题.md`

#### `golden-title` — 爆款标题生成器

根据正文或主题，按 **10+ 种爆款标题模式**生成一批带评分和推荐理由的候选标题。

- 模式：数字+主题、疑问型、年份前缀、"普通人"框架、冒号分隔、括号增幅、口语感叹、对比反转、直接挑衅、中英混搭、数据锚定……
- 5 维评分（吸引力 / 信息密度 / SEO 友好 / 情绪触发 / 传播力），满分 25 分排序
- 每条同时给"文本标题"（≤20 字，含关键词）和"封面标题"（极简，视觉冲击）

### xiaohongshu-card

#### `make-html-card` — 文案转图文卡片

把小红书文案转成精美的 HTML 图文卡片，每张 **1242×1660px**。视觉风格：暖黄底 + 白色圆角卡片 + 红色强调 + 方正兰亭黑。

智能排版：自动拆分段落、按填充度（65%–85%）流式分配多卡片布局、识别 emoji/`##` 锚点、自动标记核心术语，并区分封面 / 正文 / 结尾三种布局，每张卡片带风险提示位。

#### `cover-image-prompt` — 封面概念图提示词

根据文字内容生成可直接喂给 Midjourney / DALL-E / Flux 的 1:1 概念海报提示词。

- **三种模板**：有承载面版本（舞台/平台感）/ 无承载面版本（构图自由）/ 编辑设计版本（黑白极简、文字主导）
- 编辑设计版还可在 **10 种视觉风格**中选择：弥散、马赛克、乐高、麦肯锡、赛博朋克、复古、像素、酸性设计、手绘涂鸦、极简黑白
- 可联动 `make-html-card`：自动从文案提取核心文字、语言、语境摘要、情绪倾向

## 依赖速查

| Skill | 需要额外装的东西 |
|-------|---------------|
| `video-downloader` | 自动装 yt-dlp；可选 Node.js ≥ 20（YouTube）、ffmpeg、aria2 |
| `audio-transcribe` | Mac：`pip3 install mlx-whisper zhconv` + `brew install ffmpeg`；Windows：`pip install faster-whisper zhconv` |
| `text-refine` | 无 |
| `srt-html` | 无（jinja2 自动安装） |
| `writting-assistant` | 无（Python 3 用于存档脚本） |
| `golden-title` | 无 |
| `make-html-card` | 无 |
| `cover-image-prompt` | 无 |

## 目录结构

```text
├── .claude-plugin/
│   └── marketplace.json          # 市场声明
├── docs/
│   └── superpowers/specs/        # 设计文档（如 srt-html 设计稿）
└── plugins/
    ├── video-toolkit/skills/
    │   ├── video-downloader/
    │   ├── audio-transcribe/     # backends/ 分 Mac/Windows 后端
    │   ├── text-refine/
    │   └── srt-html/             # templates/ 内置动画与配色模板
    ├── writting-assistant/skills/
    │   ├── writting-assistant/
    │   │   ├── references/       # 人设、质检标准
    │   │   ├── scripts/          # save_draft.py 存档脚本
    │   │   └── examples/         # economy / investing / tech / insurance 四分类爆款样例
    │   └── golden-title/
    └── xiaohongshu-card/skills/
        ├── make-html-card/       # assets/layouts/ + references/
        └── cover-image-prompt/   # 三套提示词模板
```

## 说明

- 所有 skill 均在 `strict: false` 模式下运行，`plugins/*/skills/` 下的 skill 会被自动发现并加载，无需在 `marketplace.json` 逐个显式声明。
- 视频线建议串起来用：下载 → 转录 → 校准 → 字幕动画，一条命令接一条，中间产物自动衔接。
- 小红书线里 `writting-assistant` 和 `golden-title` 配合最好：前者出正文，后者专攻标题。
