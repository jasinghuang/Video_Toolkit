# Architecture Decisions — Layout Components System

本文件记录 web-video-presentation 布局组件系统的架构决策。每个决策说明
"选了什么、为什么、不选什么"。

---

## 决策 1：Chrome（页眉页脚）

**决定：保持 WVP 的无 chrome 哲学。布局组件不包含页眉页脚。**

理由：

- WVP 是「伪装成视频的网页」，录屏后观众看到的是视频，不是幻灯片。
  页眉页脚（页码 / 章节标签 / 来源标注）会破坏视频沉浸感。
- BHT 是幻灯片工具——它的 chrome 服务于演示者翻页时的定位需求。
  WVP 的 Auto 模式自动推进，演示者不手动翻页，不需要 chrome。
- EXAMPLES 里已有的 masthead（如 `.ex-masthead`、`.lr-masthead`）本质
  上不是 chrome——它们是**章节内容的一部分**（开场标签 / 章节标记），
  渲染在 `.scene` 内部，随内容变化。这可以保留。

**布局组件提供什么：** 组件内部不渲染 chrome。章节 agent 如需章节级
标签（如「第一部分 · 强在哪」），自行用 `.label` + `.rule` 组合。

**边界：** `.scene-pad` 的内边距（`--stage-pad-y` / `--stage-pad-x`）
充当了安全区——BHT 的顶栏/底栏位置在 WVP 中就是空的留白区。视觉上
等价于「有 chrome 的结构，但 chrome 是透明的」。

---

## 决策 2：定位模型

**决定：混合模型。布局组件默认走 flexbox/grid 流式布局，同时暴露
`decor` 属性用于 BHT 风格的绝对定位装饰元素。**

理由：

- 纯 `position: absolute`（BHT 方式）会导致布局组件与主题的间距系统
  脱钩——每个主题有不同的 `--stage-pad-x` / `--space-lg`，absolute
  坐标无法自适应。
- 纯 flexbox/grid（当前 WVP 方式）无法实现 BHT 的叠层装饰效果
  （offset shadow boxes、角标、几何图形叠加）。
- 混合模型：**结构走流式（兼容主题），装饰走绝对定位（还原 BHT）。**

具体规则：

| 元素类型 | 定位方式 | 原因 |
|---|---|---|
| 文字内容（标题 / 正文 / 标签） | flexbox/grid 流式 | 跟随主题间距系统 |
| 数据卡 / 步骤卡 / 表单元格 | flexbox/grid 流式 | 跟随主题间距系统 |
| 角标 / 印章 / 叠层色块 / 几何图形 | `position: absolute`（在组件根上 `position: relative`） | BHT 装饰词汇 |
| 图表（坐标轴 + 柱体 + 标签） | `position: absolute` 或 SVG | 精确空间关系 |
| 全屏图 + 底部渐变压字 | `position: absolute` | 覆盖式布局 |

**布局组件 API 暴露两种插槽：**

```tsx
// 结构插槽（流式布局，主题兼容）
<CoverSlide
  headline="标题"
  subtitle="副标题"
  // 装饰插槽（absolute 定位，在组件 bounds 内自由摆放）
  decor={<GeometricSwitch />}
/>
```

`decor` 渲染为 `position: absolute` 在组件根元素的 `position: relative`
上下文内。组件提供 `decorAnchor` 属性控制装饰锚点（`"top-right"` /
`"center"` / `"bottom-left"` 等）。

章节 agent 如需超出布局组件能力的复杂绝对定位（如 Creative Mode
的等距示意图），自行写章节 CSS——布局组件不试图覆盖所有场景。

---

## 决策 3：步状态管理（ghost → active → past）

**决定：布局组件通过 `activeIndex` + `revealed` 两个 prop 暴露渐进揭示。
默认行为（无 activeIndex）为单步全显。**

### 状态推导规则

```
revealed: number[]  ← 已揭示的项索引（支持多步累积揭示）
activeIndex: number ← 当前正在揭示的项索引（可选，用于强调动画）

对于每个项 i：
  i < activeIndex  → "past"   （灰化保留）
  i === activeIndex → "active"（亮起 + 入场动画）
  i 不在 revealed 中 → "ghost"（虚线占位 / 隐藏）
```

### 组件 API 示例

```tsx
// 单步全显（默认）
<StatGrid items={[a, b, c, d]} />

// 渐进揭示：step 0 = 全部 ghost，step 1 = 第 0 项 active，step 2 = 第 1 项 active, 第 0 项 past
<StatGrid
  items={[a, b, c, d]}
  activeIndex={step - 1}       // step 1 → index 0 active
  revealed={items.slice(0, step).map((_, i) => i)}  // 累积
/>
```

### 组件内部实现模式

```tsx
function getItemState(i: number, activeIndex?: number, revealed?: number[]) {
  if (activeIndex === undefined) return "visible";
  if (i === activeIndex) return "active";
  if (revealed?.includes(i)) return "past";
  return "ghost";
}
```

组件内部根据 state 切换 CSS class（`-ghost` / `-active` / `-past`），
每个状态对应基础 CSS 中定义的视觉样式（透明度 / 滤镜 / 边框样式）。

### 为什么不是更复杂的方案

- 不引入 `useReducer` 或内部状态：章节是 step 的纯函数，布局组件也是。
  状态推导规则简单、可预测、可测试。
- 不要求组件感知 step 语义：组件只知道「哪个项是什么状态」。step 到
  项的映射由章节 agent 在组件调用处完成。
- 不强制动画策略：组件提供 CSS class 作为状态钩子，动画 keyframes 由
  章节 CSS 或 animations.css 提供。

---

## 决策 4：动画系统

**决定：建 3 层动画基础设施，不建 1 个大而全的动画组件。**

