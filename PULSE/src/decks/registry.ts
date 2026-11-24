import type { ComponentType } from "react";
import TemplateDeck from "./template";

export interface DeckMeta {
  /** 주소: ?deck=<slug> */
  slug: string;
  title: string;
  date?: string;
  description?: string;
}

export interface DeckEntry extends DeckMeta {
  Deck: ComponentType;
}

/*
 * 비공개 덱: src/decks/private/*.tsx 는 git 에 올라가지 않는다 (.gitignore).
 * 파일이 `export const meta: DeckMeta` 와 `export default` 컴포넌트를 내보내면 자동으로 목록에 뜬다.
 * 내부 수치·IP·미결 사항이 들어간 발표는 여기에 둔다.
 */
const privateModules = import.meta.glob<{ default: ComponentType; meta: DeckMeta }>("./private/*.tsx", { eager: true });
const privateDecks: DeckEntry[] = Object.values(privateModules)
  .filter((m) => m.meta && m.default)
  .map((m) => ({ ...m.meta, Deck: m.default }))
  .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

/** 공개 덱은 여기 한 줄 추가하면 목록과 주소가 생긴다. */
export const decks: DeckEntry[] = [
  ...privateDecks,
  {
    slug: "template",
    title: "PULSE 발표 템플릿",
    description: "표지, 설명, 비교 표, 마무리 예제",
    Deck: TemplateDeck,
  },
];

export function findDeck(slug: string): DeckEntry | undefined {
  return decks.find((d) => d.slug === slug);
}
