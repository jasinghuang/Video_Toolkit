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

15 套主题，每套来自 [beautiful-html-templates](https://github.com/zarazhangrui/beautiful-html-templates) 的独立设计 DNA。

### 深色主题

| id | 名称 | 性格 | bestFor |
|----|------|------|---------|
| `signal` | 信号 | 深海军蓝+暖奶油双表面，古董金 accent，Instrument Serif 斜体，80px 不可视听网格 | 深度内容、品牌文化、高端发布、编辑级口播 |
| `studio` | 工作室 | 近黑+酸性黄二元系统，Barlow 900 大写，类型即图形 | 创意设计、品牌宣言、激进观点、年轻化内容 |
| `broadside` | 传单 | 近黑+暖奶油双表面，火橙 accent，全 sans-serif 双语系统 | 双语内容、社论、pitch deck、数据叙事 |
| `block-frame` | 块框 | 多色 pastel-neon 块系统，Space Grotesk，3px 粗黑边框 | 创意、非正式、设计周、年轻品牌 |

### 浅色主题

| id | 名称 | 性格 | bestFor |
|----|------|------|---------|
| `cartesian` | 笛卡尔 | 暖石色调系统，无饱和色，Playfair Display 斜体，1px 发丝线，罗盘圆装饰 | 学术研究、建筑设计、极简内容、投资报告 |
| `emerald-editorial` | 翡翠编辑 | 深绿+奶油，编辑级衬线，自然/可持续气质 | 环境、户外、纪录、文学 |
| `neo-grid-bold` | 新网格 | 12×8 网格系统，粗体 sans-serif，技术文档感 | 技术演示、架构图、数据密集 |
| `8-bit-orbit` | 8位轨道 | 像素艺术+复古游戏美学 | 游戏、怀旧、创意技术 |
| `biennale-yellow` | 双年黄 | 阳光黄+暖羊皮纸，艺术展览气质 | 艺术展览、文化项目、创意 |
| `daisy-days` | 雏菊 | 柔粉 pastel+手写体，温和友好 | 温馨、友好、onboarding、女性向 |
| `monochrome` | 单色 | 严格单色编辑，比 Cartesian 更暗 | 摄影、极简、严肃内容 |
| `pin-and-paper` | 图钉纸 | 软木板+图钉美学，独特装饰词汇 | 创意工作坊、头脑风暴、非正式 |
| `retro-zine` | 复古志 | risograph 印刷质感+叠层色彩 | 独立出版、zine、触感 vintage |
| `editorial-tri-tone` | 三色调 | 三色调编辑系统，独特配色 | 时尚、设计、品牌 |
| `raw-grid` | 原生网格 | 原始网格美学/结构化 brutalist | 建筑、结构、实验性 |

> 运行 `bash scripts/scaffold.sh --list-themes` 查看当前完整目录。

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
