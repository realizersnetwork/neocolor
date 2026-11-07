# NEO-COLLAR

[neocolor.net](https://neocolor.net) 웹사이트 소스입니다. 현장(건축 공종별) 사람들이 배우고 · 묻고 · 일하고 · 가르치는 플랫폼으로, 지금은 정식 오픈 전이라 강의는 모두 '오픈 예정'으로 보입니다. 한국어 · English · 日本語를 지원합니다.

## 구조

- `public/` — 실제로 배포되는 사이트 파일
  - `index.html` — 화면 뼈대 (홈, 강의, 로드맵, 커뮤니티, 인력사무소, 수강권, 베테랑 스튜디오, 광고 안내, 방문자 통계)
  - `assets/i18n.js` — **화면 문구** (한국어·영어·일본어). 문구를 고칠 때는 세 언어를 같이 고칩니다
  - `assets/data.js` — **공종 카테고리, 강의, 로드맵, 현장 용어, 예시 공고, 수강권 가격**. 내용을 추가·수정할 때는 이 파일만 고치면 됩니다
  - `assets/app.js` — 메뉴, 필터, 검색, 언어 전환, 학생/베테랑 모드, 방문자 집계 동작
  - `assets/style.css` — 디자인
  - `media/` — 메인 동영상(`hero.mp4`), 첫 화면 이미지(`hero-poster.jpg`), 옥상 사진(`rooftop.*`)
  - `_headers` — 브라우저가 예전 파일을 붙잡고 있지 않게 하는 설정

## 배포 (Cloudflare Pages)

| 항목 | 값 |
|---|---|
| Production branch | `main` |
| Build command | `exit 0` |
| Build output directory | `public` |

- `main`에 올리면 자동으로 neocolor.net에 반영됩니다.
- 다른 브랜치에 올리면 미리보기 주소로 따로 배포됩니다.
- Cloudflare Pages는 파일 하나당 25MB까지라, 동영상은 압축해서 넣습니다.
- 방문자 통계는 별도 설정 없이 무료 카운터(Abacus)를 씁니다. 자세한 규칙은 `CLAUDE.md`에 있습니다.
