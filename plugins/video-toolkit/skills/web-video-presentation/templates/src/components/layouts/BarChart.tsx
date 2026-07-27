import type { CSSProperties, ReactNode } from "react";
import type { StepState } from "../StepReveal";
import "./layouts.css";

/* ===================================================================
 * BarChart — CSS-based horizontal bar chart with labels and values.
 *
 * Layout (flex column inside .scene-pad):
 *   ┌──────────────────────────────────────┐
 *   │  Headline (optional)                 │
 *   │  Kicker (optional)                   │
 *   │                                      │
 *   │  ┌─────────────────────────── 42%    │
 *   │  ┌────────────────── 27%             │
 *   │  ┌──────────── 15%                   │
 *   │  ─────────────────────────────────   │
 *   │  LABEL_A   LABEL_B   LABEL_C         │
 *   │                                      │
 *   │  Source: ...                          │
 *   └──────────────────────────────────────┘
 *
 * Usage (full component):
 *   <BarChart
 *     headline="Revenue by segment"
 *     bars={[
 *       { label: "Product", value: 42, color: "accent" },
 *       { label: "Service", value: 27, color: "surface-2" },
 *     ]}
 *     activeIndex={step - 1}
 *     revealed={[...]}
 *   />
 *
 * Usage (sub-components):
 *   <BarChart.Root headline="Revenue">
 *     <BarChart.Bar label="Product" value={42} color="accent" />
 *     <BarChart.Bar label="Service" value={27} color="surface-2" />
 *   </BarChart.Root>
 * =================================================================== */

export interface BarItem {
  label: string;
  value: number;
  /** Bar color variant. Default: "accent". */
  color?: "accent" | "surface-2" | "muted";
}

export interface BarChartProps {
  /** Optional headline above the chart. */
  headline?: string;
  /** Kicker / tagline above headline. */
  kicker?: string;
  /** Bar data items. */
  bars: BarItem[];
  /** Maximum value for the scale. Auto-calculated if omitted. */
  maxValue?: number;
  /** Source / footnote below the chart. */
  source?: string;
  /** Step state: which bar is currently active. */
  activeIndex?: number;
  /** Step state: which bars have been revealed so far. */
  revealed?: number[];
  className?: string;
  style?: CSSProperties;
}

const barColors: Record<NonNullable<BarItem["color"]>, string> = {
  accent: "bc-bar-accent",
  "surface-2": "bc-bar-surface",
  muted: "bc-bar-muted",
};

export function BarChart({
  headline,
  kicker,
  bars,
  maxValue,
  source,
  activeIndex,
  revealed,
  className,
  style,
}: BarChartProps) {
  const maxVal = maxValue ?? Math.max(...bars.map((b) => b.value));
  const hasStepState = activeIndex !== undefined;
  const revealedSet = revealed ? new Set(revealed) : null;

  return (
    <div className={`bc-scene scene-pad ${className ?? ""}`} style={style}>
      {/* Header */}
      {(kicker || headline) && (
        <div className="bc-header">
          {kicker && <div className="label">{kicker}</div>}
          {headline && <h2 className="bc-headline display">{headline}</h2>}
        </div>
      )}

      {/* Chart */}
      <div className="bc-body">
        <div className="bc-track">
          {bars.map((bar, i) => {
            const pct = maxVal > 0 ? (bar.value / maxVal) * 100 : 0;
            const colorClass = barColors[bar.color ?? "accent"];

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
              <BarChart.Bar
                key={i}
                label={bar.label}
                value={bar.value}
                pct={pct}
                colorClass={colorClass}
                stateClass={stateClass}
              />
            );
          })}
        </div>

        {/* Baseline */}
        <div className="bc-baseline" />

        {/* Source */}
        {source && <div className="bc-source">{source}</div>}
      </div>
    </div>
  );
}

/* ─── Bar sub-component ─── */

interface BarProps {
  label: string;
  value: number;
  pct: number;
  colorClass: string;
  stateClass: string;
  className?: string;
  style?: CSSProperties;
}

function Bar({ label, value, pct, colorClass, stateClass, className, style }: BarProps) {
  return (
    <div className={`bc-col ${stateClass} ${className ?? ""}`} style={style}>
      <div className={`bc-bar ${colorClass}`} style={{ transform: `scaleY(${pct / 100})` }} />
      <div className="bc-value">{value}</div>
      <div className="bc-label">{label}</div>
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
    <div className={`bc-scene scene-pad ${className ?? ""}`} style={style}>
      {(kicker || headline) && (
        <div className="bc-header">
          {kicker && <div className="label">{kicker}</div>}
          {headline && <h2 className="bc-headline display">{headline}</h2>}
        </div>
      )}
      <div className="bc-body">
        <div className="bc-track">{children}</div>
        <div className="bc-baseline" />
      </div>
    </div>
  );
}

BarChart.Bar = Bar;
BarChart.Root = Root;
