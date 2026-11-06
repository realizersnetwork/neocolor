#!/usr/bin/env bash
# 전체 사이트를 버셀(Vercel)에 올린다 — GitHub Actions(.github/workflows/vercel.yml)가 실행한다
#
# - 정식 오픈 전에는 두 도메인(neocolor.net·neo-collar.com)에 '준비 중' 화면만 보이므로,
#   전체 사이트(public/ 그대로)는 여기서 버셀 공개 주소에 올려서 본다 (2026-11-07 소유자: "형님도 수정할 수 있는 공개로")
# - main 에 들어온 수정은 누가 했든(소유자·형님) 자동으로 올라간다
# - 로그인 없이 누구나 볼 수 있게(Vercel Authentication 끔) 맞추고, 검색엔진에는 안 나오게 한다(noindex)
# - _redirects·_headers 는 Cloudflare 전용 설정이라 뺀다
# - git 정보 없이 임시 폴더에서 올린다. 커밋 작성자(Claude·형님)가 소유자 버셀 계정이 아니라서
#   버셀 무료 요금제가 배포를 막는 문제('Git author must have access')를 피하려고
#
# 필요한 것: 환경변수 VERCEL_TOKEN (저장소 Secrets, 소유자 버셀 계정 Account Settings → Tokens 에서 만든 열쇠)
# 시험할 때만: VERCEL_API(가짜 서버 주소), VERCEL_CLI(가짜 명령)
set -euo pipefail

NAME="${VERCEL_PROJECT_NAME:-neocolor}"
API="${VERCEL_API:-https://api.vercel.com}"
CLI="${VERCEL_CLI:-npx --yes vercel@latest}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
: "${VERCEL_TOKEN:?VERCEL_TOKEN 열쇠가 없습니다}"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
RES="$WORK/res.json"
TEAM=""
CODE=""

# api 방법 경로 [본문] → 응답 본문은 $RES, 응답 번호는 $CODE
api() {
  local method="$1" url="$API$2" body="${3:-}"
  if [ -n "$TEAM" ]; then
    case "$url" in *\?*) url="$url&teamId=$TEAM" ;; *) url="$url?teamId=$TEAM" ;; esac
  fi
  local args=(-sS -o "$RES" -w '%{http_code}' -X "$method" -H "Authorization: Bearer $VERCEL_TOKEN")
  if [ -n "$body" ]; then args+=(-H "Content-Type: application/json" --data "$body"); fi
  : > "$RES"
  CODE="$(curl "${args[@]}" "$url")" || CODE="000"
}
fail() {
  echo "::error::$1"
  if [ -s "$RES" ]; then head -c 600 "$RES"; echo; fi
  exit 1
}

echo "1) 열쇠 확인"
api GET /v2/user
if [ "$CODE" = 200 ]; then
  TEAM="$(jq -r '.user.defaultTeamId // empty' "$RES")"
else
  # 팀 전용 열쇠(Scope: 팀 → All Projects)는 계정 정보를 못 읽는다. 그때는 버셀이 열쇠의 팀으로 알아서 정한다
  echo "   계정 정보는 못 읽음 (응답 $CODE) → 열쇠에 정해진 팀으로 진행"
fi

echo "2) 버셀 프로젝트 $NAME 확인"
api GET "/v9/projects/$NAME"
if [ "$CODE" = 401 ] || [ "$CODE" = 403 ]; then
  fail "VERCEL_TOKEN 열쇠가 맞지 않거나 권한이 없습니다 (응답 $CODE). 버셀 Account Tokens 에서 Scope 를 본인 팀 → All Projects 로 새로 만들어 GitHub Secrets 의 VERCEL_TOKEN 을 바꿔 주세요."
elif [ "$CODE" = 404 ]; then
  echo "   아직 없어서 새로 만듭니다"
  api POST /v11/projects "$(jq -nc --arg n "$NAME" '{name: $n, framework: null}')"
  [ "$CODE" = 200 ] || [ "$CODE" = 201 ] || fail "버셀 프로젝트를 만들지 못했습니다 (응답 $CODE)"
elif [ "$CODE" != 200 ]; then
  fail "버셀 프로젝트를 확인하지 못했습니다 (응답 $CODE)"
fi
PID="$(jq -r '.id // empty' "$RES")"
ORG="$(jq -r '.accountId // empty' "$RES")"
[ -n "$PID" ] && [ -n "$ORG" ] || fail "버셀 프로젝트 번호를 읽지 못했습니다"

