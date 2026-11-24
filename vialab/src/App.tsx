import { findDeck } from "@/decks/registry";
import { CatalogPage } from "@/catalog/CatalogPage";

/**
 * 라우터 없이 쿼리 하나로 화면을 고른다.
 *   /                    → 컴포넌트 카탈로그 + 덱 목록
 *   /?deck=<slug>#/5     → 그 덱의 5번째 슬라이드
 */
export function App() {
  const slug = new URLSearchParams(window.location.search).get("deck");
  const entry = slug ? findDeck(slug) : undefined;
  if (entry) {
    const { Deck } = entry;
    return <Deck />;
  }
  return <CatalogPage />;
}
