# NEOCOLOR 프로젝트 메모

## 기본
- 사이트: https://neocolor.net — 빌드 없는 정적 HTML, 한국어 기본
- 사이트 파일은 전부 `public/` 안에 둔다 (배포 폴더)

## 배포
- Cloudflare Pages + GitHub 연동: `main` = 실서비스, 그 외 브랜치 = 미리보기 주소
- 설정값: Build command `exit 0`, Build output directory `public`
- 도메인은 Cloudflare Registrar 등록. 커스텀 도메인을 붙이려면 Pages 프로젝트가 도메인과 같은 Cloudflare 계정에 있어야 한다

## 작업 방식
- 작은 수정은 `main`에 바로 올린다
- 큰 변경은 브랜치에 올려 미리보기 주소를 먼저 보여주고, 확인받은 뒤 `main`에 합친다
- 소유자는 비개발자다. 설명은 짧고 쉬운 한국어로, 단계는 구체적으로

## 현재 상태
- '준비 중(Coming soon)' 첫 화면만 있음. 사이트 내용은 소유자와 정해서 채운다
