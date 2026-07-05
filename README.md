# choo-studio

숲속 오두막 강의동 — 편집장님의 개인 사이트(`choo-studio.uk`).
독자는 **나 한 명**(자기검열 없이 내 맘대로). 서사형 기획서는 [`PROJECT.md`](./PROJECT.md),
작업용 압축 컨텍스트는 [`CLAUDE.md`](./CLAUDE.md) 참조.

## 스택
Astro 7 · React 19(island) · MDX · Tailwind v4 · Rough.js(손그림) · @fontsource/gaegu(손글씨)

## 실행
```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # 정적 산출물 → dist/
npm run preview   # 빌드 결과 미리보기
```

## 공간 = 정보구조 (톤이 흐른다)
```
숲(홈) → 오두막(주제) → 칠판(글 목록) → 공책(글 본문)
초록      나무·아늑        다크·분필         라이트·색연필
```

## 라우트
| URL | 화면 | 파일 |
|---|---|---|
| `/` | 숲 오솔길(손그림 지도) | `src/pages/index.astro` |
| `/[cabin]` | 오두막 도착(나무·램프·고양이 추) | `src/pages/[cabin]/index.astro` |
| `/[cabin]/board` | 칠판 = 글 목록 | `src/pages/[cabin]/board.astro` |
| `/[cabin]/notes/[slug]` | 공책 = 글 본문(MDX) | `src/pages/[cabin]/notes/[slug].astro` |

`[cabin]` = `eyes`(안경·눈) · `math`(수학·물리) · `ai` · `talk`(잡담). URL만 영문, 화면 표기는 전부 한글.

## 구조
```
src/
├─ lib/cabins.ts       오두막 4채 메타(이름·색·소개·ready) ← 오두막 추가는 여기
├─ lib/sketch.ts       Rough.js 손그림 렌더러(빌드타임, seed 고정)
├─ components/Cabin.astro   손그림 오두막(홈 지도용)
├─ content.config.ts   글 스키마(title·cabin·date·hasSim·summary)
├─ content/notes/*.mdx 글 본문 ← 글 추가는 여기
├─ layouts/BaseLayout.astro  html 쉘 + 폰트 로드
├─ pages/              라우트(위 표)
└─ styles/global.css   팔레트·폰트 토큰·공책/시뮬 스타일
```

## 콘텐츠 추가법 (← Cowork 작업)
**새 글** — `src/content/notes/<slug>.mdx` 한 장:
```mdx
---
title: 노안, 왜 팔이 짧아질까
cabin: eyes          # eyes | math | ai | talk
date: 2026-07-10
hasSim: false        # true면 칠판에 노란 분필 + "시뮬 있음"
summary: 한 줄 요약(선택)
---
본문… 시뮬 자리는 아래처럼:
<div class="sim-slot">
  <div class="sim-title">◐ 시뮬 제목</div>
  <div class="sim-note">여기에 React island</div>
</div>
```
→ 해당 오두막 칠판에 자동 등록. 별도 목록 편집 불필요.

**새 오두막** — `src/lib/cabins.ts`에 한 줄 추가하고 홈(`index.astro`)에 `<Cabin … href="/키" />` 배치.

**오두막 열기** — 준비되면 `cabins.ts`의 `ready: true`로. (홈 라벨의 "아직 짓는 중"이 사라짐)

## 손그림 톤 (Rough.js)
`src/lib/sketch.ts`의 `gen`으로 도형을 만들고 `draw()`로 SVG path 문자열을 얻어 `set:html`로 심는다.
**클라이언트 JS 없이 빌드타임 생성** · `seed` 고정 → 새로고침해도 안 흔들림.

## 배포 (예정)
로컬(i5)에서 `npm run build` → `dist/`를 NAS 정적 호스팅 → 기존 cloudflared 터널에 `choo-studio.uk` Public Hostname만 추가.

---

## 현황 (2026-07-03)
**1단계 뼈대 완료** — 4화면 흐름(숲→오두막→칠판→공책)이 실제로 굴러감. 홈은 Rough.js 손그림 적용,
오두막 4채 라우트 생성(`eyes`만 글 1편, 나머지는 "준비중"). 글·시뮬 내용은 Cowork에서 채운다.

**남은 것**: ① 내부 화면(오두막·칠판·공책)에도 손그림 톤 통일(현재 홈만) ② 첫 진짜 시뮬(볼록렌즈 React island) ③ 배포.
