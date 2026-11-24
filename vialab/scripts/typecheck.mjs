#!/usr/bin/env node
/*
 * 타입체크: 이 레포의 src/ + (DECK_DIR 가 있으면) 그 폴더의 덱.
 *
 * DECK_DIR 폴더에는 node_modules 가 없으므로, 이 레포의 타입을 가리키는 tsconfig.json 을
 * 그 폴더에 만들어 둔다 (매번 다시 씀). 에디터도 이 파일로 @/components 를 찾는다.
 */
import { spawnSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tsc = join(root, "node_modules", ".bin", process.platform === "win32" ? "tsc.cmd" : "tsc");

function run(args) {
  const r = spawnSync(tsc, args, { cwd: root, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run(["--noEmit"]);

if (process.env.DECK_DIR) {
  const deckDir = resolve(process.env.DECK_DIR);
  if (!existsSync(deckDir)) {
    console.error(`DECK_DIR 폴더가 없다: ${deckDir}`);
    process.exit(2);
  }
  const p = (...s) => join(root, ...s).split("\\").join("/");
  const tsconfig = {
    extends: p("tsconfig.json"),
    compilerOptions: {
      typeRoots: [p("node_modules/@types")],
      types: [p("node_modules/vite/client"), "node"],
      paths: {
        "@/*": [p("src/*")],
        react: [p("node_modules/@types/react")],
        "react/*": [p("node_modules/@types/react/*")],
      },
    },
    include: ["*.tsx"],
  };
  writeFileSync(
    join(deckDir, "tsconfig.json"),
    `// pt-templates/${basename(root)} 의 npm run typecheck 가 만든 파일. 고치지 않는다.\n${JSON.stringify(tsconfig, null, 2)}\n`,
  );
  run(["-p", deckDir, "--noEmit"]);
}
