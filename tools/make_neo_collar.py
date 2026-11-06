#!/usr/bin/env python3
"""neo-collar.com 사이트 만들기

public/ (neocolor.net) 을 통째로 neo-collar/ 로 복사하면서 이름·주소만 바꾼다.
로그인·회원가입은 같은 수퍼베이스 프로젝트를 그대로 쓴다 (config.js 그대로).

    python3 tools/make_neo_collar.py

- NEOCOLOR → NEOCOLLAR, 로고 NEO+COLOR → NEO+COLLAR
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
    # 로고: NEO<span class="...">COLOR</span> → NEO<span class="...">COLLAR</span>
    (re.compile(r'NEO(<span class="[^"]*">)COLOR(</span>)'), r"NEO\1COLLAR\2"),
    (re.compile(r"NEOCOLOR"), "NEOCOLLAR"),
    # 방문자 통계 이름공간 (neocolor.net 숫자와 섞이지 않게)
    (re.compile(r"neocolor-net-2"), "neo-collar-com-1"),
    # 주소 (정규식 안에 쓰인 neocolor\.net 도)
    (re.compile(r"neocolor\\\.net"), r"neo-collar\\.com"),
    (re.compile(r"neocolor\\\.pages\\\.dev"), r"neo-collar\\.pages\\.dev"),
    (re.compile(r"neocolor\.net"), "neo-collar.com"),
    (re.compile(r"neocolor\.pages\.dev"), "neo-collar.pages.dev"),
]


# NEOCOLLAR 로고가 NEOCOLOR보다 한 글자 길어서, 휴대폰 머리줄이 두 줄로 밀리지 않게 로고만 조금 작게
EXTRA_CSS = """
/* (neo-collar 전용) 로고가 한 글자 길어서 휴대폰에서는 조금 작게 → 머리줄 한 줄 유지 */
@media (max-width: 719px) { .site-header .logo .wordmark { font-size: 20px; } }
@media (max-width: 379px) {
  .site-header .logo .wordmark { font-size: 19px; }
  html:not([lang="ko"]) .site-header .logo .wordmark { font-size: 17px; }
}
"""


def convert(text: str, name: str = "") -> str:
    for pat, rep in RULES:
        text = pat.sub(rep, text)
    if name == "style.css":
        text = text.rstrip("\n") + "\n" + EXTRA_CSS
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
            dst.write_text(convert(src.read_text(encoding="utf-8"), src.name), encoding="utf-8")
        else:
            shutil.copy2(src, dst)
    # 남은 옛 이름이 있으면 알려준다
    left = []
    for f in DST.rglob("*"):
        if f.is_file() and f.suffix.lower() in TEXT:
            for i, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
                if re.search(r"neocolor|NEOCOLOR|>COLOR<", line, re.I):
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
