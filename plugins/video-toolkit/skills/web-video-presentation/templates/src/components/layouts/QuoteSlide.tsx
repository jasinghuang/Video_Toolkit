import type { CSSProperties, ReactNode } from "react";
import type { AnimType } from "../AnimateIn";
import "./layouts.css";

/* ===================================================================
 * QuoteSlide — large quote mark + centered text + attribution.
 *
 * Layout (centered flex column inside .scene-pad):
 *   ┌──────────────────────────────────────┐
 *   │                                      │
 *   │              "                       │
 *   │                                      │
 *   │    "A short pull quote or            │
 *   │     highlighted observation          │
 *   │     can sit here."                   │
 *   │                                      │
 *   │           — Source Name              │
 *   │             Source Role · Context    │
 *   │                                      │
 *   └──────────────────────────────────────┘
 *
 * Variants:
 *   "centered" (default) — large centered quote, BHT Signal style
 *   "left-accent"        — left border accent, WVP .quote style
 *
 * Usage:
 *   <QuoteSlide
 *     text="A short pull quote can sit here."
 *     source="Source Name"
 *     context="Role · Context"
 *     variant="centered"
 *   />
 * =================================================================== */

export interface QuoteSlideProps {
  /** Quote text. Rendered in large italic display. */
  text: string;
  /** Source / attribution name. */
  source?: string;
  /** Context line (role, organization, date). */
  context?: string;
  /** Layout variant. */
  variant?: "centered" | "left-accent";
  /** Animation for the quote mark. */
  markEnter?: AnimType;
  /** Animation for the quote text. */
  textEnter?: AnimType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function QuoteSlide({
  text,
  source,
  context,
  variant = "centered",
  className,
  style,
  children,
}: QuoteSlideProps) {
  const sceneClass = variant === "left-accent" ? "qu-scene-left" : "";

  return (
    <div className={`qu-scene scene-pad ${sceneClass} ${className ?? ""}`} style={style}>
      {/* Quote mark */}
      <div className="qu-mark" aria-hidden="true">
        &ldquo;
      </div>

      {/* Quote text */}
      <blockquote className="qu-text">{text}</blockquote>

      {/* Attribution */}
      {(source || context) && (
        <div className="qu-attr">
          {source && <span className="qu-source">{source}</span>}
          {context && <span className="qu-context">{context}</span>}
        </div>
      )}

      {/* Custom children (for complex attribution or decorative elements) */}
      {children}
    </div>
  );
}

/* ─── Sub-components ─── */

function Root({
  variant = "centered",
  children,
  className,
  style,
}: {
  variant?: "centered" | "left-accent";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const sceneClass = variant === "left-accent" ? "qu-scene-left" : "";
  return (
    <div className={`qu-scene scene-pad ${sceneClass} ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}

QuoteSlide.Root = Root;
