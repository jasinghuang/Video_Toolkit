# add-subtitle presentation 注入模式 设计文档

- 日期：2026-07-15
- 状态：待实现
- 背景：add-subtitle 当前只有"视频 + srt → HTML 字幕播放页"模式。需新增"给 web-video-presentation 产出的 presentation 注入字幕层"模式。

## 背景与动机

[web-video-presentation](https://github.com/ConardLi/garden-skills)（第三方 skill，ConardLi/garden-skills）把口播稿做成 Vite + React 的 16:9 网页演示（幻灯片动画 + TTS 音频）。其产出的 presentation 在播放时，`App.tsx` 已算出当前 step 的 narration 文本（`stepText = ch.narrations[stepper.cursor.step]`），auto 模式下音频 `ended` 自动推进 step。

这意味着"字幕 = 显示 `stepText`"——随 step 走、step 跟音频走，**天然和画面/口播同步，无需 srt、无需时间戳、无需 ffprobe**。

web-video-presentation 是第三方仓库（直接改不持久、升级会丢）。因此 add-subtitle 新增 **presentation 注入模式**：读 presentation 项目，生成字幕层组件 + patch `App.tsx` 挂载，让 presentation 获得字幕显示能力。字幕样式沿用 add-subtitle 的"黑字白底圆角描边标签"设计（为 1920×1080 舞台坐标重新标定参数）。

## 目标

- add-subtitle 新增 `--presentation <path>` 模式：给 web-video-presentation 产出的 presentation 注入字幕层
- 字幕显示当前 `stepText`（narration），随 step 推进自动切换
- 字幕在舞台内（1920×1080 坐标，随 `transform: scale` 一起缩放），样式为黑字白底圆角描边标签
- 默认显示，按 `H` 键临时隐藏
- 不改 web-video-presentation skill（第三方），原"视频 + srt"模式保留

## 非目标

- 不改 web-video-presentation skill
- 不引入逐字高亮/动画（字幕是静态标签）
- 不读 `audio-segments.json` 的时间信息（step 驱动，非时间驱动）
- 不改 presentation 的 audio / 动画 / step 逻辑

## 两种模式（互斥）

| 模式 | 命令 | 输出 |
|------|------|------|
| 视频模式（已有） | `skill_main.py subtitle.srt --video video.mp4` | `{srt}_subtitle.html` |
| presentation 模式（新增） | `skill_main.py --presentation <path>` | presentation 项目内注入字幕层文件 + patch `App.tsx` |

## 注入流程

输入：presentation 目录路径（web-video-presentation 脚手架产出的标准结构：`src/App.tsx`、`src/registry/chapters.ts` 等）。

add-subtitle 执行：

1. **校验**：
   - `src/App.tsx` 存在
   - `App.tsx` 含 `stepText`（narration 变量）和 `<Stage` 标签（web-video-presentation 标准结构）
   - 不含则报错退出，提示"presentation 结构不识别，可能 web-video-presentation 模板已变更"
2. **生成 `src/components/Subtitle.tsx`**：React 组件 + 默认显示 + `H` 键隐藏逻辑
3. **生成 `src/components/Subtitle.css`**：字幕层 + 标签样式（舞台 px）
4. **patch `src/App.tsx`**：
   - 加 `import { Subtitle } from "./components/Subtitle";`
   - 在 `<Stage>` 内、`<div className="scene">…</div>` 之后插入 `<Subtitle text={stepText} />`
   - **幂等**：检测到 import 已存在则跳过 patch（重复运行不重复注入）

字幕文本来源：`App.tsx` 的 `stepText`（已由 `useStepper` 算出）。不读 `audio-segments.json`（仅可选读它核对 narration 数量一致，非必需）。

## Subtitle 组件

```tsx
// src/components/Subtitle.tsx
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
```

`App.tsx` patch（在 `<Stage>` 内插入）：

```tsx
<Stage onAdvance={stepper.next}>
  <div key={ch.id} className="scene">
    <Cmp step={stepper.cursor.step} />
  </div>
  <Subtitle text={stepText} />   {/* 新增 */}
</Stage>
```

## 字幕样式（舞台坐标 1920×1080）

CSS 在 `src/components/Subtitle.css`。字幕层在舞台内（`Stage` 内），绝对定位底部居中。

参数（视频播放页参数 ×2 平移，实现时用真实 presentation mockup 微调）：

```css
.subtitle-layer {
  position: absolute;
  bottom: 86px;            /* 舞台 1080 的 8% */
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;             /* 高于场景内容 */
  pointer-events: none;
}

.subtitle-badge {
  display: inline-block;
  font-family: "FZLanTingHei", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-weight: 600;
  font-size: 52px;                  /* 初步值，实现时 mockup 标定 */
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
```

**参数标定计划**：实现第一步用 ep00（或任意真实 presentation）跑 dev server，在真实画面上 mockup 调字号/描边/位置（像 add-subtitle 视频播放页那样迭代），把最终值固化进 `Subtitle.css` 并回填本 spec。

## CLI

```bash
# 视频模式（保留）
python ${CLAUDE_PLUGIN_ROOT}/skills/add-subtitle/skill_main.py subtitle.srt --video video.mp4

# presentation 模式（新增）
python ${CLAUDE_PLUGIN_ROOT}/skills/add-subtitle/skill_main.py --presentation /path/to/presentation
```

参数互斥：`--presentation` 与 `srt_file + --video` 不能同时使用（argparse 互斥组）。

## patch 健壮性

web-video-presentation 升级若改 `App.tsx` 结构，patch 可能失败。策略：

- **先校验再 patch**：确认 `stepText` + `<Stage` 存在才 patch
- **不硬编码行号**：用结构匹配（定位 `<Stage…>` 标签，在其内部 `<div className="scene">…</div>` 之后插入）
- **失败报错**：校验或 patch 失败时清晰提示，不强行修改、不破坏 `App.tsx`
- **幂等**：`import { Subtitle }` 已存在则跳过 patch

## 测试

- 用 fixture presentation（最小 web-video-presentation 结构副本）跑注入：
  - `Subtitle.tsx` / `Subtitle.css` 生成且内容正确
  - `App.tsx` 正确 patch（import + 挂载位置）
  - 幂等（重复运行不重复注入、不重复 import）
  - `npx tsc --noEmit` 通过（生成的 TS 合法）
- 校验失败路径：`App.tsx` 不含 `stepText`/`<Stage` 时报错退出、不动文件
- 样式参数 mockup：真实 presentation 画面调参

## 范围边界

- 只加字幕层（显示 `stepText`），不改 presentation 的 audio / 动画 / step 逻辑
- 字幕样式是标签（黑字白底圆角描边），不引入逐字高亮
- 不改 web-video-presentation skill（第三方）
- 原"视频 + srt"模式保留不动
- 字幕样式参数（舞台 px）在实现时 mockup 标定

## 依赖

- 无新增 Python 依赖（标准库 `pathlib`/`re` 即可完成生成 + patch）
- 生成的 `Subtitle.tsx` 是 React + TS（presentation 项目本身已有 react + typescript）

## 与其他 skill 的关系

```
web-video-presentation（第三方，做内容）
    ↓ 产出 presentation/（Vite+React 项目）
add-subtitle --presentation（注入字幕层）
    ↓ 改 presentation/src/
presentation 播放时显示字幕（stepText 驱动）
```

web-video-presentation 不受影响；add-subtitle 是 presentation 的"后期字幕注入"工具。
