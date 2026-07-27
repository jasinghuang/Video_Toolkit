import type { CSSProperties, ReactNode } from "react";
import "./layouts.css";

/* ===================================================================
 * DonutChart — CSS conic-gradient donut chart with legend.
 *
 * Layout (2-column grid inside .scene-pad):
 *   ┌──────────────────────────────────────┐
 *   │  Headline (optional)                 │
 *   │                                      │
 *   │  ┌────────┐  ┌───────────────────┐   │
 *   │  │        │  │  ● Segment One   24 │   │
 *   │  │  Donut │  │  ● Segment Two   34 │   │
 *   │  │        │  │  ● Segment Three 42 │   │
 *   │  └────────┘  │  ────────────────    │   │
 *   │              │  Total: 100          │   │
 *   │              └───────────────────┘   │   │
 *   └──────────────────────────────────────┘
 *
 * The donut is rendered via conic-gradient with a cutout (::after).
 *
 * Usage (full component):
 *   <DonutChart
 *     headline="Market share"
 *     segments={[
 *       { label: "Segment A", value: 42, color: "var(--accent)" },
 *       { label: "Segment B", value: 33, color: "var(--surface-2)" },
 *     ]}
 *   />
 *
 * Usage (sub-components):
 *   <DonutChart.Root headline="Market share">
 *     <DonutChart.Donut segments={[...]} />
 *     <DonutChart.Legend segments={[...]} total={100} />
 *   </DonutChart.Root>
 * =================================================================== */

export interface DonutSegment {
  label: string;
  value: number;
  /** Any valid CSS color — use var(--accent), var(--surface-2), etc. */
  color: string;
}

export interface DonutChartProps {
  /** Optional headline above the chart. */
  headline?: string;
  /** Segments of the donut. */
  segments: DonutSegment[];
  /** Total value for percentage calculation. Auto-calculated if omitted. */
  total?: number;
  className?: string;
  style?: CSSProperties;
}

export function DonutChart({
  headline,
  segments,
  total: totalProp,
  className,
  style,
}: DonutChartProps) {
  const total = totalProp ?? segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className={`dc-scene scene-pad ${className ?? ""}`} style={style}>
      {/* Header */}
      {headline && (
        <div className="dc-header">
          <h2 className="dc-headline display">{headline}</h2>
        </div>
      )}

      {/* Body */}
      <div className="dc-body">
        <DonutChart.Donut segments={segments} total={total} />
        <DonutChart.Legend segments={segments} total={total} />
      </div>
    </div>
  );
}

/* ─── Donut sub-component ─── */

interface DonutProps {
  segments: DonutSegment[];
  total: number;
  className?: string;
  style?: CSSProperties;
}

function Donut({ segments, total, className, style }: DonutProps) {
  // Build conic-gradient string from segments
  let cumulativePercent = 0;
  const gradientParts = segments.map((seg) => {
    const pct = total > 0 ? (seg.value / total) * 100 : 0;
    const start = cumulativePercent;
    const end = cumulativePercent + pct;
    cumulativePercent = end;
    return `${seg.color} ${start}% ${end}%`;
  });

  // Fallback to a single accent color if all values are 0
  const gradient =
    segments.length > 0 && total > 0
      ? `conic-gradient(${gradientParts.join(", ")})`
      : `conic-gradient(var(--accent) 0% 100%)`;

  return (
    <div className="dc-donut-wrap">
      <div
        className={`dc-donut ${className ?? ""}`}
        style={{ background: gradient, ...style }}
      />
    </div>
  );
}

/* ─── Legend sub-component ─── */

interface LegendProps {
  segments: DonutSegment[];
  total: number;
  className?: string;
  style?: CSSProperties;
}

function Legend({ segments, total, className, style }: LegendProps) {
  return (
    <div className={`dc-legend ${className ?? ""}`} style={style}>
      {segments.map((seg, i) => {
        const pct = total > 0 ? ((seg.value / total) * 100).toFixed(1) : "0.0";
        return (
          <div key={i} className="dc-item">
            <div className="dc-swatch" style={{ background: seg.color }} />
            <span className="dc-item-label">{seg.label}</span>
            <span className="dc-item-value">{pct}%</span>
          </div>
        );
      })}
      <div className="dc-total">Total: {total}</div>
    </div>
  );
}

/* ─── Root sub-component ─── */

function Root({
  headline,
  children,
  className,
  style,
}: {
  headline?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`dc-scene scene-pad ${className ?? ""}`} style={style}>
      {headline && (
        <div className="dc-header">
          <h2 className="dc-headline display">{headline}</h2>
        </div>
      )}
      <div className="dc-body">{children}</div>
    </div>
  );
}

DonutChart.Donut = Donut;
DonutChart.Legend = Legend;
DonutChart.Root = Root;
