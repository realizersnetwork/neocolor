#!/usr/bin/env bash
# 비공개 사이트(전체 사이트)를 버셀(Vercel)에 올린다 — GitHub Actions(.github/workflows/vercel-private.yml)가 실행한다
#
# - public/ 전체를 버셀 프로젝트 neocolor-private 에 올린다 (_redirects·_headers 는 Cloudflare 전용 설정이라 뺀다)
# - 올리기 전에 항상 'Vercel Authentication · All Deployments'(버셀에 로그인해서 허락받은 사람만 보기)로 맞춘다.
#   이 설정이 확인되지 않으면 올리지 않고 멈춘다 → 전체 사이트가 실수로 공개되는 일이 없게
# - git 정보 없이 임시 폴더에서 올린다. 커밋 작성자(Claude·형님)가 소유자 버셀 계정이 아니라서
#   버셀이 배포를 막는 문제('Git author must have access')를 피하려고
#
# 필요한 것: 환경변수 VERCEL_TOKEN (저장소 Secrets, 소유자 버셀 계정 Account Settings → Tokens 에서 만든 열쇠)
# 시험할 때만: VERCEL_API(가짜 서버 주소), VERCEL_CLI(가짜 명령)
set -euo pipefail

NAME="${VERCEL_PROJECT_NAME:-neocolor-private}"
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
[ "$CODE" = 200 ] || fail "VERCEL_TOKEN 열쇠가 맞지 않습니다 (응답 $CODE). 버셀에서 열쇠를 새로 만들어 GitHub Secrets 의 VERCEL_TOKEN 을 바꿔 주세요."
TEAM="$(jq -r '.user.defaultTeamId // empty' "$RES")"

echo "2) 버셀 프로젝트 $NAME 확인"
api GET "/v9/projects/$NAME"
if [ "$CODE" = 404 ]; then
  echo "   아직 없어서 새로 만듭니다"
  api POST /v11/projects "$(jq -nc --arg n "$NAME" '{name: $n, framework: null}')"
  [ "$CODE" = 200 ] || [ "$CODE" = 201 ] || fail "버셀 프로젝트를 만들지 못했습니다 (응답 $CODE)"
elif [ "$CODE" != 200 ]; then
  fail "버셀 프로젝트를 확인하지 못했습니다 (응답 $CODE)"
fi
PID="$(jq -r '.id // empty' "$RES")"
ORG="$(jq -r '.accountId // empty' "$RES")"
[ -n "$PID" ] && [ -n "$ORG" ] || fail "버셀 프로젝트 번호를 읽지 못했습니다"

echo "3) 비공개 설정: 버셀에 로그인해서 허락받은 사람만 (Vercel Authentication · All Deployments)"
api PATCH "/v9/projects/$PID" '{"ssoProtection":{"deploymentType":"all"}}'
[ "$CODE" = 200 ] || fail "비공개 설정을 하지 못해서 올리지 않았습니다 (응답 $CODE)"
[ "$(jq -r '.ssoProtection.deploymentType // empty' "$RES")" = "all" ] \
  || fail "비공개 설정(All Deployments)이 확인되지 않아서 올리지 않았습니다"

echo "4) 올릴 파일 준비: public/ 전체 (Cloudflare 전용 설정 파일은 뺌)"
SITE="$WORK/site"
cp -a "$ROOT/public" "$SITE"
rm -f "$SITE/_redirects" "$SITE/_headers"
# /privacy 처럼 .html 없는 주소도 열리게
printf '{\n  "cleanUrls": true\n}\n' > "$SITE/vercel.json"

echo "5) 버셀에 올리기"
export VERCEL_ORG_ID="$ORG" VERCEL_PROJECT_ID="$PID" VERCEL_TELEMETRY_DISABLED=1
export GIT_CEILING_DIRECTORIES="$WORK"   # 임시 폴더 밖의 git 저장소를 찾지 않게 (git 정보 없이 올림)
OUT="$WORK/deploy.txt"
# shellcheck disable=SC2086  # CLI 는 일부러 띄어쓰기로 나눈다 (npx --yes vercel@latest)
(cd "$SITE" && $CLI deploy --prod --yes --token "$VERCEL_TOKEN") > "$OUT" || fail "버셀에 올리지 못했습니다"
DEPLOY_URL="$(grep -Eo 'https://[A-Za-z0-9.-]+' "$OUT" | tail -n 1 || true)"
echo "   이번 버전: ${DEPLOY_URL:-(주소를 읽지 못함)}"

echo "6) 비공개 사이트 주소"
api GET "/v9/projects/$PID"
ADDR=""
if [ "$CODE" = 200 ]; then
  ADDR="$(jq -r '([.targets.production.alias[]?] + [.alias[]?.domain?])
    | map(select(type == "string" and endswith(".vercel.app"))) | sort_by(length) | first // empty' "$RES")"
fi
echo "   https://${ADDR:-$NAME.vercel.app} (버셀 프로젝트 화면의 Domains 에서도 볼 수 있음)"
if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  {
    echo "### 비공개 사이트 (Vercel)"
    echo ""
    echo "- 주소: https://${ADDR:-$NAME.vercel.app}"
    echo "- 볼 수 있는 사람: 버셀에 로그인한 소유자 + 접근을 허락받은 사람 (Vercel Authentication · All Deployments)"
    echo "- 이번 버전: ${DEPLOY_URL:-}"
  } >> "$GITHUB_STEP_SUMMARY"
fi
echo "끝"
