import type { CSSProperties, ReactNode } from "react";
import "./layouts.css";

/* ===================================================================
 * StatementSlide — kicker + gold rule + large statement text (centered).
 *
 * Layout (centered flex column):
 *   ┌──────────────────────────────────────┐
 *   │          KICKER LABEL                │
 *   │          ────────────                │
 *   │                                      │
 *   │     STATEMENT TEXT (display, 68%)    │
 *   └──────────────────────────────────────┘
 *
 * Usage (full component):
 *   <StatementSlide
 *     kicker="THE TAKEAWAY"
 *     statement="Design is the intermediary between information and
 *       understanding."
 *   />
 *
 * Usage (sub-components):
 *   <StatementSlide.Root>
 *     <StatementSlide.Kicker>THE TAKEAWAY</StatementSlide.Kicker>
 *     <StatementSlide.Rule />
 *     <StatementSlide.Statement>...</StatementSlide.Statement>
 *   </StatementSlide.Root>
 * =================================================================== */

export interface StatementSlideProps {
  /** Optional kicker / label above rule. */
  kicker?: string;
  /** Large statement text. */
  statement: string;
  className?: string;
  style?: CSSProperties;
}

export function StatementSlide({
  kicker,
  statement,
  className,
  style,
}: StatementSlideProps) {
  return (
    <div className={`st-scene scene-pad ${className ?? ""}`} style={style}>
      {kicker && <StatementSlide.Kicker>{kicker}</StatementSlide.Kicker>}
      <StatementSlide.Rule />
      <StatementSlide.Statement>{statement}</StatementSlide.Statement>
    </div>
  );
}

/* ─── Sub-components ─── */

function Kicker({ children }: { children: ReactNode }) {
  return <div className="st-kicker">{children}</div>;
}

function Rule() {
  return <div className="st-rule" />;
}

function Statement({ children }: { children: ReactNode }) {
  return <div className="st-statement display">{children}</div>;
}

function Root({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`st-scene scene-pad ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}

StatementSlide.Kicker = Kicker;
StatementSlide.Rule = Rule;
StatementSlide.Statement = Statement;
StatementSlide.Root = Root;
