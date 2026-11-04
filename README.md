# NEOCOLOR

[neocolor.net](https://neocolor.net) 웹사이트 소스입니다.

## 구조

- `public/` — 실제로 배포되는 사이트 파일 (`index.html`이 첫 화면)

## 배포 (Cloudflare Pages)

| 항목 | 값 |
|---|---|
| Production branch | `main` |
| Build command | `exit 0` |
| Build output directory | `public` |

- `main`에 올리면 자동으로 neocolor.net에 반영됩니다.
- 다른 브랜치에 올리면 미리보기 주소로 따로 배포됩니다.
