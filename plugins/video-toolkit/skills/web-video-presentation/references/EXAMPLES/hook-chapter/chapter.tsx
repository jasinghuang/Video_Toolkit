// ⚠️ 这是 anchor 参考代码，不会被任何项目编译。
//    抄到真实项目时（presentation/src/chapters/NN-hook/），
//    把下面两个 import 改成：
//      import { MaskReveal } from "../../components/MaskReveal";
//      import { AnimateIn } from "../../components/AnimateIn";
//      import { StepReveal } from "../../components/StepReveal";
//      import { CoverSlide, QuoteSlide, StatGrid } from "../../components/layouts";
//      import type { ChapterStepProps } from "../../registry/types";
import { MaskReveal } from "../../../templates/src/components/MaskReveal";
import { AnimateIn } from "../../../templates/src/components/AnimateIn";
import { StepReveal } from "../../../templates/src/components/StepReveal";
import { CoverSlide, QuoteSlide, StatGrid } from "../../../templates/src/components/layouts";
import type { ChapterStepProps } from "../../../templates/src/registry/types";
import "./chapter.css";

/**
 * hook-chapter · 用布局组件重写的完整章节示例
 * ─────────────────────────────────────────
 * 默认绑 newsroom 主题（serif + 报头红 + 印刷盖章 motion）。
 *
 * 新版架构：优先用布局组件（CoverSlide / QuoteSlide / StatGrid），
 * 只在需要自定义视觉演示时才写章节 CSS（如 stamp-drop / brush-strike）。
 *
 * 组件使用对照：
 *   step 0  — StatGrid（3 张 ghost 卡片，悬念钩子）
 *   step 1-3 — 自定义（独图 + 角章动画，布局组件无此模式）
 *   step 4  — CoverSlide（takeover 大字）
 *   step 5  — QuoteSlide（钩子收束 + brush 划掉）
 */
export default function HookChapter({ step }: ChapterStepProps) {
  /* ─── 素材数据（来自 outline.md 本章 + article.md 段落）─── */
  const reveals: Array<{ src: string; label: string; caption: string }> = [
    {
      src: "/hook/<asset-1>.png",
      label: "01 / 03",
      caption: "<反例 1 caption，来自 article §X>",
    },
    {
      src: "/hook/<asset-2>.png",
      label: "02 / 03",
      caption: "<反例 2 caption>",
    },
    {
      src: "/hook/<asset-3>.png",
      label: "03 / 03",
      caption: "<反例 3 caption>",
    },
  ];

  /* ─── step 0 — 三张 ghost 卡片（用 StatGrid） ─── */
  if (step === 0) {
    return (
      <StatGrid
        headline=""
        kicker="这几天"
        items={reveals.map((r) => ({
          value: r.label,
          label: r.caption,
        }))}
        cols={3}
        activeIndex={-1}    // 全部 ghost
        revealed={[]}
        className="hk-intro"
      />
    );
  }

  /* ─── step 1-3 — 每张图独占（自定义布局：布局组件无此模式） ─── */
  if (step >= 1 && step <= 3) {
    const r = reveals[step - 1];
    return (
      <div className="hk-scene scene-pad" key={step}>
        <div className="hk-solo-frame">
          <MaskReveal show duration={1100}>
            <div className="hk-solo-img-wrap">
              <img className="hk-solo-img" src={r.src} alt={r.caption} />
              <div className="hk-stamp">FAKE?</div>
            </div>
          </MaskReveal>
          <AnimateIn type="fade-up" delay={2}>
            <div className="hk-solo-meta">
              <span className="hk-solo-label">{r.label}</span>
              <span className="hk-solo-caption">{r.caption}</span>
            </div>
          </AnimateIn>
        </div>
      </div>
    );
  }

  /* ─── step 4 — takeover（用 CoverSlide） ─── */
  if (step === 4) {
    return (
      <CoverSlide
        headline="<主题大字 takeover>"
        kicker="现在"
        meta=""
        className="hk-takeover-scene"
        decor={
          <div className="hk-mini-row" aria-hidden="true">
            {reveals.map((r, idx) => (
              <img
                key={r.src}
                className="hk-mini"
                src={r.src}
                alt={r.caption}
                style={{ animationDelay: `${idx * 80}ms` }}
              />
            ))}
          </div>
        }
      />
    );
  }

  /* ─── step 5 — 钩子收束（用 QuoteSlide + 自定义 brush） ─── */
  return (
    <QuoteSlide.Root variant="centered" className="hk-close">
      <AnimateIn type="fade-up" delay={1}>
        <h2 className="hk-quote">&lt;下一句钩子&gt;</h2>
      </AnimateIn>
      <span className="hk-brush" aria-hidden />
    </QuoteSlide.Root>
  );
}
