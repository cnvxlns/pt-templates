import type { CSSProperties, ReactNode } from "react";
import { Slide, type SlideMeta, type SlideTone } from "./deck/Slide";
import { AccentBar, Eyebrow, H1, H2, Logo } from "./primitives";
import { IndexList, type IndexItem } from "./content";

/*
 * 템플릿의 11개 슬라이드 유형을 그대로 옮긴 레이아웃.
 *   01 CoverSlide      02 AgendaSlide     03 SectionSlide
 *   04·07·08·09 ContentSlide (헤더 + 자유 본문)
 *   05 SplitSlide      06 FullBleedSlide  10 StatementSlide
 *   11 ClosingSlide
 */

/* ── 공통 헤더 ─────────────────────────────────── */

/** 본문 슬라이드 상단: (eyebrow) + 제목 · 오른쪽 작은 로고 · 아래 구분선 */
export function SlideHeader({ title, eyebrow, logo = true, aside }: { title: ReactNode; eyebrow?: ReactNode; logo?: boolean; aside?: ReactNode }) {
  return (
    <header className="vl-header">
      <div className="vl-header__titles">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <H2>{title}</H2>
      </div>
      {aside ?? (logo && <Logo width={150} style={{ marginBottom: 12 }} />)}
    </header>
  );
}

/* ── 01 표지 ─────────────────────────────────── */

export interface CoverSlideProps extends SlideMeta {
  title: ReactNode;
  subtitle?: ReactNode;
  /** 왼쪽 아래: 발표자 · 소속 */
  presenter?: ReactNode;
  /** 오른쪽 아래: 날짜 / 행사 */
  date?: ReactNode;
  event?: ReactNode;
}

export function CoverSlide({ title, subtitle, presenter, date, event = "Lab Meeting", ...meta }: CoverSlideProps) {
  return (
    <Slide {...meta} style={{ justifyContent: "space-between" }}>
      <Logo width={300} />
      <div className="vl-stack" style={{ gap: 32 }}>
        <AccentBar />
        <H1 style={{ maxWidth: 1400 }}>{title}</H1>
        {subtitle && <p style={{ fontSize: 38, fontWeight: 300, color: "var(--vl-muted)" }}>{subtitle}</p>}
      </div>
      <div
        className="vl-row"
        style={{ alignItems: "flex-end", justifyContent: "space-between", borderTop: "1px solid var(--vl-line)", paddingTop: 34 }}
      >
        <p style={{ fontSize: 32, fontWeight: 500 }}>{presenter}</p>
        <p className="vl-num" style={{ fontSize: 30, color: "var(--vl-muted)" }}>
          {date}
          {date && event && <>&nbsp;&nbsp;/&nbsp;&nbsp;</>}
          {event}
        </p>
      </div>
    </Slide>
  );
}

/* ── 02 목차 ─────────────────────────────────── */

export function AgendaSlide({ title = "목차", items, ...meta }: SlideMeta & { title?: ReactNode; items: (ReactNode | IndexItem)[] }) {
  const rows: IndexItem[] = items.map((it) =>
    it && typeof it === "object" && "label" in (it as object) ? (it as IndexItem) : { label: it as ReactNode },
  );
  return (
    <Slide {...meta} style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 80 }}>
      <div className="vl-stack" style={{ gap: 28 }}>
        <AccentBar />
        <H2>{title}</H2>
      </div>
      <div className="vl-stack" style={{ justifyContent: "center" }}>
        <IndexList items={rows} />
      </div>
    </Slide>
  );
}

/* ── 03 섹션 구분 ─────────────────────────────── */

export function SectionSlide({
  number,
  title,
  description,
  tone = "dark",
  ...meta
}: SlideMeta & { number: ReactNode; title: ReactNode; description?: ReactNode; tone?: SlideTone }) {
  return (
    <Slide {...meta} tone={tone} style={{ justifyContent: "center", gap: 40 }}>
      <span className="vl-num" style={{ fontSize: 160, lineHeight: 1, fontWeight: 500, color: tone === "accent" ? "var(--vl-white)" : "var(--vl-orange)" }}>
        {number}
      </span>
      <h2 style={{ fontSize: 88, fontWeight: 600, letterSpacing: "-0.02em" }}>{title}</h2>
      {description && (
        <p style={{ fontSize: 34, fontWeight: 300, color: tone === "accent" ? "var(--vl-orange-ink)" : "var(--vl-muted)", maxWidth: 1100 }}>
          {description}
        </p>
      )}
    </Slide>
  );
}

/* ── 04·07·08·09 본문 ─────────────────────────── */

export interface ContentSlideProps extends SlideMeta {
  title: ReactNode;
  eyebrow?: ReactNode;
  tone?: SlideTone;
  logo?: boolean;
  /** 헤더 오른쪽을 로고 대신 다른 것(배지 등)으로 */
  aside?: ReactNode;
  /** 헤더와 본문 사이 간격 (기본 72) */
  gap?: number;
  bodyStyle?: CSSProperties;
  children?: ReactNode;
}

