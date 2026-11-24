# VIALab Slides

VIALab-Template.html 디자인을 그대로 옮긴 **React + TypeScript** 발표 템플릿 (빌드 도구: Vite).
슬라이드는 1920×1080 캔버스이고, 화면 크기에 맞춰 자동으로 축소·확대된다.

```bash
npm install
npm run dev        # http://localhost:5173  → 컴포넌트 카탈로그 + 덱 목록
npm run build      # 타입체크 + 정적 빌드 → dist/
npm run preview    # dist/ 를 로컬 서버로 띄움
npm run typecheck
```

## 발표 조작

| 키 | 동작 |
|---|---|
| → ↓ Space PageDown / ← ↑ PageUp | 다음 / 이전 |
| Home / End, R | 처음·끝, 처음으로 |
| G 또는 Esc | 전체 보기(그리드) — 클릭해서 이동 |
| N | 발표자 노트 |
| F | 전체 화면 |
| Ctrl/Cmd + P | 한 장당 한 페이지 PDF (배경 그래픽 켜기) |

주소 `?deck=<slug>#/5` 는 그 덱의 5번째 슬라이드 (라우터 없음, `src/App.tsx`). 터치 기기는 화면 왼쪽/오른쪽 탭으로 이동.

## 구조

```
index.html                Vite 진입점
src/
  main.tsx                React 마운트 + 스타일 import
  App.tsx                 ?deck=<slug> 면 덱, 아니면 카탈로그
  catalog/                npm run dev 첫 화면 (컴포넌트 문서)
    CatalogPage.tsx
    docs.ts               ← 컴포넌트 설명·props 표
    examples/<이름>.tsx   ← 미리보기 + 코드 (파일 하나 = 예제 하나)
  decks/
    registry.ts           ← 공개 덱은 여기에 한 줄 등록
    template.tsx          원본 11장 템플릿 (새 덱 시작점)
    private/              ← 비공개 덱 (git 에 안 올라감, 자동 등록)
  components/
    deck/DeckStage.tsx    스케일·키보드·노트·개요·인쇄
    deck/Slide.tsx        슬라이드 한 장 (tone: light | dark | accent)
    layouts.tsx           템플릿 11유형 레이아웃
    content.tsx           본문 컴포넌트
    primitives.tsx        텍스트·로고·레이아웃 헬퍼
    tokens.ts             색·서체·크기 (TS)
  styles/
    tokens.css            디자인 토큰 (CSS 변수)
    deck.css              모든 컴포넌트 스타일
    fonts.css             템플릿에서 추출한 IBM Plex Sans KR / Space Grotesk
public/
  fonts/                  woff2 (오프라인 동작)
  vialab-logo.png
```

## 새 발표 만들기

1. `src/decks/template.tsx` 를 `src/decks/<slug>.tsx` 로 복사
2. `src/decks/registry.ts` 의 `decks` 배열에 등록
   - 내부 수치·IP·미결 사항이 들어간 발표는 대신 `src/decks/private/` 에 둔다.
     git 에 올라가지 않고, `export const meta` 만 있으면 자동으로 목록에 뜬다 (`private/README.md`).
3. 그림은 `public/decks/<slug>/` 에 두고 `<Figure src="/decks/<slug>/a.png" />`

모든 슬라이드 컴포넌트는 `label`(개요·하단 표시)과 `notes`(발표자 노트)를 받는다.

## 컴포넌트

`import { … } from "@/components"` 하나로 쓴다. **`npm run dev` 첫 화면(카탈로그)에 컴포넌트마다
미리보기 · 복사할 수 있는 코드 · props 표가 있다.** 아래는 요약.

새 컴포넌트를 만들면 카탈로그에도 올린다: `src/catalog/examples/<이름>.tsx` 에 예제를 하나 만들고
`src/catalog/docs.ts` 의 `DOCS` 배열에 항목을 추가한다.

**레이아웃 (템플릿 11유형)**

| 컴포넌트 | 템플릿 | 용도 |
|---|---|---|
| `CoverSlide` | 01 표지 | title, subtitle, presenter, date, event |
| `AgendaSlide` | 02 목차 | items (4개 이내) |
| `SectionSlide` | 03 섹션 구분 | number, title, description |
| `ContentSlide` | 04·07·08·09 | 헤더(eyebrow+제목+로고) + 자유 본문. `aside` 로 로고 대신 Badge |
| `SplitSlide` | 05 2단 | 왼쪽 설명, `aside` 에 그림 |
| `FullBleedSlide` | 06 전체 이미지 | `media` 에 Figure/Placeholder |
| `StatementSlide` | 10 핵심 문장 | 한 문장 + source |
| `ClosingSlide` | 11 마무리 | questions |
| `Slide` | — | 위에 없는 형태를 직접 짤 때 |

**본문**

| 컴포넌트 | 용도 |
|---|---|
| `BulletList` | 오렌지 사각 글머리 (`sub` 로 보충 설명, `size="md"`) |
| `IndexList` | 01·02… 번호 행 목록 |
| `Stat`, `StatGrid` | 큰 수치 (accent, unit, size) |
| `DataTable` | 비교 표 (`highlight` 행 오렌지, `num`/`mono` 열) |
| `KeyValue` | 2열 정의 목록 (환경·사양, `compact`) |
| `CompareList` | 같은 항목의 출처별 값 비교 |
| `Timeline` | 일정 (state: done / active / todo) |
| `FlowSteps` | 처리 단계 흐름 (가로·세로, emphasis, dark) |
| `Card`, `CardGrid` | outline · paper · rule · dark · accent · plain |
| `CodeBlock` + `Dim`/`Ok`/`Err` | 코드·로그·터미널 |
| `Badge` | pass · fail · warn · neutral · accent · solid |
| `Checklist` | 확인됨 ✓ / 미확인 – / 실패 ✕ |
| `Callout` | 왼쪽 막대 강조 상자 |
| `Placeholder`, `Figure` | 이미지 자리 / 그림+캡션 |

**원시 요소**: `AccentBar` `Eyebrow` `H1` `H2` `H3` `Lead` `Text` `Hl` `B` `Code` `Num` `Logo` `Divider` `Stack` `Row` `Columns` `Spacer`

## 디자인 규칙 (템플릿에서 그대로)

- 색은 오렌지 `#F5821F` 하나만 강조로 쓴다. 나머지는 무채색. 새 색은 `tokens.css` 에 먼저 추가
- 한글 IBM Plex Sans KR, 숫자·영문 라벨 Space Grotesk
- 바깥 여백 100 / 110 / 80 px, 본문 헤더 아래 구분선 + 오른쪽 150px 로고
- 글머리 3개, 지표 3개, 표 열 4개, 목차 4개 이내
