/*
 * 카탈로그(npm run dev 첫 화면)에 나오는 컴포넌트 설명.
 * 미리보기와 코드는 examples/<id>.tsx 에서 자동으로 가져온다.
 * 새 컴포넌트를 만들면: examples/<이름>.tsx 하나 + 아래 배열에 항목 하나.
 */

export type Group = "layout" | "content" | "primitive";

export const GROUPS: { id: Group; title: string; hint: string }[] = [
  { id: "layout", title: "슬라이드 레이아웃", hint: "슬라이드 한 장 전체. 템플릿의 11가지 유형 그대로." },
  { id: "content", title: "본문 컴포넌트", hint: "ContentSlide 등의 본문 안에 넣는 블록." },
  { id: "primitive", title: "원시 요소", hint: "글자·로고·배치 헬퍼." },
];

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  desc: string;
}

export interface ComponentDoc {
  /** examples/<id>.tsx 와 같은 이름 */
  id: string;
  /** 화면에 보이는 이름 (여러 컴포넌트를 묶을 때) */
  name?: string;
  group: Group;
  summary: string;
  /** 미리보기: slide = 1920×1080 한 장, block = 본문 블록만 */
  frame: "slide" | "block";
  props: PropDoc[];
}

const META: PropDoc[] = [
  { name: "label", type: "string", desc: "전체 보기(G)·하단 컨트롤에 표시되는 짧은 이름" },
];

