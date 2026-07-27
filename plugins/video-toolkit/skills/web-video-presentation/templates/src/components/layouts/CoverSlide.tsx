import type { CSSProperties, ReactNode } from "react";
import "./layouts.css";

/* ===================================================================
 * CoverSlide — hero headline + decorative graphic zone + bottom meta.
 *
 * Layout (vertical flex inside .scene-pad):
 *   ┌──────────────────────────────────────┐
 *   │  [decor slot — absolute, top-right]   │
 *   │                                      │
 *   │  MEGA HEADLINE                       │
 *   │  (display / display-cn)              │
 *   │                                      │
 *   │  subtitle / kicker                   │
 *   │                                      │
 *   │  [bottom meta: author · date · tag]  │
 *   └──────────────────────────────────────┘
 *
 * Usage (full component):
 *   <CoverSlide
 *     headline="CREATIVE MODE"
 *     headlineCn="创意模式"
 *     subtitle="A presentation template — eight pages"
 *     meta="A PRESENTATION TEMPLATE · 01 / 08"
 *     decor={<GeometricSwitch />}
 *   />
 *
 * Usage (sub-components for custom layouts):
 *   <CoverSlide.Root>
 *     <CoverSlide.Headline>...</CoverSlide.Headline>
 *     <CoverSlide.Subtitle>...</CoverSlide.Subtitle>
 *   </CoverSlide.Root>
 * =================================================================== */

export interface CoverSlideProps {
  /** Primary headline (Latin). Rendered with .display class. */
  headline?: string;
  /** Primary headline (Chinese). Rendered with .display-cn class. */
  headlineCn?: string;
  /** Kicker / tagline above headline. */
  kicker?: string;
  /** Subtitle / description below headline. */
  subtitle?: string;
  /** Bottom meta bar — author, date, version, page number. */
  meta?: string;
  /** Decorative element slot (absolute positioned, default: top-right). */
  decor?: ReactNode;
  decorAnchor?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function CoverSlide({
  headline,
  headlineCn,
  kicker,
  subtitle,
  meta,
  decor,
  decorAnchor = "top-right",
  className,
  style,
  children,
}: CoverSlideProps) {
  return (
    <div className={`cv-scene scene-pad ${className ?? ""}`} style={style}>
      {/* Kicker */}
      {kicker && <CoverSlide.Kicker>{kicker}</CoverSlide.Kicker>}

      {/* Headline zone */}
      <div className="cv-body">
        {(headline || headlineCn) && (
          <h1 className="cv-headline">
            {headlineCn && <span className="display-cn">{headlineCn}</span>}
            {headline && headlineCn && <br />}
            {headline && <span className="display">{headline}</span>}
          </h1>
        )}

        {/* Subtitle */}
        {subtitle && <CoverSlide.Subtitle>{subtitle}</CoverSlide.Subtitle>}

        {/* Custom children (for complex headline structures) */}
        {children}
      </div>

      {/* Bottom meta */}
      {meta && <CoverSlide.Meta>{meta}</CoverSlide.Meta>}

      {/* Decorative graphic */}
      {decor && (
        <div className={`cv-decor cv-decor-${decorAnchor}`} aria-hidden="true">
          {decor}
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function Kicker({ children }: { children: ReactNode }) {
  return <div className="cv-kicker label">{children}</div>;
}

function Headline({ children }: { children: ReactNode }) {
  return <h1 className="cv-headline">{children}</h1>;
}

function Subtitle({ children }: { children: ReactNode }) {
  return <p className="cv-subtitle body">{children}</p>;
}

function Meta({ children }: { children: ReactNode }) {
  return <div className="cv-meta meta">{children}</div>;
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
    <div className={`cv-scene scene-pad ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}

CoverSlide.Kicker = Kicker;
CoverSlide.Headline = Headline;
CoverSlide.Subtitle = Subtitle;
CoverSlide.Meta = Meta;
CoverSlide.Root = Root;
