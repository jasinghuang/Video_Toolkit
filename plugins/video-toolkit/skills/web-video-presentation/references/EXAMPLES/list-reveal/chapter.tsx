// ⚠️ 这是 anchor 参考代码，不会被任何项目编译。
//    抄到真实项目时（presentation/src/chapters/NN-list/），
//    把下面 import 改成：
//      import { MaskReveal } from "../../components/MaskReveal";
//      import { AnimateIn } from "../../components/AnimateIn";
//      import { StepReveal } from "../../components/StepReveal";
//      import { StatGrid, StatItem } from "../../components/layouts";
//      import type { ChapterStepProps } from "../../registry/types";
import { MaskReveal } from "../../../templates/src/components/MaskReveal";
import { AnimateIn } from "../../../templates/src/components/AnimateIn";
import { StepReveal } from "../../../templates/src/components/StepReveal";
import { StatGrid } from "../../../templates/src/components/layouts";
import type { StatItem } from "../../../templates/src/components/layouts";
import type { ChapterStepProps } from "../../../templates/src/registry/types";
import "./chapter.css";

/**
 * list-reveal · 用布局组件重写的渐进揭示示例
 * ─────────────────────────────────────────
 * 新版架构：用 StatGrid 驱动 3 列数据卡，StepReveal 处理状态过渡。
 * 不再需要手写 Slot 组件和 lr-* CSS —— StatGrid 自带的 .sg-card +
 * step-ghost / step-active / step-past 类已覆盖全部视觉状态。
 *
 * 组件使用对照：
 *   step 0      — StatGrid（引子 masthead + 3 ghost 卡片）
 *   step 1-3    — StatGrid（渐进揭示：ghost → active → past）
 *
 * 自定义部分（仍写 CSS）：
 *   lr-masthead  — 双线 + kicker 的章节标题（布局组件不管这个）
 *   lr-intro-h   — 引子大字（自定义排版，不映射到 StatGrid props）
 */

const ITEMS: StatItem[] = [
  { value: "01", label: "文字渲染", note: "图里的文字也能正确写出来" },
  { value: "02", label: "指令遵循", note: "可以给到非常具体的要求" },
  { value: "03", label: "照片真实感", note: "光影 / 材质 / 人物接近真实" },
];

export default function ListRevealChapter({ step }: ChapterStepProps) {
  /* ─── step 0 — 引子 + 全部 ghost ─── */
  if (step === 0) {
    return (
      <StatGrid.Root kicker="第一部分" headline="强在哪" className="lr-intro-scene">
        {/* 引子 masthead（布局组件不管这个） */}
        <header className="lr-masthead">
          <span className="lr-rule" />
          <span className="lr-kicker">第一部分</span>
          <span className="lr-rule" />
        </header>

        <AnimateIn type="fade-up" delay={1}>
          <h1 className="lr-intro-h">
            强在<span className="lr-em">哪</span>
          </h1>
        </AnimateIn>

        <AnimateIn type="fade-up" delay={2}>
          <div className="lr-intro-sub">三件事 —— 一个个看</div>
        </AnimateIn>

        {/* 3 列 ghost 卡片 */}
        <div className="lr-grid">
          {ITEMS.map((item, i) => (
            <StepReveal key={i} state="ghost">
              <StatGrid.Card
                value={item.value}
                label={item.label}
                note={item.note}
                corner={`/0${i + 1}`}
              />
            </StepReveal>
          ))}
        </div>
      </StatGrid.Root>
    );
  }

  /* ─── step 1-3 — 渐进揭示 ─── */
  const activeIdx = step - 1;
  const revealed = ITEMS.slice(0, step).map((_, i) => i);

  return (
    <StatGrid.Root kicker="第一部分 · 强在哪" className="lr-reveal-scene">
      {/* Masthead（精简版：单行） */}
      <header className="lr-masthead">
        <span className="lr-rule" />
        <span className="lr-kicker">第一部分 · 强在哪</span>
        <span className="lr-rule" />
      </header>

      {/* 3 列渐进揭示 */}
      <div className="lr-grid">
        {ITEMS.map((item, i) => {
          const state =
            i < activeIdx ? "past" : i === activeIdx ? "active" : "ghost";

          return (
            <StepReveal key={i} state={state} enter="reveal-right">
              <StatGrid.Card
                value={item.value}
                label={item.label}
                note={item.note}
                corner={`/0${i + 1}`}
                variant={i === activeIdx ? "accent" : "surface"}
              />
            </StepReveal>
          );
        })}
      </div>
    </StatGrid.Root>
  );
}
