#!/usr/bin/env node
"use strict";

const assert = require("assert");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const oldApex = "neo" + "color.net";
const oldPages = "neo" + "color.pages.dev";
const oldVercel = "neo" + "color.vercel.app";
const typo = "neo" + "color.com";

function load(rel) {
  const abs = path.join(root, rel);
  delete require.cache[require.resolve(abs)];
  return require(abs);
}

function loc(hostname, extra) {
  const port = extra && extra.port ? String(extra.port) : "";
  const protocol = (extra && extra.protocol) || "https:";
  const origin = protocol + "//" + hostname + (port ? ":" + port : "");
  return Object.assign({
    protocol: protocol,
    hostname: hostname,
    port: port,
    origin: origin,
    search: "",
    hash: ""
  }, extra || {});
}

function check(api, label) {
  assert.strictEqual(api.authReturnUrl(loc("neocollar.vercel.app", { pathname: "/index.html" }), "ko"), "https://neocollar.vercel.app/", label + " dev root");
  assert.strictEqual(api.authReturnUrl(loc("neocollar.vercel.app"), "en"), "https://neocollar.vercel.app/?lang=en", label + " dev lang");
  assert.strictEqual(api.authReturnUrl(loc("neocollar.vercel.app"), "ja"), "https://neocollar.vercel.app/?lang=ja", label + " dev ja");
  assert.strictEqual(api.authBounceUrl(loc("neocollar.vercel.app", { hash: "#/courses" })), null, label + " dev stays");

  assert.strictEqual(api.authReturnUrl(loc("neocollar1028.vercel.app"), "ko"), "https://neocollar1028.vercel.app/", label + " fallback dev");
  assert.strictEqual(api.authBounceUrl(loc("neocollar1028.vercel.app")), null, label + " fallback stays");

  assert.strictEqual(api.classify("neo-collar.com"), "production", label);
  assert.strictEqual(api.authReturnUrl(loc("neo-collar.com"), "ja"), "https://neo-collar.com/?lang=ja", label + " prod");
  assert.strictEqual(api.authBounceUrl(loc("neo-collar.com")), null, label + " prod stays");
  assert.strictEqual(api.authReturnUrl(loc("www.neo-collar.com"), "ko"), "https://www.neo-collar.com/", label + " www stays for same-origin login");
  assert.strictEqual(api.classify("neo-collar.pages.dev"), "production", label);

  const local = loc("localhost", { protocol: "http:", port: "8765" });
  assert.strictEqual(api.classify("localhost"), "local", label);
  assert.strictEqual(api.authReturnUrl(local, "ko"), "http://localhost:8765/", label + " local");
  assert.strictEqual(api.authBounceUrl(local), null, label + " local stays");

  assert.strictEqual(api.classify(oldApex), "stale", label);
  assert.strictEqual(api.authReturnUrl(loc(oldApex), "ko"), "https://neo-collar.com/", label + " old apex");
  assert.strictEqual(api.authBounceUrl(loc(oldApex, { hash: "#/plans" })), "https://neo-collar.com/#/plans", label + " old bounce");
  assert.strictEqual(api.authBounceUrl(loc("www." + oldApex, { search: "?lang=en" })), "https://neo-collar.com/?lang=en", label + " old www");
  assert.strictEqual(api.authBounceUrl(loc(oldApex, { search: "?code=abc" })), null, label + " keep callback");
  assert.strictEqual(api.authReturnUrl(loc(oldPages), "en"), "https://neo-collar.com/?lang=en", label + " old pages");
  assert.strictEqual(api.authBounceUrl(loc(oldVercel, { hash: "#/courses" })), "https://neocollar.vercel.app/#/courses", label + " old vercel alias");
  const typoReturn = api.authReturnUrl(loc(typo), "ko");
  assert.strictEqual(typoReturn, "https://neo-collar.com/", label + " typo");
  assert.ok(!typoReturn.includes(typo), label + " typo not emitted");
  assert.ok(!api.authReturnUrl(loc(oldApex), "en").includes(oldApex), label + " stale not emitted");
  assert.ok(!api.authReturnUrl(loc("neocollar.vercel.app"), "ko").includes("index.html"), label + " no index.html");

  assert.strictEqual(api.classify("imlxvwvfqbyznetkgtmv.supabase.co"), "other", label + " supabase host is not a site origin");
  assert.strictEqual(
    api.authReturnUrl(loc("imlxvwvfqbyznetkgtmv.supabase.co"), "ko"),
    "https://imlxvwvfqbyznetkgtmv.supabase.co/",
    label + " do not rewrite provider host"
  );
}

function jpegSize(file) {
  const data = fs.readFileSync(file);
  let i = 2;
  while (i < data.length - 8) {
    if (data[i] !== 0xff) { i += 1; continue; }
    const marker = data[i + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return { width: data.readUInt16BE(i + 7), height: data.readUInt16BE(i + 5) };
    }
    if (marker === 0xd8 || marker === 0xd9) { i += 2; continue; }
    i += 2 + data.readUInt16BE(i + 2);
  }
  throw new Error("jpeg size " + file);
}

