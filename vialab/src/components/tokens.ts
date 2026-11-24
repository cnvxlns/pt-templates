/** CSS 변수(src/styles/tokens.css)의 TS 사본. 인라인 style 이나 SVG 에서 쓴다. */
export const color = {
  orange: "var(--vl-orange)",
  orangeDark: "var(--vl-orange-dark)",
  orangeInk: "var(--vl-orange-ink)",
  orangeTint: "var(--vl-orange-tint)",
  ink: "var(--vl-ink)",
  white: "var(--vl-white)",
  body: "var(--vl-body)",
  subtle: "var(--vl-subtle)",
  muted: "var(--vl-muted)",
  track: "var(--vl-track)",
  line: "var(--vl-line)",
  paper: "var(--vl-paper)",
  darkSurface: "var(--vl-dark-surface)",
  darkLine: "var(--vl-dark-line)",
  darkText: "var(--vl-dark-text)",
  darkSub: "var(--vl-dark-sub)",
  pass: "var(--vl-pass)",
  fail: "var(--vl-fail)",
} as const;

export const font = {
  sans: "var(--vl-font-sans)",
  display: "var(--vl-font-display)",
  mono: "var(--vl-font-mono)",
} as const;

/** 템플릿의 타입 스케일 (px, 1920×1080 기준) */
export const size = {
  cover: 104,
  section: 88,
  sectionNumber: 160,
  statement: 76,
  title: 64,
  body: 46,
  bodySm: 38,
  lead: 36,
  label: 34,
  caption: 28,
  stat: 132,
} as const;

export const SLIDE_W = 1920;
export const SLIDE_H = 1080;

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
