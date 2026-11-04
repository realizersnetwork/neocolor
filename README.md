# NEOCOLOR

[neocolor.net](https://neocolor.net) 웹사이트 소스입니다. 현장 실무(건축 공종별) 강의 플랫폼으로, 지금은 정식 오픈 전이라 강의는 모두 '오픈 예정'으로 보입니다.

## 구조

- `public/` — 실제로 배포되는 사이트 파일
  - `index.html` — 메인 화면 (동영상·사진 메인 비주얼, 공종 메뉴, 강의 목록)
  - `assets/data.js` — **공종 카테고리와 강의 목록**. 강의를 추가·수정할 때는 이 파일만 고치면 됩니다
  - `assets/app.js` — 메뉴, 필터, 검색 동작
  - `assets/style.css` — 디자인
  - `media/` — 메인 동영상(`hero.mp4`), 첫 화면 이미지(`hero-poster.jpg`), 옥상 사진(`rooftop.*`)

## 배포 (Cloudflare Pages)

| 항목 | 값 |
|---|---|
| Production branch | `main` |
| Build command | `exit 0` |
| Build output directory | `public` |

- `main`에 올리면 자동으로 neocolor.net에 반영됩니다.
- 다른 브랜치에 올리면 미리보기 주소로 따로 배포됩니다.
- Cloudflare Pages는 파일 하나당 25MB까지라, 동영상은 압축해서 넣습니다.
