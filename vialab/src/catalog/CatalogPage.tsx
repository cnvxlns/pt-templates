import { useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { Slide, SLIDE_W, size as typeScale } from "@/components";
import { decks } from "@/decks/registry";
import { DOCS, GROUPS, type ComponentDoc } from "./docs";
import "./catalog.css";

/* examples/*.tsx 를 컴포넌트와 원문(코드 표시용) 두 가지로 불러온다. */
const exampleModules = import.meta.glob<{ default: ComponentType }>("./examples/*.tsx", { eager: true });
const exampleSources = import.meta.glob<string>("./examples/*.tsx", { eager: true, query: "?raw", import: "default" });

function exampleOf(id: string) {
  const key = `./examples/${id}.tsx`;
  return { Component: exampleModules[key]?.default, code: toSnippet(exampleSources[key] ?? "") };
}

/** 예제 파일에서 import 줄과 return ( … ) 안쪽만 뽑아 보여준다. */
function toSnippet(raw: string): string {
  const imp = raw.match(/^import .*$/m)?.[0] ?? "";
  const body = raw.match(/return \(\n([\s\S]*?)\n {2}\);\n\}/)?.[1];
  if (!body) return raw;
  return `${imp}\n\n${body
    .split("\n")
    .map((l) => l.replace(/^ {4}/, ""))
    .join("\n")}`;
}

/* ───────────────────────── 페이지 ───────────────────────── */

