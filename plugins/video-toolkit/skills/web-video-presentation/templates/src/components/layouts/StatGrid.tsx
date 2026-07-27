import type { CSSProperties, ReactNode } from "react";
import type { StepState } from "../StepReveal";
import "./layouts.css";

/* ===================================================================
 * StatGrid — 2×2 / 3-column / 4-column stat card grid.
 *
 * Layout:
 *   ┌──────────────────────────────────────┐
 *   │  Headline (optional)                 │
 *   │                                      │
 *   │  ┌──────┐ ┌──────┐ ┌──────┐         │
 *   │  │ 42%  │ │ 2.7× │ │ 118  │         │
 *   │  │ Lift │ │ Thru │ │Users │         │
 *   │  └──────┘ └──────┘ └──────┘         │
 *   │                                      │
 *   │  [source note]                       │
 *   └──────────────────────────────────────┘
 *
 * Usage (full component):
 *   <StatGrid
 *     headline="Four figures, one story"
 *     items={[
 *       { value: "42%", label: "Lift in engagement", note: "Q1 2026" },
 *       { value: "2.7×", label: "Throughput multiplier" },
 *     ]}
 *     activeIndex={step - 1}
 *     revealed={[...]}
 *   />
 *
 * Usage (sub-components):
 *   <StatGrid.Root>
 *     <StatGrid.Card state="active" value="42%" label="Lift" corner="/01" />
 *     <StatGrid.Card state="ghost" value="118" label="Users" />
 *   </StatGrid.Root>
 * =================================================================== */

export interface StatItem {
  value: string;
  label: string;
  note?: string;
}

export interface StatGridProps {
  /** Optional headline above the grid. */
  headline?: string;
  /** Kicker / tagline above headline. */
  kicker?: string;
  /** Stat items. */
  items: StatItem[];
  /** Number of columns. Default: auto (2 for 2 items, 3 for 3, etc.). */
  cols?: 2 | 3 | 4;
  /** Cell background variants per item. Default: all "surface". */
  cellVariants?: ("surface" | "surface-2" | "accent")[];
  /** Corner labels per item (e.g., "/01", "/02"). */
  corners?: string[];
  /** Step state: which item is currently active. */
  activeIndex?: number;
  /** Step state: which items have been revealed so far. */
  revealed?: number[];
  /** Source / footnote below the grid. */
  source?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function StatGrid({
  headline,
  kicker,
  items,
  cols = items.length >= 4 ? 4 : items.length >= 3 ? 3 : 2,
  cellVariants,
  corners,
  activeIndex,
  revealed,
  source,
  className,
  style,
  children,
}: StatGridProps) {
  const hasStepState = activeIndex !== undefined;
  const revealedSet = revealed ? new Set(revealed) : null;

  return (
    <div className={`sg-scene scene-pad ${className ?? ""}`} style={style}>
      {/* Header */}
      {(kicker || headline) && (
        <div className="sg-header">
          {kicker && <div className="label">{kicker}</div>}
          {headline && <h2 className="sg-headline display">{headline}</h2>}
        </div>
      )}

      {/* Grid */}
      <div className={`sg-grid sg-grid-cols-${cols}`}>
        {items.map((item, i) => {
          let state: StepState | undefined;
          if (hasStepState && revealedSet) {
            if (i === activeIndex) state = "active";
            else if (revealedSet.has(i)) state = "past";
            else state = "ghost";
          }

          return (
            <StatGrid.Card
              key={i}
              value={item.value}
              label={item.label}
              note={item.note}
              variant={cellVariants?.[i]}
              corner={corners?.[i]}
              state={state}
            />
          );
        })}

        {/* Custom children (for mixed content cells) */}
        {children}
      </div>

      {/* Source */}
      {source && <div className="sg-source meta" style={{ marginTop: "var(--space-md)" }}>{source}</div>}
    </div>
  );
}

/* ─── Card sub-component ─── */

interface CardProps {
  value: string;
  label: string;
  note?: string;
  variant?: "surface" | "surface-2" | "accent";
  corner?: string;
  state?: StepState;
  className?: string;
  style?: CSSProperties;
}

function Card({ value, label, note, variant = "surface", corner, state, className, style }: CardProps) {
  const stateClass =
    state === "ghost" ? "step-ghost" : state === "active" ? "step-active" : state === "past" ? "step-past" : "";

  return (
    <div
      className={`sg-card sg-card-${variant} ${stateClass} ${className ?? ""}`}
      style={style}
    >
      {corner && <StatGrid.Corner>{corner}</StatGrid.Corner>}
      <div className="sg-card-value">{value}</div>
      <div>
        <div className="sg-card-label">{label}</div>
        {note && <div className="sg-card-note">{note}</div>}
      </div>
    </div>
  );
}

function Corner({ children }: { children: ReactNode }) {
  return <span className="sg-card-corner mono label">{children}</span>;
}

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
    <div className={`sg-scene scene-pad ${className ?? ""}`} style={style}>
      {(kicker || headline) && (
        <div className="sg-header">
          {kicker && <div className="label">{kicker}</div>}
          {headline && <h2 className="sg-headline display">{headline}</h2>}
        </div>
      )}
      {children}
    </div>
  );
}

StatGrid.Card = Card;
StatGrid.Corner = Corner;
StatGrid.Root = Root;