echo "3) 공개 설정: 로그인 없이 누구나 (Vercel Authentication 끄기)"
api PATCH "/v9/projects/$PID" '{"ssoProtection":null}'
if [ "$CODE" != 200 ]; then
  echo "::warning::로그인 없이 보기 설정을 바꾸지 못했습니다 (응답 $CODE). 기본 주소(프로젝트이름.vercel.app)는 그래도 공개로 열립니다"
elif [ "$(jq -r '.ssoProtection // "null"' "$RES")" != "null" ]; then
  echo "::warning::로그인 없이 보기 설정이 확인되지 않았습니다. 기본 주소(프로젝트이름.vercel.app)는 그래도 공개로 열립니다"
fi

echo "4) 올릴 파일 준비: public/ 전체 (Cloudflare 전용 설정 파일은 뺌)"
SITE="$WORK/site"
cp -a "$ROOT/public" "$SITE"
rm -f "$SITE/_redirects" "$SITE/_headers"
# /privacy 처럼 .html 없는 주소도 열리게, 검색엔진에는 안 나오게 (정식 주소는 neocolor.net)
cat > "$SITE/vercel.json" <<'JSON'
{
  "cleanUrls": true,
  "headers": [
    { "source": "/(.*)", "headers": [{ "key": "X-Robots-Tag", "value": "noindex" }] }
  ]
}
JSON

echo "5) 버셀에 올리기"
export VERCEL_ORG_ID="$ORG" VERCEL_PROJECT_ID="$PID" VERCEL_TELEMETRY_DISABLED=1
export GIT_CEILING_DIRECTORIES="$WORK"   # 임시 폴더 밖의 git 저장소를 찾지 않게 (git 정보 없이 올림)
OUT="$WORK/deploy.txt"
# shellcheck disable=SC2086  # CLI 는 일부러 띄어쓰기로 나눈다 (npx --yes vercel@latest)
(cd "$SITE" && $CLI deploy --prod --yes --token "$VERCEL_TOKEN") > "$OUT" || fail "버셀에 올리지 못했습니다"
DEPLOY_URL="$(grep -Eo 'https://[A-Za-z0-9.-]+' "$OUT" | tail -n 1 || true)"
echo "   이번 버전: ${DEPLOY_URL:-(주소를 읽지 못함)}"

echo "6) 주소 정하기: neocollar 가 들어간 가장 단순한 주소 (2026-11-07 소유자)"
# 앞에서부터 쓸 수 있는 것 하나를 붙인다. 이미 붙어 있는 게 있으면 그대로 쓴다
DOMAINS="${VERCEL_DOMAINS:-neocollar.vercel.app neocollar1028.vercel.app}"   # 소유자: "없으면 neocollar1028"
CHOSEN=""
HAVE=""
api GET "/v9/projects/$PID/domains"
if [ "$CODE" = 200 ]; then HAVE="$(jq -r '.domains[]?.name // empty' "$RES")"; fi
for d in $DOMAINS; do
  if printf '%s\n' "$HAVE" | grep -qxF "$d"; then CHOSEN="$d"; echo "   이미 붙어 있음: $d"; break; fi
done
if [ -z "$CHOSEN" ]; then
  for d in $DOMAINS; do
    api POST "/v10/projects/$PID/domains" "$(jq -nc --arg n "$d" '{name: $n}')"
    if [ "$CODE" = 200 ] || [ "$CODE" = 201 ]; then CHOSEN="$d"; echo "   새로 붙임: $d"; break; fi
    echo "   $d 는 쓸 수 없음 (응답 $CODE) → 다음 후보"
  done
fi
[ -n "$CHOSEN" ] || echo "::warning::neocollar 주소를 붙이지 못했습니다. 기본 주소로 열립니다"

echo "7) 사이트 주소"
ADDR="$CHOSEN"
if [ -z "$ADDR" ]; then
  api GET "/v9/projects/$PID"
  if [ "$CODE" = 200 ]; then
    ADDR="$(jq -r '([.targets.production.alias[]?] + [.alias[]?.domain?])
      | map(select(type == "string" and endswith(".vercel.app"))) | sort_by(length) | first // empty' "$RES")"
  fi
fi
echo "   https://${ADDR:-$NAME.vercel.app} (버셀 프로젝트 화면의 Domains 에서도 볼 수 있음)"
if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  {
    echo "### 전체 사이트 (Vercel)"
    echo ""
    echo "- 주소: https://${ADDR:-$NAME.vercel.app}"
    echo "- 로그인 없이 누구나 볼 수 있음 (검색엔진에는 안 나오게 해 둠)"
    echo "- 이번 버전: ${DEPLOY_URL:-}"
  } >> "$GITHUB_STEP_SUMMARY"
fi
echo "끝"
