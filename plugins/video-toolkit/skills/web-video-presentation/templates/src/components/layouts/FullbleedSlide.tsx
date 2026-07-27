import type { CSSProperties, ReactNode } from "react";
import "./layouts.css";

/* ===================================================================
 * FullbleedSlide — full-size image with bottom gradient overlay text.
 *
 * Layout (absolute):
 *   ┌─────────────────────────────────────────┐
 *   │  [full-size image fills entire slide]   │
 *   │                                         │
 *   │  ┌─ gradient overlay (bottom half) ──┐  │
 *   │  │   headline (display, white)        │  │
 *   │  │   caption (mono, white/60%)        │  │
 *   │  └────────────────────────────────────┘  │
 *   └─────────────────────────────────────────┘
 *
 * Has a placeholder mode when no imageUrl provided.
 *
 * Usage (full component):
 *   <FullbleedSlide
 *     imageUrl="https://example.com/photo.jpg"
 *     headline="The mountain"
 *     caption="Peak elevation 4,200m"
 *   />
 *
 * Usage (sub-components for custom overlay content):
 *   <FullbleedSlide.Root>
 *     <img className="fb-image" src="photo.jpg" alt="" />
 *     <FullbleedSlide.Overlay>
 *       <div className="fb-headline display">Custom headline</div>
 *     </FullbleedSlide.Overlay>
 *   </FullbleedSlide.Root>
 * =================================================================== */

export interface FullbleedSlideProps {
  /** Background image URL. If omitted, renders a placeholder. */
  imageUrl?: string;
  /** Headline text (rendered white on the gradient overlay). */
  headline?: string;
  /** Caption text (rendered mono + white/60% on the gradient overlay). */
  caption?: string;
  className?: string;
  style?: CSSProperties;
  /** Custom children (e.g., a custom image element or additional overlays). */
  children?: ReactNode;
}

export function FullbleedSlide({
  imageUrl,
  headline,
  caption,
  className,
  style,
  children,
}: FullbleedSlideProps) {
  return (
    <div className={`fb-scene ${className ?? ""}`} style={style}>
      {/* Image or placeholder */}
      {imageUrl ? (
        <img className="fb-image" src={imageUrl} alt="" />
      ) : (
        <div className="fb-placeholder">Image placeholder</div>
      )}

      {/* Text overlay */}
      {(headline || caption) && (
        <FullbleedSlide.Overlay>
          {headline && <div className="fb-headline display">{headline}</div>}
          {caption && <div className="fb-caption">{caption}</div>}
        </FullbleedSlide.Overlay>
      )}

      {/* Custom children */}
      {children}
    </div>
  );
}

/* ─── Sub-components ─── */

function Overlay({ children }: { children: ReactNode }) {
  return <div className="fb-overlay">{children}</div>;
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
    <div className={`fb-scene ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}

FullbleedSlide.Overlay = Overlay;
FullbleedSlide.Root = Root;
