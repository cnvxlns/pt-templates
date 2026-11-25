import type { CSSProperties, ElementType, ReactNode } from "react";
import { cx } from "./tokens";

type Base = { className?: string; style?: CSSProperties; children?: ReactNode };

/* ── 텍스트 ─────────────────────────────────────── */

/** 제목 위 64×6 오렌지 막대. 템플릿 표지·섹션·2단 슬라이드의 시그니처. */
export function AccentBar({ width = 64, color, style }: { width?: number | string; color?: string; style?: CSSProperties }) {
  return <div className="vl-accent-bar" style={{ width, background: color, ...style }} aria-hidden />;
}

/** 본문이나 도표에 쓰는 작은 라벨. */
export function Eyebrow({ muted, className, style, children }: Base & { muted?: boolean }) {
  return (
    <span className={cx("vl-eyebrow", muted && "vl-eyebrow--muted", className)} style={style}>
      {children}
    </span>
  );
}

/** 표지용 104px 제목 */
export function H1({ className, style, children }: Base) {
  return <h1 className={cx("vl-h1", className)} style={style}>{children}</h1>;
}
/** 슬라이드 제목 64px */
export function H2({ className, style, children }: Base) {
  return <h2 className={cx("vl-h2", className)} style={style}>{children}</h2>;
}
/** 소제목 40px */
export function H3({ className, style, children }: Base) {
  return <h3 className={cx("vl-h3", className)} style={style}>{children}</h3>;
}

/** 36px light 리드 문단 */
export function Lead({ className, style, children }: Base) {
  return <p className={cx("vl-lead", className)} style={style}>{children}</p>;
}

/** 본문 문단 32px (size="sm" 28px), muted 면 회색 light */
export function Text({
  size = "md",
  muted,
  as: As = "p",
  className,
  style,
  children,
}: Base & { size?: "md" | "sm"; muted?: boolean; as?: ElementType }) {
  return (
    <As className={cx("vl-text", size === "sm" && "vl-text--sm", muted && "vl-text--muted", className)} style={style}>
      {children}
    </As>
  );
}

/** 오렌지 강조 */
export function Hl({ children, strong }: { children: ReactNode; strong?: boolean }) {
  return <span className={cx("vl-hl", strong && "vl-strong")}>{children}</span>;
}

/** 굵게 */
export function B({ children }: { children: ReactNode }) {
  return <strong className="vl-strong">{children}</strong>;
}

/** 인라인 코드 */
export function Code({ children }: { children: ReactNode }) {
  return <code className="vl-code">{children}</code>;
}

/** 숫자용 Space Grotesk */
export function Num({ children, accent, style }: { children: ReactNode; accent?: boolean; style?: CSSProperties }) {
  return <span className={cx("vl-num", accent && "vl-hl")} style={style}>{children}</span>;
}

/* ── 브랜드 ─────────────────────────────────────── */

/** VIALab 로고. 표지 300px, 본문 헤더 150px. */
export function Logo({ width = 150, style }: { width?: number; style?: CSSProperties }) {
  return <img className="vl-logo" src="/vialab-logo.png" alt="VIALab" width={width} style={{ width, ...style }} />;
}

export function Divider({ style }: { style?: CSSProperties }) {
  return <hr className="vl-divider" style={style} />;
}

/* ── 레이아웃 헬퍼 ───────────────────────────────── */

type FlexProps = Base & {
  gap?: number;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  /** 남은 높이를 채운다 */
  fill?: boolean;
};

/** 세로 쌓기 */
export function Stack({ gap = 24, align, justify, fill, className, style, children }: FlexProps) {
  return (
    <div
      className={cx("vl-stack", fill && "vl-fill", className)}
      style={{ gap, alignItems: align, justifyContent: justify, ...style }}
    >
      {children}
    </div>
  );
}

/** 가로 배치 */
export function Row({ gap = 24, align, justify, fill, className, style, children }: FlexProps) {
  return (
    <div
      className={cx("vl-row", fill && "vl-fill", className)}
      style={{ gap, alignItems: align, justifyContent: justify, ...style }}
    >
      {children}
    </div>
  );
}

/**
 * 단 나누기. cols 는 숫자(균등) 또는 grid-template-columns 문자열.
 *   <Columns cols={2}> · <Columns cols="1fr 1.4fr" gap={90}>
 */
export function Columns({
  cols = 2,
  gap = 80,
  align,
  fill,
  className,
  style,
  children,
}: Base & { cols?: number | string; gap?: number; align?: CSSProperties["alignItems"]; fill?: boolean }) {
  return (
    <div
      className={cx("vl-grid", fill && "vl-fill", className)}
      style={{
        gridTemplateColumns: typeof cols === "number" ? `repeat(${cols}, minmax(0, 1fr))` : cols,
        gap,
        alignItems: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** flex 컨테이너 안에서 남은 공간 밀어내기 */
export function Spacer() {
  return <div style={{ flex: 1 }} aria-hidden />;
}
