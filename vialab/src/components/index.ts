// 덱 파일에서는 이 경로 하나만 import 한다:  import { ... } from "@/components";
export { DeckStage } from "./deck/DeckStage";
export { Slide, type SlideMeta, type SlideTone, type SlideProps } from "./deck/Slide";
export * from "./primitives";
export * from "./content";
export * from "./layouts";
export { color, font, size, cx, SLIDE_W, SLIDE_H } from "./tokens";
