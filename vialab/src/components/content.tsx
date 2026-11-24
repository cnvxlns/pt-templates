import { Fragment, type CSSProperties, type ReactNode } from "react";
import { cx } from "./tokens";

type Base = { className?: string; style?: CSSProperties };

/* ── 글머리 목록 ─────────────────────────────────── */

export interface BulletItem {
  text: ReactNode;
  /** 한 줄 아래 회색 보충 설명 */
  sub?: ReactNode;
}

/** 오렌지 사각 글머리. 템플릿 권장: 3개 이내, 한 줄씩. size="md" 는 4~5개용. */
export function BulletList({ items, size = "lg", className, style }: Base & { items: (ReactNode | BulletItem)[]; size?: "lg" | "md" }) {
  return (
    <ul className={cx("vl-bullets", size === "md" && "vl-bullets--md", className)} style={style}>
      {items.map((it, i) => {
        const item: BulletItem =
          it && typeof it === "object" && "text" in (it as object) ? (it as BulletItem) : { text: it as ReactNode };
        return (
          <li key={i} className="vl-bullet">
            <span className="vl-bullet__mark" aria-hidden />
            <div>
              <p className="vl-bullet__main">{item.text}</p>
              {item.sub && <p className="vl-bullet__sub">{item.sub}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ── 번호 행 목록 (목차·순서) ──────────────────────── */

export interface IndexItem {
  label: ReactNode;
  detail?: ReactNode;
  /** 기본은 01, 02 … */
  num?: string;
}

export function IndexList({ items, compact, className, style }: Base & { items: IndexItem[]; compact?: boolean }) {
  return (
    <div className={cx("vl-index", compact && "vl-index--compact", className)} style={style}>
      {items.map((it, i) => (
        <div key={i} className="vl-index__row">
          <span className="vl-index__num">{it.num ?? String(i + 1).padStart(2, "0")}</span>
          <span className="vl-index__label">{it.label}</span>
          {it.detail && <span className="vl-index__detail">{it.detail}</span>}
        </div>
      ))}
    </div>
  );
}

/* ── 수치 ─────────────────────────────────────── */

export interface StatProps extends Base {
  value: ReactNode;
  unit?: ReactNode;
  label: ReactNode;
  note?: ReactNode;
  accent?: boolean;
  size?: "lg" | "md" | "sm";
}

/** 큰 숫자 + 라벨 + 보충. 템플릿 권장: 한 장에 3개까지. */
export function Stat({ value, unit, label, note, accent, size = "lg", className, style }: StatProps) {
  return (
    <div className={cx("vl-stat", accent && "vl-stat--accent", size !== "lg" && `vl-stat--${size}`, className)} style={style}>
      <span className="vl-stat__value">
        {value}
        {unit && <span className="vl-stat__unit">{unit}</span>}
      </span>
      <span className="vl-stat__label">{label}</span>
      {note && <span className="vl-stat__note">{note}</span>}
    </div>
  );
}

export function StatGrid({ columns = 3, gap, className, style, children }: Base & { columns?: number; gap?: number; children: ReactNode }) {
  return (
    <div className={cx("vl-stats", className)} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap, ...style }}>
      {children}
    </div>
  );
}

/* ── 표 ─────────────────────────────────────── */

export interface Column {
  header: ReactNode;
  align?: "left" | "right" | "center";
  /** Space Grotesk 숫자 */
  num?: boolean;
  /** 고정폭 (경로·식별자) */
  mono?: boolean;
  width?: number | string;
}

/**
 * 비교 표. rows 는 셀 배열의 배열.
 * highlight 에 넣은 행 번호는 "Ours" 처럼 오렌지로 강조된다.
 */
export function DataTable({
  columns,
  rows,
  highlight = [],
  muted = [],
  compact,
  className,
  style,
}: Base & {
  columns: (Column | string)[];
  rows: ReactNode[][];
  highlight?: number[];
  muted?: number[];
  compact?: boolean;
}) {
  const cols: Column[] = columns.map((c) => (typeof c === "string" ? { header: c } : c));
  const cellClass = (c: Column) =>
    cx(c.align === "right" && "is-right", c.align === "center" && "is-center", c.num && "is-num", c.mono && "is-mono");
  return (
    <table className={cx("vl-table", compact && "vl-table--compact", className)} style={style}>
      <thead>
        <tr>
          {cols.map((c, i) => (
            <th key={i} className={cx(c.align === "right" && "is-right", c.align === "center" && "is-center")} style={{ width: c.width }}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri} className={cx(highlight.includes(ri) && "is-highlight", muted.includes(ri) && "is-muted")}>
            {r.map((cell, ci) => (
              <td key={ci} className={cellClass(cols[ci] ?? { header: "" })}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** 2열 정의 목록 (환경·사양 정리용) */
export function KeyValue({
  items,
  keyWidth = 260,
  compact,
  className,
  style,
}: Base & { items: [ReactNode, ReactNode][]; keyWidth?: number | string; compact?: boolean }) {
  return (
    <dl className={cx("vl-kv", compact && "vl-kv--compact", className)} style={{ gridTemplateColumns: `${typeof keyWidth === "number" ? `${keyWidth}px` : keyWidth} 1fr`, ...style }}>
      {items.map(([k, v], i) => (
        <div key={i} className="vl-kv__row">
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── 일정 ─────────────────────────────────────── */

export type Progress = "done" | "active" | "todo";

export interface TimelineItem {
  period: ReactNode;
  title: ReactNode;
  detail?: ReactNode;
  /** done=검정, active=오렌지, todo=회색 막대 */
  state?: Progress;
}

export function Timeline({ items, className, style }: Base & { items: TimelineItem[] }) {
  return (
    <div className={cx("vl-timeline", className)} style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, ...style }}>
      {items.map((it, i) => (
        <div key={i} className="vl-timeline__item" data-state={it.state ?? "todo"}>
          <div className="vl-timeline__bar" />
          <span className="vl-timeline__period">{it.period}</span>
          <span className="vl-timeline__title">{it.title}</span>
          {it.detail && <span className="vl-timeline__detail">{it.detail}</span>}
        </div>
      ))}
    </div>
  );
}

/* ── 단계 흐름 ─────────────────────────────────── */

export interface FlowStep {
  title: ReactNode;
  detail?: ReactNode;
  /** 오렌지 윗선 강조 */
  emphasis?: boolean;
  /** 검정 박스 */
  dark?: boolean;
  num?: string;
}

/** 01 → 02 → 03 처리 단계. direction="column" 이면 세로. */
export function FlowSteps({
  steps,
  direction = "row",
  numbered = true,
  arrow = "→",
  className,
  style,
}: Base & { steps: FlowStep[]; direction?: "row" | "column"; numbered?: boolean; arrow?: ReactNode }) {
  return (
    <div className={cx("vl-flow", direction === "column" && "vl-flow--column", className)} style={style}>
      {steps.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span className="vl-flow__arrow" aria-hidden>
              {arrow}
            </span>
          )}
          <div className="vl-flow__step" data-emphasis={s.emphasis || undefined} data-tone={s.dark ? "dark" : undefined}>
            {numbered && <span className="vl-flow__num">{s.num ?? String(i + 1).padStart(2, "0")}</span>}
            <span className="vl-flow__title">{s.title}</span>
            {s.detail && <span className="vl-flow__detail">{s.detail}</span>}
          </div>
        </Fragment>
      ))}
    </div>
  );
}

/* ── 카드 ─────────────────────────────────────── */

export type CardVariant = "plain" | "outline" | "paper" | "dark" | "accent" | "rule";

export interface CardProps extends Base {
  variant?: CardVariant;
  /** rule 변형에서 윗선을 오렌지로 */
  accent?: boolean;
  index?: ReactNode;
  eyebrow?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
}

export function Card({ variant = "outline", accent, index, eyebrow, title, className, style, children }: CardProps) {
  return (
    <div className={cx("vl-card", variant !== "plain" && `vl-card--${variant}`, accent && "is-accent", className)} style={style}>
      {index && <span className="vl-card__index">{index}</span>}
      {eyebrow && <span className="vl-eyebrow">{eyebrow}</span>}
      {title && <h3 className="vl-card__title">{title}</h3>}
      {children && <div className="vl-card__body">{children}</div>}
    </div>
  );
}

export function CardGrid({ columns = 2, gap, className, style, children }: Base & { columns?: number | string; gap?: number; children: ReactNode }) {
  return (
    <div
      className={cx("vl-cards", className)}
      style={{ gridTemplateColumns: typeof columns === "number" ? `repeat(${columns}, minmax(0, 1fr))` : columns, gap, ...style }}
    >
      {children}
    </div>
  );
}

/* ── 코드 / 터미널 ─────────────────────────────── */

/**
 * 코드·로그 블록. children 은 문자열 또는 <Dim>/<Ok>/<Err>/<Hl> 을 섞은 노드.
 * title 을 주면 상단 바(터미널 점 3개 + 제목)가 생긴다.
 */
export function CodeBlock({
  title,
  light,
  size = "md",
  className,
  style,
  children,
}: Base & { title?: ReactNode; light?: boolean; size?: "sm" | "md" | "lg"; children: ReactNode }) {
  return (
    <figure className={cx("vl-codeblock", light && "vl-codeblock--light", size !== "md" && `vl-codeblock--${size}`, className)} style={style}>
      {title && (
        <figcaption className="vl-codeblock__bar">
          <span className="vl-codeblock__dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          {title}
        </figcaption>
      )}
      <pre>{children}</pre>
    </figure>
  );
}
/** 코드블록 안 회색(주석) */
export const Dim = ({ children }: { children: ReactNode }) => <span className="c-dim">{children}</span>;
/** 코드블록 안 초록(성공) */
export const Ok = ({ children }: { children: ReactNode }) => <span className="c-ok">{children}</span>;
/** 코드블록 안 빨강(실패) */
export const Err = ({ children }: { children: ReactNode }) => <span className="c-err">{children}</span>;

/* ── 배지 ─────────────────────────────────────── */

export type BadgeStatus = "pass" | "fail" | "warn" | "neutral" | "accent" | "solid";

export function Badge({ status = "neutral", children, style }: { status?: BadgeStatus; children: ReactNode; style?: CSSProperties }) {
  return (
    <span className={cx("vl-badge", `vl-badge--${status}`)} style={style}>
      {children}
    </span>
  );
}

/* ── 체크리스트 ─────────────────────────────────── */

export interface CheckItem {
  label: ReactNode;
  detail?: ReactNode;
  state?: "done" | "todo" | "fail";
}

const MARK = { done: "✓", todo: "–", fail: "✕" } as const;

/** 검증 완료/미확인 목록 */
export function Checklist({ items, size = "md", className, style }: Base & { items: CheckItem[]; size?: "md" | "sm" }) {
  return (
    <ul className={cx("vl-checklist", size === "sm" && "vl-checklist--sm", className)} style={style}>
      {items.map((it, i) => {
        const state = it.state ?? "done";
        return (
          <li key={i} className="vl-check" data-state={state}>
            <span className="vl-check__mark" aria-label={state}>
              {MARK[state]}
            </span>
            <span className="vl-check__label">{it.label}</span>
            {it.detail && <span className="vl-check__detail">{it.detail}</span>}
          </li>
        );
      })}
    </ul>
  );
}

/* ── 콜아웃 ─────────────────────────────────────── */

/** 왼쪽 막대 강조 상자. tone: accent(오렌지 옅은 면) / ink(회색 면) / dark(검정) */
export function Callout({
  label,
  tone = "accent",
  className,
  style,
  children,
}: Base & { label?: ReactNode; tone?: "accent" | "ink" | "dark"; children: ReactNode }) {
  return (
    <div className={cx("vl-callout", tone !== "accent" && `vl-callout--${tone}`, className)} style={style}>
      {label && <span className="vl-callout__label">{label}</span>}
      <div className="vl-callout__body">{children}</div>
    </div>
  );
}

/* ── 이미지 ─────────────────────────────────────── */

/** 빗금 이미지 자리. 실제 그림이 생기면 Figure 로 바꾼다. */
export function Placeholder({ label = "image", dark, height, className, style }: Base & { label?: ReactNode; dark?: boolean; height?: number | string }) {
  return (
    <div className={cx("vl-placeholder", dark && "vl-placeholder--dark", className)} style={{ height, ...style }}>
      <span className="vl-placeholder__label">{label}</span>
    </div>
  );
}

/** 그림 + 캡션. src 는 public/ 기준 경로 (예: "/decks/my-talk/fig1.png"). */
export function Figure({
  src,
  alt = "",
  caption,
  num,
  fit = "contain",
  video,
  className,
  style,
}: Base & { src: string; alt?: string; caption?: ReactNode; num?: ReactNode; fit?: "contain" | "cover"; video?: boolean }) {
  return (
    <figure className={cx("vl-figure", className)} style={style}>
      <div className="vl-figure__media">
        {video ? (
          <video src={src} style={{ objectFit: fit }} autoPlay muted loop playsInline />
        ) : (
          <img src={src} alt={alt} style={{ objectFit: fit }} />
        )}
      </div>
      {caption && (
        <figcaption>
          {num && <b>{num}</b>}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ── 값 비교 (출처별 값) ─────────────────────────── */

export interface CompareRow {
  label: ReactNode;
  value: ReactNode;
  emphasis?: boolean;
}

/** "저장값 / 노드값 / 장치값" 처럼 같은 항목을 출처별로 나란히 보여준다. */
export function CompareList({ rows, className, style }: Base & { rows: CompareRow[] }) {
  return (
    <div className={cx("vl-compare", className)} style={style}>
      {rows.map((r, i) => (
        <div key={i} className="vl-compare__row" data-emphasis={r.emphasis || undefined}>
          <span className="vl-compare__label">{r.label}</span>
          <span className="vl-compare__value">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
