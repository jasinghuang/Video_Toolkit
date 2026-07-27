import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./Example.css";

/**
 * Reference chapter — replace with your own.
 *
 * Uses the 12 MUST classes from the active theme so you can swap themes
 * without editing chapter code. See references/SEMANTIC-CLASSES.md.
 */
export default function ExampleChapter({ step }: ChapterStepProps) {
  /* Step 0 — hero headline + label + click cue */
  if (step === 0) {
    return (
      <div className="ex-scene scene-pad">
        <div className="ex-masthead">
          <span className="label">Your Presentation</span>
          <span className="meta">Issue · 01 — Replace this</span>
        </div>
        <div className="divider" />

        <div className="ex-cover-body">
          <div className="label">Chapter 01 — Example</div>
          <h1 className="ex-cover-h">
            <MaskReveal show duration={900}>
              <span className="display-cn">这是&nbsp;</span>
            </MaskReveal>
            <MaskReveal show delay={300} duration={900}>
              <span className="display">
                <em>first step</em>
              </span>
            </MaskReveal>
            <MaskReveal show delay={650} duration={900}>
              <span className="display-cn">.</span>
            </MaskReveal>
          </h1>
          <div className="label">
            <span className="ex-dot" /> &nbsp;Tap anywhere to advance
          </div>
        </div>
      </div>
    );
  }

  /* Step 1 — split layout: stat value + body */
  if (step === 1) {
    return (
      <div className="ex-scene scene-pad">
        <div className="ex-masthead">
          <span className="label">Your Presentation</span>
          <span className="meta">Issue · 01</span>
        </div>
        <div className="divider" />

        <div className="ex-split">
          <div className="stat-value">02</div>
          <div className="ex-split-body">
            <div className="label">每一步</div>
            <h2 className="ex-split-h">
              <MaskReveal show duration={900}>
                <span className="display-cn">独占&nbsp;</span>
              </MaskReveal>
              <MaskReveal show delay={300} duration={900}>
                <span className="display">
                  <em>整个屏幕</em>
                </span>
              </MaskReveal>
              <MaskReveal show delay={650} duration={900}>
                <span className="display-cn">.</span>
              </MaskReveal>
            </h2>
            <p className="body">
              The active theme controls every visual detail — palette, fonts,
              stat style, divider weight, decoration, motion. The chapter code
              is theme-agnostic.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* Step 2 — quote close */
  return (
    <div className="ex-scene scene-pad ex-close">
      <div className="ex-close-inner">
        <div className="label">Now</div>
        <div className="quote ex-quote">
          <MaskReveal show duration={1100}>
            <span className="display-cn">Replace this with </span>
          </MaskReveal>
          <MaskReveal show delay={400} duration={1100}>
            <span className="display">
              <em>your own&nbsp;</em>
            </span>
          </MaskReveal>
          <MaskReveal show delay={760} duration={1100}>
            <span className="display-cn">chapters.</span>
          </MaskReveal>
        </div>
        <div className="meta">
          See SKILL.md / CHAPTER-CRAFT.md / THEMES.md
        </div>
      </div>
    </div>
  );
}
