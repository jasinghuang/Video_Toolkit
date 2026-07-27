import type { CSSProperties, ReactNode } from "react";
import type { StepState } from "../StepReveal";
import "./layouts.css";

/* ===================================================================
 * Pyramid — descending-width hierarchy pyramid.
 *
 * Layout (flex column inside .scene-pad):
 *   ┌──────────────────────────────────────┐
 *   │  Headline (optional)                 │
 *   │                                      │
 *   │  ┌────────────────────────────┐      │
 *   │  │  Name              desc    │      │  ← widest (tint 70%)
 *   │  ├────────────────────────────┤      │
 *   │  │  Name              desc    │      │  ← tint 45%
 *   │  ├────────────────────────────┤      │
 *   │  │  Name              desc    │      │  ← tint 27%
 *   │  ├────────────────────────────┤      │
 *   │  │  Name              desc    │      │  ← tint 15%
 *   │  ├────────────────────────────┤      │
 *   │  │  Name              desc    │      │  ← narrowest (tint 8%)
 *   └──────────────────────────────────────┘
 *
 * Each level has accent left border and progressively lighter background
 * using color-mix. Widths decrease from top (wideset) to bottom (narrowest).
 *
 * Usage (full component):
 *   <Pyramid
 *     headline="The hierarchy"
 *     levels={[
 *       { name: "Strategy", desc: "Long-term vision" },
 *       { name: "Tactics", desc: "Medium-term plans" },
 *       { name: "Operations", desc: "Daily execution" },
 *     ]}
 *     activeIndex={step - 1}
 *     revealed={[...]}
 *   />
 *
 * Usage (sub-components):
 *   <Pyramid.Root headline="The hierarchy">
 *     <Pyramid.Level name="Strategy" desc="Long-term" index={0} total={3} />
 *     <Pyramid.Level name="Tactics" desc="Medium" index={1} total={3} />
 *   </Pyramid.Root>
 * =================================================================== */

export interface PyramidLevel {
  name: string;
  desc?: string;
}

export interface PyramidProps {
  /** Optional headline above the pyramid. */
  headline?: string;
  /** Kicker / tagline above headline. */
  kicker?: string;
  /** Levels from widest (top) to narrowest (bottom). */
  levels: PyramidLevel[];
  /** Step state: which level is currently active. */
  activeIndex?: number;
  /** Step state: which levels have been revealed so far. */
  revealed?: number[];
  className?: string;
  style?: CSSProperties;
}

/**
 * Calculate tint percentage for a pyramid level.
 * Top level (index 0) gets 70%, bottom level gets 8%.
 */
function getTint(index: number, total: number): number {
  if (total <= 1) return 70;
  const ratio = index / (total - 1); // 0 to 1
  return Math.round(8 + (70 - 8) * (1 - ratio)); // 70..8
}

export function Pyramid({
  headline,
  kicker,
  levels,
  activeIndex,
  revealed,
  className,
  style,
}: PyramidProps) {
  const hasStepState = activeIndex !== undefined;
  const revealedSet = revealed ? new Set(revealed) : null;

  return (
    <div className={`py-scene scene-pad ${className ?? ""}`} style={style}>
      {/* Header */}
      {(kicker || headline) && (
        <div className="py-header">
          {kicker && <div className="label">{kicker}</div>}
          {headline && <h2 className="py-headline display">{headline}</h2>}
        </div>
      )}

      {/* Levels */}
      <div className="py-body">
        {levels.map((level, i) => {
          const tint = getTint(i, levels.length);
          const widthPct = 100 - i * (70 / Math.max(levels.length - 1, 1));

          let state: StepState | undefined;
          if (hasStepState && revealedSet) {
            if (i === activeIndex) state = "active";
            else if (revealedSet.has(i)) state = "past";
            else state = "ghost";
          }

          const stateClass =
            state === "ghost"
              ? "step-ghost"
              : state === "active"
                ? "step-active"
                : state === "past"
                  ? "step-past"
                  : "";

          return (
            <Pyramid.Level
              key={i}
              name={level.name}
              desc={level.desc}
              tint={tint}
              widthPct={widthPct}
              stateClass={stateClass}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ─── Level sub-component ─── */

interface LevelProps {
  name: string;
  desc?: string;
  tint: number;
  widthPct: number;
  stateClass: string;
  className?: string;
  style?: CSSProperties;
}

function Level({ name, desc, tint, widthPct, stateClass, className, style }: LevelProps) {
  return (
    <div
      className={`py-level py-level-accent ${stateClass} ${className ?? ""}`}
      style={{
        transform: `scaleX(${widthPct / 100})`,
        "--py-tint": `${tint}%`,
        ...style,
      } as CSSProperties}
    >
      <div className="py-name">{name}</div>
      {desc && <div className="py-desc">{desc}</div>}
    </div>
  );
}

/* ─── Root sub-component ─── */

function Root({
  headline,
  kicker,
  children,
  className,
  style,
}: {
  headline?: string;
  kicker?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`py-scene scene-pad ${className ?? ""}`} style={style}>
      {(kicker || headline) && (
        <div className="py-header">
          {kicker && <div className="label">{kicker}</div>}
          {headline && <h2 className="py-headline display">{headline}</h2>}
        </div>
      )}
      <div className="py-body">{children}</div>
    </div>
  );
}

Pyramid.Level = Level;
Pyramid.Root = Root;
