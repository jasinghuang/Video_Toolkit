import type { CSSProperties, ReactNode } from "react";
import type { StepState } from "../StepReveal";
import "./layouts.css";

/* ===================================================================
 * Timeline — vertical timeline with date column, spine, and content.
 *
 * Layout (3-column grid inside .scene-pad):
 *   ┌──────────────────────────────────────┐
 *   │  Headline (optional)                 │
 *   │                                      │
 *   │  2024  │  ●──  Milestone One         │
 *   │        │  │    Description text.     │
 *   │        │  │                          │
 *   │  2025  │  ●──  Milestone Two         │
 *   │        │  │    Description text.     │
 *   │        │  │                          │
 *   │  2026  │  ●    Milestone Three       │
 *   │        │       Description text.     │
 *   └──────────────────────────────────────┘
 *
 * Usage:
 *   <Timeline
 *     headline="From start to present"
 *     events={[
 *       { date: "2024", title: "Milestone One", body: "..." },
 *       { date: "2025", title: "Milestone Two", body: "..." },
 *     ]}
 *     activeIndex={step - 1}
 *     revealed={[...]}
 *   />
 * =================================================================== */

export interface TimelineEvent {
  date: string;
  title: string;
  body?: string;
}

export interface TimelineProps {
  /** Optional headline above the timeline. */
  headline?: string;
  /** Kicker / tagline. */
  kicker?: string;
  /** Events in chronological order. */
  events: TimelineEvent[];
  /** Step state: which event is currently active. */
  activeIndex?: number;
  /** Step state: which events have been revealed. */
  revealed?: number[];
  className?: string;
  style?: CSSProperties;
}

export function Timeline({
  headline,
  kicker,
  events,
  activeIndex,
  revealed,
  className,
  style,
}: TimelineProps) {
  const hasStepState = activeIndex !== undefined;
  const revealedSet = revealed ? new Set(revealed) : null;

  return (
    <div className={`tl-scene scene-pad ${className ?? ""}`} style={style}>
      {/* Header */}
      {(kicker || headline) && (
        <div className="tl-header">
          {kicker && <div className="label">{kicker}</div>}
          {headline && <h2 className="tl-headline display">{headline}</h2>}
        </div>
      )}

      {/* Timeline body */}
      <div className="tl-body">
        {events.map((ev, i) => {
          let state: StepState | undefined;
          if (hasStepState && revealedSet) {
            if (i === activeIndex) state = "active";
            else if (revealedSet.has(i)) state = "past";
            else state = "ghost";
          }

          return <TimelineEventRow key={i} event={ev} state={state} />;
        })}
      </div>
    </div>
  );
}

/* ─── Internal: single event row ─── */

function TimelineEventRow({
  event,
  state,
}: {
  event: TimelineEvent;
  state?: StepState;
}) {
  const stateClass =
    state === "ghost"
      ? "step-ghost"
      : state === "active"
        ? "step-active"
        : state === "past"
          ? "step-past"
          : "";

  return (
    <>
      {/* Date column */}
      <div className={`tl-event-date ${stateClass}`}>{event.date}</div>

      {/* Spine column */}
      <div className="tl-spine">
        <div className="tl-spine-dot" />
      </div>

      {/* Content column */}
      <div className={`tl-event tl-event-content ${stateClass}`}>
        <div className="tl-event-title">{event.title}</div>
        {event.body && <div className="tl-event-body">{event.body}</div>}
      </div>
    </>
  );
}

/* ─── Sub-components ─── */

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
    <div className={`tl-scene scene-pad ${className ?? ""}`} style={style}>
      {(kicker || headline) && (
        <div className="tl-header">
          {kicker && <div className="label">{kicker}</div>}
          {headline && <h2 className="tl-headline display">{headline}</h2>}
        </div>
      )}
      <div className="tl-body">{children}</div>
    </div>
  );
}

Timeline.Root = Root;
