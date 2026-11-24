---
name: PULSE
description: PULSE 알고리즘 스터디의 개념 강의·문제 풀이·주차별 리뷰용. 네이비와 시안의 표지·마무리, 밝은 본문, 복잡도 비교 패널과 표를 갖춘 1920×1080 React 템플릿.
---

# PULSE 템플릿

이 폴더에서 `npm ci` 후 `npm run dev`를 실행한다. Vite가 출력하는 주소에서 덱을 고르거나 `?deck=template`을 연다.

## 덱 작성

`src/decks/template.tsx`를 발표 자료 폴더 안의 `deck/<slug>.tsx`로 복사해 시작한다 (이 레포 밖).
명령은 이 폴더에서 `DECK_DIR`로 덱 폴더를 지정해 실행한다.

```sh
export DECK_DIR=~/발표자료/<주제>/deck
npm run dev      # 목록에 그 폴더의 덱만 뜬다
npm run build    # 타입체크(덱 포함) + 빌드 → $DECK_DIR/dist/
```

따로 둘 폴더가 없으면 `src/decks/private/<slug>.tsx`에 둔다 (Git 제외, `DECK_DIR` 없이 쓰는 기본 위치).
어느 쪽이든 아래 형식으로 목록 정보를 내보내면 자동 등록된다.

```tsx
import type { DeckMeta } from "@/decks/registry";

export const meta: DeckMeta = {
  slug: "prefix-sums",
  title: "누적 합",
  description: "알고리즘 스터디",
};
```

- `DeckStage` 안에 슬라이드를 배치하고, 각 장에 `label`을 지정한다. 설명이 필요하면 `notes` 속성에 넣는다.
- `CoverSlide`와 `ClosingSlide`는 `eyebrow`, `title`, `lead`와 선택 사항인 `footer`, `art`를 받는다.
- `ContentSlide`에 제목과 본문을 넣는다. `pulse-grid` 안에서 `Panel` 두 개를 비교하고, 한쪽에만 `accent`를 준다.
- 수식과 큰 숫자는 `pulse-formula`, 비교 표는 `pulse-table`, 절차는 `ol.pulse-flow`, 핵심 요점은 `pulse-callout`을 쓴다.
- 스타일과 색상은 `src/styles/pulse.css`의 토큰을 사용한다. 표나 본문이 길면 장을 나눈다.
- 그림은 덱 파일 옆 `assets/`에 두고 import 한다: `import fig from "./assets/fig.png"` → `<img src={fig} />`.
  (`src/decks/private/`의 덱은 `public/private/<slug>/`에 두고 `/private/<slug>/파일명`으로 참조한다. 둘 다 Git 제외.)
- `npm run typecheck`가 덱 폴더에 `tsconfig.json`을 만들어 둔다 (에디터가 `@/components`를 찾게). 고치지 않는다.
- `DECK_DIR` 없이 빌드하면 `src/decks/private/`의 덱이 빌드 결과에 포함되므로 배포 전에 포함할 덱을 확인한다.

## 발표 및 검사

- `?deck=<slug>#/3`은 세 번째 슬라이드를 바로 연다.
- ← / →로 이동, G로 전체 슬라이드, N으로 발표자 노트, F로 전체화면을 연다.
- 레포의 VIALab 템플릿과 같은 발표 셸과 검사 방식으로 실행한다.

```sh
npm run build
npm run check -- <slug> --shots --pdf
```

검사기는 Chrome 또는 Chromium으로 넘침·잘림을 확인한다. 필요하면 `CHROME_PATH`를 지정한다. 스크린샷과 16:9 PDF는 `.deck-check/`에 저장된다 (`DECK_DIR`를 지정했으면 `$DECK_DIR/.deck-check/`).
