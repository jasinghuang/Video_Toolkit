import type { CSSProperties, ReactNode } from "react";

/**
 * Standard 7-level staggered delay system.
 * Mirrors the CSS classes in animations.css (delay-0 through delay-6).
 */
export const STAGGER = [0, 80, 180, 300, 440, 600, 780] as const;

export type AnimType =
  | "fade-up"
  | "fade-in"
  | "reveal-right"
  | "reveal-left"
  | "scale-in"
  | "pop-in";

interface Props {
  /** Animation type. Default: "fade-up". */
  type?: AnimType;
  /** Staggered delay level (0-6). Maps to STAGGER[delay] ms. Default: 0. */
  delay?: number;
  /** Duration override in ms. Falls back to animation defaults if omitted. */
  duration?: number;
  /** Whether the animation should play. Default: true. */
  show?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Unified entrance animation wrapper. Maps animation types to the CSS
 * primitives in animations.css.
 *
 * Usage:
 * ```tsx
 * <AnimateIn type="reveal-right" delay={2}>
 *   <h1 className="display">hero headline</h1>
 * </AnimateIn>
 * ```
 *
 * For "reveal-right" / "reveal-left": uses clip-path wipe (like MaskReveal).
 * For "fade-up" / "fade-in" / "scale-in" / "pop-in": uses CSS animation
 * classes with animation-fill-mode: both.
 */
export function AnimateIn({
  type = "fade-up",
  delay = 0,
  duration,
  show = true,
  className,
  style,
  children,
}: Props) {
  if (!show) return <>{children}</>;

  const delayMs = STAGGER[Math.min(delay, 6)];

  // Reveal types use clip-path transitions (like MaskReveal)
  if (type === "reveal-right") {
    const cls = ["mask-reveal", show ? "in" : "", className]
      .filter(Boolean)
      .join(" ");
    const s: CSSProperties = {
      display: "inline-block",
      transitionDelay: `${delayMs}ms`,
      ...(duration ? { transitionDuration: `${duration}ms` } : {}),
      ...style,
    };
    return (
      <span className={cls} style={s}>
        {children}
      </span>
    );
  }

  if (type === "reveal-left") {
    const cls = ["mask-reveal-left", show ? "in" : "", className]
      .filter(Boolean)
      .join(" ");
    const s: CSSProperties = {
      display: "inline-block",
      transitionDelay: `${delayMs}ms`,
      ...(duration ? { transitionDuration: `${duration}ms` } : {}),
      ...style,
    };
    return (
      <span className={cls} style={s}>
        {children}
      </span>
    );
  }

  // Keyframe-based types
  const animClass =
    type === "fade-up"
      ? "anim-fade-up"
      : type === "fade-in"
        ? "anim-fade-in"
        : type === "scale-in"
          ? "anim-scale-in"
          : "anim-pop-in";

  const cls = [animClass, `delay-${Math.min(delay, 6)}`, className]
    .filter(Boolean)
    .join(" ");

  const s: CSSProperties = {
    ...(duration ? { animationDuration: `${duration}ms` } : {}),
    ...style,
  };

  return (
    <span className={cls} style={s}>
      {children}
    </span>
  );
}