### 第 1 层：动画原语（CSS keyframes）—— 已有，需补

`animations.css` 已有：mask-reveal、rule-grow、rise-in、scale-in、pop-in、pulse-halo、letter-stagger。

需补（对齐 BHT 的 5 种动画类型）：

| BHT 类型 | WVP 对应 | 实现方式 |
|---|---|---|
| fade-up | `rise-in`（已有） | 需加 CSS class `.rise-in` |
| fade-in | `fade-in`（base.css 已有） | 直接用 |
| reveal-right | `mask-reveal`（已有） | 直接用 `<MaskReveal>` |
| reveal-left | **新增** | `mask-reveal-left`（clip-path 从右往左） |
| scale-in | `scale-in`（已有 keyframe） | 需加 CSS class `.scale-in` |

### 第 2 层：`<AnimateIn>` 组件

统一入口，封装所有入场动画：

```tsx
<AnimateIn type="fade-up" delay={2} duration={600}>
  <h1>标题</h1>
</AnimateIn>
```

`type` 枚举：`"fade-up" | "fade-in" | "reveal-right" | "reveal-left" | "scale-in" | "pop-in"`

`delay`：0-6 的档位（映射到 `0 / 80 / 180 / 300 / 440 / 600 / 780` ms，对应 BHT 的 7 级交错延迟）。

### 第 3 层：`<StepReveal>` 组件

包装布局组件，处理跨步状态转换的动画：

```tsx
<StepReveal state="active" enter="reveal-right" exit="fade">
  <StatCard ... />
</StepReveal>
```

- `state`: `"ghost" | "active" | "past" | "visible"`
- `enter`: 入场动画类型
- `exit`: 离场变换（ghost→active 或 active→past 时的过渡）

`StepReveal` 不替换布局组件的内部实现——它只是外层包装器，处理 state
变化时的 CSS class 切换。布局组件内部的 state class（`-ghost` /
`-active` / `-past`）负责静态视觉样式；`StepReveal` 负责入场/过渡动画。

### 章节 agent 的选择层级

```
需要自定义动画 keyframes → 写章节 CSS（不改 animations.css）
需要标准入场动画       → 用 <AnimateIn>
需要跨步状态转换       → 用 <StepReveal> 包装布局组件
需要复杂多元素编排     → 组合 <AnimateIn> + 不同 delay
```

---

## 决策 5：装饰策略

**决定：装饰分为三层——主题层、组件层、章节层。每层有明确的归属边界。**

### 主题层（theme.css 提供）

属于主题设计系统的一部分，**所有使用该主题的章节自动获得**：

- `.rule` — 装饰性短线（通常 accent 色）
- `.kicker` — mono 标签文本（章节编号 / 分类标签）
- `.surface-pattern` — 舞台表面的图案纹理（Signal 的网格线 / daisy-days 的手绘花）
- `.surface-vignette` — 舞台边缘的渐变暗角
- `--card-shadow` — 卡片的阴影风格

### 组件层（布局组件提供）

属于布局组件视觉公式的一部分，**所有使用该组件的章节自动获得**：

- 角标（StatGrid 每格右上角的 `/01` `/02`）
- 箭头连接器（ProcessFlow 步骤间的 → 三角箭头）
- 编号（ProcessFlow / Timeline 每项的序号）
- 数据卡背景色交替（StatGrid 的 `cellColors` 属性）

### 章节层（章节 CSS 提供）

属于本章特有的装饰元素，**章节 agent 自由创作**：

- 特定 SVG 形状（如 hook-chapter 的 brush-strike）
- 特定几何色块组合（如 Creative Mode 的开关图形）
- 印章动画（如 hook-chapter 的 stamp-drop）
- 自定义图表元素（如手绘风格的坐标轴线）

### 边界规则

| 场景 | 归属 |
|---|---|
| 「这个装饰所有主题都能用」 | 布局组件 |
| 「这个装饰只能用在这个主题」 | theme.css |
| 「这个装饰只用于这个章节的这一页」 | 章节 CSS |
| 「不确定」 | 先放章节 CSS，用两次以上 → 提升到布局组件 |

---

## 决策 6：布局组件 API 规范

所有布局组件遵循统一的 API 约定：

### 通用 Props

```ts
interface LayoutComponentProps<T> {
  // 数据
  items: T[];

  // 步骤状态（可选 —— 不传 = 单步全显）
  activeIndex?: number;
  revealed?: number[];

  // 样式覆盖
  className?: string;
  style?: CSSProperties;

  // 装饰插槽
  decor?: ReactNode;
  decorAnchor?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";

  // 变体
  variant?: string;  // 组件特定的布局变体

  // 布局配置
  cols?: number;     // StatGrid / ProcessFlow / DataTable
  gap?: string;      // 覆盖默认间距（用 CSS 变量）
}
```

### 子组件模式

每个布局组件导出两部分：

```tsx
// 1. 完整组件 —— 一键渲染标准布局
import { StatGrid } from "./components/layouts/StatGrid";
<StatGrid items={data} />

// 2. 子组件 —— 需要自定义时的积木块
import { StatGrid, StatCard } from "./components/layouts/StatGrid";
<StatGrid>
  <StatCard state="active" value="42%" label="增长" />
  <StatCard state="ghost" value="118" label="用户数" />
</StatGrid>
```

完整组件模式 = 90% 场景的便捷路径。
子组件模式 = 需要精细控制每个 item 渲染时的逃生舱。

### 组件不做什么

- 不加载字体（fonts.css 负责）
- 不定义颜色值（CSS 变量负责）
- 不定义动画 keyframes（animations.css 或章节 CSS 负责）
- 不导入主题文件（theme.css 负责）
- 不处理章节路由 / step 计数（章节 agent 负责）
