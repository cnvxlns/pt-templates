import type { CSSProperties, ReactNode } from "react";
import { cx } from "../tokens";

/** 모든 슬라이드 컴포넌트가 받는 공통 메타. DeckStage 가 읽는다. */
export interface SlideMeta {
  /** 개요 화면·하단 컨트롤에 표시되는 짧은 이름 */
  label?: string;
}

export type SlideTone = "light" | "dark" | "accent";

export interface SlideProps extends SlideMeta {
  tone?: SlideTone;
  /** false 면 바깥 여백(100/110/80) 없이 가장자리까지 채운다 */
  padded?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 슬라이드 한 장 = 1920×1080 section. 레이아웃 컴포넌트는 모두 이걸 감싼다. */
export function Slide({ tone = "light", padded = true, className, style, label, children }: SlideProps) {
  return (
    <section
      className={cx("vl-slide", `vl-slide--${tone}`, !padded && "vl-slide--bleed", className)}
      style={style}
      data-label={label}
    >
      {children}
    </section>
  );
}
