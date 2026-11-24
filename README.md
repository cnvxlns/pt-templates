# pt-templates

발표자료 템플릿 모음 + Claude Code 플러그인.
플러그인을 설치하면 "발표자료 만들어줘" 같은 요청에 `make-slides` 스킬이 이 레포의 템플릿으로
덱을 만들고, 넘침 검사 · 스크린샷 · PDF 까지 확인해서 넘겨준다.

## 템플릿

| 폴더 | 용도 |
|---|---|
| [`vialab/`](vialab/) | VIALab 랩 미팅 · 진행 보고 · 내부 세미나 |
| [`PULSE/`](PULSE/) | PULSE 알고리즘 스터디 · 개념 강의 · 문제 풀이 |

각 템플릿은 독립된 React + TypeScript 프로젝트다. 폴더에서 `npm install && npm run dev` 하면
컴포넌트 카탈로그와 덱 목록이 뜬다.

## Claude Code 플러그인으로 설치

Claude Code 안에서:

```
/plugin marketplace add cnvxlns/pt-templates
/plugin install pt-templates@pt-templates
```

셸에서는 `claude plugin marketplace add cnvxlns/pt-templates && claude plugin install pt-templates@pt-templates`.

- 이후 발표자료를 요청하면 스킬이 자동으로 불린다. 직접 부르려면 `/pt-templates:make-slides`.
- 덱은 플러그인 설치본이 아니라 **이 레포의 git 작업 사본**에 만든다. 스킬이 홈 아래에서 찾고,
  없으면 `~/pt-templates` 로 clone 한다. 다른 위치를 쓰려면 환경변수 `PT_TEMPLATES_DIR` 를 지정한다.
- 템플릿이 갱신되면: `claude plugin marketplace update pt-templates` 후 `/reload-plugins`.
  (스킬은 작업 사본을 쓸 때마다 `git pull --ff-only` 로 템플릿을 최신으로 맞춘다.)

## 비공개 덱

이 레포는 공개다. 각 템플릿의 비공개 위치(예: `vialab/src/decks/private/`, `vialab/public/private/`)는
`.gitignore` 로 제외되어 있어서, 내부 발표는 거기에 두면 로컬에만 남는다.

## 템플릿 추가하기

새 폴더 하나 = 템플릿 하나. 스킬은 `*/TEMPLATE.md` 를 찾아 목록을 만들기 때문에 **스킬은 고칠 필요가 없다.**
새 폴더는 아래를 갖춘다.

1. `TEMPLATE.md` — frontmatter 에 `name`, `description`(언제 쓰는 템플릿인지, 톤).
   본문에 덱을 두는 위치, 컴포넌트 문서 위치, 디자인 규칙, 검사 명령.
2. 비공개 덱·그림 폴더를 `.gitignore` 로 제외.
3. 덱 검사 명령 (넘침·잘림 검사, 스크린샷, PDF). `vialab/scripts/check-deck.mjs` 를 가져다 쓰면 된다.

```
pt-templates/
├── .claude-plugin/          plugin.json, marketplace.json
├── skills/make-slides/      SKILL.md — 템플릿 공통 절차
└── <템플릿>/
    ├── TEMPLATE.md          ← 템플릿별 사용법 (스킬이 읽음)
    └── …
```

검증: `claude plugin validate .`
