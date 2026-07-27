# 主题系统

每个演示从头到尾跑**一个主题**。主题不再只是 25 个 CSS 变量——每套主题现在是一个**完整的 CSS 设计系统**（300-600 行），包含调色板、排版尺度、间距节奏、阴影性格、装饰层和 12 个语义组件 class。

章节 agent 用主题提供的语义 class 来构建页面布局，写自己的 CSS 只用于动画 keyframes 和独特的视觉演示。

## 架构

```
themes/<slug>/
├── theme.json       ← 元数据：id / mood / bestFor / avoidFor / preview
├── theme.css        ← 完整 CSS 设计系统（变量 + 12 MUST class + 扩展）
└── design.md        ← 设计意图文档（给章节 agent 看的约束和指引）
```

**章节对主题的消费**：

- **必须用语义 class**：`.display` / `.body` / `.card` / `.divider` 等 12 个 class
- **必须用 CSS 变量取颜色**：`--text` / `--surface` / `--accent` 等
- **章节自己写**：动画 keyframes、独特视觉演示的布局 CSS、章节特有装饰

完整合约见 [`references/SEMANTIC-CLASSES.md`](SEMANTIC-CLASSES.md)。

## 内置主题

34 套主题，每套来自 [beautiful-html-templates](https://github.com/zarazhangrui/beautiful-html-templates) 的独立设计 DNA，1:1 翻译为 WVP 主题。每套含 `theme.json`（元数据）+ `theme.css`（完整 CSS 设计系统）+ `design.md`（设计约束文档）。

运行 `bash scripts/scaffold.sh --list-themes` 查看完整目录及每套的中文简介。

覆盖的设计方向：

| 方向 | 代表主题 |
|------|---------|
| 编辑级暗色 | `signal`, `pink-script`, `dark-botanical`→`grove` |
| 编辑级浅色 | `cartesian`, `monochrome`, `soft-editorial`, `editorial-forest` |
| 极简/学术 | `vellum`, `mat`, `cobalt-grid` |
| 激进/粗野 | `studio`, `block-frame`, `raw-grid`, `bold-poster` |
| 温暖/手绘 | `pin-and-paper`, `daisy-days`, `scatterbrain` |
| 复古/怀旧 | `retro-windows`, `retro-zine`, `8-bit-orbit`, `stencil-tablet` |
| 多彩/玩味 | `sakura-chroma`, `playful`, `capsule`, `coral` |
| 专业/商务 | `blue-professional`, `broadside`, `peoples-platform`, `long-table` |
| 艺术/文化 | `biennale-yellow`, `editorial-tri-tone`, `creative-mode`, `emerald-editorial` |
| 技术/网格 | `neo-grid-bold` |

## 脚手架时选主题

```bash
# 默认（signal）
bash scripts/scaffold.sh ./presentation

# 显式指定
bash scripts/scaffold.sh ./talk --theme=cartesian
```

脚手架把选定主题的 `theme.css` 拷到 `<project>/src/styles/theme.css`，并把主题 id 写到 `<project>/.theme`。

## 切换主题

切换 = 一次文件覆盖：

```bash
cp <path-to-web-video-presentation>/themes/cartesian/theme.css \
   presentation/src/styles/theme.css
```

刷新 dev server。完成。章节代码一行不改。

如果切换后某章节看起来有问题，那是该章节在某处硬编码了颜色/字体——去找出来修。

## 创作新主题

### 1. 从最接近的起点复制

| 目标情绪 | 起点 |
|---------|------|
| 阴郁、电影感、编辑级 | `signal` |
| 安静、极简、学术 | `cartesian` |
| 激进、现代主义、宣言 | `studio` |
| 温暖、社论、双语 | `broadside` |
| 多色、创意、非正式 | `block-frame` |

```bash
cd themes
cp -r signal my-theme
```

### 2. 改 `my-theme/theme.css`

按合约自上而下走一遍：调色板 → 字体 → 类型尺度 → 间距 → 性格旋钮 → 阴影 → 装饰 → 12 MUST class。

**几条关键规则：**

- 深色主题 `--shell` 比 `--surface` 更深/更饱和；浅色主题 `--shell` 比 `--surface` 略灰
- `--text` 与 `--surface` 至少 4.5:1 对比度；96px+ 标题可放宽到 3:1
- `--accent` 是唯一的饱和色；`--accent-glow` 和 `--accent-soft` 是同色相透明度叠层
- `--text-faint` 在 13px 大写时仍然要可读
- 挑一个设计签名重发力；别同时叠三个

### 3. 改 `my-theme/theme.json`

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "nameZh": "我的主题",
  "description": "一句英文描述。",
  "descriptionZh": "一句中文描述。",
  "mood": ["dark", "moody"],
  "bestFor": ["场景1", "场景2"],
  "avoidFor": ["不适合场景"],
  "formality": "high",
  "source": "custom",
  "preview": { "shell": "#000", "surface": "#fff", "text": "#000", "accent": "#06f" }
}
```

`id` 必须等于目录名。

### 4. 改 `my-theme/design.md`

写清楚：调色板规则、排版层级、装饰词汇、动画方向、反模式。章节 agent 在实现时会读这份文档来理解约束。

### 5. 测试

```bash
bash scripts/scaffold.sh /tmp/test-theme --theme=my-theme
cd /tmp/test-theme && npm run dev
```

把 demo 每一步点完。检查所有 12 个 MUST class 是否渲染正确。

## 反模式

- **章节 CSS 硬编码 hex 颜色/字体名** —— 缺哪个语义就补哪个变量
- **演示中途切换主题** —— 选一个，一以贯之
- **第二个 accent 色** —— 只能有一个。用尺度+字重做层级
- **在组件层 override 主题变量** —— 只在 `:root` 里覆盖
- **依赖主题的 TSX 条件分支** —— 章节必须主题无关。布局依赖明 vs 暗 = 布局脆弱
- **一个主题叠三个设计签名** —— 选一个
- **跳过 12 个 MUST class** —— 每个主题必须全部实现
