"""Generate the cover illustrations for works without public screenshots (assets/img/works/*.svg).

The covers are hand-drawn UI sketches, not screenshots: they show what each
project does without loading or capturing any running service. In particular
the MeetBook cover is a fictional mock-up with made-up rooms and bookings, so
nothing from the production system is used.

Run:  python3 tools/gen_covers.py
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "assets" / "img" / "works"

GINGER = "#C86A2D"
GINGER_L = "#E9A66F"
CREAM = "#F6E7D6"
CREAM_D = "#EAD3BA"
CHAR = "#3B312A"
CHAR_L = "#7A6A5E"
WHITE = "#FDFDFC"
SAGE = "#9BA487"
SAGE_L = "#D4D9C4"
FONT = "'Lato','PingFang TC','Noto Sans TC','Microsoft JhengHei',sans-serif"

W, H = 800, 500


def text(x, y, s, size=16, fill=CHAR, weight=700, anchor="start", opacity=1):
    return (f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" opacity="{opacity}">{s}</text>')


def rect(x, y, w, h, fill, r=8, extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" {extra}/>'


def paw(cx, cy, s=1.0, fill=GINGER, opacity=1):
    p = [f'<g transform="translate({cx},{cy}) scale({s})" fill="{fill}" opacity="{opacity}">',
         '<ellipse cx="0" cy="4" rx="5.2" ry="4.3"/>',
         '<circle cx="-5.7" cy="-1.7" r="2.1"/><circle cx="-2" cy="-5.4" r="2.2"/>',
         '<circle cx="2.2" cy="-5.4" r="2.2"/><circle cx="5.8" cy="-1.7" r="2.1"/></g>']
    return "".join(p)


def frame(title, body, bg=CREAM, accent=GINGER, device="browser"):
    """Wrap content in a soft background and a browser or phone frame."""
    deco = (f'<circle cx="720" cy="70" r="120" fill="{accent}" opacity=".10"/>'
            f'<circle cx="60" cy="460" r="90" fill="{SAGE}" opacity=".18"/>'
            + paw(745, 455, 2.2, accent, .25) + paw(705, 475, 1.5, accent, .18))
    if device == "phone":
        shell = (rect(270, 30, 260, 470, CHAR, 34) + rect(282, 42, 236, 446, WHITE, 24)
                 + rect(365, 50, 70, 8, CHAR, 4))
        return svg(bg, deco + shell + body)
    shell = (rect(60, 40, 680, 430, WHITE, 16, 'filter="url(#sh)"')
             + f'<path d="M60 56a16 16 0 0 1 16-16h648a16 16 0 0 1 16 16v26H60z" fill="{CREAM_D}"/>'
             + "".join(f'<circle cx="{84 + i * 18}" cy="61" r="5" fill="{c}"/>'
                       for i, c in enumerate([GINGER, GINGER_L, SAGE]))
             + rect(150, 51, 440, 20, WHITE, 10) + text(165, 66, title, 12, CHAR_L, 400))
    return svg(bg, deco + shell + body)


def svg(bg, inner):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img">'
            '<defs><filter id="sh" x="-10%" y="-10%" width="120%" height="130%">'
            f'<feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="{CHAR}" flood-opacity=".16"/></filter></defs>'
            f'{rect(0, 0, W, H, bg, 0)}{inner}</svg>')


def line(points, color=GINGER, width=3, fill=None):
    d = "M" + " L".join(f"{x},{y}" for x, y in points)
    f = f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'
    if fill:
        area = d + f" L{points[-1][0]},{fill} L{points[0][0]},{fill} Z"
        f = f'<path d="{area}" fill="{color}" opacity=".12"/>' + f
    return f


# ---------------------------------------------------------------- covers
def lottery():
    # Booth lottery: prizes set up in an admin page, drawn on the front page. Prizes are made up.
    b = [text(90, 116, "園遊會抽獎", 22, CHAR, 900)]
    b.append(rect(90, 140, 250, 300, "#FBF5EE", 14) + text(110, 172, "後台 · 獎品設定", 14, CHAR, 900))
    for i, (n, q) in enumerate([("頭獎 · 拍立得", "1"), ("二獎 · 藍牙耳機", "2"), ("三獎 · 保溫瓶", "5"), ("參加獎 · 貼紙", "50")]):
        y = 192 + i * 56
        b.append(rect(110, y, 210, 44, WHITE, 10, f'stroke="{CREAM_D}"') + text(124, y + 28, n, 13, CHAR, 700)
                 + text(306, y + 28, "×" + q, 13, GINGER, 900, "end"))
    b.append(f'<path d="M352 290 h40" stroke="{CHAR_L}" stroke-width="3" stroke-dasharray="6 6"/>')
    b.append(f'<path d="M392 282 l10 8 -10 8z" fill="{CHAR_L}"/>')
    b.append(rect(420, 140, 296, 300, CHAR, 14) + text(568, 176, "前台 · 抽獎", 14, WHITE, 700, "middle"))
    b.append(f'<circle cx="568" cy="282" r="78" fill="{GINGER}"/>' + f'<circle cx="568" cy="282" r="60" fill="{GINGER_L}"/>')
    b.append(text(568, 276, "二獎", 24, CHAR, 900, "middle") + text(568, 302, "藍牙耳機", 14, CHAR, 700, "middle"))
    b.append(rect(488, 380, 160, 40, GINGER, 20) + text(568, 406, "抽！", 16, WHITE, 900, "middle"))
    return frame("lottery · fair", "".join(b))


def sentiment():
    # Opinion dashboard sketch: keywords, counts and trends are invented for illustration only.
    b = [text(90, 116, "輿情儀表板", 22, CHAR, 900), text(220, 116, "示意畫面 · 非實際資料", 12, CHAR_L, 400)]
    for i, (lab, val, col) in enumerate([("正面", "62%", SAGE), ("中立", "27%", CREAM_D), ("負面", "11%", GINGER)]):
        x = 90 + i * 140
        b.append(rect(x, 136, 126, 74, "#FBF5EE", 12) + text(x + 16, 162, lab, 13, CHAR_L, 700)
                 + text(x + 16, 196, val, 26, CHAR, 900) + rect(x + 96, 150, 16, 16, col, 8))
    b.append(rect(90, 226, 406, 214, "#FBF5EE", 12) + text(108, 254, "情緒趨勢（近一個月）", 13, CHAR, 900))
    b.append(line([(110, 400), (160, 380), (210, 390), (260, 340), (310, 350), (360, 310), (410, 320), (470, 290)], SAGE, 3, 420))
    b.append(line([(110, 410), (160, 405), (210, 380), (260, 400), (310, 395), (360, 405), (410, 385), (470, 395)], GINGER, 3))
    b.append(rect(516, 136, 200, 304, CHAR, 12) + text(534, 166, "熱門關鍵字", 14, WHITE, 900))
    for i, (k, w) in enumerate([("數位帳戶", 140), ("App 改版", 110), ("客服", 90), ("利率", 70), ("活動", 50)]):
        y = 186 + i * 48
        b.append(text(534, y + 14, k, 13, WHITE, 700) + rect(534, y + 22, w, 8, GINGER_L, 4))
    return frame("sentiment · fastapi", "".join(b))


COVERS = {"lottery": lottery, "sentiment": sentiment}

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in COVERS.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
    print(f"wrote {len(COVERS)} covers to {OUT}")
