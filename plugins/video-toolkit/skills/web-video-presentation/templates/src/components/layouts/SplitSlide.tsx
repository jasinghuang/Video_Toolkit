import type { CSSProperties, ReactNode } from "react";
import "./layouts.css";

/* ===================================================================
 * SplitSlide — left text + right image/chart/decoration.
 *
 * Layout (2-column grid inside .scene-pad):
 *   ┌─────────────────────────────────────┐
 *   │  ┌──────────┐  ┌──────────────────┐ │
 *   │  │ Headline │  │                  │ │
 *   │  │          │  │   Image / Chart  │ │
 *   │  │ Body     │  │   or children    │ │
 *   │  │ Bullets  │  │                  │ │
 *   │  └──────────┘  └──────────────────┘ │
 *   └─────────────────────────────────────┘
 *
 * Usage:
 *   <SplitSlide
 *     headline="The approach"
 *     body="Describe the core idea here."
 *     bullets={["Point one", "Point two"]}
 *   >
 *     <img src="/img.png" alt="diagram" />
 *   </SplitSlide>
 * =================================================================== */

export interface SplitSlideProps {
  /** Kicker / tagline above headline. */
  kicker?: string;
  /** Headline (left side). */
  headline?: string;
  /** Body text below headline. */
  body?: string;
  /** Bullet points below body. */
  bullets?: string[];
  /** Flip layout: image on left, text on right. */
  flip?: boolean;
  /** Show image placeholder if no children provided. */
  placeholder?: string;
  /** Image caption. */
  caption?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function SplitSlide({
  kicker,
  headline,
  body,
  bullets,
  flip = false,
  placeholder,
  caption,
  className,
  style,
  children,
}: SplitSlideProps) {
  return (
    <div className={`sp-scene scene-pad ${className ?? ""}`} style={style}>
      <div className={`sp-body ${flip ? "sp-body-flip" : ""}`}>
        {/* Text side */}
        <div className="sp-text">
          {kicker && <div className="label">{kicker}</div>}
          {headline && <h2 className="sp-headline display">{headline}</h2>}
          {body && <p className="body">{body}</p>}
          {bullets && bullets.length > 0 && (
            <ul className="sp-bullets">
              {bullets.map((b, i) => (
                <li key={i} className="body">{b}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Asset side */}
        <div className="sp-image">
          {children ?? (
            <SplitSlide.Placeholder label={placeholder ?? "Image"} />
          )}
          {caption && <div className="sp-image-caption">{caption}</div>}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function Placeholder({ label = "Image" }: { label?: string }) {
  return (
    <div className="sp-image-placeholder" aria-hidden="true">
      {label}
    </div>
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
    <div className={`sp-scene scene-pad ${className ?? ""}`} style={style}>
      <div className="sp-body">{children}</div>
    </div>
  );
}

SplitSlide.Placeholder = Placeholder;
SplitSlide.Root = Root;
