import type { CSSProperties, ReactNode } from "react";
import "./layouts.css";

/* ===================================================================
 * ComparePanels — side-by-side A/B comparison with dividing border.
 *
 * Layout (2-column grid inside .scene-pad):
 *   ┌────────────────────────────┬─────────────────────────────┐
 *   │  BEFORE                    │  AFTER                      │
 *   │  ───────────────────────── │  ────────────────────────── │
 *   │  Headline                  │  Headline                   │
 *   │  Body text...              │  Body text...               │
 *   │  — Bullet one              │  — Bullet one               │
 *   │  — Bullet two              │  — Bullet two               │
 *   └────────────────────────────┴─────────────────────────────┘
 *
 * Usage (full component):
 *   <ComparePanels
 *     left={{ label: "Before", headline: "Old way", bullets: ["Slow", "Expensive"] }}
 *     right={{ label: "After", headline: "New way", bullets: ["Fast", "Cheap"] }}
 *   />
 *
 * Usage (sub-components):
 *   <ComparePanels.Root>
 *     <ComparePanels.Panel side="left" label="Before" headline="Old">
 *       ...
 *     </ComparePanels.Panel>
 *     <ComparePanels.Panel side="right" label="After" headline="New">
 *       ...
 *     </ComparePanels.Panel>
 *   </ComparePanels.Root>
 * =================================================================== */

export interface ComparePanelData {
  /** Panel label (shown in mono, uppercase). */
  label: string;
  /** Panel headline. */
  headline: string;
  /** Optional body paragraph. */
  body?: string;
  /** Optional bullet list items. */
  bullets?: string[];
}

export interface ComparePanelsProps {
  /** Left (A) panel data. */
  left: ComparePanelData;
  /** Right (B) panel data. */
  right: ComparePanelData;
  className?: string;
  style?: CSSProperties;
}

export function ComparePanels({
  left,
  right,
  className,
  style,
}: ComparePanelsProps) {
  return (
    <div className={`cp-scene scene-pad ${className ?? ""}`} style={style}>
      <div className="cp-body">
        <ComparePanels.Panel side="left" label={left.label} headline={left.headline} body={left.body} bullets={left.bullets} />
        <ComparePanels.Panel side="right" label={right.label} headline={right.headline} body={right.body} bullets={right.bullets} />
      </div>
    </div>
  );
}

/* ─── Panel sub-component ─── */

interface PanelProps {
  /** Which side of the comparison — affects border styling. */
  side: "left" | "right";
  label: string;
  headline: string;
  body?: string;
  bullets?: string[];
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function Panel({ side, label, headline, body, bullets, className, style, children }: PanelProps) {
  const sideClass = side === "left" ? "cp-panel-left" : "cp-panel-right";

  return (
    <div className={`cp-panel ${sideClass} ${className ?? ""}`} style={style}>
      <div className="cp-panel-label">
        <span className="cp-panel-label-accent">{label}</span>
      </div>
      <h2 className="cp-panel-headline display">{headline}</h2>
      {body && <p className="cp-panel-body">{body}</p>}
      {bullets && bullets.length > 0 && (
        <ul className="cp-bullets">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
}

/* ─── Root sub-component ─── */

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
    <div className={`cp-scene scene-pad ${className ?? ""}`} style={style}>
      <div className="cp-body">{children}</div>
    </div>
  );
}

ComparePanels.Panel = Panel;
ComparePanels.Root = Root;
