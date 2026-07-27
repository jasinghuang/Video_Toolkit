import type { CSSProperties, ReactNode } from "react";
import "./layouts.css";

/* ===================================================================
 * ChapterOpener — chapter number + decorative rule + title + description.
 *
 * Layout (flex column):
 *   ┌──────────────────────────────────────┐
 *   │  CHAPTER 1          (mono, accent)   │
 *   │  ─────────────────── (36px gold rule)│
 *   │  SECTION TITLE      (h1 / display)   │
 *   │                                      │
 *   │  description text   (body, 50% wide) │
 *   └──────────────────────────────────────┘
 *
 * Usage (full component):
 *   <ChapterOpener
 *     num="CHAPTER 1"
 *     title="The Big Idea"
 *     description="A brief overview of the concept."
 *   />
 *
 * Usage (sub-components):
 *   <ChapterOpener.Root>
 *     <ChapterOpener.Num>CHAPTER 1</ChapterOpener.Num>
 *     <ChapterOpener.Rule />
 *     <ChapterOpener.Title>The Big Idea</ChapterOpener.Title>
 *     <ChapterOpener.Description>...</ChapterOpener.Description>
 *   </ChapterOpener.Root>
 * =================================================================== */

export interface ChapterOpenerProps {
  /** Chapter label (e.g., "CHAPTER 1" or "01"). Rendered as mono + uppercase. */
  num: string;
  /** Section title. */
  title: string;
  /** Optional description below title. */
  description?: string;
  className?: string;
  style?: CSSProperties;
}

export function ChapterOpener({
  num,
  title,
  description,
  className,
  style,
}: ChapterOpenerProps) {
  return (
    <div className={`ch-scene scene-pad ${className ?? ""}`} style={style}>
      <ChapterOpener.Num>{num}</ChapterOpener.Num>
      <ChapterOpener.Rule />
      <ChapterOpener.Title>{title}</ChapterOpener.Title>
      {description && (
        <ChapterOpener.Description>{description}</ChapterOpener.Description>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function Num({ children }: { children: ReactNode }) {
  return <div className="ch-num">{children}</div>;
}

function Rule() {
  return <div className="ch-rule" />;
}

function Title({ children }: { children: ReactNode }) {
  return <h1 className="ch-title display">{children}</h1>;
}

function Description({ children }: { children: ReactNode }) {
  return <p className="ch-desc body">{children}</p>;
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
    <div className={`ch-scene scene-pad ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}

ChapterOpener.Num = Num;
ChapterOpener.Rule = Rule;
ChapterOpener.Title = Title;
ChapterOpener.Description = Description;
ChapterOpener.Root = Root;
