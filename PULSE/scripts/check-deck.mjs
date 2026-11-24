#!/usr/bin/env node
/*
 * 덱 검사: 빌드 → 로컬 미리보기 서버 → headless Chrome 으로 모든 슬라이드의 넘침·잘림 검사.
 *
 *   npm run check -- <slug>                      검사만
 *   npm run check -- <slug> --shots [dir]        슬라이드별 PNG (기본 .deck-check/<slug>/)
 *   npm run check -- <slug> --pdf [file]         한 장당 한 페이지 PDF (기본 .deck-check/<slug>.pdf)
 *   npm run check -- <slug> --no-build           이미 빌드한 dist/ 를 그대로 사용
 *
 * Chrome 위치는 CHROME_PATH 로 지정할 수 있다. 문제가 있으면 exit code 1.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import net from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
if (!slug) {
  console.error("사용법: npm run check -- <slug> [--shots [dir]] [--pdf [file]] [--no-build]");
  process.exit(2);
}
const optValue = (flag, fallback) => {
  const i = args.indexOf(flag);
  if (i < 0) return undefined;
  const next = args[i + 1];
  return next && !next.startsWith("--") && next !== slug ? next : fallback;
};
const shotsDir = optValue("--shots", join(root, ".deck-check", slug));
const pdfFile = optValue("--pdf", join(root, ".deck-check", `${slug}.pdf`));
const noBuild = args.includes("--no-build");

/* ── Chrome ── */
function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = [
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ];
  for (const c of candidates) {
    if (c.startsWith("/")) {
      if (existsSync(c)) return c;
    } else if (spawnSync("which", [c]).status === 0) {
      return c;
    }
  }
  return null;
}
const chromeBin = findChrome();
if (!chromeBin) {
  console.error("Chrome/Chromium 을 찾지 못했다. CHROME_PATH 로 경로를 지정한다.");
  process.exit(2);
}
const profile = mkdtempSync(join(tmpdir(), "vl-check-"));
function chrome(extra, url) {
  const r = spawnSync(
    chromeBin,
    [
      "--headless=new",
      `--user-data-dir=${profile}`,
      "--hide-scrollbars",
      "--window-size=1920,1080",
      "--virtual-time-budget=5000",
      ...extra,
      url,
    ],
    { encoding: "utf8", maxBuffer: 256 * 1024 * 1024, timeout: 120_000 },
  );
  if (r.error) throw r.error;
  return r.stdout;
}

/* ── 서버 ── */
const freePort = () =>
  new Promise((ok, fail) => {
    const s = net.createServer();
    s.once("error", fail);
    s.listen(0, "127.0.0.1", () => {
      const { port } = s.address();
      s.close(() => ok(port));
    });
  });
const viteBin = join(root, "node_modules", ".bin", process.platform === "win32" ? "vite.cmd" : "vite");
if (!existsSync(viteBin)) {
  console.error("node_modules 가 없다. 먼저 npm install 한다.");
  process.exit(2);
}

let server;
const cleanup = () => {
  server?.kill();
  rmSync(profile, { recursive: true, force: true });
};
process.on("exit", cleanup);
process.on("SIGINT", () => process.exit(130));

async function main() {
  if (!noBuild) {
    const b = spawnSync(viteBin, ["build", "--logLevel", "warn"], { cwd: root, stdio: "inherit" });
    if (b.status !== 0) process.exit(b.status ?? 1);
  }
  const port = await freePort();
  server = spawn(viteBin, ["preview", "--port", String(port), "--strictPort", "--host", "127.0.0.1"], {
    cwd: root,
    stdio: "ignore",
  });
  const base = `http://127.0.0.1:${port}`;
  for (let t = 0; ; t++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {
      /* 아직 안 뜸 */
    }
    if (t > 100) throw new Error("미리보기 서버가 뜨지 않았다");
    await new Promise((r) => setTimeout(r, 200));
  }

  /* 검사 */
  const dom = chrome(["--dump-dom"], `${base}/?deck=${encodeURIComponent(slug)}&check&capture#/1`);
  const m = dom.match(/<script[^>]*\bid="vl-check"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) {
    console.error(`덱 '${slug}' 을 찾지 못했다. src/decks/registry.ts 또는 src/decks/private/ 를 확인한다.`);
    process.exit(2);
  }
  const result = JSON.parse(m[1]);
  console.log(`\n${slug}: ${result.slides}장`);
  for (const s of result.report) {
    if (!s.issues.length) continue;
    console.log(`  ${String(s.index).padStart(2, "0")} ${s.label ?? ""}`);
    for (const i of s.issues) console.log(`     - ${i.kind} ${i.by}px  ${i.element}`);
  }
  console.log(result.ok ? "  넘침·잘림 없음" : "  ↑ 위 슬라이드를 고친다 (by = 안전 영역을 넘은 px, 1920×1080 기준)");

  /* 스크린샷 */
  if (shotsDir) {
    mkdirSync(shotsDir, { recursive: true });
    for (let i = 1; i <= result.slides; i++) {
      const file = join(shotsDir, `${String(i).padStart(2, "0")}.png`);
      chrome([`--screenshot=${file}`], `${base}/?deck=${encodeURIComponent(slug)}&capture#/${i}`);
    }
    console.log(`  스크린샷: ${shotsDir}/01.png … ${String(result.slides).padStart(2, "0")}.png`);
  }

  /* PDF */
  if (pdfFile) {
    mkdirSync(dirname(pdfFile), { recursive: true });
    chrome([`--print-to-pdf=${pdfFile}`, "--no-pdf-header-footer"], `${base}/?deck=${encodeURIComponent(slug)}&capture#/1`);
    console.log(`  PDF: ${pdfFile}`);
  }

  process.exit(result.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