export const DOCS: ComponentDoc[] = [
  /* ── 슬라이드 레이아웃 ── */
  {
    id: "CoverSlide",
    group: "layout",
    frame: "slide",
    summary: "표지. 로고 · 오렌지 막대 · 제목 · 부제 · 발표자/날짜.",
    props: [
      { name: "title", type: "ReactNode", required: true, desc: "104px 제목" },
      { name: "subtitle", type: "ReactNode", desc: "회색 한 줄 부제" },
      { name: "presenter", type: "ReactNode", desc: "왼쪽 아래 (발표자 · 소속)" },
      { name: "date", type: "ReactNode", desc: "오른쪽 아래 날짜" },
      { name: "event", type: "ReactNode", default: '"Lab Meeting"', desc: "날짜 옆 행사명" },
      ...META,
    ],
  },
  {
    id: "AgendaSlide",
    group: "layout",
    frame: "slide",
    summary: "목차. 왼쪽 제목, 오른쪽 번호 행. 네 항목 이내.",
    props: [
      { name: "items", type: "(ReactNode | { label, detail?, num? })[]", required: true, desc: "목차 항목. 문자열만 넣어도 된다" },
      { name: "title", type: "ReactNode", default: '"목차"', desc: "" },
      ...META,
    ],
  },
  {
    id: "SectionSlide",
    group: "layout",
    frame: "slide",
    summary: "섹션 구분. 큰 번호 + 제목 + 한 줄 설명.",
    props: [
      { name: "number", type: "ReactNode", required: true, desc: '"01" 같은 큰 번호' },
      { name: "title", type: "ReactNode", required: true, desc: "" },
      { name: "description", type: "ReactNode", desc: "회색 한 줄" },
      { name: "tone", type: '"dark" | "light" | "accent"', default: '"dark"', desc: "배경" },
      ...META,
    ],
  },
  {
    id: "ContentSlide",
    group: "layout",
    frame: "slide",
    summary: "가장 많이 쓰는 본문 슬라이드. 헤더(제목 + 로고) 아래에 자유롭게 본문을 넣는다.",
    props: [
      { name: "title", type: "ReactNode", required: true, desc: "64px 제목" },
      { name: "children", type: "ReactNode", desc: "본문. 남은 높이를 채우는 세로 flex 영역" },
      { name: "aside", type: "ReactNode", desc: "헤더 오른쪽을 로고 대신 이것으로 (Badge 등)" },
      { name: "gap", type: "number", default: "72", desc: "헤더와 본문 사이 간격(px)" },
      { name: "tone", type: '"light" | "dark" | "accent"', default: '"light"', desc: "배경. light 가 아니면 로고 숨김" },
      { name: "logo", type: "boolean", default: "true", desc: "헤더 오른쪽 로고" },
      { name: "bodyStyle", type: "CSSProperties", desc: "본문 영역 인라인 스타일" },
      ...META,
    ],
  },
  {
    id: "SplitSlide",
    group: "layout",
    frame: "slide",
    summary: "2단. 왼쪽 제목·설명, 오른쪽 그림이나 도식.",
    props: [
      { name: "title", type: "ReactNode", required: true, desc: "" },
      { name: "aside", type: "ReactNode", required: true, desc: "오른쪽 (Figure, Placeholder, CodeBlock…)" },
      { name: "children", type: "ReactNode", desc: "왼쪽 설명 (Lead, BulletList…)" },
      { name: "ratio", type: "string", default: '"1fr 1fr"', desc: "grid-template-columns" },
      { name: "reverse", type: "boolean", desc: "그림을 왼쪽으로" },
      ...META,
    ],
  },
  {
    id: "FullBleedSlide",
    group: "layout",
    frame: "slide",
    summary: "이미지를 꽉 채우고 아래에 제목·캡션을 겹친다. 주행 영상, 정성 결과용.",
    props: [
      { name: "media", type: "ReactNode", required: true, desc: '<Figure fit="cover" /> 또는 <Placeholder dark />' },
      { name: "title", type: "ReactNode", desc: "" },
      { name: "caption", type: "ReactNode", desc: "" },
      ...META,
    ],
  },
  {
    id: "StatementSlide",
    group: "layout",
    frame: "slide",
    summary: "한 장에 한 문장. 오렌지 배경.",
    props: [
      { name: "children", type: "ReactNode", required: true, desc: "강조할 문장" },
      { name: "source", type: "ReactNode", desc: "출처·맥락 한 줄" },
      { name: "tone", type: '"accent" | "dark" | "light"', default: '"accent"', desc: "" },
      ...META,
    ],
  },
  {
    id: "ClosingSlide",
    group: "layout",
    frame: "slide",
    summary: "마무리. 논의 질문 두세 개 + 연구실명 · 감사합니다.",
    props: [
      { name: "questions", type: "ReactNode[]", default: "[]", desc: "" },
      { name: "title", type: "ReactNode", default: '"논의 사항"', desc: "" },
      { name: "org", type: "ReactNode", default: '"Vehicle Intelligence and Autonomy Laboratory"', desc: "" },
      { name: "thanks", type: "ReactNode", default: '"감사합니다"', desc: "" },
      ...META,
    ],
  },
  {
    id: "Slide",
    group: "layout",
    frame: "slide",
    summary: "빈 슬라이드. 위 레이아웃에 맞지 않을 때 직접 구성한다 (SlideHeader 와 함께).",
    props: [
      { name: "tone", type: '"light" | "dark" | "accent"', default: '"light"', desc: "배경" },
      { name: "padded", type: "boolean", default: "true", desc: "false 면 바깥 여백(100/110/80) 없음" },
      { name: "children", type: "ReactNode", desc: "세로 flex 컨테이너 안에 들어간다" },
      { name: "style / className", type: "", desc: "" },
      ...META,
    ],
  },

  /* ── 본문 ── */
  {
    id: "BulletList",
    group: "content",
    frame: "block",
    summary: "오렌지 사각 글머리 목록. 템플릿 권장은 세 개 이내, 한 줄씩.",
    props: [
      { name: "items", type: "(ReactNode | { text, sub? })[]", required: true, desc: "sub 는 아래 회색 보충 설명" },
      { name: "size", type: '"lg" | "md"', default: '"lg"', desc: "md 는 4~5개일 때 (36px)" },
    ],
  },
  {
    id: "IndexList",
    group: "content",
    frame: "block",
    summary: "01 · 02 … 번호가 붙은 행 목록. 목차나 순서에.",
    props: [
      { name: "items", type: "{ label, detail?, num? }[]", required: true, desc: "num 을 주면 번호 대신 표시" },
      { name: "compact", type: "boolean", desc: "행 간격·글자 축소" },
    ],
  },
  {
    id: "Stat",
    name: "Stat · StatGrid",
    group: "content",
    frame: "block",
    summary: "큰 수치 + 라벨 + 보충. StatGrid 로 나란히 놓는다. 한 장에 세 개까지.",
    props: [
      { name: "value", type: "ReactNode", required: true, desc: "Space Grotesk 큰 숫자" },
      { name: "label", type: "ReactNode", required: true, desc: "" },
      { name: "unit", type: "ReactNode", desc: "숫자 옆 작은 단위" },
      { name: "note", type: "ReactNode", desc: "회색 보충" },
      { name: "accent", type: "boolean", desc: "숫자를 오렌지로" },
      { name: "size", type: '"lg" | "md" | "sm"', default: '"lg"', desc: "132 / 96 / 64 px" },
      { name: "StatGrid.columns", type: "number", default: "3", desc: "" },
      { name: "StatGrid.gap", type: "number", default: "70", desc: "" },
    ],
  },
  {
    id: "DataTable",
    group: "content",
    frame: "block",
    summary: "비교 표. 강조 행은 오렌지 (템플릿의 “Ours” 행).",
    props: [
      { name: "columns", type: "(string | { header, align?, num?, mono?, emphasis?, width? })[]", required: true, desc: "num: 숫자 서체, mono: 경로·식별자, emphasis: 열 전체 옅은 오렌지 강조" },
      { name: "rows", type: "ReactNode[][]", required: true, desc: "" },
      { name: "highlight", type: "number[]", desc: "오렌지로 강조할 행 번호 (0부터)" },
      { name: "muted", type: "number[]", desc: "흐리게 할 행 번호" },
      { name: "compact", type: "boolean", desc: "행이 많을 때" },
    ],
  },
  {
    id: "KeyValue",
    group: "content",
    frame: "block",
    summary: "2열 정의 목록. 환경·사양 정리에.",
    props: [
      { name: "items", type: "[ReactNode, ReactNode][]", required: true, desc: "[항목, 값]" },
      { name: "keyWidth", type: "number | string", default: "260", desc: "왼쪽 열 너비" },
      { name: "compact", type: "boolean", desc: "" },
    ],
  },
  {
    id: "CompareList",
    group: "content",
    frame: "block",
    summary: "같은 항목을 출처별로 나란히 비교한다 (저장값 / 노드값 / 장치값).",
    props: [{ name: "rows", type: "{ label, value, emphasis? }[]", required: true, desc: "emphasis 행은 오렌지 굵게" }],
  },
  {
    id: "Timeline",
    group: "content",
    frame: "block",
    summary: "기간별 일정. 막대 색으로 진행 상태를 나타낸다.",
    props: [
      {
        name: "items",
        type: '{ period, title, detail?, state? }[]',
        required: true,
        desc: 'state: "done" 검정 · "active" 오렌지 · "todo"(기본) 회색',
      },
    ],
  },
  {
    id: "FlowSteps",
    group: "content",
    frame: "block",
    summary: "처리 단계를 화살표로 잇는다. 파이프라인·트랜잭션 설명에.",
    props: [
      { name: "steps", type: "{ title, detail?, emphasis?, dark?, num? }[]", required: true, desc: "emphasis: 오렌지 윗선, dark: 검정 박스" },
      { name: "direction", type: '"row" | "column"', default: '"row"', desc: "" },
      { name: "numbered", type: "boolean", default: "true", desc: "01, 02 … 번호" },
      { name: "arrow", type: "ReactNode", default: '"→"', desc: "" },
    ],
  },
  {
    id: "Card",
    name: "Card · CardGrid",
    group: "content",
    frame: "block",
    summary: "번호·라벨·제목·본문을 묶는 상자. 변형 6가지. CardGrid 로 나란히 놓는다.",
    props: [
      { name: "variant", type: '"outline" | "paper" | "rule" | "dark" | "accent" | "plain"', default: '"outline"', desc: "" },
      { name: "accent", type: "boolean", desc: "rule 의 윗선을 오렌지로" },
      { name: "index", type: "ReactNode", desc: '"01" 같은 번호' },
      { name: "eyebrow", type: "ReactNode", desc: "작은 영문 라벨" },
      { name: "title", type: "ReactNode", desc: "" },
      { name: "children", type: "ReactNode", desc: "본문 (29px light)" },
      { name: "CardGrid.columns", type: "number | string", default: "2", desc: "숫자 또는 grid-template-columns" },
      { name: "CardGrid.gap", type: "number", default: "40", desc: "" },
    ],
  },
  {
    id: "CodeBlock",
    name: "CodeBlock · Dim · Ok · Err",
    group: "content",
    frame: "block",
    summary: "코드·로그·터미널 출력. Dim(회색) / Ok(초록) / Err(빨강) / Hl(오렌지) 로 부분 강조.",
    props: [
      { name: "children", type: "ReactNode", required: true, desc: "문자열(\\n 줄바꿈)과 강조 요소를 섞는다" },
      { name: "title", type: "ReactNode", desc: "주면 상단에 터미널 바가 생긴다" },
      { name: "light", type: "boolean", desc: "밝은 배경" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "22 / 26 / 30 px" },
    ],
  },
  {
    id: "Badge",
    group: "content",
    frame: "block",
    summary: "상태 표시 알약. ContentSlide 의 aside 에 자주 쓴다.",
    props: [
      { name: "status", type: '"pass" | "fail" | "warn" | "neutral" | "accent" | "solid"', default: '"neutral"', desc: "" },
      { name: "children", type: "ReactNode", required: true, desc: "" },
    ],
  },
  {
    id: "Checklist",
    group: "content",
    frame: "block",
    summary: "확인됨 ✓ / 미확인 – / 실패 ✕ 목록. 검증 현황에.",
    props: [
      { name: "items", type: "{ label, detail?, state? }[]", required: true, desc: 'state: "done"(기본) | "todo" | "fail"' },
      { name: "size", type: '"md" | "sm"', default: '"md"', desc: "항목이 많으면 sm" },
    ],
  },
  {
    id: "Callout",
    group: "content",
    frame: "block",
    summary: "왼쪽 막대가 있는 강조 상자. 보충 설명, 주의 사항.",
    props: [
      { name: "children", type: "ReactNode", required: true, desc: "" },
      { name: "label", type: "ReactNode", desc: "상단 작은 라벨" },
      { name: "tone", type: '"accent" | "ink" | "dark"', default: '"accent"', desc: "오렌지 옅은 면 / 회색 면 / 검정" },
    ],
  },
  {
    id: "Placeholder",
    group: "content",
    frame: "block",
    summary: "빗금 이미지 자리. 그림이 준비되면 Figure 로 바꾼다.",
    props: [
      { name: "label", type: "ReactNode", default: '"image"', desc: "가운데 표시할 글자" },
      { name: "dark", type: "boolean", desc: "어두운 빗금" },
      { name: "height", type: "number | string", desc: "" },
    ],
  },
  {
    id: "Figure",
    group: "content",
    frame: "block",
    summary: "그림(또는 영상) + 캡션.",
    props: [
      { name: "src", type: "string", required: true, desc: "public/ 기준 경로" },
      { name: "alt", type: "string", desc: "" },
      { name: "caption", type: "ReactNode", desc: "" },
      { name: "num", type: "ReactNode", desc: '캡션 앞 번호 (예: "Fig. 1")' },
      { name: "fit", type: '"contain" | "cover"', default: '"contain"', desc: "" },
      { name: "video", type: "boolean", desc: "src 를 자동 재생 영상으로" },
    ],
  },

  /* ── 원시 요소 ── */
  {
    id: "Typography",
    name: "AccentBar · Eyebrow · H1–H3 · Lead · Text · Hl · B · Code · Num",
    group: "primitive",
    frame: "block",
    summary: "글자 요소. 크기·색이 템플릿 값으로 고정돼 있어 직접 font-size 를 줄 필요가 없다.",
    props: [
      { name: "AccentBar", type: "{ width?, color? }", default: "width 64", desc: "제목 위 6px 오렌지 막대" },
      { name: "Eyebrow", type: "{ muted? }", desc: "본문이나 도표에 쓰는 작은 라벨" },
      { name: "H1 / H2 / H3", type: "", desc: "104 / 64 / 40 px" },
      { name: "Lead", type: "", desc: "36px light 리드 문단" },
      { name: "Text", type: '{ size?: "md" | "sm", muted?, as? }', desc: "32 / 28 px 본문" },
      { name: "Hl", type: "{ strong? }", desc: "오렌지 강조" },
      { name: "B", type: "", desc: "굵게" },
      { name: "Code", type: "", desc: "인라인 코드" },
      { name: "Num", type: "{ accent? }", desc: "숫자용 Space Grotesk" },
    ],
  },
  {
    id: "Layout",
    name: "Stack · Row · Columns · Spacer · Divider",
    group: "primitive",
    frame: "block",
    summary: "배치 헬퍼. 슬라이드 안에서 div + style 대신 쓴다.",
    props: [
      { name: "Stack / Row", type: "{ gap?, align?, justify?, fill? }", default: "gap 24", desc: "세로 / 가로 flex. fill 은 남은 높이 채우기" },
      { name: "Columns", type: "{ cols?, gap?, align?, fill? }", default: "cols 2, gap 80", desc: 'cols: 숫자(균등) 또는 "1fr 2fr"' },
      { name: "Spacer", type: "", desc: "flex 안에서 남은 공간 밀어내기" },
      { name: "Divider", type: "", desc: "1px 구분선" },
    ],
  },
  {
    id: "SlideHeader",
    group: "primitive",
    frame: "block",
    summary: "ContentSlide 의 헤더만 따로. Slide 로 직접 구성할 때 쓴다.",
    props: [
      { name: "title", type: "ReactNode", required: true, desc: "" },
      { name: "aside", type: "ReactNode", desc: "오른쪽 (기본은 로고)" },
      { name: "logo", type: "boolean", default: "true", desc: "" },
    ],
  },
  {
    id: "Logo",
    group: "primitive",
    frame: "block",
    summary: "VIALab 로고. 표지 300px, 본문 헤더 150px.",
    props: [{ name: "width", type: "number", default: "150", desc: "" }],
  },
];
