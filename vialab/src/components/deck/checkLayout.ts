import { SLIDE_W } from "../tokens";

/**
 * ?check 로 덱을 열면 실행된다 (scripts/check-deck.mjs 가 사용).
 * 모든 슬라이드에서 안전 영역(바깥 여백 안쪽)을 벗어나거나 잘린 요소를 찾아
 * <script type="application/json" id="vl-check"> 에 결과를 적는다.
 * 숨겨진 슬라이드도 레이아웃은 계산되므로 한 번에 전부 검사할 수 있다.
 */

export interface LayoutIssue {
  /** 무엇이 문제인지 */
  kind: "overflow-bottom" | "overflow-right" | "clipped";
  /** 요소 class 와 텍스트 앞부분 */
  element: string;
  /** 안전 영역을 넘은 px (1920×1080 기준) */
  by: number;
}

export interface SlideReport {
  index: number;
  label?: string;
  issues: LayoutIssue[];
}

export interface DeckReport {
  slides: number;
  ok: boolean;
  report: SlideReport[];
}

const TOLERANCE = 2;

function describe(el: Element): string {
  const cls = typeof el.className === "string" && el.className ? `.${el.className.trim().split(/\s+/).join(".")}` : "";
  const text = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 50);
  return `${el.tagName.toLowerCase()}${cls}${text ? ` "${text}"` : ""}`;
}

export function checkLayout(root: ParentNode = document): DeckReport {
  const slides = Array.from(root.querySelectorAll<HTMLElement>(".vl-frame > .vl-slide"));
  const report: SlideReport[] = slides.map((slide, i) => {
    const sr = slide.getBoundingClientRect();
    const k = sr.width / SLIDE_W || 1; // 화면 축소 비율
    const cs = getComputedStyle(slide);
    const padR = parseFloat(cs.paddingRight) * k;
    const padB = parseFloat(cs.paddingBottom) * k;
    const limitR = sr.right - padR;
    const limitB = sr.bottom - padB;

    const issues: LayoutIssue[] = [];
    const flagged = new Set<Element>();

    for (const el of Array.from(slide.querySelectorAll<HTMLElement>("*"))) {
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      // 부모가 이미 걸렸으면 자식은 생략 (가장 바깥 원인만 보고)
      if (el.parentElement && flagged.has(el.parentElement)) {
        flagged.add(el);
        continue;
      }
      // 배경처럼 일부러 꽉 채우는 절대 위치 요소는 제외
      if (getComputedStyle(el).position === "absolute") continue;

      const overB = (r.bottom - limitB) / k;
      const overR = (r.right - limitR) / k;
      if (overB > TOLERANCE) {
        issues.push({ kind: "overflow-bottom", element: describe(el), by: Math.round(overB) });
        flagged.add(el);
      } else if (overR > TOLERANCE) {
        issues.push({ kind: "overflow-right", element: describe(el), by: Math.round(overR) });
        flagged.add(el);
      } else {
        // overflow:hidden 안에서 내용이 잘림 (코드블록 긴 줄 등)
        const ov = getComputedStyle(el).overflowX;
        if ((ov === "hidden" || ov === "clip") && el.scrollWidth - el.clientWidth > TOLERANCE) {
          issues.push({ kind: "clipped", element: describe(el), by: el.scrollWidth - el.clientWidth });
          flagged.add(el);
        }
      }
    }
    return { index: i + 1, label: slide.dataset.label, issues };
  });

  return { slides: slides.length, ok: report.every((s) => s.issues.length === 0), report };
}

/** 결과를 DOM 에 남긴다 (headless Chrome 의 --dump-dom 으로 읽음). */
export async function runCheck(): Promise<void> {
  await document.fonts.ready;
  // 레이아웃이 안정될 때까지 잠깐 기다린다 (headless 에서는 requestAnimationFrame 이 돌지 않을 수 있어 타이머 사용)
  await new Promise((r) => setTimeout(r, 300));
  const result = checkLayout();
  let out = document.getElementById("vl-check");
  if (!out) {
    out = document.createElement("script");
    out.id = "vl-check";
    out.setAttribute("type", "application/json");
    document.body.appendChild(out);
  }
  out.textContent = JSON.stringify(result);
  // 사람이 브라우저에서 ?check 로 열었을 때도 보이게
  console.info("[vl-check]", result);
}
