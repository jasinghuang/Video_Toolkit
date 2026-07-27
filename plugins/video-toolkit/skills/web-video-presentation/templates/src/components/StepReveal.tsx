import type { ReactNode } from "react";
import type { AnimType } from "./AnimateIn";

export type StepState = "ghost" | "active" | "past" | "visible";

interface Props {
  /** Current step state for this item. */
  state: StepState;
  /** Entrance animation when transitioning to "active". Default: "fade-up". */
  enter?: AnimType;
  /** Content to render. */
  children: ReactNode;
  className?: string;
}

/**
 * Wraps a layout item with step-state-driven CSS classes for progressive
 * reveal. Does NOT manage state — the parent chapter component derives
 * state from `step` and passes it down.
 *
 * CSS classes applied:
 *   "ghost"   → .step-ghost   (dimmed placeholder)
 *   "active"  → .step-active  (full visibility)
 *   "past"    → .step-past    (muted background)
 *   "visible" → no state class (default fully visible)
 *
 * The entrance animation (enter prop) fires when state transitions to
 * "active". This is a CSS-only transition — no JS animation API.
 *
 * Usage:
 * ```tsx
 * {items.map((item, i) => {
 *   const state = i < activeIdx ? "past" : i === activeIdx ? "active" : "ghost";
 *   return (
 *     <StepReveal key={i} state={state} enter="reveal-right">
 *       <StatCard value={item.value} label={item.label} />
 *     </StepReveal>
 *   );
 * })}
 * ```
 */
export function StepReveal({
  state,
  enter = "fade-up",
  children,
  className,
}: Props) {
  const stateClass =
    state === "ghost"
      ? "step-ghost"
      : state === "active"
        ? "step-active"
        : state === "past"
          ? "step-past"
          : "";

  // Map enter to an animation class for the "active" entrance moment.
  const enterClass =
    state === "active"
      ? enter === "fade-up"
        ? "anim-fade-up"
        : enter === "fade-in"
          ? "anim-fade-in"
          : enter === "scale-in"
            ? "anim-scale-in"
            : enter === "pop-in"
              ? "anim-pop-in"
              : ""
      : "";

  const cls = ["step-reveal", stateClass, enterClass, className]
    .filter(Boolean)
    .join(" ");

  return <div className={cls}>{children}</div>;
}
