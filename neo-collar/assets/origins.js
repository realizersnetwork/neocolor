/* 로그인·메일 링크가 돌아오는 주소
 * 수퍼베이스 프로젝트 주소(*.supabase.co)와 구글 등이 쓰는 공급자 콜백(/auth/v1/callback)은 여기서 다루지 않는다.
 * 끊긴 예전 주소·오타 주소는 글자를 붙여 적는다. 통째로 적어 두면 이름 복사 스크립트가 정식 주소까지 옛 주소로 바꿔 버린다.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.NEO_ORIGINS = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const PROD = "https://neo-collar.com";
  const DEV = "https://neocollar.vercel.app";
  const PROD_HOSTS = new Set(["neo-collar.com", "www.neo-collar.com", "neo-collar.pages.dev"]);
  const DEV_HOSTS = new Set(["neocollar.vercel.app", "neocollar1028.vercel.app"]);

  function staleNames() {
    const apex = "neo" + "color.net";
    const pages = "neo" + "color.pages.dev";
    const vercel = "neo" + "color.vercel.app";
    const typo = "neo" + "color.com";
    return { apex: apex, pages: pages, vercel: vercel, typo: typo };
  }

  function staleSet() {
    const s = staleNames();
    return new Set([
      s.apex, "www." + s.apex,
      s.pages,
      s.vercel, "www." + s.vercel,
      s.typo, "www." + s.typo
    ]);
  }

  function hostOf(hostname) {
    return String(hostname || "").toLowerCase().replace(/\.+$/, "");
  }

  function classify(hostname) {
    const host = hostOf(hostname);
    if (PROD_HOSTS.has(host)) return "production";
    if (DEV_HOSTS.has(host)) return "development";
    if (staleSet().has(host)) return "stale";
    if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return "local";
    return "other";
  }

  function read(loc) {
    loc = loc || {};
    return {
      protocol: loc.protocol || "https:",
      hostname: hostOf(loc.hostname),
      port: String(loc.port || ""),
      origin: loc.origin && loc.origin !== "null" ? loc.origin : "",
      search: String(loc.search || ""),
      hash: String(loc.hash || "")
    };
  }

  function currentOrigin(loc) {
    if (loc.origin) return loc.origin.replace(/\/+$/, "");
    const port = loc.port ? ":" + loc.port : "";
    return (loc.protocol || "https:") + "//" + loc.hostname + port;
  }

  /* 허용된 곳이면 그 주소 그대로(같은 기기 로그인 저장이 유지된다).
     끊긴 주소·오타 주소는 되돌리지 않는다. 버셀 옛 별칭만 지금 개발 주소로, 나머지는 정식 주소로. */
  function authOrigin(input) {
    const loc = read(input);
    const kind = classify(loc.hostname);
    if (kind === "production" || kind === "development") return "https://" + loc.hostname;
    if (kind === "stale") {
      return loc.hostname === staleNames().vercel || loc.hostname === "www." + staleNames().vercel ? DEV : PROD;
    }
    return currentOrigin(loc);
  }

  function langQuery(lang) {
    return lang === "en" || lang === "ja" ? "?lang=" + lang : "";
  }

  /* 경로에 index.html 을 붙이지 않는다. 준비 중 화면의 /index.html 이동이 로그인 암호를 지울 수 있다. */
  function authReturnUrl(input, lang) {
    return authOrigin(input).replace(/\/+$/, "") + "/" + langQuery(lang);
  }

  function hasAuthCallback(input) {
    const loc = read(input);
    const q = new URLSearchParams(loc.search.replace(/^\?/, ""));
    if (["code", "error", "error_code", "error_description"].some((k) => q.has(k))) return true;
    return /access_token|refresh_token|error_description/.test(loc.hash);
  }

  function safeHash(hash) {
    if (!hash || hash.indexOf("#/") !== 0 || hash.length > 200) return "";
    return /^#\/[A-Za-z0-9\-._~/?=&%]*$/.test(hash) ? hash : "";
  }

  function authBounceUrl(input) {
    const loc = read(input);
    if (hasAuthCallback(loc)) return null;
    const next = authOrigin(loc).replace(/\/+$/, "");
    let nextHost = "";
    try { nextHost = new URL(next + "/").host; } catch (_) { return null; }
    const here = loc.hostname + (loc.port ? ":" + loc.port : "");
    if (nextHost === here) return null;
    const params = new URLSearchParams(loc.search.replace(/^\?/, ""));
    const lang = params.get("lang");
    const q = lang === "ko" || lang === "en" || lang === "ja" ? "lang=" + lang : "";
    return next + "/" + (q ? "?" + q : "") + safeHash(loc.hash);
  }

  return {
    PROD: PROD,
    DEV: DEV,
    classify: classify,
    authOrigin: authOrigin,
    authReturnUrl: authReturnUrl,
    authBounceUrl: authBounceUrl,
    hasAuthCallback: hasAuthCallback
  };
});
