/* NEO-COLLAR — 화면 동작
 * 언어(ko/en/ja) · 학생/베테랑 모드 · 메뉴 · 강의 · 로드맵 · 커뮤니티 · 인력사무소 · 수강권 · 베테랑 스튜디오 · 방문자 통계
 * 주소(#/...)로 화면을 바꾼다: #/ · #/courses[/공종[/세부]][?q=&saved=1&clip=1] · #/roadmaps[/id] · #/community[/terms]
 *   · #/jobs[/hire|seek|trainee] · #/plans · #/veteran[/upload|payout|guide] · #/stats
 */
(() => {
  "use strict";

  const D = window.NEO;
  const I = window.NEO_I18N;
  if (!D || !I) return;

  /* ---------- 기본 도구 ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (ch) => ESC[ch]);
  const LANGS = ["ko", "en", "ja"];
  const LOCALE = { ko: "ko-KR", en: "en-US", ja: "ja-JP" };
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* 저장이 안 돼도 화면은 그대로 */ } }
  };
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (_) { /* 무시 */ } }
  };
  const desktopQuery = window.matchMedia("(min-width: 960px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let lang = detectLang();
  function detectLang() {
    try {
      const q = new URLSearchParams(location.search).get("lang");
      if (LANGS.includes(q)) return q;
    } catch (_) { /* 무시 */ }
    const saved = store.get("neo.lang", null);
    if (LANGS.includes(saved)) return saved;
    const prefs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "ko"])
      .map((s) => String(s).toLowerCase());
    if (prefs.some((p) => p.startsWith("ko"))) return "ko";
    if (prefs.some((p) => p.startsWith("ja"))) return "ja";
    return "en";
  }

  const t = (key, vars) => {
    const pack = I[lang] || I.ko;
    let s = pack[key] != null ? pack[key] : I.ko[key] != null ? I.ko[key] : key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return s;
  };
  const L = (o) => (o == null ? "" : typeof o === "string" ? o : o[lang] != null ? o[lang] : o.ko || "");
  const fmt = (n, digits = 0) =>
    new Intl.NumberFormat(LOCALE[lang], { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
  const money = (n) => t("money", { n: fmt(Math.round(n)) });
  const man = (n) => Math.round(n / 1e4);
  const krwMonthShort = (n) => (lang === "en" ? `₩${fmt(n / 1e6, 2)}M` : lang === "ja" ? `${fmt(man(n))}万ウォン` : `${fmt(man(n))}만원`);
  const krwDayShort = (n) => (lang === "en" ? `₩${fmt(Math.round(n / 1e3))}k` : lang === "ja" ? `${man(n)}万ウォン` : `${man(n)}만원`);
  const krwRangeShort = (a, b) =>
    lang === "en" ? `₩${fmt(Math.round(a / 1e3))}k–${fmt(Math.round(b / 1e3))}k` : lang === "ja" ? `${man(a)}万〜${man(b)}万ウォン` : `${man(a)}만~${man(b)}만원`;

  /* ---------- 데이터 색인 ---------- */
  const byId = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
  const catById = byId(D.categories);
  const courseById = byId(D.courses);
  const rmById = byId(D.roadmaps);
  const wageById = byId(D.wages.items);
  const topicById = byId(D.topicBoards);
  const subName = (c) => (catById[c.cat].subs.find((s) => s.id === c.sub) || {}).name;
  // 국비 전문과정 = 한 분야를 처음부터 끝까지 배우는 과정 (판단 기준: 짧은 클립 제외, 10시간 이상). 단품 결제 가능, 구독 회원은 첫 2강 맛보기
  const GOV_ONLY_HOURS = 10;
  const govOnly = (c) => c.kind !== "clip" && c.hours >= GOV_ONLY_HOURS;
  const lengthText = (c) => (c.kind === "clip" ? t("card.min", { n: c.min }) : t("card.hours", { n: c.hours }));
  const rmHours = (r) =>
    Math.max(1, Math.round(r.courses.reduce((a, id) => { const c = courseById[id]; return a + (c.kind === "clip" ? c.min / 60 : c.hours); }, 0)));

  /* ---------- 아이콘 ---------- */
  const SV = (body, cls) => `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
  const CAT_ICON = {
    manage: '<rect x="6" y="4.5" width="12" height="16" rx="2"/><path d="M9.5 4.5h5V7h-5zM9 11h6M9 15h4"/>',
    civil: '<path d="M12 3v9M10 3h4"/><path d="M8.5 12h7l-.8 5.2a3 3 0 0 1-5.9 0z"/>',
    frame: '<path d="M5 4.5h14M5 19.5h14M12 4.5v15M8 4.5v2M16 4.5v2M8 17.5v2M16 17.5v2"/>',
    water: '<path d="M12 3.5s6 6.4 6 10.8a6 6 0 0 1-12 0c0-4.4 6-10.8 6-10.8z"/><path d="M9.5 14.5a2.6 2.6 0 0 0 2.5 2.5"/>',
    mep: '<path d="M4 10.5h7.5a3.5 3.5 0 0 1 3.5 3.5v1.5M8 10.5v-3M5.5 7.5h5M4 8.5v4M15 18.5v.5M15 21v.5"/>',
    elec: '<path d="M13.5 3 5.5 13.5h5.5L10 21l8-10.5h-5.5z"/>',
    exterior: '<rect x="4.5" y="4" width="15" height="16" rx="1.5"/><path d="M12 4v16M4.5 12h15"/>',
    wood: '<path d="m14.5 4.5 5 5-2.5 2.5-5-5z"/><path d="M13.2 8.8 4.5 17.5l2 2 8.7-8.7"/>',
    tile: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    finish: '<rect x="4" y="4" width="13" height="5" rx="1.5"/><path d="M17 6.5h2.5v5H11v3"/><rect x="9.5" y="14.5" width="3" height="6" rx="1"/>',
    labor: '<path d="M3.5 17.5h17M5.5 17.5V15a6.5 6.5 0 0 1 13 0v2.5M10 9V6.5h4V9"/>'
  };
  const ICON = {
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    megaphone: '<path d="M4 10v4a1 1 0 0 0 1 1h2l5 4V5L7 9H5a1 1 0 0 0-1 1z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    cap: '<path d="m3 9 9-4 9 4-9 4z"/><path d="M7 11v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4"/>',
    briefcase: '<rect x="3.5" y="7" width="17" height="12" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3.5 12h17"/>',
    medal: '<circle cx="12" cy="14.5" r="5.5"/><path d="M8 3h8l-2.5 6h-3z"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10.5 5-3v9l-5-3z"/>',
    users: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9.5" r="2.4"/><path d="M15.5 14.2A4.5 4.5 0 0 1 21 18.5"/>',
    chat: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A1.5 1.5 0 0 1 4 14.5z"/>',
    alert: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17h.01"/>',
    camera: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.5-2h5L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/>',
    star: '<path d="m12 4 2.4 5 5.4.7-4 3.7 1 5.4L12 16.2 7.2 18.8l1-5.4-4-3.7 5.4-.7z"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M8 9l1.6 6L12 10l2.4 5L16 9M7.5 12h9"/>',
    smile: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
    phone: '<path d="M6.5 4h3l1.5 4-2 1.5a10 10 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 6a2 2 0 0 1 2-2z"/>'
  };
  const catIcon = (id, cls) => SV(CAT_ICON[id] || CAT_ICON.labor, cls);
  const icon = (name, cls) => SV(ICON[name] || "", cls);

  /* ---------- 상태 ---------- */
  const hasPrice = (id) => D.pricing.some((p) => p.id === id);
  try { localStorage.removeItem("neo.country"); } catch (_) { /* 예전에 저장한 나라 지우기 */ }
  function detectCountry() {
    // 접속 나라는 시작 후 /cdn-cgi/trace 로 다시 맞춘다(applyTraceCountry). 그 전엔 브라우저 언어로 짐작
    const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""]).map((x) => String(x));
    for (const l of langs) {
      const region = (l.split("-")[1] || "").toUpperCase();
      if (/^[A-Z]{2}$/.test(region) && hasPrice(region)) return region;
      const base = l.slice(0, 2).toLowerCase();
      const byLang = { ko: "KR", ja: "JP", vi: "VN", id: "ID", hi: "IN", th: "TH", ms: "MY", tl: "PH", fil: "PH", tr: "TR", pl: "PL", de: "DE", fr: "FR", it: "IT", nl: "NL", sv: "SE", da: "DK", nb: "NO", he: "IL", ur: "PK" }[base];
      if (byLang) return byLang;
    }
    return "KR";
  }
  // 같은 사이트의 /cdn-cgi/trace 에서 접속 나라를 한 번만 읽는다 (방문자 통계와 나라별 요금이 같이 씀)
  let tracePromise = null;
  function traceCountry() {
    if (!tracePromise) {
      tracePromise = (async () => {
        if (!/^https:$/.test(location.protocol)) return null;
        try {
          const txt = await (await fetch("/cdn-cgi/trace", { cache: "no-store" })).text();
          return (txt.match(/^loc=([A-Z0-9]{2})$/m) || [])[1] || null;
        } catch (_) { return null; }
      })();
    }
    return tracePromise;
  }
  const savedRaw = store.get("neo.saved", []);
  let saved = new Set((Array.isArray(savedRaw) ? savedRaw : []).filter((id) => courseById[id]));
  const pageSize = () => (desktopQuery.matches ? 16 : 12);
  const state = {
    view: null,
    cat: "all", sub: null, q: "",
    filters: { level: null, online: false, clip: false, gov: false, saved: false },
    limit: pageSize(),
    jobsTab: "hire", jobRegion: "all", jobCat: "all",
    commTab: "boards", termCat: "all", termQ: "",
    lastStudent: "#/",
    wage: D.wages.items[0].id,
    homeLevel: "beginner",
    homeCountry: detectCountry(),
    country: null,
    quiz: { step: 0, answers: [] },
    course: null,
    stats: null
  };

  /* ---------- 알림 ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
  }

  /* ---------- 고정 문구 번역 ---------- */
  function applyStatic() {
    document.documentElement.lang = lang;
    $$("[data-privacy]").forEach((a) => { a.href = `/privacy?lang=${lang}`; });
   const HTML_KEYS = new Set(['hero.lead', 'hero.photo_text', '밑문장_키']);
$$("[data-i18n]").forEach((el) => { const k = el.dataset.i18n; if (HTML_KEYS.has(k)) el.innerHTML = t(k); else el.textContent = t(k); });
    $$("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const i = pair.indexOf(":");
        if (i > 0) el.setAttribute(pair.slice(0, i).trim(), t(pair.slice(i + 1).trim()));
      });
    });
    document.title = t("meta.title");
    const md = $('meta[name="description"]');
    if (md) md.setAttribute("content", t("meta.desc"));
    $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  }

  /* ---------- 강의 카드 ---------- */
  function badgesHTML(c) {
    const b = [`<span class="b b-soon">${esc(t("badge.soon"))}</span>`];
    if (c.kind === "clip") b.push(`<span class="b b-clip">${esc(t("badge.clip"))}</span>`);
    if (c.knowhow) b.push(`<span class="b b-know">${esc(t("badge.knowhow"))}</span>`);
    if (govOnly(c)) b.push(`<span class="b b-gov">${esc(t("badge.govOnly"))}</span>`);
    return b.join("");
  }
  function saveBtnHTML(id) {
    const on = saved.has(id);
    return `<button class="save-btn" type="button" data-save="${id}" aria-pressed="${on}" aria-label="${esc(t(on ? "card.unsave" : "card.save"))}">${icon("heart")}</button>`;
  }
  function cardHTML(c) {
    const cat = catById[c.cat];
    return `<article class="card">
      <div class="thumb" style="--c:${cat.color}">${catIcon(cat.id, "thumb-ic")}<span class="thumb-cat">${esc(L(cat.name))}</span><span class="thumb-sub">${esc(L(subName(c)))}</span></div>
      <div class="card-body">
        <div class="badges">${badgesHTML(c)}</div>
        <h3 class="card-title">${esc(L(c.title))}</h3>
        <p class="card-desc">${esc(L(c.desc))}</p>
        <p class="card-meta">${esc(t("level." + c.level))} · ${esc(t("format." + c.format))} · ${esc(lengthText(c))}</p>
      </div>
      <button class="card-hit" type="button" data-course="${c.id}" aria-label="${esc(t("card.open", { title: L(c.title) }))}"></button>
      ${saveBtnHTML(c.id)}
    </article>`;
  }
  const renderRow = (sel, list) => { const el = $(sel); if (el) el.innerHTML = list.map(cardHTML).join(""); };

  /* ---------- 로드맵 카드 ---------- */
  function rmWageText(r) {
    const w = r.wage ? wageById[r.wage] : null;
    return w ? t("rm.wage", { n: money(w.daily), trade: L(w.name) }) : "";
  }
  function rmCardHTML(r) {
    const wage = rmWageText(r);
    const certs = r.certs.slice(0, 2).map((x) => `<span class="cert">${esc(L(D.certs[x]))}</span>`).join("");
    return `<a class="rm-card" href="#/roadmaps/${r.id}" style="--c:${r.color}">
      <span class="rm-name">${esc(L(r.name))}</span>
      <span class="rm-goal">${esc(L(r.goal))}</span>
      <span class="rm-meta">${esc(t("rm.courses", { n: r.courses.length }))} · ${esc(t("rm.hours", { n: rmHours(r) }))}</span>
      ${wage ? `<span class="rm-wage">${esc(wage)}</span>` : ""}
      ${certs ? `<span class="chip-row">${certs}</span>` : ""}
    </a>`;
  }
  function rmFullHTML(r) {
    const wage = rmWageText(r);
    const practice = r.courses.some((id) => courseById[id].format !== "online");
    const steps = r.courses.map((id, i) => {
      const c = courseById[id];
      return `<li><button type="button" data-course="${id}"><span class="n">${i + 1}</span><span class="t">${esc(L(c.title))}</span><span class="m">${esc(lengthText(c))}${govOnly(c) ? ` · ${esc(t("badge.govOnly"))}` : ""}</span></button></li>`;
    }).join("");
    const certs = r.certs.map((x) => `<span class="cert">${esc(L(D.certs[x]))}</span>`).join("");
    return `<article class="rm-full" id="rm-${r.id}" style="--c:${r.color}">
      <h2>${esc(L(r.name))}</h2>
      <p class="rm-goal">${esc(L(r.goal))}</p>
      <div class="rm-stats">
        <span class="pill">${esc(t("rm.courses", { n: r.courses.length }))}</span>
        <span class="pill">${esc(t("rm.hours", { n: rmHours(r) }))}</span>
        ${practice ? `<span class="pill pill-ok">${esc(t("cm.practice"))}</span>` : ""}
        ${wage ? `<span class="pill pill-gov">${esc(wage)}</span>` : ""}
      </div>
      <ol class="rm-steps">${steps}</ol>
      <div class="rm-foot">
        <div class="chip-row">${certs}</div>
        <button class="btn btn-dark" type="button" data-soon>${esc(t("rm.start"))}</button>
      </div>
    </article>`;
  }

  /* ---------- 홈 ---------- */
  function renderQuick() {
    const grid = $("#quickGrid");
    grid.innerHTML = D.categories.map((c) =>
      `<button class="quick-item" type="button" data-cat="${c.id}"><span class="quick-icon" style="--c:${c.color}">${catIcon(c.id)}</span><span>${esc(L(c.name))}</span></button>`
    ).join("");
    // 칸 수를 카테고리 개수에 맞춤: 휴대폰은 마지막 줄 빈칸이 적은 쪽(4칸/5칸), PC는 한 줄(12개 넘으면 두 줄)
    const n = D.categories.length;
    const empty = (cols) => (cols - (n % cols)) % cols;
    grid.style.setProperty("--cols-m", empty(4) <= empty(5) ? 4 : 5);
    grid.style.setProperty("--cols-d", n <= 12 ? n : Math.ceil(n / 2));
    $("#suggestChips").innerHTML = (D.suggestions[lang] || D.suggestions.ko)
      .map((s) => `<button type="button" data-search="${esc(s)}">${esc(s)}</button>`).join("");
  }

  const LEVEL_LIST = {
    beginner: () => D.starter.map((id) => courseById[id]).filter(Boolean),
    pro: () => D.courses.filter((c) => c.level === "pro" && c.kind !== "clip").slice(0, 12),
    expert: () => D.courses.filter((c) => c.level === "expert" && c.kind !== "clip")
  };
  function renderLevelTabs() {
    $("#levelTabs").innerHTML = ["beginner", "pro", "expert"].map((lv) =>
      `<button type="button" role="tab" data-level-tab="${lv}" aria-selected="${state.homeLevel === lv}"><strong>${esc(t("level." + lv))}</strong><span>${esc(t(`home.level.${lv}.d`))}</span></button>`
    ).join("");
    renderRow("#rowLevel", LEVEL_LIST[state.homeLevel]());
  }

  function renderWages() {
    const items = D.wages.items;
    const max = Math.max(...items.map((w) => w.daily));
    $("#wageList").innerHTML = items.map((w) => {
      const base = w.id === D.wages.base;
      return `<div role="listitem"><button class="wage-row${base ? " is-base" : ""}" type="button" data-wage="${w.id}" aria-pressed="${state.wage === w.id}">
        <span class="wage-name">${esc(L(w.name))}${base ? `<small>${esc(t("wage.baseTag"))}</small>` : ""}</span>
        <span class="wage-track"><span class="wage-bar" style="--w:${((w.daily / max) * 100).toFixed(1)}%"></span></span>
        <span class="wage-val">${esc(money(w.daily))}</span>
      </button></div>`;
    }).join("");
    renderWageDetail();
  }
  function renderWageDetail() {
    const w = wageById[state.wage] || D.wages.items[0];
    const base = wageById[D.wages.base];
    const lines = [];
    if (w.id !== base.id) lines.push(t("wage.diff", { n: money(w.daily - base.daily) }));
    lines.push(t("wage.month", { n: krwMonthShort(w.daily * 20) }));
    $("#wageDetail").innerHTML = `<p class="wd-name">${esc(L(w.name))} · ${esc(L(catById[w.cat].name))}</p>
      <p class="wd-day">${esc(t("wage.daily", { n: money(w.daily) }))}</p>
      <ul>${lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
      <button class="btn btn-primary" type="button" data-cat="${w.cat}">${esc(t("wage.courses"))}</button>`;
  }

  function renderLadder() {
    const trades = D.wages.items.filter((w) => w.id !== D.wages.base);
    const min = Math.min(...trades.map((w) => w.daily));
    const max = Math.max(...trades.map((w) => w.daily));
    $("#ladder").innerHTML = D.ladder.map((s, i) => {
      let wage = "";
      if (s.wage === "laborer") wage = t("ladder.wageBase", { r: krwDayShort(wageById.laborer.daily) });
      else if (s.wage === "range") wage = t("ladder.wageRange", { r: krwRangeShort(min, max) });
      return `<li><a href="${s.link}"><span class="step-no">${i + 1}</span><strong>${esc(L(s.title))}</strong><span class="ld">${esc(L(s.desc))}</span>${wage ? `<em>${esc(wage)}</em>` : ""}</a></li>`;
    }).join("");
  }

  const priceItem = (id) => D.pricing.find((x) => x.id === id) || D.pricing[0];
  const priceFor = (id) => { const p = priceItem(id); return typeof p.price === "string" ? p.price : L(p.price); };
  function countryNamer() {
    let dn = null;
    try { dn = new Intl.DisplayNames([LOCALE[lang]], { type: "region" }); } catch (_) { /* 오래된 브라우저 */ }
    return (code) => { try { return (dn && dn.of(code)) || code; } catch (_) { return code; } };
  }
  // 달러 → 보는 사람 언어의 돈 (한국어: 원, 영어: 달러, 일본어: 엔), 대략
  function approxMoney(usd) {
    if (lang === "ko") return `약 ${fmt(Math.round((usd * D.fx.KRW) / 100) * 100)}원`;
    if (lang === "ja") return `約${fmt(Math.round((usd * D.fx.JPY) / 10) * 10)}円`;
    return `≈ $${fmt(usd, 2)}`;
  }
  function renderPlanTeaser() {
    const items = [
      { name: t("plan.gov.name"), price: t("plan.gov.price"), sub: t("plan.gov.sub"), badge: t("plan.gov.badge") },
      { name: t("plan.voucher.name"), price: t("plan.voucher.price"), sub: t("plan.voucher.sub"), badge: t("plan.voucher.badge"), featured: true },
      { name: t("plan.monthly.name"), price: `${priceFor(state.homeCountry)} ${t("plan.monthly.unit")}`, sub: t("plan.monthly.sub"), badge: t("plan.monthly.badge") }
    ];
    $("#planTeaser").innerHTML = items.map((p) =>
      `<a class="plan-mini${p.featured ? " featured" : ""}" href="#/plans"><span class="pm-top"><span class="pm-name">${esc(p.name)}</span><span class="pill${p.featured ? " pill-dark" : ""}">${esc(p.badge)}</span></span><span class="pm-price">${esc(p.price)}</span><span class="pm-sub">${esc(p.sub)}</span></a>`
    ).join("");
  }

  function renderCommTeaser() {
    const boards = [...D.topicBoards.slice(0, 2).map((b) => ({ name: b.name, color: b.color })), ...D.categories.slice(0, 7).map((c) => ({ name: c.name, color: c.color }))];
    $("#boardChips").innerHTML = boards.map((b) => `<a href="#/community"><span class="dot" style="--c:${b.color}"></span>${esc(L(b.name))}</a>`).join("");
    const day = Math.floor(Date.now() / 864e5);
    const start = day % D.terms.length;
    const pick = [0, 1, 2].map((i) => D.terms[(start + i * 7) % D.terms.length]);
    $("#termPeek").innerHTML = pick.map((x) =>
      `<div><strong lang="ko">${esc(x.t)}${lang !== "ko" ? `<small>${esc(x.rom)}</small>` : ""}</strong><span>${esc(L(x.m))}</span></div>`
    ).join("");
  }

  function renderJobsTeaser() {
    $("#jobsTeaser").innerHTML = [["hire", "megaphone"], ["seek", "user"], ["trainee", "cap"]].map(([k, ic]) =>
      `<a class="jt-item" href="#/jobs/${k}"><span class="jt-ic">${icon(ic)}</span><strong>${esc(t("jobs.tab." + k))}</strong><span>${esc(t(`home.jobs.${k}.d`))}</span></a>`
    ).join("");
  }

  const krwPer = (cur) => (cur === "KRW" ? 1 : D.overseas.eur.KRW / D.overseas.eur[cur]);
  const PER_MONTH = { year: (a) => a / 12, week: (a) => (a * 52) / 12, hour: (a) => (a * 40 * 52) / 12, day: (a) => a * 20 };
  function osDisplay(krw) {
    if (lang === "ko") return `${fmt(man(krw))}만원`;
    if (lang === "ja") return `${fmt(krw / krwPer("JPY") / 1e4, 1)}万円`;
    return `$${fmt(Math.round(krw / krwPer("USD") / 10) * 10)}`;
  }
  function renderOverseas() {
    const rows = D.overseas.items.map((o) => ({ o, krw: PER_MONTH[o.per](o.amount) * krwPer(o.cur) }));
    const max = Math.max(...rows.map((r) => r.krw));
    rows.sort((a, b) => (a.o.ref ? 1 : 0) - (b.o.ref ? 1 : 0) || b.krw - a.krw);
    $("#osList").innerHTML = rows.map(({ o, krw }) =>
      `<div class="os-row${o.ref ? " is-ref" : ""}" role="listitem">
        <div class="os-top"><span class="os-country">${esc(L(o.country))}</span><span class="os-month">${esc(osDisplay(krw))}<small>${esc(t("os.unit"))}</small></span></div>
        <div class="os-track"><span class="os-bar" style="--w:${((krw / max) * 100).toFixed(1)}%"></span></div>
        <p class="os-figure">${esc(L(o.figure))}</p>
        <p class="os-why">${esc(L(o.why))}</p>
        <p class="os-src">${esc(L(o.src))}</p>
      </div>`
    ).join("");
  }

  const faqHTML = () => D.faq.map((f) => `<details><summary>${esc(L(f.q))}</summary><p>${esc(L(f.a))}</p></details>`).join("");

  /* ---------- 메뉴 (PC 메가 메뉴 · 휴대폰 서랍) ---------- */
  const megaEl = $("#mega");
  const menuBtn = $("#menuBtn");
  const drawer = $("#drawer");
  let megaCat = D.categories[0].id;
  function renderMega() {
    $("#megaList").innerHTML = D.categories.map((c) =>
      `<li><button type="button" data-mega="${c.id}" class="${c.id === megaCat ? "active" : ""}"><span class="dot" style="--c:${c.color}"></span>${esc(L(c.name))}</button></li>`
    ).join("");
    renderMegaPanel(megaCat);
  }
  function renderMegaPanel(catId) {
    megaCat = catId;
    const c = catById[catId];
    const list = D.courses.filter((x) => x.cat === catId).slice(0, 10);
    $("#megaPanel").innerHTML = `
      <h3>${esc(L(c.name))}</h3>
      <p class="desc">${esc(L(c.desc))}</p>
      <div class="mega-subs">${c.subs.map((s) => `<button type="button" data-cat="${c.id}" data-sub="${s.id}">${esc(L(s.name))}</button>`).join("")}</div>
      <ul class="mega-courses">${list.map((x) => `<li><button type="button" data-course="${x.id}">${esc(L(x.title))}<small>${esc(lengthText(x))}</small></button></li>`).join("")}</ul>
      <button type="button" class="mega-all" data-cat="${c.id}">${esc(L(c.name))} · ${esc(t("common.viewAll"))} →</button>`;
    $$("[data-mega]").forEach((b) => b.classList.toggle("active", b.dataset.mega === catId));
  }
  function renderDrawer() {
    $("#drawerBody").innerHTML = `
      <div class="drawer-links">
        <a href="#/courses" data-close>${esc(t("nav.courses"))}</a>
        <a href="#/roadmaps" data-close>${esc(t("nav.roadmaps"))}</a>
        <a href="#/community" data-close>${esc(t("nav.community"))}</a>
        <a href="#/jobs" data-close>${esc(t("nav.jobs"))} <span class="pass-chip">PASS</span></a>
        <a href="#/plans" data-close>${esc(t("nav.plans"))}</a>
        <a href="#/courses?saved=1" data-close>${esc(t("nav.saved"))}</a>
        <a href="#/contact" data-close>${esc(t("nav.contact"))}</a>
      </div>
      <div class="drawer-auth">${authUser
        ? `<span class="drawer-user">${esc(t("auth.welcome", { name: userLabel(authUser) }))}</span><button type="button" data-auth="logout">${esc(t("auth.logout"))}</button>`
        : `<button type="button" data-auth="login">${esc(t("auth.login"))}</button><button type="button" data-auth="signup">${esc(t("auth.signup"))}</button>`}</div>
      ${authUser ? `<button class="drawer-delete" type="button" data-auth="delete">${esc(t("auth.delete"))}</button>` : ""}
      ${D.categories.map((c) => `<div class="drawer-cat">
        <button type="button" data-cat="${c.id}"><span class="dot" style="--c:${c.color}"></span>${esc(L(c.name))}</button>
        <div class="drawer-subs">${c.subs.map((s) => `<button type="button" data-cat="${c.id}" data-sub="${s.id}">${esc(L(s.name))}</button>`).join("")}</div>
      </div>`).join("")}`;
  }
  function renderFooter() {
    $("#footCats").innerHTML = D.categories.map((c) => `<li><button type="button" data-cat="${c.id}">${esc(L(c.name))}</button></li>`).join("");
    $("#footContact").innerHTML = `<span class="fc-label">${esc(t("contact.footLabel"))}</span>${contactLine()}`;
    $("#adsContact").innerHTML = contactLine();
  }

  /* ---------- 문의하기 (고객센터) ----------
   * 정식 오픈 전에도 광고·제휴·단체교육·베테랑 신청 문의를 받는다. 연락처는 data.js 의 contact
   * 한국어 화면은 010 번호를 크게, 영어·일본어 화면은 국제번호(+82)를 크게 */
  const CONTACT_TOPICS = ["ads", "partner", "group", "veteran", "etc"];
  const C = D.contact;
  const mainPhone = () => (lang === "ko" ? C.phone : C.intl);
  const subPhone = () => t(lang === "ko" ? "contact.intlNote" : "contact.krNote", { n: lang === "ko" ? C.intl : C.phone });
  function contactMail(topic) {
    const subject = `[NEO-COLLAR] ${t("contact.topic." + topic)}`;
    const body = topic === "etc" ? "" : t("contact.body." + topic);
    return `mailto:${C.email}?subject=${encodeURIComponent(subject)}${body ? "&body=" + encodeURIComponent(body) : ""}`;
  }
  // 한 줄짜리 연락처 (푸터·광고 안내)
  function contactLine() {
    return `<a href="mailto:${C.email}">${icon("mail", "ci")}<span class="email-text">${esc(C.email)}</span></a>`
      + `<a href="tel:${C.tel}">${icon("phone", "ci")}${esc(mainPhone())}</a>`
      + `<span class="fc-intl">${esc(subPhone())}</span>`;
  }
  function renderContact() {
    const tp = state.contactTopic || "etc";
    $("#contactTopics").innerHTML = CONTACT_TOPICS.map((id) =>
      `<button type="button" class="chip" data-topic="${id}" aria-pressed="${id === tp}">${esc(t("contact.topic." + id))}</button>`).join("");
    $("#contactCards").innerHTML = `
      <div class="contact-card">
        <span class="cc-ic">${icon("mail")}</span>
        <div class="cc-body"><span class="cc-label">${esc(t("contact.email"))}</span><a class="cc-value email-text" href="${contactMail(tp)}">${esc(C.email)}</a></div>
        <div class="cc-actions"><a class="btn btn-dark" href="${contactMail(tp)}">${esc(t("contact.mailBtn"))}</a><button class="btn btn-line" type="button" data-copy="${esc(C.email)}">${esc(t("contact.copy"))}</button></div>
      </div>
      <div class="contact-card">
        <span class="cc-ic">${icon("phone")}</span>
        <div class="cc-body"><span class="cc-label">${esc(t("contact.phone"))}</span><a class="cc-value" href="tel:${C.tel}">${esc(mainPhone())}</a><span class="cc-sub">${esc(subPhone())}</span></div>
        <div class="cc-actions"><a class="btn btn-dark" href="tel:${C.tel}">${esc(t("contact.callBtn"))}</a><button class="btn btn-line" type="button" data-copy="${esc(mainPhone())}">${esc(t("contact.copy"))}</button></div>
      </div>
      <p class="info-note contact-note">${esc(t("contact.note." + tp))}</p>`;
  }
  async function copyText(text) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (_) {
      try {
        const ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); ok = document.execCommand("copy"); ta.remove();
      } catch (_) { ok = false; }
    }
    toast(ok ? t("contact.copied", { v: text }) : text);
  }
  const openMega = () => { megaEl.hidden = false; menuBtn.setAttribute("aria-expanded", "true"); };
  const closeMega = () => { megaEl.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); };
  const openDrawer = () => { drawer.hidden = false; document.documentElement.classList.add("modal-open"); menuBtn.setAttribute("aria-expanded", "true"); };
  const closeDrawer = () => {
    drawer.hidden = true;
    if (!$$("dialog[open]").length) document.documentElement.classList.remove("modal-open");
    menuBtn.setAttribute("aria-expanded", "false");
  };
  function closeMenus() {
    if (!megaEl.hidden) closeMega();
    if (!drawer.hidden) closeDrawer();
    $("#searchForm").classList.remove("open");
  }

  /* ---------- 전체 강의 ---------- */
  // 필터도 전부 주소에 담는다 → 다른 곳에서 들어오면 필터가 깨끗하게 풀린다
  function coursesHash({ cat = "all", sub = null, q = "", saved: sv = false, clip = false, level = null, online = false, gov = false } = {}) {
    let h = "#/courses";
    if (cat && cat !== "all" && catById[cat]) { h += "/" + cat; if (sub) h += "/" + sub; }
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (level) p.set("level", level);
    if (clip) p.set("clip", "1");
    if (online) p.set("online", "1");
    if (gov) p.set("gov", "1");
    if (sv) p.set("saved", "1");
    const s = p.toString();
    return s ? `${h}?${s}` : h;
  }
  function filteredCourses() {
    const q = state.q.trim().toLowerCase();
    const f = state.filters;
    return D.courses.filter((c) => {
      if (state.cat !== "all" && c.cat !== state.cat) return false;
      if (state.sub && c.sub !== state.sub) return false;
      if (f.level && c.level !== f.level) return false;
      if (f.online && c.format !== "online") return false;
      if (f.clip && c.kind !== "clip") return false;
      if (f.gov && !govOnly(c)) return false;
      if (f.saved && !saved.has(c.id)) return false;
      if (q) {
        const cat = catById[c.cat];
        const sub = cat.subs.find((s) => s.id === c.sub) || { name: {} };
        const hay = [c.title, c.desc, cat.name, sub.name].map((o) => [o.ko, o.en, o.ja].join(" ")).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }
  function centerPressed(bar) {
    const btn = bar && bar.querySelector('[aria-pressed="true"]');
    if (btn) bar.scrollLeft = btn.offsetLeft - bar.clientWidth / 2 + btn.offsetWidth / 2;
  }
  function renderCourses() {
    const chips = [{ id: "all", label: t("courses.all") }, ...D.categories.map((c) => ({ id: c.id, label: L(c.name) }))];
    $("#catChips").innerHTML = chips.map((c) =>
      `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${state.cat === c.id}">${esc(c.label)}</button>`
    ).join("");
    const sc = $("#subChips");
    if (state.cat === "all") sc.innerHTML = "";
    else {
      const c = catById[state.cat];
      sc.innerHTML = [
        `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${!state.sub}">${esc(t("courses.all"))}</button>`,
        ...c.subs.map((s) => `<button class="chip" type="button" data-cat="${c.id}" data-sub="${s.id}" aria-pressed="${state.sub === s.id}">${esc(L(s.name))}</button>`)
      ].join("");
    }
    const f = state.filters;
    const fchips = [
      ...["beginner", "pro", "expert"].map((lv) => ({ k: "level:" + lv, on: f.level === lv, label: t("level." + lv) })),
      { k: "clip", on: f.clip, label: t("courses.f.clip") },
      { k: "online", on: f.online, label: t("courses.f.online") },
      { k: "gov", on: f.gov, label: t("courses.f.gov") },
      { k: "saved", on: f.saved, label: `♡ ${t("courses.f.saved")}${saved.size ? " " + saved.size : ""}` }
    ];
    $("#filterChips").innerHTML = fchips.map((x) =>
      `<button class="chip" type="button" data-filter="${x.k}" aria-pressed="${x.on}">${esc(x.label)}</button>`
    ).join("");

    const list = filteredCourses();
    $("#courseGrid").innerHTML = list.slice(0, state.limit).map(cardHTML).join("");
    const rest = list.length - state.limit;
    $("#moreWrap").hidden = rest <= 0;
    $("#moreBtn").textContent = t("common.more", { n: Math.max(rest, 0) });
    const empty = $("#emptyText");
    empty.hidden = list.length > 0;
    empty.textContent = t(f.saved && saved.size === 0 ? "courses.emptySaved" : state.q ? "courses.empty" : "courses.emptyFilter");
    let label;
    if (state.q) label = t("courses.resultSearch", { q: esc(state.q) });
    else if (state.cat === "all") label = esc(t("courses.resultAll"));
    else {
      const c = catById[state.cat];
      label = esc(L(c.name)) + (state.sub ? " · " + esc(L(c.subs.find((s) => s.id === state.sub).name)) : "");
    }
    $("#resultText").innerHTML = t("courses.result", { label, n: list.length });
    $("#clearSearch").hidden = !state.q;
    centerPressed($("#catChips"));
  }

  /* ---------- 커뮤니티 ---------- */
  function boardHTML(b, isTrade) {
    return `<button class="board" type="button" data-soon><span class="bd-ic" style="--c:${b.color}">${isTrade ? catIcon(b.id) : icon(b.icon)}</span><strong>${esc(L(b.name))}</strong><span class="bd-d">${esc(L(b.desc))}</span></button>`;
  }
  function renderCommunity() {
    $$("#commTabs [data-ctab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.ctab === state.commTab)));
    $$("[data-cpanel]").forEach((p) => { p.hidden = p.dataset.cpanel !== state.commTab; });
    $("#tradeBoards").innerHTML = D.categories.map((c) => boardHTML(c, true)).join("");
    $("#topicBoards").innerHTML = D.topicBoards.map((b) => boardHTML(b, false)).join("");
    $("#postList").innerHTML = D.posts.map((p) => {
      const board = catById[p.board] || topicById[p.board];
      return `<li><span class="b">${esc(L(D.postTypes[p.type]))}</span><span class="post-board">${esc(L(board.name))}</span><span class="post-title">${esc(L(p.title))}</span></li>`;
    }).join("");
    renderTerms();
  }
  function termHTML(x) {
    const catName = x.cat === "general" ? t("comm.terms.general") : L(catById[x.cat].name);
    const extra = [];
    if (x.jp) extra.push(`<span class="jp">${esc(t("comm.terms.from", { jp: x.jp }))}</span>`);
    if (x.std) extra.push(`<span>${esc(t("comm.terms.std", { std: x.std }))}</span>`);
    return `<article class="term">
      <div class="term-top"><span class="term-word" lang="ko">${esc(x.t)}</span><span class="term-rom">${esc(x.rom)}</span><span class="cert term-cat">${esc(catName)}</span></div>
      <p class="term-mean">${esc(L(x.m))}</p>
      ${extra.length ? `<div class="term-extra">${extra.join("")}</div>` : ""}
    </article>`;
  }
  function renderTerms() {
    const used = new Set(D.terms.map((x) => x.cat));
    const cats = ["all", "general", ...D.categories.map((c) => c.id).filter((id) => used.has(id))];
    $("#termChips").innerHTML = cats.map((id) => {
      const label = id === "all" ? t("courses.all") : id === "general" ? t("comm.terms.general") : L(catById[id].name);
      return `<button class="chip" type="button" data-term-cat="${id}" aria-pressed="${state.termCat === id}">${esc(label)}</button>`;
    }).join("");
    const q = state.termQ.trim().toLowerCase();
    const list = D.terms.filter((x) =>
      (state.termCat === "all" || x.cat === state.termCat) &&
      (!q || [x.t, x.rom, x.jp, x.std, x.m.ko, x.m.en, x.m.ja].filter(Boolean).join(" ").toLowerCase().includes(q))
    );
    $("#termCount").textContent = t("comm.terms.count", { n: list.length });
    $("#termGrid").innerHTML = list.map(termHTML).join("");
    $("#termEmpty").hidden = list.length > 0;
  }

  /* ---------- 인력사무소 ---------- */
  const regionMatch = (j) => state.jobRegion === "all" || j.region === state.jobRegion || j.region === "all";
  const catMatch = (j) => state.jobCat === "all" || j.cat === state.jobCat;
  const regionName = (id) => L((D.regions.find((r) => r.id === id) || D.regions[0]).name);
  function hireHTML(j) {
    const cat = catById[j.cat];
    const vet = j.tags.includes("veteran");
    return `<article class="job">
      <div class="job-top"><span class="b b-sample">${esc(t("common.example"))}</span>${vet ? `<span class="b b-vet">${esc(t("jobs.vet"))}</span>` : ""}<span class="job-type">${esc(t("jobs.type." + j.type))}</span></div>
      <h3 class="job-title">${esc(L(j.title))}</h3>
      <p class="job-meta"><span class="dot" style="--c:${cat.color}"></span>${esc(L(cat.name))} · ${esc(L(j.place))}</p>
      <div class="tags">${j.tags.map((k) => `<span>${esc(L(D.jobTags[k]))}</span>`).join("")}</div>
      <button class="job-act" type="button" data-soon>${esc(t("jobs.apply"))}</button>
    </article>`;
  }
  function seekHTML(j) {
    const cat = catById[j.cat];
    return `<article class="job">
      <div class="job-top"><span class="b b-sample">${esc(t("common.example"))}</span>${j.neo ? `<span class="b b-neo">${esc(t("jobs.neo"))}</span>` : ""}${j.veteran ? `<span class="b b-vet">${esc(t("jobs.vet"))}</span>` : ""}</div>
      <h3 class="job-title">${esc(L(j.title))}</h3>
      <p class="job-meta"><span class="dot" style="--c:${cat.color}"></span>${esc(L(cat.name))} · ${esc(L(j.place))}</p>
      <div class="tags">${(j.tags || []).map((x) => `<span>${esc(L(x))}</span>`).join("")}</div>
      <button class="job-act" type="button" data-soon>${esc(t("jobs.contact"))}</button>
    </article>`;
  }
  function traineeHTML(j) {
    const cat = catById[j.cat];
    return `<article class="job">
      <div class="job-top"><span class="b b-sample">${esc(t("common.example"))}</span><span class="b">${esc(t(`jobs.tr.${j.partner}.t`))}</span></div>
      <h3 class="job-title">${esc(L(j.title))}</h3>
      <p class="job-meta"><span class="dot" style="--c:${cat.color}"></span>${esc(L(cat.name))} · ${esc(regionName(j.region))}</p>
      <div class="tags"><span>${esc(t("jobs.tr.status"))}</span></div>
      <button class="job-act" type="button" data-soon>${esc(t("jobs.tr.applyBtn"))}</button>
    </article>`;
  }
  function renderJobs() {
    $$("#jobTabs [data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === state.jobsTab)));
    $$("[data-panel]").forEach((p) => { p.hidden = p.dataset.panel !== state.jobsTab; });
    const rs = $("#jobRegion");
    const cs = $("#jobCat");
    rs.innerHTML = D.regions.map((r) => `<option value="${r.id}">${esc(L(r.name))}</option>`).join("");
    rs.value = state.jobRegion;
    cs.innerHTML = [`<option value="all">${esc(t("jobs.allTrades"))}</option>`, ...D.categories.map((c) => `<option value="${c.id}">${esc(L(c.name))}</option>`)].join("");
    cs.value = state.jobCat;

    const hire = D.jobs.hire.filter((j) => regionMatch(j) && catMatch(j));
    const seek = D.jobs.seek.filter((j) => regionMatch(j) && catMatch(j));
    const tr = D.jobs.trainee.filter((j) => regionMatch(j) && catMatch(j));
    $("#hireList").innerHTML = hire.map(hireHTML).join("");
    $("#seekList").innerHTML = seek.map(seekHTML).join("");
    $("#traineeList").innerHTML = tr.length ? tr.map(traineeHTML).join("") : `<p class="empty">${esc(t("jobs.empty"))}</p>`;
    $("#jobsEmpty").hidden = state.jobsTab === "trainee" || (state.jobsTab === "hire" ? hire.length : seek.length) > 0;

    $("#traineeFlow").innerHTML = [1, 2, 3, 4, 5].map((i) => `<li>${esc(t("jobs.tr.s" + i))}</li>`).join("");
    $("#partnerTypes").innerHTML = [["school", "cap"], ["office", "briefcase"], ["veteran", "medal"]].map(([k, ic]) =>
      `<div class="partner"><span class="p-ic">${icon(ic)}</span><strong>${esc(t(`jobs.tr.${k}.t`))}</strong><span>${esc(t(`jobs.tr.${k}.d`))}</span></div>`
    ).join("");
    $("#regionGrid").innerHTML = D.regions.filter((r) => r.id !== "all").map((r) =>
      `<div class="region"><strong>${esc(L(r.name))}</strong><span>${esc(t("jobs.tr.recruiting"))}</span></div>`
    ).join("");
  }

  /* ---------- 수강권 ---------- */
  function renderPlans() {
    const li = (key, hl) => `<li${hl ? ' class="hl"' : ""}>${icon("check")}<span>${esc(t(key))}</span></li>`;
    const pr = priceItem(state.country || state.homeCountry);
    const cname = countryNamer();
    $("#plansGrid").innerHTML = `
      <article class="plan">
        <div class="plan-top"><span class="pill pill-gov">${esc(t("plan.gov.badge"))}</span><span class="country-label">${esc(t("plan.koreaOnly"))}</span></div>
        <h3>${esc(t("plan.gov.name"))}</h3>
        <p class="plan-price">${esc(t("plan.gov.price"))}</p>
        <p class="plan-sub">${esc(t("plan.gov.sub"))}</p>
        <ul>${li("plan.gov.b1")}${li("plan.gov.b2")}${li("plan.gov.b3")}</ul>
        <button class="btn btn-line" type="button" data-soon>${esc(t("plan.gov.btn"))}</button>
      </article>
      <article class="plan featured">
        <div class="plan-top"><span class="plan-pass">NEO PASS</span><span class="pill pill-dark">${esc(t("plan.voucher.badge"))}</span></div>
        <h3>${esc(t("plan.voucher.name"))}</h3>
        <p class="plan-price">${esc(t("plan.voucher.price"))}</p>
        <p class="plan-sub">${esc(t("plan.voucher.sub"))}</p>
        <ul>${li("plan.voucher.b1")}${li("plan.voucher.b2", true)}${li("plan.voucher.b3")}${li("plan.voucher.b4")}</ul>
        <p class="country-label">${esc(t("plan.koreaOnly"))}</p>
        <button class="btn btn-dark" type="button" data-soon>${esc(t("plan.voucher.btn"))}</button>
      </article>
      <article class="plan">
        <div class="plan-top"><span class="plan-pass">NEO PASS</span><span class="pill">${esc(t("plan.monthly.badge"))}</span></div>
        <h3>${esc(t("plan.monthly.name"))}</h3>
        <p class="plan-price">${esc(priceFor(pr.id))}<small>${esc(t("plan.monthly.unit"))}</small></p>
        ${pr.perDay ? `<p class="plan-perday">${esc(t("plan.monthly.perDay"))}</p>` : ""}
        <p class="plan-sub">${esc(t("plan.monthly.sub"))}</p>
        <label class="country-pick"><span class="country-label">${esc(t("plan.country"))}</span>
          <select id="countrySelect">${sortedPricing(cname).map((x) => `<option value="${x.id}"${x.id === pr.id ? " selected" : ""}>${esc(cname(x.id))} · ${esc(priceFor(x.id))}</option>`).join("")}</select></label>
        <ul>${li("plan.monthly.b1")}${li("plan.monthly.b2", true)}${li("plan.monthly.b3")}${li("plan.monthly.b4")}</ul>
        <button class="btn btn-dark" type="button" data-soon>${esc(t("plan.monthly.btn"))}</button>
      </article>`;
    $("#pickList").innerHTML = [1, 2, 3, 4].map((i) => `<li><span>${esc(t(`plans.pick${i}.c`))}</span><strong>${esc(t(`plans.pick${i}.r`))}</strong></li>`).join("");
    renderPriceTable();
  }
  // 대한민국 먼저, 나머지는 보는 언어의 이름 순서대로
  function sortedPricing(cname) {
    let coll = null;
    try { coll = new Intl.Collator(LOCALE[lang]); } catch (_) { /* 무시 */ }
    const rest = D.pricing.filter((x) => x.id !== "KR")
      .sort((a, b) => (coll ? coll.compare(cname(a.id), cname(b.id)) : cname(a.id) < cname(b.id) ? -1 : 1));
    return [D.pricing.find((x) => x.id === "KR"), ...rest];
  }
  function renderPriceTable() {
    const cname = countryNamer();
    $("#ptGroups").innerHTML = `
      <div class="pt-group">
        <ul class="pt-list">${sortedPricing(cname).map((x) => `
          <li class="pt-row${x.id === state.homeCountry ? " is-you" : ""}">
            <span class="pt-name">${esc(cname(x.id))}</span>
            <span class="pt-price">${esc(priceFor(x.id))}</span>
            <span class="pt-approx">${x.id === "KR" && lang === "ko" ? "" : esc(approxMoney(x.usd))}</span>
          </li>`).join("")}</ul>
      </div>`;
  }

  /* ---------- 베테랑 스튜디오 ---------- */
  function renderVeteran() {
    const ways = [["way1", "video", "#7a4dff", false], ["way2", "users", "#e03a7a", true], ["way3", "briefcase", "#2f6bff", true]];
    $("#vetWays").innerHTML = ways.map(([k, ic, c, soon]) =>
      `<article class="way" style="--c:${c}"><span class="w-ic">${icon(ic)}</span><strong>${esc(t(`vet.${k}.t`))}${soon ? `<span class="soon-tag">${esc(t("common.prep"))}</span>` : ""}</strong><p>${esc(t(`vet.${k}.d`))}</p></article>`
    ).join("");
    $("#vetKpis").innerHTML = [1, 2, 3, 4].map((i) => `<div class="kpi"><span>${esc(t("vet.kpi" + i))}</span><strong>${esc(t("vet.kpi" + i + "v"))}</strong></div>`).join("");
    $("#upSteps").innerHTML = [1, 2, 3, 4].map((i) => `<li><b>${i}</b>${esc(t("vet.step" + i))}</li>`).join("");
    const upCat = $("#upCat");
    const upLevel = $("#upLevel");
    const cv = upCat.value || D.categories[0].id;
    const lv = upLevel.value || "pro";
    upCat.innerHTML = D.categories.map((c) => `<option value="${c.id}">${esc(L(c.name))}</option>`).join("");
    upCat.value = cv;
    upLevel.innerHTML = ["beginner", "pro", "expert"].map((l) => `<option value="${l}">${esc(t("level." + l))}</option>`).join("");
    upLevel.value = lv;
    $("#payGrid").innerHTML = [1, 2, 3].map((i) => `<div class="pay"><strong>${esc(t(`vet.pay${i}.t`))}</strong><p>${esc(t(`vet.pay${i}.d`))}</p></div>`).join("");
    $("#vetPerks").innerHTML = [1, 2, 3, 4].map((i) =>
      `<div class="perk"><strong>${esc(t(`vet.perk${i}.t`))}${i === 1 ? `<span class="soon-tag">${esc(t("common.prep"))}</span>` : ""}</strong><p>${esc(t(`vet.perk${i}.d`))}</p></div>`
    ).join("");
    $("#vetWho").innerHTML = [1, 2, 3, 4].map((i) => `<li>${esc(t("vet.who" + i))}</li>`).join("");
    $("#vetGuide").innerHTML = [1, 2, 3, 4, 5, 6].map((i) => `<div class="tip"><b>${i}</b><strong>${esc(t(`vet.g${i}.t`))}</strong><p>${esc(t(`vet.g${i}.d`))}</p></div>`).join("");
    $("#vetSteps").innerHTML = [1, 2, 3, 4, 5].map((i) => `<li>${esc(t("vet.r" + i))}</li>`).join("");
    updateCalc();
  }
  // 한 달 수입 계산기 (예시): 영상 제작비 + 국비 과정 몫. 구독 수익 나눔은 '볼수록 더해진다'고만 보여준다
  // 기본값(소유자 요청 '혹할 금액'): 10분 이상 20분 미만 10편(80만) + 국비 수강생 10명 × 50만 × 30%(150만) = 월 230만 원
  function updateCalc() {
    const lenSel = $("#inLen");
    const cur = lenSel.value || "mid";
    lenSel.innerHTML = D.payRates.map((r) => `<option value="${r.id}">${esc(t("vet.len." + r.id))} · ${esc(t("vet.len.each", { p: money(r.fee) }))}</option>`).join("");
    lenSel.value = cur;
    const v = Number($("#inVideos").value);
    const g = Number($("#inViewers").value);
    const fee = (D.payRates.find((r) => r.id === lenSel.value) || D.payRates[1]).fee;
    const feeSum = v * fee;
    const govSum = Math.round(g * D.vetShare.govFeeExample * D.vetShare.gov);
    $("#outVideos").textContent = t("unit.videos", { n: fmt(v) });
    $("#outViewers").textContent = t("unit.people", { n: fmt(g) });
    const month = feeSum + govSum;
    $("#calcMonth").textContent = money(month);
    $("#calcBreak").textContent = `${t("vet.calc.feeLine", { a: money(feeSum) })} · ${t("vet.calc.govLine", { b: money(govSum) })}`;
    $("#calcYear").textContent = money(month * 12);
  }

  // 영상 올리기는 로그인 후에만 (지금은 화면에 파일 선택 칸이 없음)
  ["#inVideos", "#inViewers"].forEach((sel) => $(sel).addEventListener("input", updateCalc));
  $("#inLen").addEventListener("change", updateCalc);

  /* ---------- 로그인·회원가입 (수퍼베이스) ----------
   * 설정값(config.js)이 있을 때만 켜진다. 없으면 버튼을 눌러도 '곧 열려요' 알림만
   * - 이메일·비밀번호, 구글 (카카오는 소유자 요청으로 뺌) / 비밀번호 찾기(메일 링크) → 돌아오면 새 비밀번호 정하기
   * - 로그인해도 베테랑 영상 올리기·정산은 계속 '서비스 준비 중'
   */
  const CFG = window.NEO_CONFIG || {};
  const authOn = /^https:\/\/[\w.-]+$/.test(CFG.supabaseUrl || "") && String(CFG.supabaseAnonKey || "").length > 20;
  const SB_SRC = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"; // 새 공개 키(sb_publishable_)도 쓰려고 최신 2.x
  let sb = null;
  let authUser = null;
  let authMode = "login";
  let authMsg = null; // { type: "ok"|"err", text }
  let authBusy = false;
  // 수퍼베이스에서 켜진 소셜 로그인만 버튼을 보여준다 (안 켠 로그인을 누르면 수퍼베이스 오류 화면으로 넘어가서)
  // 확인이 안 되면 이미 켜 둔 구글만 (2026-11-06 소유자: 안 되는 건 빼)
  let socialOn = { google: true, kakao: false, naver: false, line: false };
  async function loadProviders() {
    try {
      const res = await fetch(CFG.supabaseUrl + "/auth/v1/settings", { headers: { apikey: CFG.supabaseAnonKey }, cache: "no-store", credentials: "omit" });
      if (!res.ok) return;
      const j = await res.json();
      const ext = (j && j.external) || {};
      const list = [].concat((j && (j.custom_providers || j.custom_oauth_providers)) || []);
      const custom = (id) => ext["custom:" + id] === true ||
        list.some((x) => x && (x.identifier === "custom:" + id || x.id === "custom:" + id) && x.enabled !== false);
      socialOn = { google: ext.google === true, kakao: ext.kakao === true, naver: custom("naver"), line: custom("line") };
      if (authDlg.open) renderAuth();
    } catch (_) { /* 확인이 안 되면 구글만 */ }
  }
  let authDelOk = false;   // 회원 탈퇴 확인란
  let authDeleted = false; // 탈퇴 직후 '로그아웃했어요' 대신 '탈퇴했어요'를 보이게
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.src = src; el.async = true;
      el.onload = resolve; el.onerror = () => reject(new Error("load " + src));
      document.head.appendChild(el);
    });
  }
  const userLabel = (u) => {
    const m = (u && u.user_metadata) || {};
    return m.name || m.full_name || m.nickname || m.preferred_username || (u && u.email ? u.email.split("@")[0] : "");
  };
  function renderUser() {
    const on = !!authUser;
    $$(".auth-btn").forEach((b) => { b.hidden = on; });
    $("#userWrap").hidden = !on;
    if (on) {
      const name = userLabel(authUser);
      $("#userName").textContent = name;
      $("#userAva").textContent = (name || "?").slice(0, 1).toUpperCase();
      $("#userEmail").textContent = authUser.email || "";
      $("#userBtn").setAttribute("aria-label", t("auth.menu"));
    } else {
      $("#userMenu").hidden = true;
    }
    renderDrawer();
  }
  const authErr = (e) => {
    const m = String((e && (e.message || e.error_description)) || "").toLowerCase();
    if (m.includes("not enabled") || m.includes("unsupported provider") || m.includes("provider not found")) return t("auth.notReady"); // 아직 수퍼베이스에서 안 켠 로그인
    if (m.includes("invalid login")) return t("auth.err.invalid");
    if (m.includes("already registered") || m.includes("already been registered")) return t("auth.err.exists");
    if (m.includes("not confirmed")) return t("auth.err.unconfirmed");
    if (m.includes("password") && (m.includes("least") || m.includes("short"))) return t("auth.err.short");
    if (m.includes("email") && (m.includes("invalid") || m.includes("valid"))) return t("auth.err.email");
    if (m.includes("rate") || m.includes("security purposes") || m.includes("too many")) return t("auth.err.rate");
    return t("auth.err.generic");
  };
  const G_LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.7V6.6H1.4a12 12 0 0 0 0 10.8z"/><path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"/></svg>';
  const K_LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#191919" d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.8 5.3 4.6 6.7l-1 3.6c-.1.3.3.6.6.4l4.3-2.8c.5.1 1 .1 1.5.1 5.5 0 10-3.6 10-8S17.5 3 12 3z"/></svg>';
  const N_LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M13.6 12.7 10.2 7.8H7v8.400h3.400v-4.900l3.400 4.900H17V7.800h-3.400z"/></svg>';
  const L_LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 3C6.5 3 2 6.5 2 10.8c0 3.8 3.4 7 8 7.6.3.100.7.200.8.500.1.300.1.700 0 1l-.1.800c0 .3-.2 1 .9.500s5.800-3.400 7.900-5.800C21.100 13.800 22 12.400 22 10.800 22 6.500 17.500 3 12 3z"/></svg>';
  function renderAuth() {
    const box = $("#authBody");
    const msg = authMsg ? `<p class="auth-msg ${authMsg.type === "ok" ? "is-ok" : "is-err"}" role="${authMsg.type === "ok" ? "status" : "alert"}">${esc(authMsg.text)}</p>` : "";
    const busy = authBusy ? " disabled" : "";
    const submit = (key) => `<button class="btn btn-dark auth-submit" type="submit"${busy}>${esc(authBusy ? t("auth.wait") : t(key))}</button>`;
    const shown = [["google", G_LOGO], ["kakao", K_LOGO], ["naver", N_LOGO], ["line", L_LOGO]].filter(([id]) => socialOn[id]);
    const social = shown.length ? `
      <div class="auth-social">
        ${shown.map(([id, logo]) => `<button class="auth-${id}" type="button" data-auth="${id}"${busy}>${logo}<span>${esc(t("auth." + id))}</span></button>`).join("\n        ")}
      </div>
      <p class="auth-or"><span>${esc(t("auth.or"))}</span></p>` : "";
    // 개인정보처리방침 (따로 떨어진 페이지, 새 창)
    const privacy = `<a class="auth-privacy" href="/privacy?lang=${lang}" target="_blank" rel="noopener">${esc(t("auth.privacy"))}</a>`;
    const field = (id, type, label, auto, extra = "") =>
      `<label class="auth-field"><span>${esc(label)}</span><input id="${id}" type="${type}" autocomplete="${auto}" required${extra}></label>`;
    let html = "";
    if (authMode === "login") {
      html = `<h2 id="authTitle">${esc(t("auth.title.login"))}</h2>${social}
        <form class="auth-form" id="authForm" novalidate>
          ${field("authEmail", "email", t("auth.email"), "email")}
          ${field("authPw", "password", t("auth.password"), "current-password")}
          ${msg}${submit("auth.submit.login")}
          <p class="auth-note">${privacy}</p>
        </form>
        <div class="auth-links"><button type="button" data-auth="forgot">${esc(t("auth.forgot"))}</button><button type="button" data-auth="signup">${esc(t("auth.toSignup"))}</button></div>`;
    } else if (authMode === "signup") {
      html = `<h2 id="authTitle">${esc(t("auth.title.signup"))}</h2>${social}
        <form class="auth-form" id="authForm" novalidate>
          ${field("authName", "text", t("auth.name"), "nickname", ' maxlength="30"')}
          ${field("authEmail", "email", t("auth.email"), "email")}
          ${field("authPw", "password", `${t("auth.password")} (${t("auth.passwordHint")})`, "new-password", ' minlength="8"')}
          ${msg}${submit("auth.submit.signup")}
          <p class="auth-note">${esc(t("auth.note"))} ${privacy}</p>
        </form>
        <div class="auth-links"><button type="button" data-auth="login">${esc(t("auth.toLogin"))}</button></div>`;
    } else if (authMode === "forgot") {
      html = `<h2 id="authTitle">${esc(t("auth.title.forgot"))}</h2>
        <p class="auth-sub">${esc(t("auth.forgotSub"))}</p>
        <form class="auth-form" id="authForm" novalidate>
          ${field("authEmail", "email", t("auth.email"), "email")}
          ${msg}${submit("auth.submit.forgot")}
        </form>
        <div class="auth-links"><button type="button" data-auth="login">${esc(t("auth.toLogin"))}</button></div>`;
    } else if (authMode === "delete") {
      // 회원 탈퇴: 수퍼베이스의 delete_my_account() 함수가 로그인한 본인 계정만 지운다
      html = `<h2 id="authTitle">${esc(t("auth.title.delete"))}</h2>
        <p class="auth-sub">${esc(t("auth.deleteSub"))}</p>
        <form class="auth-form" id="authForm" novalidate>
          <label class="auth-check"><input id="authDelOk" type="checkbox"${authDelOk ? " checked" : ""}${busy}><span>${esc(t("auth.deleteOk"))}</span></label>
          ${msg}<button class="btn auth-submit auth-danger" type="submit"${busy}>${esc(authBusy ? t("auth.wait") : t("auth.submit.delete"))}</button>
        </form>
        <div class="auth-links"><button type="button" data-auth="cancel">${esc(t("auth.cancel"))}</button></div>`;
    } else {
      html = `<h2 id="authTitle">${esc(t("auth.title.reset"))}</h2>
        <form class="auth-form" id="authForm" novalidate>
          ${field("authPw", "password", t("auth.newPassword"), "new-password", ' minlength="8"')}
          ${msg}${submit("auth.submit.reset")}
        </form>`;
    }
    // 다시 그려도 입력한 값은 남긴다
    const keep = {};
    $$("#authBody input").forEach((i) => { keep[i.id] = i.value; });
    box.innerHTML = html;
    Object.keys(keep).forEach((id) => { const i = document.getElementById(id); if (i && id !== "authPw") i.value = keep[id]; });
  }
  function openAuth(mode) {
    if (!authOn || !sb) { toast(t("auth.notReady")); return; }
    authMode = mode; authMsg = null; authBusy = false;
    renderAuth();
    showDialog(authDlg);
    const first = $("#authBody input");
    if (first) setTimeout(() => first.focus(), 50);
  }
  const homeUrl = () => (window.NEO_ORIGINS
    ? window.NEO_ORIGINS.authReturnUrl(location, lang)
    : location.origin + "/" + (lang === "ko" ? "" : "?lang=" + lang));
  function leaveStaleOrigin() {
    const api = window.NEO_ORIGINS;
    if (!api) return false;
    const bounce = api.authBounceUrl(location);
    if (!bounce) return false;
    location.replace(bounce);
    return true;
  }
  async function authSocial(provider) {
    if (leaveStaleOrigin()) return;
    if (!sb) return;
    if (!socialOn[provider]) { toast(t("auth.notReady")); return; }
    session.set("neo.afterLogin", location.hash || "#/");
    authBusy = true; renderAuth();
    // 카카오는 이메일 권한(심사 필요) 없이 닉네임·사진만 받는다. 네이버·라인은 수퍼베이스 '직접 추가' 로그인(custom:naver, custom:line)
    const opts = { redirectTo: homeUrl() };
    if (provider === "kakao") opts.scopes = "profile_nickname profile_image";
    const { error } = await sb.auth.signInWithOAuth({ provider: provider === "naver" || provider === "line" ? "custom:" + provider : provider, options: opts });
    if (error) { authBusy = false; authMsg = { type: "err", text: authErr(error) }; renderAuth(); return; }
    // 보통은 바로 구글 화면으로 넘어간다. 안 넘어가면 몇 초 뒤 버튼을 다시 살린다
    setTimeout(() => { if (authBusy) { authBusy = false; if (authDlg.open) renderAuth(); } }, 6000);
  }
  // 구글 화면에서 뒤로 돌아왔을 때 버튼이 잠긴 채 남지 않게
  window.addEventListener("pageshow", (e) => { if (e.persisted && authBusy) { authBusy = false; if (authDlg.open) renderAuth(); } });
  async function submitAuth() {
    if (leaveStaleOrigin()) return;
    if (!sb || authBusy) return;
    const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
    if (authMode === "delete") { await deleteAccount(); return; }
    const email = v("authEmail");
    const pw = (document.getElementById("authPw") || {}).value || "";
    if (authMode !== "reset" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { authMsg = { type: "err", text: t("auth.err.email") }; renderAuth(); return; }
    if ((authMode === "signup" || authMode === "reset") && pw.length < 8) { authMsg = { type: "err", text: t("auth.err.short") }; renderAuth(); return; }
    authBusy = true; authMsg = null; renderAuth();
    let error = null;
    let done = null;
    try {
      if (authMode === "login") {
        ({ error } = await sb.auth.signInWithPassword({ email, password: pw }));
        if (!error) done = "close";
      } else if (authMode === "signup") {
        const r = await sb.auth.signUp({ email, password: pw, options: { data: { name: v("authName") }, emailRedirectTo: homeUrl() } });
        error = r.error;
        if (!error) done = r.data && r.data.session ? "close" : "checkMail";
      } else if (authMode === "forgot") {
        ({ error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: homeUrl() }));
        if (!error) done = "sentReset";
      } else {
        ({ error } = await sb.auth.updateUser({ password: pw }));
        if (!error) done = "pwChanged";
      }
    } catch (e) { error = e; }
    authBusy = false;
    if (error) { authMsg = { type: "err", text: authErr(error) }; renderAuth(); return; }
    if (done === "close") { closeDialog(authDlg); toast(t("auth.welcome", { name: userLabel(authUser) || email.split("@")[0] })); return; }
    if (done === "pwChanged") { closeDialog(authDlg); toast(t("auth.pwChanged")); return; }
    authMsg = { type: "ok", text: t(done === "checkMail" ? "auth.checkMail" : "auth.sentReset") };
    renderAuth();
  }
  async function deleteAccount() {
    const box = document.getElementById("authDelOk");
    authDelOk = !!(box && box.checked);
    if (!authDelOk) { authMsg = { type: "err", text: t("auth.err.deleteOk") }; renderAuth(); return; }
    authBusy = true; authMsg = null; renderAuth();
    let error = null;
    try { ({ error } = await sb.rpc("delete_my_account")); } catch (e) { error = e || true; }
    authBusy = false;
    // 함수가 아직 없거나 실패하면 이메일로 요청하도록 안내
    if (error) { authMsg = { type: "err", text: t("auth.err.delete") }; renderAuth(); return; }
    authDeleted = true;
    try { await sb.auth.signOut({ scope: "local" }); } catch (_) { /* 계정이 이미 지워져서 실패해도 이 기기에서는 로그아웃 */ }
    authUser = null; authDelOk = false; renderUser();
    closeDialog(authDlg);
    toast(t("auth.deleted"));
  }
  async function initAuth() {
    if (!authOn) return;
    const back = new URL(location.href).searchParams;
    const hadCode = back.has("code");
    const linkError = back.has("error") || back.has("error_code");
    try {
      await loadScript(SB_SRC);
      loadProviders();
      sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
        auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      sb.auth.onAuthStateChange((event, sess) => {
        const before = authUser;
        authUser = sess ? sess.user : null;
        renderUser();
        if (event === "PASSWORD_RECOVERY") { authMode = "reset"; authMsg = null; renderAuth(); showDialog(authDlg); }
        if (event === "SIGNED_IN" && !before && authUser) {
          const back = session.get("neo.afterLogin");
          if (back) {
            session.set("neo.afterLogin", "");
            toast(t("auth.welcome", { name: userLabel(authUser) }));
            if (back !== location.hash) go(back);
          }
        }
        if (event === "SIGNED_OUT" && before) { if (authDeleted) authDeleted = false; else toast(t("auth.loggedOut")); }
      });
      const { data } = await sb.auth.getSession();
      authUser = data && data.session ? data.session.user : null;
      renderUser();
      // 소셜 로그인·메일 링크로 돌아오면 주소에 남는 code 등을 지운다 (화면 주소는 그대로)
      const u = new URL(location.href);
      if (["code", "error", "error_code", "error_description"].some((k) => u.searchParams.has(k))) {
        ["code", "error", "error_code", "error_description"].forEach((k) => u.searchParams.delete(k));
        history.replaceState(null, "", u.pathname + u.search + u.hash);
      }
      if ((hadCode || linkError) && !authUser && !authDlg.open) {
        openAuth("login");
        authMsg = linkError ? { type: "err", text: t("auth.err.link") } : { type: "ok", text: t("auth.afterConfirm") };
        renderAuth();
      }
    } catch (_) {
      sb = null; // 불러오기 실패 → 버튼은 '곧 열려요'
    }
  }
  function toggleUserMenu(open) {
    const menu = $("#userMenu");
    const show = open == null ? menu.hidden : open;
    menu.hidden = !show;
    $("#userBtn").setAttribute("aria-expanded", String(show));
  }
  $("#userBtn").addEventListener("click", (e) => { e.stopPropagation(); toggleUserMenu(); });
  document.addEventListener("click", (e) => { if (!$("#userMenu").hidden && !e.target.closest("#userWrap")) toggleUserMenu(false); });
  document.addEventListener("submit", (e) => {
    if (e.target && e.target.id === "authForm") { e.preventDefault(); submitAuth(); }
  });

  /* ---------- 구글 애드센스 (config.js 값이 있을 때만) ----------
   * 화면마다 맨 아래 한 칸. 화면이 처음 보일 때 채운다 (숨겨진 칸에는 광고가 안 들어가서) */
  const adsOn = /^ca-pub-\d{10,20}$/.test(CFG.adsenseClient || "") && /^\d{6,12}$/.test(String(CFG.adsenseSlot || ""));
  let adsLoaded = false;
  function fillAd(view) {
    if (!adsOn) return;
    const box = $(`.view[data-view="${view}"] .ad-g`);
    if (!box || box.dataset.filled) return;
    if (!adsLoaded) {
      adsLoaded = true;
      const el = document.createElement("script");
      el.async = true; el.crossOrigin = "anonymous";
      el.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CFG.adsenseClient}`;
      document.head.appendChild(el);
    }
    box.hidden = false;
    box.dataset.filled = "1";
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", CFG.adsenseClient);
    ins.setAttribute("data-ad-slot", String(CFG.adsenseSlot));
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");
    box.appendChild(ins);
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (_) { /* 광고가 안 나와도 화면은 그대로 */ }
  }

  /* ---------- 방문자 통계 ----------
   * 따로 설정할 필요 없는 무료 카운터(Abacus · abacus.jasoncameron.dev)에 나라별 숫자만 올린다
   * - 나라: Cloudflare가 알려주는 접속 나라 (/cdn-cgi/trace 의 loc 값)
   * - 같은 기기(브라우저)는 처음 한 번만 센다. 오늘 방문자는 하루에 한 번만 (한국 시간)
   * - 오늘 방문자는 누적에 잡힌 기기만 센다 → 오늘이 누적보다 많아질 수 없다
   * - 검색 로봇·자동 프로그램(headless 브라우저 등)은 세지 않는다
   * - IP 주소는 어디에도 저장하지 않는다
   * - 실서비스 주소(neo-collar.com)에서만 센다. 미리보기 주소에서는 세지 않는다
   * - 아래 목록에 없는 나라는 '기타 나라'(OT), 모르는 나라는 '알 수 없음'(XX)
   * - 2026-11-05 숫자가 꼬인 것을 고치면서 새 이름공간(neocolor-net-2)으로 0부터 다시 셈
   */
  const COUNTER = "https://abacus.jasoncameron.dev";
  const COUNTER_NS = "neocolor-net-2";
  const STAT_COUNTRIES = ["KR", "US", "JP", "CN", "VN", "PH", "ID", "TH", "IN", "MN", "UZ", "AU", "CA", "SA", "AE"];
  const SEEN = "neo.seen2";
  const SEEN_DAY = "neo.seenDay2";
  const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|scan|monitor|python|curl|wget|java\/|okhttp|axios|go-http|phantom|selenium|puppeteer|playwright/i;
  const isBot = () => { try { return navigator.webdriver === true || BOT_UA.test(navigator.userAgent || ""); } catch (_) { return false; } };
  const kstDay = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  const isLive = () => location.protocol === "https:" && /^(www\.)?neo-collar\.com$|^neo-collar\.pages\.dev$/.test(location.hostname);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  // 카운터는 10초에 30번까지만 받는다. 바쁘다고(429) 하면 한 번만 잠깐 기다렸다가 다시
  async function counterFetch(op, key) {
    const url = `${COUNTER}/${op}/${COUNTER_NS}/${key}`;
    let res = await fetch(url, { cache: "no-store", credentials: "omit" });
    if (res.status === 429) {
      await wait(Math.min(Number(res.headers.get("retry-after")) || 10, 15) * 1000 + 300);
      res = await fetch(url, { cache: "no-store", credentials: "omit" });
    }
    return res;
  }
  let visitDone = Promise.resolve();
  async function countVisit() {
    if (!isLive() || isBot()) return;
    const today = kstDay();
    try {
      let seen = store.get(SEEN, false) === true || session.get(SEEN) === "1";
      if (!seen) {
        const cc = (await traceCountry()) || "XX";
        const key = cc === "XX" || cc === "T1" ? "XX" : STAT_COUNTRIES.includes(cc) ? cc : "OT";
        if ((await counterFetch("hit", "c-" + key)).ok) { seen = true; store.set(SEEN, true); session.set(SEEN, "1"); }
      }
      if (seen && store.get(SEEN_DAY, "") !== today && session.get(SEEN_DAY) !== today) {
        if ((await counterFetch("hit", "d-" + today)).ok) { store.set(SEEN_DAY, today); session.set(SEEN_DAY, today); }
      }
    } catch (_) { /* 카운터가 안 되면 조용히 넘어간다 (다음 방문 때 다시 시도) */ }
  }
  async function loadStats() {
    // 방금 불러온 숫자는 20초 동안 다시 쓴다 (카운터 사용 횟수 아끼기)
    if (state.stats && state.stats.ok && Date.now() - state.stats.at < 20000) { renderStats(); return; }
    state.stats = { loading: true };
    renderStats();
    await Promise.race([visitDone, wait(4000)]); // 내 방문이 먼저 기록된 뒤에 읽는다
    const read = async (key) => {
      const res = await counterFetch("get", key);
      if (res.status === 404) return 0;
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      return Number(data && data.value) || 0;
    };
    const keys = [...STAT_COUNTRIES, "OT", "XX"];
    try {
      const [today, ...counts] = await Promise.all([read("d-" + kstDay()), ...keys.map((k) => read("c-" + k))]);
      const countries = keys.map((k, i) => ({ country: k, n: counts[i] })).filter((c) => c.n > 0)
        .sort((a, b) => b.n - a.n || (a.country === "OT" || a.country === "XX" ? 1 : 0) - (b.country === "OT" || b.country === "XX" ? 1 : 0));
      state.stats = { ok: true, today, countries, total: countries.reduce((a, c) => a + c.n, 0), at: Date.now() };
    } catch (_) {
      state.stats = { ok: false };
    }
    if (state.view === "stats") renderStats();
  }
  function regionNamer() {
    let dn = null;
    try { dn = new Intl.DisplayNames([LOCALE[lang]], { type: "region" }); } catch (_) { /* 오래된 브라우저 */ }
    return (code) => {
      if (code === "OT") return t("stats.other");
      if (!code || code === "XX") return t("stats.unknown");
      try { return (dn && dn.of(code)) || code; } catch (_) { return code; }
    };
  }
  function renderStats() {
    const box = $("#statsBody");
    const s = state.stats;
    if (!box || !s) return;
    if (s.loading) { box.innerHTML = `<p class="empty">${esc(t("stats.loading"))}</p>`; return; }
    if (!s.ok) { box.innerHTML = `<p class="info-note">${esc(t("stats.error"))}</p>`; return; }
    const name = regionNamer();
    const max = Math.max(1, ...s.countries.map((c) => c.n));
    const rows = s.countries.map((c) =>
      `<div class="stat-row" role="listitem"><span class="stat-name">${esc(name(c.country))}${c.country.length === 2 && c.country !== "OT" && c.country !== "XX" ? `<small>${esc(c.country)}</small>` : ""}</span><span class="wage-track"><span class="wage-bar" style="--w:${((c.n / max) * 100).toFixed(1)}%"></span></span><span class="stat-val">${esc(fmt(c.n))}<small>${esc(fmt(s.total ? (c.n / s.total) * 100 : 0, 1))}%</small></span></div>`
    ).join("");
    let updated = "";
    try { updated = new Date(s.at).toLocaleString(LOCALE[lang]); } catch (_) { updated = ""; }
    box.innerHTML = `
      <div class="kpis">
        <div class="kpi"><span>${esc(t("stats.total"))}</span><strong>${esc(fmt(s.total))}</strong></div>
        <div class="kpi"><span>${esc(t("stats.today"))}</span><strong>${esc(fmt(s.today))}</strong></div>
      </div>
      <h2 class="sub-title">${esc(t("stats.byCountry"))}</h2>
      ${s.countries.length ? `<div class="stat-list" role="list">${rows}</div>` : `<p class="empty">${esc(t("stats.empty"))}</p>`}
      ${updated ? `<p class="source">${esc(t("stats.updated", { t: updated }))}</p>` : ""}`;
  }

  /* ---------- 강의 상세 창 · 기술 찾기 창 ---------- */
  const courseDlg = $("#courseDlg");
  const quizDlg = $("#quizDlg");
  const authDlg = $("#authDlg");
  function showDialog(dlg) {
    if (dlg.open) return;
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
    document.documentElement.classList.add("modal-open");
  }
  function closeDialog(dlg) {
    if (!dlg || !dlg.open) return;
    if (typeof dlg.close === "function") dlg.close();
    else { dlg.removeAttribute("open"); dlg.dispatchEvent(new Event("close")); }
  }
  const closeAllDialogs = () => $$("dialog[open]").forEach(closeDialog);
  [courseDlg, quizDlg, authDlg].forEach((dlg) => {
    dlg.addEventListener("close", () => {
      if (!$$("dialog[open]").length && drawer.hidden) document.documentElement.classList.remove("modal-open");
    });
    dlg.addEventListener("click", (e) => { if (e.target === dlg) closeDialog(dlg); });
  });

  function openCourse(id) {
    if (!courseById[id]) return;
    state.course = id;
    renderCourseDialog();
    showDialog(courseDlg);
    const inner = $(".sheet-inner", courseDlg);
    if (inner) inner.scrollTop = 0;
  }
  function renderCourseDialog() {
    const c = courseById[state.course];
    if (!c) return;
    const cat = catById[c.cat];
    const wid = D.wages.byCat[c.cat];
    const w = wid ? wageById[wid] : null;
    const rms = D.roadmaps.filter((r) => r.courses.includes(c.id));
    const related = D.courses.filter((x) => x.cat === c.cat && x.id !== c.id).slice(0, 4);
    const on = saved.has(c.id);
    $("#courseBody").innerHTML = `
      <div class="cm-hero" style="--c:${cat.color}">
        ${catIcon(cat.id, "thumb-ic")}
        <p class="cm-crumb">${esc(L(cat.name))} › ${esc(L(subName(c)))}</p>
        <h2 id="cmTitle">${esc(L(c.title))}</h2>
        <p>${esc(L(c.desc))}</p>
        <div class="badges">${badgesHTML(c)}</div>
      </div>
      <div class="cm-body">
        <dl class="cm-meta">
          <div><dt>${esc(t("cm.hours"))}</dt><dd>${esc(lengthText(c))}</dd></div>
          <div><dt>${esc(t("cm.level"))}</dt><dd>${esc(t("level." + c.level))}</dd></div>
          <div><dt>${esc(t("cm.format"))}</dt><dd>${esc(t("format." + c.format))}</dd></div>
          <div><dt>${esc(t("cm.subs"))}</dt><dd>${esc(t("cm.subsValue"))}</dd></div>
        </dl>
        ${w ? `<div class="cm-sec"><h3>${esc(t("cm.wage"))}</h3><div class="cm-wage"><strong>${esc(money(w.daily))}</strong><span>${esc(L(w.name))}</span><small>${esc(t("cm.wageSrc"))}</small></div></div>` : ""}
        <div class="cm-sec"><h3>${esc(t("cm.how"))}</h3><ul class="dots">${(govOnly(c) ? ["cm.howGov", "cm.howSingle", "cm.howTaste"] : ["cm.how1"]).map((k) => `<li>${esc(t(k))}</li>`).join("")}</ul>${govOnly(c) ? `<button class="text-link" type="button" data-go="#/plans">${esc(t("cm.howPlans"))}</button>` : ""}</div>
        ${govOnly(c) ? `<div class="cm-sec"><h3>${esc(t("cm.copay"))}</h3><div class="cm-wage"><strong>${esc(t("cm.copayV"))}</strong><span>${esc(t("cm.copayD"))}</span><small>${esc(t("cm.copaySrc"))}</small></div></div>` : ""}
        ${c.format !== "online" ? `<div class="cm-sec"><h3>${esc(t("cm.practice"))}</h3><div class="cm-practice">${esc(t("cm.practiceDesc"))} <button class="text-link" type="button" data-go="#/jobs/trainee">${esc(t("cm.practiceLink"))}</button></div></div>` : ""}
        <div class="cm-sec"><h3>${esc(t("cm.tools"))}</h3><div class="tool-list">${cat.tools.map((x) => `<span>${esc(L(x))}</span>`).join("")}</div></div>
        ${cat.certs.length ? `<div class="cm-sec"><h3>${esc(t("cm.certs"))}</h3><div class="chip-row">${cat.certs.map((x) => `<span class="cert">${esc(L(D.certs[x]))}</span>`).join("")}</div></div>` : ""}
        ${rms.length ? `<div class="cm-sec"><h3>${esc(t("cm.roadmaps"))}</h3><div class="cm-links">${rms.map((r) => `<button type="button" data-go="#/roadmaps/${r.id}">${esc(L(r.name))}</button>`).join("")}</div></div>` : ""}
        ${related.length ? `<div class="cm-sec"><h3>${esc(t("cm.related"))}</h3><div class="cm-related">${related.map((x) => `<button type="button" data-course="${x.id}">${esc(L(x.title))}<small>${esc(lengthText(x))}</small></button>`).join("")}</div></div>` : ""}
        <p class="cm-note">${esc(t("cm.curriculum"))}</p>
      </div>
      <div class="cm-actions">
        <button class="btn btn-line" type="button" data-save="${c.id}" aria-pressed="${on}">${icon("heart")}<span>${esc(t(on ? "card.unsave" : "card.save"))}</span></button>
        ${govOnly(c) ? `<button class="btn btn-dark" type="button" data-soon>${esc(t("cm.single"))}</button>` : `<button class="btn btn-dark" type="button" data-go="#/plans">${esc(t("cm.plans"))}</button>`}
      </div>`;
  }

  function openQuiz() {
    state.quiz = { step: 0, answers: [] };
    renderQuiz();
    showDialog(quizDlg);
  }
  function renderQuiz() {
    const total = D.quiz.length;
    const { step, answers } = state.quiz;
    const box = $("#quizBody");
    if (step >= total) {
      const score = {};
      answers.forEach((ai, qi) => {
        const w = D.quiz[qi].options[ai].w;
        Object.keys(w).forEach((k) => { score[k] = (score[k] || 0) + w[k]; });
      });
      const ranked = D.roadmaps.map((r, i) => ({ r, s: score[r.id] || 0, i })).sort((a, b) => b.s - a.s || a.i - b.i);
      box.innerHTML = `<div class="quiz">
        <h2 id="quizTitle">${esc(t("quiz.title"))}</h2>
        <div class="q-bar" style="--p:100%"><i></i></div>
        <h3>${esc(t("quiz.resultTitle"))}</h3>
        <div class="q-result">${rmCardHTML(ranked[0].r)}<p class="alt-label">${esc(t("quiz.resultAlt"))}</p>${rmCardHTML(ranked[1].r)}</div>
        <button class="q-back" type="button" data-q-retry>↺ ${esc(t("quiz.retry"))}</button>
      </div>`;
      return;
    }
    const q = D.quiz[step];
    box.innerHTML = `<div class="quiz">
      <h2 id="quizTitle">${esc(t("quiz.title"))}</h2>
      <p class="q-step">${esc(t("quiz.step", { n: step + 1, total }))}</p>
      <div class="q-bar" style="--p:${((step / total) * 100).toFixed(0)}%"><i></i></div>
      <h3>${esc(L(q.q))}</h3>
      <div class="q-opts">${q.options.map((o, i) => `<button type="button" data-q-opt="${i}">${esc(L(o.t))}</button>`).join("")}</div>
      ${step > 0 ? `<button class="q-back" type="button" data-q-back>← ${esc(t("quiz.back"))}</button>` : ""}
    </div>`;
  }

  /* ---------- 관심 강의 ---------- */
  function updateSavedCount() {
    const el = $("#savedCount");
    el.textContent = String(saved.size);
    el.hidden = saved.size === 0;
  }
  function toggleSave(id) {
    if (!courseById[id]) return;
    const on = !saved.has(id);
    if (on) saved.add(id); else saved.delete(id);
    store.set("neo.saved", [...saved]);
    $$(`.save-btn[data-save="${id}"]`).forEach((b) => {
      b.setAttribute("aria-pressed", String(on));
      b.setAttribute("aria-label", t(on ? "card.unsave" : "card.save"));
    });
    updateSavedCount();
    toast(t(on ? "toast.saved" : "toast.unsaved"));
    if (state.view === "courses") renderCourses();
    if (courseDlg.open && state.course === id) renderCourseDialog();
  }

  /* ---------- 주소(라우팅) ---------- */
  const VIEWS = ["home", "courses", "roadmaps", "community", "jobs", "plans", "veteran", "ads", "stats", "contact"];
  function parseRoute() {
    const raw = (location.hash || "#/").slice(1);
    const legacy = raw.match(/^cat=([\w-]+)/);
    if (legacy) return { view: "courses", a: legacy[1], b: null, params: new URLSearchParams() };
    const qi = raw.indexOf("?");
    const path = qi >= 0 ? raw.slice(0, qi) : raw;
    const params = new URLSearchParams(qi >= 0 ? raw.slice(qi + 1) : "");
    const parts = path.split("/").filter(Boolean);
    const view = VIEWS.includes(parts[0]) ? parts[0] : "home";
    return { view, a: parts[1] || null, b: parts[2] || null, params };
  }
  function go(hash) {
    if (location.hash === hash) handleRoute();
    else location.hash = hash;
  }
  // 부드러운 스크롤(CSS) 없이 바로 이동. 진행 중이던 부드러운 스크롤도 여기서 끊는다
  function instantly(fn) {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    void html.offsetHeight; // 모드가 바뀌어 머리글 높이가 달라진 것을 먼저 반영
    fn();
    html.style.scrollBehavior = prev;
  }
  const jumpTop = () => instantly(() => window.scrollTo(0, 0));
  // 목록을 다시 그려도 키보드 초점이 같은 버튼에 남도록
  function keepFocus(render) {
    const a = document.activeElement;
    const host = a && a !== document.body && a.parentElement ? a.parentElement.closest("[id]") : null;
    const key = host
      ? a.getAttributeNames().filter((n) => n.startsWith("data-")).map((n) => `[${n}="${CSS.escape(a.getAttribute(n))}"]`).join("")
      : "";
    render();
    if (host && key && !a.isConnected && host.isConnected) {
      const next = host.querySelector(key);
      if (next) next.focus({ preventScroll: true });
    }
  }
  function handleRoute() { keepFocus(route); }
  function route() {
    const r = parseRoute();
    const prev = state.view;
    state.view = r.view;
    const mode = r.view === "veteran" ? "veteran" : "student";
    document.body.dataset.view = r.view;
    document.body.dataset.mode = mode;
    if (mode === "student") state.lastStudent = location.hash || "#/";
    $$(".view").forEach((v) => { v.hidden = v.dataset.view !== r.view; });
    const navKey = r.view === "veteran" ? "veteran-" + (["upload", "payout", "guide"].includes(r.a) ? r.a : "top") : r.view;
    $$("[data-nav]").forEach((a) => { if (a.dataset.nav === navKey) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    $$(".mode button[data-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
    closeMenus();
    closeAllDialogs();

    if (r.view === "courses") {
      state.cat = catById[r.a] ? r.a : "all";
      state.sub = state.cat !== "all" && catById[state.cat].subs.some((s) => s.id === r.b) ? r.b : null;
      state.q = r.params.get("q") || "";
      const lv = r.params.get("level");
      state.filters.level = ["beginner", "pro", "expert"].includes(lv) ? lv : null;
      state.filters.saved = r.params.get("saved") === "1";
      state.filters.clip = r.params.get("clip") === "1";
      state.filters.online = r.params.get("online") === "1";
      state.filters.gov = r.params.get("gov") === "1";
      state.limit = pageSize();
      $("#searchInput").value = state.q;
      renderCourses();
    } else if (r.view === "jobs") {
      state.jobsTab = ["hire", "seek", "trainee"].includes(r.a) ? r.a : "hire";
      renderJobs();
    } else if (r.view === "community") {
      state.commTab = r.a === "terms" ? "terms" : "boards";
      renderCommunity();
    } else if (r.view === "stats") {
      loadStats();
    } else if (r.view === "contact") {
      const tp = r.params.get("topic");
      state.contactTopic = CONTACT_TOPICS.includes(tp) ? tp : "etc";
      renderContact();
    }

    requestAnimationFrame(() => fillAd(r.view));
    const heroClip = document.getElementById("heroVideo");
    if (heroClip && !heroClip.dataset.broken) {
      if (r.view === "home") { if (!reducedMotion && heroClip.querySelector("source[src]")) heroClip.play().catch(() => {}); }
      else heroClip.pause();
    }

    let target = null;
    if (r.view === "roadmaps" && rmById[r.a]) target = document.getElementById("rm-" + r.a);
    if (r.view === "veteran" && ["upload", "payout", "guide"].includes(r.a)) target = document.getElementById("vet-" + r.a);
    if (r.view === "plans" && r.a === "countries") target = document.getElementById("priceTable");
    if (target) {
      if (prev !== r.view) jumpTop();
      requestAnimationFrame(() => {
        if (prev === r.view) target.scrollIntoView({ behavior: "smooth", block: "start" });
        else instantly(() => target.scrollIntoView({ block: "start" }));
        if (target.classList.contains("rm-full")) { target.classList.remove("flash"); void target.offsetWidth; target.classList.add("flash"); }
      });
    } else if (prev !== r.view) {
      jumpTop();
    }
  }
  function goMode(mode) {
    if (mode === "veteran") go("#/veteran");
    else go(state.lastStudent && !state.lastStudent.startsWith("#/veteran") ? state.lastStudent : "#/");
  }

  /* ---------- 클릭 처리 (한곳에서) ---------- */
  const CLICK_SEL = [
    "[data-save]", "[data-course]", "[data-cat]", "[data-search]", "[data-soon]", "[data-auth]", "button[data-mode]", "[data-lang]",
    "[data-go]", "[data-quiz]", "[data-q-opt]", "[data-q-back]", "[data-q-retry]", "[data-filter]", "[data-tab]", "[data-ctab]",
    "[data-term-cat]", "[data-level-tab]", "[data-wage]", "[data-dlg-close]", "[data-mega]", "[data-copy]", "[data-topic]"
  ].join(",");
  document.addEventListener("click", (e) => keepFocus(() => onClick(e)));
  function onClick(e) {
    const el = e.target.closest(CLICK_SEL);
    if (!megaEl.hidden && !e.target.closest("#mega") && !e.target.closest("#menuBtn")) closeMega();
    if (!el) return;
    const ds = el.dataset;
    if (ds.save) { toggleSave(ds.save); return; }
    if (ds.course) { closeMenus(); openCourse(ds.course); return; }
    if (ds.cat) {
      // 강의 목록 안에서 공종을 바꾸면 켜 둔 필터는 그대로, 다른 화면에서 오면 필터 없이
      const keep = state.view === "courses" && !!el.closest(".view");
      go(coursesHash({ ...(keep ? state.filters : {}), cat: ds.cat, sub: ds.sub || null }));
      return;
    }
    if (ds.search != null && el.hasAttribute("data-search")) { go(coursesHash({ q: ds.search })); return; }
    if (el.hasAttribute("data-soon")) { toast(t("toast.soon")); return; }
    if (ds.auth) {
      const a = ds.auth;
      if (a === "logout") { toggleUserMenu(false); closeMenus(); if (sb) sb.auth.signOut(); return; }
      if (a === "google" || a === "kakao" || a === "naver" || a === "line") { authSocial(a); return; }
      if (a === "cancel") { closeDialog(authDlg); return; }
      if (a === "delete") { toggleUserMenu(false); closeMenus(); authDelOk = false; openAuth("delete"); return; }
      if (authDlg.open && (a === "login" || a === "signup" || a === "forgot")) { authMode = a; authMsg = null; renderAuth(); return; }
      closeMenus(); openAuth(a);
      return;
    }
    if (el.matches("button[data-mode]")) { goMode(ds.mode); return; }
    if (ds.copy) { copyText(ds.copy); return; }
    if (ds.topic && state.view === "contact") {
      state.contactTopic = ds.topic;
      history.replaceState(null, "", "#/contact?topic=" + ds.topic);
      keepFocus(renderContact);
      return;
    }
    if (ds.lang) { setLang(ds.lang); return; }
    if (ds.go) { closeAllDialogs(); go(ds.go); return; }
    if (el.hasAttribute("data-quiz")) { openQuiz(); return; }
    if (ds.qOpt != null) { state.quiz.answers[state.quiz.step] = Number(ds.qOpt); state.quiz.step += 1; renderQuiz(); return; }
    if (el.hasAttribute("data-q-back")) { state.quiz.step = Math.max(0, state.quiz.step - 1); renderQuiz(); return; }
    if (el.hasAttribute("data-q-retry")) { state.quiz = { step: 0, answers: [] }; renderQuiz(); return; }
    if (ds.filter) {
      const k = ds.filter;
      const f = { ...state.filters };
      if (k.startsWith("level:")) { const lv = k.slice(6); f.level = f.level === lv ? null : lv; }
      else f[k] = !f[k];
      go(coursesHash({ ...f, cat: state.cat, sub: state.sub, q: state.q }));
      return;
    }
    if (ds.tab) { go("#/jobs/" + ds.tab); return; }
    if (ds.ctab) { go(ds.ctab === "terms" ? "#/community/terms" : "#/community"); return; }
    if (ds.termCat) { state.termCat = ds.termCat; renderTerms(); return; }
    if (ds.levelTab) { state.homeLevel = ds.levelTab; renderLevelTabs(); return; }
    if (ds.wage) {
      state.wage = ds.wage;
      $$("[data-wage]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.wage === state.wage)));
      renderWageDetail();
      return;
    }
    if (el.hasAttribute("data-dlg-close")) { closeDialog(el.closest("dialog")); return; }
    if (ds.mega) { go(coursesHash({ cat: ds.mega })); }
  }
  // 로고를 다시 누르면 맨 위로
  $(".logo").addEventListener("click", () => { if (state.view === "home") jumpTop(); });

  // 메가 메뉴: 마우스를 올린 공종의 강의를 보여줌
  const megaList = $("#megaList");
  const showMega = (e) => { const b = e.target.closest("[data-mega]"); if (b && b.dataset.mega !== megaCat) renderMegaPanel(b.dataset.mega); };
  megaList.addEventListener("mouseover", showMega);
  megaList.addEventListener("focusin", showMega);
  menuBtn.addEventListener("click", () => {
    if (desktopQuery.matches) { if (megaEl.hidden) openMega(); else closeMega(); }
    else openDrawer();
  });
  drawer.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeDrawer(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenus(); });
  desktopQuery.addEventListener("change", () => { closeMenus(); if (state.view === "courses") renderCourses(); });

  // 검색
  const searchForm = $("#searchForm");
  const searchInput = $("#searchInput");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = searchInput.value.trim();
    searchInput.blur();
    go(coursesHash({ q }));
  });
  $("#searchToggle").addEventListener("click", () => {
    searchForm.classList.toggle("open");
    if (searchForm.classList.contains("open")) searchInput.focus();
  });
  $("#clearSearch").addEventListener("click", () => { searchInput.value = ""; go(coursesHash({ ...state.filters, cat: state.cat, sub: state.sub })); });
  $("#moreBtn").addEventListener("click", () => { state.limit += pageSize(); renderCourses(); });

  // 인력사무소 필터
  $("#jobRegion").addEventListener("change", (e) => { state.jobRegion = e.target.value; renderJobs(); });
  $("#jobCat").addEventListener("change", (e) => { state.jobCat = e.target.value; renderJobs(); });

  // 현장 용어 검색
  $("#termSearch").addEventListener("input", (e) => { state.termQ = e.target.value; renderTerms(); });


  /* ---------- 메인 동영상 ---------- */
  const video = $("#heroVideo");
  function armClip(clip) {
    if (!clip) return;
    const fail = () => {
      if (clip.dataset.broken) return;
      clip.dataset.broken = "1";
      clip.removeAttribute("autoplay");
      try { clip.pause(); } catch (_) { /* 무시 */ }
      const source = clip.querySelector("source");
      if (source) source.removeAttribute("src");
      clip.removeAttribute("src");
      try { clip.load(); } catch (_) { /* 포스터만 남긴다 */ }
    };
    clip.addEventListener("error", fail);
    const source = clip.querySelector("source");
    if (source) source.addEventListener("error", fail);
    if (reducedMotion) { clip.removeAttribute("autoplay"); clip.pause(); }
  }
  armClip(video);
  if ("IntersectionObserver" in window && video && video.querySelector("source[src]")) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (video.dataset.broken) return;
        if (!entry.isIntersecting) video.pause();
        else if (state.view === "home" && !reducedMotion) video.play().catch(() => {});
      });
    }, { threshold: 0.15 }).observe(video);
  }

  /* ---------- 글자 크게 ---------- */
  const sizeBtn = $("#sizeBtn");
  function setBig(on) {
    document.documentElement.classList.toggle("big-text", on);
    sizeBtn.setAttribute("aria-pressed", String(on));
    store.set("neo.big", on);
  }
  sizeBtn.addEventListener("click", () => setBig(!document.documentElement.classList.contains("big-text")));

  /* ---------- 나라 바꾸기 (요금) ---------- */
  document.addEventListener("change", (e) => {
    if (e.target && e.target.id === "countrySelect" && hasPrice(e.target.value)) {
      state.country = e.target.value; // 저장하지 않는다 (다른 나라 요금을 잠깐 보는 것뿐)
      keepFocus(renderPlans);
    }
  });
  // 홈·수강권의 기본 요금은 실제로 접속한 나라로 (모르면 브라우저 언어로 짐작한 나라, 한국어면 한국)
  async function applyTraceCountry() {
    const cc = await traceCountry();
    if (cc && hasPrice(cc) && cc !== state.homeCountry) {
      state.homeCountry = cc;
      renderPlans();
      renderPlanTeaser();
    }
  }

  /* ---------- 언어 바꾸기 ---------- */
  function setLang(l) {
    if (!LANGS.includes(l) || l === lang) return;
    lang = l;
    store.set("neo.lang", l);
    try {
      const u = new URL(location.href);
      if (l === "ko") u.searchParams.delete("lang"); else u.searchParams.set("lang", l);
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    } catch (_) { /* 파일로 열었을 때 등은 무시 */ }
    applyStatic();
    renderAll();
  }

  /* ---------- 전체 그리기 ---------- */
  function renderAll() {
    renderQuick();
    renderRow("#rowClips", D.courses.filter((c) => c.kind === "clip").slice(0, 12));
    renderLevelTabs();
    renderWages();
    renderLadder();
    renderPlanTeaser();
    $("#rmScroller").innerHTML = D.roadmaps.map(rmCardHTML).join("");
    renderCommTeaser();
    renderJobsTeaser();
    renderOverseas();
    renderRow("#rowDiy", D.courses.filter((c) => c.diy));
    $("#faqHome").innerHTML = faqHTML();
    $("#faqPlans").innerHTML = faqHTML();
    renderMega();
    renderDrawer();
    renderFooter();
    $("#rmList").innerHTML = D.roadmaps.map(rmFullHTML).join("");
    renderRow("#rowLabor", D.courses.filter((c) => c.cat === "labor"));
    renderCommunity();
    renderJobs();
    renderPlans();
    renderVeteran();
    renderCourses();
    renderStats();
    renderContact();
    updateSavedCount();
    if (courseDlg.open) renderCourseDialog();
    if (quizDlg.open) renderQuiz();
    if (authDlg.open) renderAuth();
  }

  /* ---------- 시작 ---------- */
  setBig(!!store.get("neo.big", false));
  applyStatic();
  renderAll();
  visitDone = countVisit();
  if (leaveStaleOrigin()) { /* 끊긴 주소에서는 로그인을 시작하지 않고 허용된 주소로 옮긴다 */ }
  else initAuth();
  applyTraceCountry();
  handleRoute();
  window.addEventListener("hashchange", handleRoute);
})();
