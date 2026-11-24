import type { CSSProperties, ReactNode } from "react";
import { Slide, type SlideMeta } from "./deck/Slide";

export { DeckStage } from "./deck/DeckStage";

interface ContentSlideProps extends SlideMeta {
  title: string;
  children: ReactNode;
}

export function ContentSlide({ title, children, ...meta }: ContentSlideProps) {
  return (
    <Slide {...meta} className="pulse-slide">
      <h2>{title}</h2>
      {children}
    </Slide>
  );
}

interface HeroProps extends SlideMeta {
  title: ReactNode;
  eyebrow: string;
  lead: ReactNode;
  footer?: ReactNode;
  art?: string;
  children?: ReactNode;
}

function Hero({
  kind, title, eyebrow, lead, footer, art, children, ...meta
}: HeroProps & { kind: "cover" | "closing" }) {
  const cover = kind === "cover";
  const Heading = cover ? "h1" : "h2";
  const style = art ? { "--pulse-art": `url("${art}")` } as CSSProperties : undefined;

  return (
    <Slide {...meta} tone="dark" className={`pulse-slide pulse-${kind}${art ? " pulse-with-art" : ""}`} style={style}>
      {cover && <div className="pulse-brand">PULSE</div>}
      <div className="pulse-hero">
        <p className="pulse-eyebrow">{eyebrow}</p>
        <Heading>{title}</Heading>
        <p className="pulse-lead">{lead}</p>
        {children}
      </div>
      {footer && <div className="pulse-meta">{footer}</div>}
    </Slide>
  );
}

export function CoverSlide(props: HeroProps) {
  return <Hero {...props} kind="cover" />;
}

export function ClosingSlide(props: HeroProps) {
  return <Hero {...props} kind="closing" />;
}

export function Panel({ title, accent, children }: {
  title: string;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <article className={accent ? "pulse-panel pulse-panel--accent" : "pulse-panel"}>
      <h3>{title}</h3>
      {children}
    </article>
  );
}