function videoSize(file) {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "csv=p=0", file
  ], { encoding: "utf8" }).trim();
  const [w, h] = out.split(",").map(Number);
  return { width: w, height: h };
}

check(load("public/assets/origins.js"), "public");

const css = fs.readFileSync(path.join(root, "public/assets/style.css"), "utf8");
assert.ok(css.includes("aspect-ratio: 9 / 8"), "pc hero slot matches 720x640");
assert.ok(!css.includes("aspect-ratio: 9 / 16"), "old portrait hero slot removed");
assert.ok(css.includes("mask-image: linear-gradient"), "mobile text sits on a soft fade");
assert.ok(css.includes("object-fit: cover"), "matched 9/8 slot covers without extra crop");
assert.ok(/\.hero-photo figcaption \{[^}]*margin-top:/.test(css), "pc caption stays under the card");
assert.ok(!/\.hero-photo figcaption \{[^}]*position:\s*absolute/.test(css), "caption is not an overlay");
assert.ok(css.includes("grid-column: 1"), "pc copy stays in the left column");
assert.ok(css.includes("grid-column: 2"), "pc hero card stays in the middle");
assert.ok(css.includes("grid-column: 3"), "pc second card stays on the right");
assert.ok(css.includes("prefers-reduced-motion"), "reduced motion hook remains");

const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
assert.ok(html.includes('src="media/card.mp4?v=6"'), "card video wired");
assert.ok(html.includes('src="media/hero.mp4?v=6"'), "hero video wired");
assert.ok(html.includes('id="cardVideo"'), "card element");
assert.ok(html.includes("muted"), "autoplay stays muted");
assert.ok(html.includes("playsinline"), "playsinline");
assert.ok(!html.includes("rooftop"), "old second image removed from the page");
assert.ok(html.includes('rel="canonical" href="https://neo-collar.com/"'), "canonical production origin");
assert.ok(!html.includes("https://" + oldApex), "absolute links do not use the disconnected origin");

const app = fs.readFileSync(path.join(root, "public/assets/app.js"), "utf8");
assert.ok(app.includes("NEO_ORIGINS.authReturnUrl"), "login return uses the origin helper");
assert.ok(app.includes("leaveStaleOrigin"), "stale origin leaves before login");
assert.ok(app.includes('dataset.broken'), "video error falls back");
assert.ok(app.includes("reducedMotion"), "reduced motion still pauses video");
assert.ok(!/homeUrl = \(\) => location\.origin \+ location\.pathname/.test(app), "pathname is not the login return path");

const cfg = fs.readFileSync(path.join(root, "public/assets/config.js"), "utf8");
assert.ok(cfg.includes("https://imlxvwvfqbyznetkgtmv.supabase.co"), "supabase project url unchanged");
assert.ok(!cfg.includes("neo-collar.com"), "supabase url is not a site origin");

const redirects = fs.readFileSync(path.join(root, "public/_redirects"), "utf8");
assert.ok(redirects.includes("/              /soon/   200"), "coming soon rewrite remains");
assert.ok(redirects.includes("/index.html    /        302"), "index redirect remains");
assert.ok(redirects.includes("/assets/*      /        302"), "assets stay hidden on the public domain");

const hero = videoSize(path.join(root, "public/media/hero.mp4"));
const card = videoSize(path.join(root, "public/media/card.mp4"));
const heroPoster = jpegSize(path.join(root, "public/media/hero-poster.jpg"));
const cardPoster = jpegSize(path.join(root, "public/media/card-poster.jpg"));
assert.deepStrictEqual(hero, { width: 720, height: 640 });
assert.deepStrictEqual(card, { width: 786, height: 1048 });
assert.deepStrictEqual(heroPoster, { width: 720, height: 640 });
assert.deepStrictEqual(cardPoster, { width: 786, height: 1048 });
assert.ok(!fs.existsSync(path.join(root, "public/media/rooftop.jpg")), "old rooftop image is not shipped");

const copyOrigins = path.join(root, "neo-collar/assets/origins.js");
if (fs.existsSync(copyOrigins)) {
  check(load("neo-collar/assets/origins.js"), "neo-collar");
  const copyHtml = fs.readFileSync(path.join(root, "neo-collar/index.html"), "utf8");
  assert.ok(copyHtml.includes('src="media/card.mp4?v=6"'), "copied card video");
  assert.ok(!copyHtml.includes("rooftop"), "copied page dropped the old image");
  assert.strictEqual(
    fs.readFileSync(path.join(root, "neo-collar/_redirects"), "utf8"),
    fs.readFileSync(path.join(root, "public/_redirects"), "utf8"),
    "coming soon rules copied unchanged"
  );
  const copyCfg = fs.readFileSync(path.join(root, "neo-collar/assets/config.js"), "utf8");
  assert.ok(copyCfg.includes("https://imlxvwvfqbyznetkgtmv.supabase.co"), "copied supabase url");
  console.log("neo-collar copy ok");
}

console.log("public origin + media checks ok");
