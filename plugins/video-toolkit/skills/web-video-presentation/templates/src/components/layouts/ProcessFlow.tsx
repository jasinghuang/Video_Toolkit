import type { CSSProperties, ReactNode } from "react";
import type { StepState } from "../StepReveal";
import "./layouts.css";

/* ===================================================================
 * ProcessFlow — horizontal N-step process with CSS arrow connectors.
 *
 * Layout (flex row inside .scene-pad):
 *   ┌───────────────────────────────────────────────┐
 *   │  Headline (optional)                           │
 *   │                                                │
 *   │  ┌──────┐  ▶  ┌──────┐  ▶  ┌──────┐  ▶       │
 *   │  │  01  │     │  02  │     │  03  │           │
 *   │  │ Step │     │ Step │     │ Step │           │
 *   │  │ Title│     │ Title│     │ Title│           │
 *   │  └──────┘     └──────┘     └──────┘           │
 *   └───────────────────────────────────────────────┘
 *
 * Arrows use CSS triangles (border trick).
 *
 * Usage (full component):
 *   <ProcessFlow
 *     headline="How it works"
 *     steps={[
 *       { title: "Discover", desc: "Find your audience" },
 *       { title: "Engage", desc: "Build relationships" },
 *     ]}
 *     activeIndex={step - 1}
 *     revealed={[...]}
 *   />
 *
 * Usage (sub-components):
 *   <ProcessFlow.Root headline="How it works">
 *     <ProcessFlow.Step num="1" title="Discover" desc="Find" />
 *     <ProcessFlow.Arrow />
 *     <ProcessFlow.Step num="2" title="Engage" desc="Build" />
 *   </ProcessFlow.Root>
 * =================================================================== */

export interface ProcessStep {
  /** Step number. Auto-incremented from 1 if omitted. */
  num?: string;
  /** Step title. */
  title: string;
  /** Optional description. */
  desc?: string;
}

export interface ProcessFlowProps {
  /** Optional headline above the flow. */
  headline?: string;
  /** Kicker / tagline above headline. */
  kicker?: string;
  /** Steps in order. */
  steps: ProcessStep[];
  /** Step state: which step is currently active. */
  activeIndex?: number;
  /** Step state: which steps have been revealed so far. */
  revealed?: number[];
  className?: string;
  style?: CSSProperties;
}

export function ProcessFlow({
  headline,
  kicker,
  steps,
  activeIndex,
  revealed,
  className,
  style,
}: ProcessFlowProps) {
  const hasStepState = activeIndex !== undefined;
  const revealedSet = revealed ? new Set(revealed) : null;

  return (
    <div className={`pf-scene scene-pad ${className ?? ""}`} style={style}>
      {/* Header */}
      {(kicker || headline) && (
        <div className="pf-header">
          {kicker && <div className="label">{kicker}</div>}
          {headline && <h2 className="pf-headline display">{headline}</h2>}
        </div>
      )}

      {/* Steps + arrows */}
      <div className="pf-body">
        {steps.map((step, i) => {
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
            <React.Fragment key={i}>
              {/* Step */}
              <ProcessFlow.Step
                num={step.num ?? String(i + 1)}
                title={step.title}
                desc={step.desc}
                state={state}
              />

              {/* Arrow (not after the last step) */}
              {i < steps.length - 1 && <ProcessFlow.Arrow state={state} />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step sub-component ─── */

interface StepProps {
  num: string;
  title: string;
  desc?: string;
  state?: StepState;
  className?: string;
  style?: CSSProperties;
}

function Step({ num, title, desc, state, className, style }: StepProps) {
  const stateClass =
    state === "ghost"
      ? "step-ghost"
      : state === "active"
        ? "step-active"
        : state === "past"
          ? "step-past"
          : "";

  return (
    <div className={`pf-step ${stateClass} ${className ?? ""}`} style={style}>
      <div className="pf-step-num">{num}</div>
      <div className="pf-step-title">{title}</div>
      {desc && <div className="pf-step-desc">{desc}</div>}
    </div>
  );
}

/* ─── Arrow sub-component ─── */

interface ArrowProps {
  state?: StepState;
  className?: string;
  style?: CSSProperties;
}

function Arrow({ state, className, style }: ArrowProps) {
  const stateClass =
    state === "ghost"
      ? "step-ghost"
      : state === "past"
        ? "step-past"
        : "";

  return (
    <div className={`pf-arrow ${stateClass} ${className ?? ""}`} style={style}>
      ▶
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
    <div className={`pf-scene scene-pad ${className ?? ""}`} style={style}>
      {(kicker || headline) && (
        <div className="pf-header">
          {kicker && <div className="label">{kicker}</div>}
          {headline && <h2 className="pf-headline display">{headline}</h2>}
        </div>
      )}
      <div className="pf-body">{children}</div>
    </div>
  );
}

ProcessFlow.Step = Step;
ProcessFlow.Arrow = Arrow;
ProcessFlow.Root = Root;