export function CatalogPage() {
  // 첫 로드 때는 React 가 그리기 전에 브라우저가 #앵커를 찾으므로, 그린 뒤 다시 스크롤한다.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <div className="cat">
      <Nav />
      <main className="cat-main">
        <header className="cat-hero" id="top">
          <div className="cat-bar" />
          <h1>VIALab 발표 컴포넌트</h1>
          <p>
            VIALab 템플릿 디자인을 그대로 옮긴 React 컴포넌트 모음. 모든 컴포넌트는{" "}
            <code>import {"{ … }"} from &quot;@/components&quot;</code> 한 줄로 가져온다. 미리보기는 실제 1920×1080 슬라이드를 축소한 것이다.
          </p>
        </header>

        <DeckList />
        <QuickStart />
        <Overview />
        <Tokens />

        {GROUPS.map((g) => (
          <section key={g.id} className="cat-group" id={`group-${g.id}`}>
            <h2 className="cat-group__title">{g.title}</h2>
            <p className="cat-group__hint">{g.hint}</p>
            {DOCS.filter((d) => d.group === g.id).map((d) => (
              <ComponentSection key={d.id} doc={d} />
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}

/* ── 왼쪽 목차 ── */

function Nav() {
  return (
    <nav className="cat-nav" aria-label="목차">
      <a href="#top" className="cat-nav__logo">
        <img src="/vialab-logo.png" alt="VIALab" width={132} />
      </a>
      <div className="cat-nav__block">
        <a href="#decks">덱 목록</a>
        <a href="#start">새 발표 만들기</a>
        <a href="#overview">한눈에 보기</a>
        <a href="#tokens">색 · 글자 크기</a>
      </div>
      {GROUPS.map((g) => (
        <div key={g.id} className="cat-nav__block">
          <span className="cat-nav__head">{g.title}</span>
          {DOCS.filter((d) => d.group === g.id).map((d) => (
            <a key={d.id} href={`#${d.id}`}>
              {d.name ?? d.id}
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
}

/* ── 덱 목록 ── */

function DeckList() {
  return (
    <section className="cat-section" id="decks">
      <h2>덱 목록</h2>
      <ul className="cat-decks">
        {decks.map((d) => (
          <li key={d.slug}>
            <a href={`?deck=${encodeURIComponent(d.slug)}#/1`}>
              <span className="cat-decks__date">{d.date ?? "—"}</span>
              <span className="cat-decks__title">{d.title}</span>
              <span className="cat-decks__desc">{d.description}</span>
              <span className="cat-decks__go">열기 →</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── 사용법 ── */

const KEYS: [string, string][] = [
  ["→ ↓ Space PageDown", "다음"],
  ["← ↑ PageUp", "이전"],
  ["Home / End · R", "처음 / 끝 · 처음으로"],
  ["G 또는 Esc", "전체 보기 (그리드)"],
  ["N", "발표자 노트"],
  ["F", "전체 화면"],
  ["Ctrl/Cmd + P", "한 장당 한 페이지 PDF"],
];

const NEW_DECK = `// 1. src/decks/template.tsx 를 src/decks/my-talk.tsx 로 복사해서 고친다
import { DeckStage, CoverSlide, ContentSlide, BulletList } from "@/components";

export default function MyTalk() {
  return (
    <DeckStage title="발표 제목">
      <CoverSlide label="표지" title="발표 제목" presenter="이름 · 과정" date="2026.12.01" />
      <ContentSlide label="요약" title="한 줄 요약" notes="발표자 노트">
        <BulletList items={["요점 하나", "요점 둘"]} />
      </ContentSlide>
    </DeckStage>
  );
}

// 2. src/decks/registry.ts 의 decks 배열에 등록
{ slug: "my-talk", title: "발표 제목", date: "2026.12.01", Deck: MyTalk },

// 3. 주소: ?deck=my-talk   그림: public/decks/my-talk/ 에 두고 "/decks/my-talk/a.png"`;

function QuickStart() {
  return (
    <section className="cat-section" id="start">
      <h2>새 발표 만들기</h2>
      <div className="cat-two">
        <CodeView code={NEW_DECK} />
        <div>
          <h3 className="cat-sub">발표 중 조작</h3>
          <table className="cat-table">
            <tbody>
              {KEYS.map(([k, v]) => (
                <tr key={k}>
                  <td>
                    <kbd>{k}</kbd>
                  </td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="cat-note">
            주소 끝 <code>#/5</code> 는 5번째 슬라이드. 모든 슬라이드 컴포넌트는 <code>label</code>·<code>notes</code> 를 받는다.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── 한눈에 보기 ── */

function Overview() {
  return (
    <section className="cat-section" id="overview">
      <h2>한눈에 보기</h2>
      <div className="cat-overview">
        {GROUPS.map((g) => (
          <div key={g.id}>
            <h3 className="cat-sub">{g.title}</h3>
            <table className="cat-table cat-table--overview">
              <tbody>
                {DOCS.filter((d) => d.group === g.id).map((d) => (
                  <tr key={d.id}>
                    <td>
                      <a href={`#${d.id}`}>{d.name ?? d.id}</a>
                    </td>
                    <td>{d.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── 디자인 토큰 ── */

const COLORS: [string, string][] = [
  ["--vl-orange", "유일한 강조색"],
  ["--vl-orange-dark", "진한 오렌지 · 링크 hover"],
  ["--vl-orange-ink", "오렌지 배경 위 보조 글자"],
  ["--vl-orange-tint", "Callout 면"],
  ["--vl-ink", "글자 · 어두운 배경"],
  ["--vl-body", "리드 문단"],
  ["--vl-subtle", "표 머리 · 보조 설명"],
  ["--vl-muted", "부제 · 날짜"],
  ["--vl-track", "진행 전 타임라인"],
  ["--vl-line", "구분선"],
  ["--vl-paper", "옅은 면 · 빗금"],
  ["--vl-white", "배경"],
  ["--vl-pass", "Badge pass"],
  ["--vl-fail", "Badge fail"],
];

const TYPE_LABEL: Record<keyof typeof typeScale, string> = {
  cover: "표지 제목 (H1)",
  section: "섹션 제목",
  sectionNumber: "섹션 번호",
  statement: "핵심 문장",
  title: "슬라이드 제목 (H2)",
  body: "글머리 본문",
  bodySm: "타임라인 제목",
  lead: "리드 문단",
  label: "수치 라벨",
  caption: "캡션 · 표 머리",
  stat: "큰 수치",
};

function Tokens() {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    setValues(Object.fromEntries(COLORS.map(([v]) => [v, cs.getPropertyValue(v).trim()])));
  }, []);
  return (
    <section className="cat-section" id="tokens">
      <h2>색 · 글자 크기</h2>
      <p className="cat-note">
        값은 <code>src/styles/tokens.css</code> (CSS 변수) 와 <code>src/components/tokens.ts</code> (TS) 에 있다. 강조색은 오렌지 하나뿐이다.
      </p>
      <div className="cat-swatches">
        {COLORS.map(([v, desc]) => (
          <div key={v} className="cat-swatch">
            <div className="cat-swatch__chip" style={{ background: `var(${v})` }} />
            <code>{v}</code>
            <span className="cat-swatch__hex">{values[v]}</span>
            <span className="cat-swatch__desc">{desc}</span>
          </div>
        ))}
      </div>
      <h3 className="cat-sub">글자 크기 (1920×1080 기준 px)</h3>
      <table className="cat-table">
        <tbody>
          {(Object.keys(typeScale) as (keyof typeof typeScale)[])
            .sort((a, b) => typeScale[b] - typeScale[a])
            .map((k) => (
              <tr key={k}>
                <td className="cat-num">{typeScale[k]}</td>
                <td>
                  <code>size.{k}</code>
                </td>
                <td>{TYPE_LABEL[k]}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <p className="cat-note">
        서체: 한글 <b>IBM Plex Sans KR</b> (300–700), 숫자·영문 라벨 <b style={{ fontFamily: "var(--vl-font-display)" }}>Space Grotesk</b>.
        바깥 여백 100 / 110 / 80 px.
      </p>
    </section>
  );
}

/* ── 컴포넌트 한 개 ── */

function ComponentSection({ doc }: { doc: ComponentDoc }) {
  const { Component, code } = exampleOf(doc.id);
  return (
    <article className="cat-comp" id={doc.id}>
      <header className="cat-comp__head">
        <h3>{doc.name ?? doc.id}</h3>
        <p>{doc.summary}</p>
      </header>
      {Component && (
        <Preview frame={doc.frame}>
          <Component />
        </Preview>
      )}
      <div className="cat-two">
        <CodeView code={code} />
        <PropsTable doc={doc} />
      </div>
    </article>
  );
}

function PropsTable({ doc }: { doc: ComponentDoc }) {
  return (
    <table className="cat-table cat-table--props">
      <thead>
        <tr>
          <th>prop</th>
          <th>타입 · 기본값</th>
          <th>설명</th>
        </tr>
      </thead>
      <tbody>
        {doc.props.map((p) => (
          <tr key={p.name}>
            <td>
              <code>{p.name}</code>
              {p.required && <span className="cat-req">필수</span>}
            </td>
            <td>
              {p.type && <code className="cat-type">{p.type}</code>}
              {p.default && <span className="cat-default">= {p.default}</span>}
            </td>
            <td>{p.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** 1920px 슬라이드를 칸 너비에 맞춰 축소해 보여준다. block 은 내용 높이만큼만. */
function Preview({ frame, children }: { frame: ComponentDoc["frame"]; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const measure = () => {
      const s = o.clientWidth / SLIDE_W;
      setScale(s);
      setHeight(i.offsetHeight * s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className={`cat-preview cat-preview--${frame}`} style={frame === "block" ? { height } : undefined}>
      <div ref={inner} className="cat-preview__inner" style={{ transform: `scale(${scale})`, height: frame === "slide" ? 1080 : undefined }}>
        {frame === "slide" ? (
          children
        ) : (
          <Slide style={{ position: "relative", height: "auto", padding: "72px 110px" }}>{children}</Slide>
        )}
      </div>
    </div>
  );
}

function CodeView({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* 클립보드 권한이 없으면 무시 */
    }
  };
  return (
    <div className="cat-code">
      <button type="button" onClick={copy}>
        {copied ? "복사됨" : "복사"}
      </button>
      <pre>{code}</pre>
    </div>
  );
}
