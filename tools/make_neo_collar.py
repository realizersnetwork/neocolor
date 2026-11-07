#!/usr/bin/env python3
"""neo-collar.com 사이트 만들기

public/ (neocolor.net) 을 통째로 neo-collar/ 로 복사하면서 이름·주소만 바꾼다.
로그인·회원가입은 같은 수퍼베이스 프로젝트를 그대로 쓴다 (config.js 그대로).

    python3 tools/make_neo_collar.py

- NEO-COLLAR → NEO-COLLAR, 로고 NEO+COLOR → NEO-+COLLAR (2026-11-07 소유자: 하이픈 넣은 NEO-COLLAR)
- neocolor.net → neo-collar.com, neocolor.pages.dev → neo-collar.pages.dev
- 방문자 통계는 따로 센다 (Abacus 이름공간 neocolor-net-2 → neo-collar-com-1)
- 영상·사진 같은 파일은 그대로 복사

public/ 을 고친 뒤 이 스크립트를 다시 돌리면 neo-collar/ 도 똑같이 바뀐다.
"""
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public"
DST = ROOT / "neo-collar"
TEXT = {".html", ".js", ".css", ".txt", ".json", ".xml", ".svg", ".webmanifest", ""}

RULES = [
    # 로고: NEO<span class="...">COLOR</span> → NEO-<span class="...">COLLAR</span> (하이픈은 흰 글자 NEO 쪽)
    (re.compile(r'NEO(<span class="[^"]*">)COLOR(</span>)'), r"NEO-\1COLLAR\2"),
    (re.compile(r"NEO-COLLAR"), "NEO-COLLAR"),
    # 방문자 통계 이름공간 (neocolor.net 숫자와 섞이지 않게)
    (re.compile(r"neocolor-net-2"), "neo-collar-com-1"),
    # 주소 (정규식 안에 쓰인 neocolor\.net 도)
    (re.compile(r"neocolor\\\.net"), r"neo-collar\\.com"),
    (re.compile(r"neocolor\\\.pages\\\.dev"), r"neo-collar\\.pages\\.dev"),
    (re.compile(r"neocolor\.net"), "neo-collar.com"),
    (re.compile(r"neocolor\.pages\.dev"), "neo-collar.pages.dev"),
]


# NEO-COLLAR 로고가 NEO-COLLAR보다 두 글자 길어서, 휴대폰 머리줄이 두 줄로 밀리지 않게 로고만 조금 작게
EXTRA_CSS = """
/* (neo-collar 전용) 로고 NEO-COLLAR 가 길어서 휴대폰에서는 조금 작게 → 머리줄 한 줄 유지 */
@media (max-width: 719px) { .site-header .logo .wordmark { font-size: 20px; } }
@media (max-width: 413px) { html:not([lang="ko"]) .site-header .logo .wordmark { font-size: 18px; } }
@media (max-width: 379px) {
  .site-header .logo .wordmark { font-size: 19px; }
  html:not([lang="ko"]) .site-header .logo .wordmark { font-size: 17px; }
}
"""

# 준비 중 화면(soon/index.html)의 큰 로고도 휴대폰에서 화면 밖으로 나가지 않게
EXTRA_SOON_CSS = """    /* (neo-collar 전용) 로고 NEO-COLLAR 가 길어서 휴대폰에서 화면 밖으로 나가지 않게 조금 작게 */
    .wordmark-xl { font-size: clamp(44px, 14vw, 108px); }
"""


# 화면 글 속 NEO-COLLAR 가 'NEO-' 에서 줄이 바뀌지 않게, 보이는 글에서는 줄바꿈 안 되는 하이픈(U+2011)을 쓴다.
# 제목·메타·화면 읽기(aria-label)·메일 제목·주석 줄은 보통 하이픈 그대로 (검색·복사할 때 같은 글자로 보이게)
KEEP_ASCII = re.compile(r"<title>|<meta |aria-label|subject|^\s*(/\*|\*|//|<!--)")


def nobreak(text: str) -> str:
    return "\n".join(
        line if KEEP_ASCII.search(line) else line.replace("NEO-COLLAR", "NEO‑COLLAR")
        for line in text.split("\n")
    )


def convert(text: str, rel: str = "") -> str:
    for pat, rep in RULES:
        text = pat.sub(rep, text)
    if rel.endswith((".html", ".js")):
        text = nobreak(text)
    if rel == "assets/style.css":
        text = text.rstrip("\n") + "\n" + EXTRA_CSS
    if rel == "soon/index.html":
        text = text.replace("  </style>", EXTRA_SOON_CSS + "  </style>", 1)
    return text


def main() -> int:
    if DST.exists():
        shutil.rmtree(DST)
    for src in sorted(SRC.rglob("*")):
        rel = src.relative_to(SRC)
        dst = DST / rel
        if src.is_dir():
            dst.mkdir(parents=True, exist_ok=True)
            continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        if src.suffix.lower() in TEXT:
            dst.write_text(convert(src.read_text(encoding="utf-8"), rel.as_posix()), encoding="utf-8")
        else:
            shutil.copy2(src, dst)
    # 남은 옛 이름이 있으면 알려준다
    left = []
    for f in DST.rglob("*"):
        if f.is_file() and f.suffix.lower() in TEXT:
            for i, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
                if re.search(r"neocolor|NEO-COLLAR|>COLOR<", line, re.I):
                    left.append(f"{f.relative_to(ROOT)}:{i}: {line.strip()[:90]}")
    print(f"neo-collar/ 만듦: 파일 {sum(1 for f in DST.rglob('*') if f.is_file())}개")
    if left:
        print("옛 이름이 남은 곳:")
        print("\n".join(left))
        return 1
    print("옛 이름 남은 곳 없음")
    return 0


if __name__ == "__main__":
    sys.exit(main())
