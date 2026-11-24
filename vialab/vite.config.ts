import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

/*
 * DECK_DIR: 이 레포 밖에 있는 덱 폴더 (*.tsx). 지정하면 그 폴더의 덱만 목록에 뜨고,
 * 빌드 결과는 <DECK_DIR>/dist 에 나온다. 없으면 src/decks/private/ 를 쓴다.
 *   DECK_DIR=~/발표자료/foo/deck npm run dev
 */
const deckDir = process.env.DECK_DIR ? resolve(process.env.DECK_DIR) : undefined;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(root, "src"),
      "@decks": deckDir ?? resolve(root, "src/decks/private"),
    },
    // 레포 밖 덱 파일도 react 를 이 레포의 node_modules 에서 가져오게 한다 (인스턴스 하나).
    dedupe: ["react", "react-dom"],
  },
  server: {
    fs: { allow: deckDir ? [root, deckDir] : [root] },
  },
  build: {
    outDir: deckDir ? resolve(deckDir, "dist") : "dist",
    emptyOutDir: true,
  },
});