/** 가장 많이 쓰는 형태: 헤더 + 자유 본문. 본문 영역은 남은 높이를 채우는 세로 flex. */
export function ContentSlide({ title, eyebrow, tone = "light", logo = true, aside, gap, bodyStyle, children, ...meta }: ContentSlideProps) {
  return (
    <Slide {...meta} tone={tone}>
      <SlideHeader title={title} eyebrow={eyebrow} logo={logo && tone === "light"} aside={aside} />
      <div className="vl-body" style={{ marginTop: gap, ...bodyStyle }}>
        {children}
      </div>
    </Slide>
  );
}

/* ── 05 2단 (설명 + 그림) ──────────────────────── */

export function SplitSlide({
  title,
  eyebrow,
  children,
  aside,
  ratio = "1fr 1fr",
  reverse,
  ...meta
}: SlideMeta & {
  title: ReactNode;
  eyebrow?: ReactNode;
  /** 왼쪽 설명 (Lead, BulletList 등) */
  children?: ReactNode;
  /** 오른쪽 그림/도식 */
  aside: ReactNode;
  ratio?: string;
  reverse?: boolean;
}) {
  const text = (
    <div className="vl-stack" style={{ gap: 36 }}>
      <AccentBar />
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <H2>{title}</H2>
      {children}
    </div>
  );
  return (
    <Slide {...meta} style={{ display: "grid", gridTemplateColumns: ratio, gap: 90, alignItems: "center" }}>
      {reverse ? (
        <>
          <div style={{ minWidth: 0 }}>{aside}</div>
          {text}
        </>
      ) : (
        <>
          {text}
          <div style={{ minWidth: 0 }}>{aside}</div>
        </>
      )}
    </Slide>
  );
}

/* ── 06 전체 이미지 ─────────────────────────────── */

export function FullBleedSlide({
  title,
  caption,
  media,
  ...meta
}: SlideMeta & {
  title?: ReactNode;
  caption?: ReactNode;
  /** <Figure fit="cover" /> 또는 <Placeholder dark /> 등 */
  media: ReactNode;
}) {
  return (
    <Slide {...meta} tone="dark" padded={false} style={{ justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex" }}>{media}</div>
      {(title || caption) && (
        <div style={{ position: "relative", padding: "80px 110px", background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))" }}>
          {title && <H2>{title}</H2>}
          {caption && <p style={{ margin: "18px 0 0", fontSize: 32, fontWeight: 300, color: "var(--vl-dark-sub)" }}>{caption}</p>}
        </div>
      )}
    </Slide>
  );
}

/* ── 10 핵심 문장 ─────────────────────────────── */

export function StatementSlide({
  children,
  source,
  tone = "accent",
  ...meta
}: SlideMeta & { children: ReactNode; source?: ReactNode; tone?: SlideTone }) {
  return (
    <Slide {...meta} tone={tone} style={{ justifyContent: "center", padding: "100px 160px 80px" }}>
      <p style={{ fontSize: 76, lineHeight: 1.35, fontWeight: 500, letterSpacing: "-0.02em", maxWidth: 1500, textWrap: "pretty" }}>{children}</p>
      {source && (
        <p
          className="vl-num"
          style={{ margin: "56px 0 0", fontSize: 30, color: tone === "accent" ? "var(--vl-orange-ink)" : "var(--vl-muted)" }}
        >
          {source}
        </p>
      )}
    </Slide>
  );
}

/* ── 11 마무리 ─────────────────────────────────── */

export function ClosingSlide({
  title = "논의 사항",
  questions = [],
  org = "Vehicle Intelligence and Autonomy Laboratory",
  thanks = "감사합니다",
  ...meta
}: SlideMeta & { title?: ReactNode; questions?: ReactNode[]; org?: ReactNode; thanks?: ReactNode }) {
  return (
    <Slide {...meta} tone="dark" style={{ justifyContent: "space-between" }}>
      <div className="vl-stack" style={{ gap: 40 }}>
        <AccentBar />
        <h2 style={{ fontSize: 88, fontWeight: 600, letterSpacing: "-0.02em" }}>{title}</h2>
      </div>
      <div className="vl-stack" style={{ gap: 38, maxWidth: 1500 }}>
        {questions.map((q, i) => (
          <p key={i} style={{ fontSize: 42, fontWeight: 300, color: "var(--vl-dark-text)", lineHeight: 1.4 }}>
            {q}
          </p>
        ))}
      </div>
      <div
        className="vl-row"
        style={{ alignItems: "flex-end", justifyContent: "space-between", borderTop: "1px solid var(--vl-dark-line)", paddingTop: 34 }}
      >
        <p className="vl-num" style={{ fontSize: 28, color: "var(--vl-muted)" }}>
          {org}
        </p>
        <p style={{ fontSize: 28, color: "var(--vl-muted)" }}>{thanks}</p>
      </div>
    </Slide>
  );
}
