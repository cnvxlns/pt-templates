---
name: vialab
description: VIALab(Vehicle Intelligence and Autonomy Laboratory) 랩 미팅·진행 보고·내부 세미나용. 흰 배경에 오렌지 하나만 강조, IBM Plex Sans KR + Space Grotesk, 1920×1080. 자율주행·센서·ROS 같은 연구 진행 보고에 맞는 표·수치·흐름·코드 블록 컴포넌트가 있다.
---

# vialab 템플릿

`VIALab-Template.html` 디자인을 옮긴 React + TypeScript (Vite) 프로젝트. 이 폴더에서 작업한다.

```bash
npm install                 # node_modules 가 없을 때만
npm run dev                 # http://localhost:5173  → 컴포넌트 카탈로그 + 덱 목록
```

## 덱 만들기

**사용자 발표는 이 레포 밖, 발표 자료 폴더 안의 `deck/` 에 만든다** (예: `~/발표자료/<주제>/deck/<slug>.tsx`).
이 레포에는 공통 컴포넌트만 둔다. 명령은 이 폴더에서 `DECK_DIR` 로 덱 폴더를 지정해 실행한다.

```bash
export DECK_DIR=~/발표자료/<주제>/deck
npm run dev                 # 목록에 그 폴더의 덱만 뜬다 → ?deck=<slug>
npm run build               # 타입체크(덱 포함) + 빌드 → $DECK_DIR/dist/
```

따로 둘 폴더가 없으면 `src/decks/private/<slug>.tsx` 에 둔다 (git 제외, `DECK_DIR` 없이 쓰는 기본 위치).
어느 쪽이든 아래처럼 `meta` 를 내보내면 덱 목록에 자동으로 뜬다 (`registry.ts` 수정 불필요).

```tsx
import { DeckStage, CoverSlide, ContentSlide, BulletList /* … */ } from "@/components";
import type { DeckMeta } from "@/decks/registry";

export const meta: DeckMeta = {
  slug: "topic-2026-12-01",          // 파일명과 같게. 주제-YYYY-MM-DD
  title: "발표 제목",
  date: "2026.12.01",
  description: "목록에 보일 한 줄",
};

export default function Deck() {
  return (
    <DeckStage title="발표 제목">
      <CoverSlide label="표지" title="발표 제목" subtitle="부제" presenter="이름 · 과정" date="2026.12.01" />
      {/* … */}
    </DeckStage>
  );
}
```

- 슬라이드 구성의 출발점: `src/decks/template.tsx` (템플릿 원본 11장).
- 그림·영상: 덱 파일 옆 `assets/` 에 두고 import 한다 — `import fig from "./assets/fig.png"` → `<Figure src={fig} />`.
- 보기: `npm run dev` → `http://localhost:5173/?deck=<slug>` (끝에 `#/5` 면 5번째 장).
- `npm run typecheck` 가 덱 폴더에 `tsconfig.json` 을 만들어 둔다 (에디터가 `@/components` 를 찾게). 고치지 않는다.
- 모든 슬라이드에 `label`(짧은 이름)을 주고, 말로 할 설명은 `notes` 에 쓴다.

## 컴포넌트

전부 `import { … } from "@/components"`.
**정확한 props 는 `src/catalog/docs.ts` 를, 실제 사용 예는 `src/catalog/examples/<이름>.tsx` 를 읽는다.**
(`npm run dev` 첫 화면이 같은 내용을 미리보기와 함께 보여준다.)

| 내용 | 쓸 것 |
|---|---|
| 표지 / 목차 / 섹션 구분 / 마무리(질문) | `CoverSlide` / `AgendaSlide` / `SectionSlide` / `ClosingSlide` |
| 일반 본문 (헤더 + 자유 본문) | `ContentSlide` — 헤더 오른쪽 `aside` 에 `Badge` 로 상태 표시 가능 |
| 설명 + 그림 2단 / 그림 꽉 채우기 | `SplitSlide` / `FullBleedSlide` + `Figure`·`Placeholder` |
| 핵심 한 문장 | `StatementSlide` |
| 요점 나열 | `BulletList` (`sub` 로 보충) · 번호 행은 `IndexList` |
| 큰 숫자 2~3개 | `StatGrid` + `Stat` |
| 비교 표 / 사양·환경 | `DataTable` (`highlight` 행 강조) / `KeyValue` |
| 같은 항목의 출처별 값 | `CompareList` |
| 처리 단계·파이프라인 | `FlowSteps` (가로·세로) |
| 일정·다음 단계 | `Timeline` (done / active / todo) |
| 묶음 설명 2~3개 | `CardGrid` + `Card` (outline·paper·rule·dark·accent) |
| 코드·로그·터미널 | `CodeBlock` + `Dim`/`Ok`/`Err`/`Hl` |
| 확인됨 / 미확인 목록 | `Checklist` |
| 보충·주의 상자 | `Callout` |
| 배치 | `Columns`(`cols={2}` 또는 `"1fr 1.4fr"`) · `Stack` · `Row` · `Spacer` |
| 글자 | `Lead` · `Text` · `Hl`(오렌지 강조) · `B` · `Code` · `Eyebrow` |

레이아웃에 맞는 게 없으면 `Slide` + `SlideHeader` 로 직접 구성한다.

## 디자인 규칙 (템플릿 원본 기준)

- 강조색은 오렌지 하나. 색·글자 크기를 인라인으로 하드코딩하지 않는다 (`src/styles/tokens.css` 변수 사용).
- 한 장 기준: 글머리 3개(`size="md"` 면 5개), 수치 3개, 표 4열, 목차 4항목 이내.
- 섹션이 3개 이상이면 `AgendaSlide` + 섹션마다 `SectionSlide`.
- 본문 영역은 약 1700×700px. 넘치면 장을 나누거나 `compact` · `size="sm"` 변형을 쓴다.

## 검사 (필수)

```bash
npm run check -- <slug> --shots        # 넘침·잘림 검사 + 슬라이드별 PNG (.deck-check/<slug>/NN.png)
npm run check -- <slug> --pdf          # + 한 장당 한 페이지 PDF (.deck-check/<slug>.pdf)
```

`DECK_DIR` 를 지정했으면 결과물은 `$DECK_DIR/.deck-check/` 에 나온다.

"넘침·잘림 없음" 이 나올 때까지 고치고, PNG 를 직접 보고 빈 장·쏠린 배치·어색한 줄바꿈을 확인한다.
Chrome 이 표준 위치에 없으면 `CHROME_PATH` 로 지정한다. 결과물(`.deck-check/`)은 git 제외.

## 컴포넌트를 새로 만들 때

1. `src/components/` 에 만들고 `src/components/index.ts` 에서 export.
2. 스타일은 `src/styles/deck.css` 에 `vl-` 접두사 클래스로, 값은 토큰 변수로.
3. 카탈로그 등록: `src/catalog/examples/<이름>.tsx` (예제 하나) + `src/catalog/docs.ts` 의 `DOCS` 에 항목.
   **공개 레포이므로 예제에는 일반적인 내용만** 쓴다.
4. `npm run build` 로 타입체크.
