/* NEOCOLOR — 메뉴, 강의 목록, 검색 */
(() => {
  "use strict";

  const DATA = window.NEO;
  if (!DATA) return;

  const { categories, courses, starter } = DATA;
  const catById = Object.fromEntries(categories.map((c) => [c.id, c]));
  const courseById = Object.fromEntries(courses.map((c) => [c.id, c]));
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const shortName = (name) => name.split("·")[0].slice(0, 2);
  const desktopQuery = window.matchMedia("(min-width: 960px)");

  const state = { cat: "all", sub: null, q: "", limit: 12 };
  const pageSize = () => (desktopQuery.matches ? 16 : 12);

  /* ---------- 알림 ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  /* ---------- 강의 카드 ---------- */
  function cardHTML(c) {
    const cat = catById[c.cat];
    const badges = ['<span class="b b-soon">오픈 예정</span>'];
    if (c.gov) badges.push('<span class="b b-gov">국비지원 예정</span>');
    if (c.voucher) badges.push('<span class="b b-voucher">평생교육이용권 예정</span>');
    return `<article class="card" tabindex="0" data-course="${c.id}" aria-label="${esc(c.title)}, 오픈 예정">
      <div class="thumb" style="--c:${cat.color}">
        <span class="thumb-cat">${esc(cat.name)}</span>
        <span class="thumb-sub">${esc(c.sub)}</span>
        <span class="thumb-hours">약 ${c.hours}시간</span>
      </div>
      <div class="card-body">
        <div class="badges">${badges.join("")}</div>
        <h3 class="card-title">${esc(c.title)}</h3>
        <p class="card-desc">${esc(c.desc)}</p>
        <p class="card-meta">${esc(c.level)} · ${esc(c.format)}</p>
      </div>
    </article>`;
  }

  const renderRow = (el, list) => { el.innerHTML = list.map(cardHTML).join(""); };
  renderRow($("#rowStarter"), starter.map((id) => courseById[id]).filter(Boolean));
  renderRow($("#rowGov"), courses.filter((c) => c.gov));
  renderRow($("#rowVoucher"), courses.filter((c) => c.voucher));

  /* ---------- 탭 · 바로가기 · 푸터 ---------- */
  const tabItems = [{ id: "all", name: "전체" }, ...categories];
  $("#catTabs").innerHTML = tabItems
    .map((c) => `<button class="cat-tab" type="button" data-cat="${c.id}" aria-pressed="false">${esc(c.name)}</button>`)
    .join("");
  $("#catChips").innerHTML = tabItems
    .map((c) => `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="false">${esc(c.name)}</button>`)
    .join("");
  $("#quickGrid").innerHTML = categories
    .map(
      (c) => `<button class="quick-item" type="button" data-cat="${c.id}">
        <span class="quick-icon" style="--c:${c.color}">${esc(shortName(c.name))}</span>
        <span>${esc(c.name)}</span>
      </button>`
    )
    .join("");
  $("#footCats").innerHTML = categories
    .map((c) => `<li><button type="button" data-cat="${c.id}">${esc(c.name)}</button></li>`)
    .join("");

  /* ---------- 메가 메뉴 (PC) ---------- */
  const megaEl = $("#mega");
  const menuBtn = $("#menuBtn");
  $("#megaList").innerHTML = categories
    .map(
      (c) => `<li><button type="button" data-mega="${c.id}">
        <span class="dot" style="--c:${c.color}"></span>${esc(c.name)}
      </button></li>`
    )
    .join("");

  function renderMegaPanel(catId) {
    const c = catById[catId];
    const list = courses.filter((x) => x.cat === catId);
    $("#megaPanel").innerHTML = `
      <h3>${esc(c.name)}</h3>
      <p class="desc">${esc(c.desc)}</p>
      <div class="mega-subs">${c.subs
        .map((s) => `<button type="button" data-cat="${c.id}" data-sub="${esc(s)}">${esc(s)}</button>`)
        .join("")}</div>
      <ul class="mega-courses">${list.map((x) => `<li>${esc(x.title)}<span>오픈 예정</span></li>`).join("")}</ul>
      <button type="button" class="mega-all" data-cat="${c.id}">${esc(c.name)} 강의 전체 보기 →</button>`;
    document.querySelectorAll("[data-mega]").forEach((b) => b.classList.toggle("active", b.dataset.mega === catId));
  }
  renderMegaPanel(categories[0].id);

  const megaList = $("#megaList");
  const showMegaFor = (e) => {
    const b = e.target.closest("[data-mega]");
    if (b) renderMegaPanel(b.dataset.mega);
  };
  megaList.addEventListener("mouseover", showMegaFor);
  megaList.addEventListener("focusin", showMegaFor);
  megaList.addEventListener("click", (e) => {
    const b = e.target.closest("[data-mega]");
    if (!b) return;
    applyFilter({ cat: b.dataset.mega, scroll: true });
    closeMenus();
  });

  /* ---------- 모바일 메뉴 ---------- */
  const drawer = $("#drawer");
  $("#drawerBody").innerHTML = `
    <div class="drawer-links">
      <a href="#funding" data-close>국비지원</a>
      <a href="#funding" data-close>평생교육이용권</a>
      <a href="#group" data-close>단체교육</a>
    </div>
    ${categories
      .map(
        (c) => `<div class="drawer-cat">
          <button type="button" data-cat="${c.id}"><span class="dot" style="--c:${c.color}"></span>${esc(c.name)}</button>
          <div class="drawer-subs">${c.subs
            .map((s) => `<button type="button" data-cat="${c.id}" data-sub="${esc(s)}">${esc(s)}</button>`)
            .join("")}</div>
        </div>`
      )
      .join("")}`;

  const openMega = () => { megaEl.hidden = false; menuBtn.setAttribute("aria-expanded", "true"); };
  const closeMega = () => { megaEl.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); };
  const openDrawer = () => {
    drawer.hidden = false;
    document.body.style.overflow = "hidden";
    menuBtn.setAttribute("aria-expanded", "true");
  };
  const closeDrawer = () => {
    drawer.hidden = true;
    document.body.style.overflow = "";
    menuBtn.setAttribute("aria-expanded", "false");
  };
  function closeMenus() {
    if (!megaEl.hidden) closeMega();
    if (!drawer.hidden) closeDrawer();
  }

  menuBtn.addEventListener("click", () => {
    if (desktopQuery.matches) megaEl.hidden ? openMega() : closeMega();
    else openDrawer();
  });
  drawer.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeDrawer();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenus();
  });
  document.addEventListener("click", (e) => {
    if (!megaEl.hidden && !e.target.closest("#mega") && !e.target.closest("#menuBtn")) closeMega();
  });
  desktopQuery.addEventListener("change", closeMenus);

  /* ---------- 필터 · 검색 ---------- */
  function filtered() {
    const q = state.q.trim().toLowerCase();
    return courses.filter((c) => {
      if (state.cat !== "all" && c.cat !== state.cat) return false;
      if (state.sub && c.sub !== state.sub) return false;
      if (q) {
        const hay = [c.title, c.desc, c.sub, catById[c.cat].name, c.format, c.level].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function renderSubChips() {
    const el = $("#subChips");
    if (state.cat === "all") { el.innerHTML = ""; return; }
    const c = catById[state.cat];
    el.innerHTML = [
      `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${!state.sub}">전체</button>`,
      ...c.subs.map(
        (s) => `<button class="chip" type="button" data-cat="${c.id}" data-sub="${esc(s)}" aria-pressed="${state.sub === s}">${esc(s)}</button>`
      ),
    ].join("");
  }

  function renderGrid() {
    const list = filtered();
    $("#courseGrid").innerHTML = list.slice(0, state.limit).map(cardHTML).join("");
    $("#emptyText").hidden = list.length > 0;
    const rest = list.length - state.limit;
    $("#moreWrap").hidden = rest <= 0;
    $("#moreBtn").textContent = `강의 더 보기 (${Math.max(rest, 0)}개 더)`;
    let label;
    if (state.q) label = `‘${esc(state.q)}’ 검색 결과`;
    else if (state.cat === "all") label = "전체 강의";
    else label = esc(catById[state.cat].name) + (state.sub ? ` · ${esc(state.sub)}` : "");
    $("#resultText").innerHTML = `${label} <strong>${list.length}</strong>개`;
    $("#clearSearch").hidden = !state.q;
  }

  function centerPressed(bar) {
    const btn = bar.querySelector('[aria-pressed="true"]');
    if (!btn) return;
    bar.scrollLeft = btn.offsetLeft - bar.clientWidth / 2 + btn.offsetWidth / 2;
  }

  function applyFilter({ cat = "all", sub = null, q = "", scroll = false } = {}) {
    state.cat = catById[cat] ? cat : "all";
    state.sub = state.cat !== "all" && sub && catById[state.cat].subs.includes(sub) ? sub : null;
    state.q = q;
    state.limit = pageSize();
    renderSubChips();
    renderGrid();
    document.querySelectorAll("#catTabs [data-cat], #catChips [data-cat]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.cat === state.cat));
    });
    centerPressed($("#catTabs"));
    centerPressed($("#catChips"));
    try {
      const hash = state.cat === "all" ? "" : `#cat=${state.cat}`;
      history.replaceState(null, "", location.pathname + location.search + hash);
    } catch (_) { /* file:// 등에서는 무시 */ }
    if (scroll) document.getElementById("courses").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // 카테고리 버튼(탭·바로가기·메뉴·푸터·필터 칩) 공통 처리
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-cat]");
    if (!t) return;
    const inFilter = !!t.closest("#catChips, #subChips");
    applyFilter({ cat: t.dataset.cat, sub: t.dataset.sub || null, scroll: !inFilter });
    closeMenus();
  });

  $("#moreBtn").addEventListener("click", () => {
    state.limit += pageSize();
    renderGrid();
  });

  const form = $("#searchForm");
  const input = $("#searchInput");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilter({ q: input.value.trim(), scroll: true });
    input.blur();
  });
  $("#clearSearch").addEventListener("click", () => {
    input.value = "";
    applyFilter({});
  });
  $("#searchToggle").addEventListener("click", () => {
    form.classList.toggle("open");
    if (form.classList.contains("open")) input.focus();
  });

  /* ---------- 오픈 전 안내 ---------- */
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-course]")) toast("정식 오픈 후 수강할 수 있어요");
    else if (e.target.closest("[data-soon]")) toast("정식 오픈 후 이용할 수 있어요");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target instanceof Element && e.target.closest("[data-course]")) {
      toast("정식 오픈 후 수강할 수 있어요");
    }
  });

  /* ---------- 메인 동영상 ---------- */
  const video = $("#heroVideo");
  const soundBtn = $("#soundBtn");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (video && reducedMotion) {
    video.removeAttribute("autoplay");
    video.pause();
  }

  // 브라우저는 소리 있는 자동재생을 막기 때문에, 무음으로 시작하고 버튼을 누르면 소리를 켠다
  if (video && soundBtn) {
    const label = soundBtn.querySelector("span");
    soundBtn.addEventListener("click", () => {
      const turnOn = video.muted;
      video.muted = !turnOn;
      if (turnOn) {
        video.volume = 1;
        video.play().catch(() => {});
      }
      soundBtn.classList.toggle("on", turnOn);
      soundBtn.setAttribute("aria-pressed", String(turnOn));
      soundBtn.setAttribute("aria-label", turnOn ? "동영상 소리 끄기" : "동영상 소리 켜기");
      label.textContent = turnOn ? "소리 끄기" : "소리 켜기";
    });

    // 화면에서 영상이 안 보이면 멈추고, 다시 보이면 이어서 재생 (소리가 계속 나는 것 방지)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) video.pause();
          else if (!reducedMotion || !video.muted) video.play().catch(() => {});
        });
      }, { threshold: 0.15 }).observe(video);
    }
  }

  /* ---------- 시작 ---------- */
  const m = location.hash.match(/^#cat=([\w-]+)/);
  applyFilter({ cat: m ? m[1] : "all" });
  if (m) setTimeout(() => document.getElementById("courses").scrollIntoView({ block: "start" }), 0);
})();
