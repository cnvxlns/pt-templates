# 비공개 덱

이 폴더의 `.tsx` 는 git 에 올라가지 않는다 (`vialab/.gitignore`).
내부 수치, 장비 시리얼·IP, 미결 의사결정이 들어간 발표는 여기에 둔다.

파일이 아래 두 가지를 내보내면 덱 목록에 자동으로 뜬다 (`registry.ts` 에 등록할 필요 없음).

```tsx
import type { DeckMeta } from "../registry";

export const meta: DeckMeta = { slug: "my-report", title: "진행 보고", date: "2026.12.01" };

export default function MyReport() {
  return <DeckStage title="진행 보고">{/* 슬라이드 */}</DeckStage>;
}
```

주소: `?deck=my-report`
