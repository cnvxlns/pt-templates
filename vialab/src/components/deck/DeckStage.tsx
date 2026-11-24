import {
  Children,
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { SLIDE_H, SLIDE_W } from "../tokens";
import type { SlideMeta } from "./Slide";
import { runCheck } from "./checkLayout";

/** Fragment 를 풀어서 슬라이드 요소 목록으로 만든다. */
function flattenSlides(children: ReactNode): ReactElement<SlideMeta>[] {
  const out: ReactElement<SlideMeta>[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === Fragment) {
      out.push(...flattenSlides((child.props as { children?: ReactNode }).children));
    } else {
      out.push(child as ReactElement<SlideMeta>);
    }
  });
  return out;
}

function readHash(total: number): number {
  if (typeof window === "undefined") return 0;
  const n = parseInt(window.location.hash.replace(/^#\/?/, ""), 10);
  return Number.isFinite(n) && n >= 1 && n <= total ? n - 1 : 0;
}

export interface DeckStageProps {
  /** 브라우저 탭 제목 */
  title?: string;
  children: ReactNode;
}

/**
 * 슬라이드 묶음을 1920×1080 캔버스로 띄우는 발표 셸.
 *
 * 키 조작
 *   → ↓ Space PageDown : 다음      ← ↑ PageUp : 이전
 *   Home / End          : 처음 / 끝  R : 처음으로
 *   N : 발표자 노트       G 또는 Esc : 전체 보기(그리드)
 *   F : 전체 화면         Ctrl/Cmd+P : 한 장당 한 페이지 PDF
 * 주소의 #/5 는 5번째 슬라이드를 가리킨다 (새로고침해도 유지).
 */
export function DeckStage({ title, children }: DeckStageProps) {
  const slides = useMemo(() => flattenSlides(children), [children]);
  const total = slides.length;

  // 첫 값을 주소 해시에서 바로 읽는다. (effect 에서 읽으면 dev StrictMode 의 이중 실행 때
  // 아래 동기화 effect 가 먼저 #/1 로 덮어써서 항상 첫 장이 열린다.)
  const [index, setIndex] = useState(() => readHash(total));
  const [scale, setScale] = useState(1);
  const [hud, setHud] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [overview, setOverview] = useState(false);
  // ?capture : 스크린샷·PDF 용. 하단 컨트롤을 그리지 않는다.
  const [capture] = useState(() => new URLSearchParams(window.location.search).has("capture"));
  const hudTimer = useRef<number | undefined>(undefined);

  const go = useCallback(
    (next: number) => setIndex(Math.max(0, Math.min(total - 1, next))),
    [total],
  );

  // 주소 해시 ↔ 현재 슬라이드
  useEffect(() => {
    const onHash = () => setIndex(readHash(total));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [total]);
  useEffect(() => {
    const want = `#/${index + 1}`;
    if (window.location.hash !== want) history.replaceState(null, "", want);
  }, [index]);

  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  // ?check : 모든 슬라이드의 넘침·잘림을 검사해 결과를 DOM 에 남긴다 (scripts/check-deck.mjs)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("check")) void runCheck();
  }, []);

  // 화면에 맞춰 축소/확대 (레터박스)
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / SLIDE_W, window.innerHeight / SLIDE_H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // 하단 컨트롤: 마우스를 움직이면 보이고 2초 뒤 사라진다
  const pokeHud = useCallback(() => {
    setHud(true);
    window.clearTimeout(hudTimer.current);
    hudTimer.current = window.setTimeout(() => setHud(false), 2000);
  }, []);
  useEffect(() => {
    pokeHud();
    window.addEventListener("mousemove", pokeHud);
    return () => {
      window.removeEventListener("mousemove", pokeHud);
      window.clearTimeout(hudTimer.current);
    };
  }, [pokeHud]);

  // 키보드
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          if (overview) return;
          e.preventDefault();
          go(index + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          if (overview) return;
          e.preventDefault();
          go(index - 1);
          break;
        case "Home":
          go(0);
          break;
        case "End":
          go(total - 1);
          break;
        case "r":
        case "R":
          go(0);
          setOverview(false);
          break;
        case "n":
        case "N":
          setNotesOpen((v) => !v);
          break;
        case "g":
        case "G":
          setOverview((v) => !v);
          break;
        case "Escape":
          setOverview((v) => !v);
          break;
        case "f":
        case "F":
          if (document.fullscreenElement) void document.exitFullscreen();
          else void document.documentElement.requestFullscreen?.();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, total, overview]);

  // 터치: 화면 왼쪽/오른쪽 절반을 탭하면 이전/다음 (링크·버튼은 제외)
  const onStageClick = (e: React.MouseEvent) => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if ((e.target as HTMLElement).closest("a,button,input,select,textarea,video,[data-no-tap]")) return;
    go(e.clientX < window.innerWidth / 2 ? index - 1 : index + 1);
  };

  const current = slides[index];
  const label = current?.props.label ?? "";
  const notes = current?.props.notes;

  return (
    <div className="vl-stage" onClick={onStageClick}>
      <div
        className="vl-canvas"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        aria-roledescription="slide deck"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="vl-frame"
            data-active={i === index}
            aria-hidden={i !== index}
            aria-label={`${i + 1} / ${total}${slide.props.label ? ` · ${slide.props.label}` : ""}`}
          >
            {slide}
          </div>
        ))}
      </div>

      {notesOpen && (
        <aside className="vl-notes" aria-label="발표자 노트">
          <div className="vl-notes__head">
            <span>
              notes · {String(index + 1).padStart(2, "0")} {label}
            </span>
            <span>N 으로 닫기</span>
          </div>
          {notes ? notes : <span className="vl-notes__empty">이 슬라이드에는 노트가 없다.</span>}
        </aside>
      )}

      {!capture && (
      <nav className="vl-hud" data-visible={hud} aria-label="슬라이드 이동">
        <button type="button" onClick={() => go(index - 1)} aria-label="이전 슬라이드">
          ←
        </button>
        <span className="vl-hud__count">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button type="button" onClick={() => go(index + 1)} aria-label="다음 슬라이드">
          →
        </button>
        {label && <span className="vl-hud__label">{label}</span>}
        <button type="button" onClick={() => setOverview(true)} title="전체 보기 (G)">
          ▦
        </button>
        <button type="button" onClick={() => setNotesOpen((v) => !v)} title="발표자 노트 (N)">
          N
        </button>
      </nav>
      )}

      {overview && (
        <Overview
          slides={slides}
          current={index}
          onPick={(i) => {
            go(i);
            setOverview(false);
          }}
        />
      )}
    </div>
  );
}

function Overview({
  slides,
  current,
  onPick,
}: {
  slides: ReactElement<SlideMeta>[];
  current: number;
  onPick: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [thumbScale, setThumbScale] = useState(0.18);

  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>(".vl-thumb__view");
    if (!el) return;
    const measure = () => setThumbScale(el.clientWidth / SLIDE_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ref.current?.querySelector<HTMLElement>('[data-current="true"]')?.focus();
    return () => ro.disconnect();
  }, []);

  return (
    <div className="vl-overview" ref={ref} role="dialog" aria-label="전체 슬라이드">
      {slides.map((slide, i) => (
        <button
          key={i}
          type="button"
          className="vl-thumb"
          data-current={i === current}
          onClick={() => onPick(i)}
        >
          <div className="vl-thumb__view">
            <div className="vl-thumb__inner" style={{ transform: `scale(${thumbScale})` }} aria-hidden>
              {slide}
            </div>
          </div>
          <div className="vl-thumb__cap">
            <b>{String(i + 1).padStart(2, "0")}</b>
            <span>{slide.props.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
