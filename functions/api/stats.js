/**
 * NEOCOLOR 방문자 통계 (Cloudflare Pages Functions + D1)
 *
 *   POST /api/stats  방문 1건 기록. 같은 IP는 한 번만 센다 (오늘 방문자도 하루에 한 번만)
 *   GET  /api/stats  나라별 누적 방문자, 오늘 방문자, 최근 14일 방문자
 *
 * 준비 (Cloudflare 대시보드, 한 번만):
 *   1) D1 데이터베이스를 하나 만든다 (예: neocolor-stats)
 *   2) Pages 프로젝트 neocolor → Settings → Bindings 에서 D1 을 변수 이름 DB 로 연결한다
 *   3) 다시 배포하면 끝. 표는 처음 호출될 때 자동으로 만들어진다
 *   (선택) 환경 변수 STATS_KEY 를 넣으면 통계 보기에 그 비밀번호가 필요해진다
 *
 * 개인정보: IP 주소 원문은 저장하지 않는다. 무작위 소금(salt)을 섞은 SHA-256 해시만 저장해서
 *          "전에 왔던 IP인지"만 확인한다. IPv6 는 주소가 자주 바뀌므로 앞 64비트(네트워크)로 묶는다.
 * 나라: Cloudflare 가 접속 위치로 추정한 값(request.cf.country). XX = 알 수 없음, T1 = Tor
 * 날짜: 한국 시간(UTC+9) 기준
 */

const HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: HEADERS });
const noContent = () => new Response(null, { status: 204, headers: { "cache-control": "no-store" } });

// 사람이 아닌 방문(검색 로봇, 감시 도구, 자동 스크립트)은 세지 않는다
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|pingdom|uptime|monitor|facebookexternalhit|curl|wget|python|go-http|java\/|okhttp|axios|node-fetch/i;

let ready = null; // 같은 작업자(isolate) 안에서는 표 만들기를 한 번만
let salt = null;

const kstDay = (offsetDays = 0) => new Date(Date.now() + 9 * 3600e3 + offsetDays * 864e5).toISOString().slice(0, 10);
const hex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");

function randomHex(bytes) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return hex(a.buffer);
}

function ensure(db) {
  if (!ready) {
    ready = db
      .batch([
        db.prepare("CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT NOT NULL)"),
        db.prepare("CREATE TABLE IF NOT EXISTS visitors (h TEXT PRIMARY KEY, country TEXT NOT NULL, first_day TEXT NOT NULL)"),
        db.prepare("CREATE TABLE IF NOT EXISTS seen_day (day TEXT NOT NULL, h TEXT NOT NULL, PRIMARY KEY (day, h))"),
        db.prepare("CREATE TABLE IF NOT EXISTS by_country (country TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0)"),
        db.prepare("CREATE TABLE IF NOT EXISTS by_day (day TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0)"),
        db.prepare("INSERT OR IGNORE INTO meta (k, v) VALUES ('salt', ?)").bind(randomHex(32))
      ])
      .catch((err) => {
        ready = null;
        throw err;
      });
  }
  return ready;
}

async function getSalt(db) {
  if (!salt) {
    const row = await db.prepare("SELECT v FROM meta WHERE k = 'salt'").first();
    salt = row && row.v;
  }
  return salt;
}

// IPv4 는 그대로, IPv6 는 앞 64비트만 (같은 집·같은 휴대폰이 주소를 바꿔도 한 번만 세도록)
function ipKey(ip) {
  if (!ip.includes(":")) return ip;
  const [head, tail = ""] = ip.split("::");
  const h = head ? head.split(":") : [];
  const t = tail ? tail.split(":") : [];
  const groups = ip.includes("::") ? [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill("0"), ...t] : h;
  return groups.slice(0, 4).map((g) => (parseInt(g, 16) || 0).toString(16)).join(":") + "::/64";
}

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  if (!db) return json({ ok: false, reason: "not_configured" }, 503);
  const ua = request.headers.get("user-agent") || "";
  const ip = request.headers.get("cf-connecting-ip") || "";
  if (!ua || BOT_RE.test(ua) || !ip) return noContent();
  const country = String((request.cf && request.cf.country) || "XX").toUpperCase().slice(0, 2);
  try {
    await ensure(db);
    const s = await getSalt(db);
    const h = hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${s}|${ipKey(ip)}`))).slice(0, 32);
    const day = kstDay();
    const [first, todayFirst] = await db.batch([
      db.prepare("INSERT OR IGNORE INTO visitors (h, country, first_day) VALUES (?, ?, ?)").bind(h, country, day),
      db.prepare("INSERT OR IGNORE INTO seen_day (day, h) VALUES (?, ?)").bind(day, h)
    ]);
    const ops = [];
    if (first.meta.changes > 0) {
      ops.push(db.prepare("INSERT INTO by_country (country, n) VALUES (?, 1) ON CONFLICT (country) DO UPDATE SET n = n + 1").bind(country));
    }
    if (todayFirst.meta.changes > 0) {
      ops.push(db.prepare("INSERT INTO by_day (day, n) VALUES (?, 1) ON CONFLICT (day) DO UPDATE SET n = n + 1").bind(day));
      // 지난날의 중복 확인 기록은 필요 없으니 가끔 지운다
      if (Math.random() < 0.05) ops.push(db.prepare("DELETE FROM seen_day WHERE day < ?").bind(day));
    }
    if (ops.length) await db.batch(ops);
    return noContent();
  } catch (err) {
    return json({ ok: false, reason: "error" }, 500);
  }
}

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  if (!db) return json({ ok: false, reason: "not_configured" }, 503);
  if (env.STATS_KEY) {
    const key = new URL(request.url).searchParams.get("key") || "";
    if (key !== env.STATS_KEY) return json({ ok: false, reason: "forbidden" }, 403);
  }
  try {
    await ensure(db);
    const day = kstDay();
    const [countries, days] = await db.batch([
      db.prepare("SELECT country, n FROM by_country WHERE n > 0 ORDER BY n DESC, country"),
      db.prepare("SELECT day, n FROM by_day WHERE day >= ? ORDER BY day").bind(kstDay(-13))
    ]);
    const list = countries.results || [];
    const recent = days.results || [];
    const todayRow = recent.find((r) => r.day === day);
    return json({
      ok: true,
      total: list.reduce((sum, r) => sum + r.n, 0),
      today: todayRow ? todayRow.n : 0,
      day,
      countries: list,
      days: recent,
      updated: new Date().toISOString()
    });
  } catch (err) {
    return json({ ok: false, reason: "error" }, 500);
  }
}
