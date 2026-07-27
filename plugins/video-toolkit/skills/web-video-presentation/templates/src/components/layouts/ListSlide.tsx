import type { CSSProperties, ReactNode } from "react";
import type { StepState } from "../StepReveal";
import "./layouts.css";

/* ===================================================================
 * ListSlide — two-column: left intro (kicker + headline + description),
 * right bullet list.
 *
 * Layout (2-column grid):
 *   ┌──────────────────────────────────────────────┐
 *   │  LEFT (2fr)       │  RIGHT (3fr)             │
 *   │  KICKER            │  — Point one             │
 *   │  HEADLINE          │  — Point two             │
 *   │  description       │  — Point three           │
 *   └──────────────────────────────────────────────┘
 *
 * Supports step state via activeIndex + revealed for progressive reveal
 * of bullet items.
 *
 * Usage (full component):
 *   <ListSlide
 *     kicker="FEATURES"
 *     headline="What makes it great"
 *     description="A closer look at the key capabilities."
 *     items={["Fast rendering", "Small bundle", "Type-safe API"]}
 *     activeIndex={step - 1}
 *     revealed={items.slice(0, step).map((_, i) => i)}
 *   />
 *
 * Usage (sub-components):
 *   <ListSlide.Root>
 *     <div className="ls-body">
 *       <ListSlide.Head>
 *         <div className="label">FEATURES</div>
 *         <h2 className="ls-headline display">What makes it great</h2>
 *       </ListSlide.Head>
 *       <ListSlide.BulletList items={["Fast", "Small", "Safe"]} />
 *     </div>
 *   </ListSlide.Root>
 * =================================================================== */

export interface ListSlideProps {
  /** Optional kicker / label. */
  kicker?: string;
  /** Optional headline. */
  headline?: string;
  /** Optional description below headline. */
  description?: string;
  /** Bullet point items. */
  items: string[];
  /** Step state: index of the currently active item. */
  activeIndex?: number;
  /** Step state: indices of previously revealed items. */
  revealed?: number[];
  className?: string;
  style?: CSSProperties;
}

export function ListSlide({
  kicker,
  headline,
  description,
  items,
  activeIndex,
  revealed,
  className,
  style,
}: ListSlideProps) {
  return (
    <div className={`ls-scene scene-pad ${className ?? ""}`} style={style}>
      <div className="ls-body">
        {(kicker || headline || description) && (
          <ListSlide.Head>
            {kicker && <div className="label">{kicker}</div>}
            {headline && <h2 className="ls-headline display">{headline}</h2>}
            {description && <p className="ls-desc body">{description}</p>}
          </ListSlide.Head>
        )}
        <ListSlide.BulletList items={items} activeIndex={activeIndex} revealed={revealed} />
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function Head({ children }: { children: ReactNode }) {
  return <div className="ls-head">{children}</div>;
}

interface BulletListProps {
  items: string[];
  activeIndex?: number;
  revealed?: number[];
}

function BulletList({ items, activeIndex, revealed }: BulletListProps) {
  const hasStepState = activeIndex !== undefined;
  const revealedSet = revealed ? new Set(revealed) : null;

  return (
    <ul className="ls-bullets">
      {items.map((item, i) => {
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
          <li key={i} className={stateClass}>
            {item}
          </li>
        );
      })}
    </ul>
  );
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
    <div className={`ls-scene scene-pad ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}

ListSlide.Head = Head;
ListSlide.BulletList = BulletList;
ListSlide.Root = Root;
