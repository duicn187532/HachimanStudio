"""Generate the portfolio cover illustrations (assets/img/works/*.svg).

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


def bars(x, y, vals, w=18, gap=10, maxh=120, color=GINGER):
    out = []
    for i, v in enumerate(vals):
        h = v * maxh
        out.append(rect(x + i * (w + gap), y + maxh - h, w, h, color, 4))
    return "".join(out)


def line(points, color=GINGER, width=3, fill=None):
    d = "M" + " L".join(f"{x},{y}" for x, y in points)
    f = f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'
    if fill:
        area = d + f" L{points[-1][0]},{fill} L{points[0][0]},{fill} Z"
        f = f'<path d="{area}" fill="{color}" opacity=".12"/>' + f
    return f


# ---------------------------------------------------------------- covers
def meetbook():
    # Fictional schedule: rooms and bookings are invented for illustration only.
    b = [text(90, 112, "會議室預約", 22, CHAR, 900), text(90, 134, "示意畫面 · 非實際資料", 12, CHAR_L, 400)]
    days = ["一", "二", "三", "四", "五"]
    for i, d in enumerate(days):
        x = 200 + i * 104
        b.append(rect(x, 150, 96, 30, GINGER if i == 2 else CREAM, 8))
        b.append(text(x + 48, 170, "週" + d, 13, WHITE if i == 2 else CHAR, 700, "middle"))
    rooms = ["Room A", "Room B", "Room C"]
    for j, r in enumerate(rooms):
        y = 196 + j * 84
        b.append(text(90, y + 44, r, 14, CHAR, 700))
        b.append(rect(200, y, 512, 72, "#FBF5EE", 10))
    blocks = [(0, 0, 1.2, GINGER, "週會"), (1, 0, .9, SAGE, "1:1"), (3, 0, 1.6, GINGER_L, "設計審查"),
              (0, 1, .7, SAGE, "面試"), (2, 1, 1.4, GINGER, "專案啟動"), (4, 1, .9, GINGER_L, "讀書會"),
              (1, 2, 1.8, GINGER_L, "工作坊"), (3, 2, .8, SAGE, "站會"), (4, 2, .9, GINGER, "回顧")]
    for d, r, w, c, t in blocks:
        x, y = 206 + d * 104, 204 + r * 84
        b.append(rect(x, y, max(60, min(84, 50 * w)), 56, c, 8))
        b.append(text(x + 10, y + 34, t, 13, WHITE if c != GINGER_L else CHAR, 700))
    b.append(rect(560, 92, 152, 40, CHAR, 20) + text(636, 117, "＋ 預約時段", 14, WHITE, 700, "middle"))
    return frame("meeting-room booking · mock-up", "".join(b))


def automl():
    b = [rect(60, 82, 150, 388, "#FBF5EE", 0)]
    for i, t in enumerate(["① 資料", "② 自動訓練", "模型庫", "實驗管理", "網路設計", "Live Script"]):
        y = 110 + i * 46
        b.append(rect(74, y - 20, 122, 34, GINGER if i == 1 else "none", 8))
        b.append(text(88, y + 2, t, 14, WHITE if i == 1 else CHAR, 700))
    b.append(text(236, 118, "Leaderboard", 22, CHAR, 900))
    rows = [("LightGBM", .92), ("XGBoost", .90), ("Random Forest", .87), ("MLP (TF.js)", .84), ("Logistic", .79)]
    for i, (m, v) in enumerate(rows):
        y = 146 + i * 40
        b.append(text(236, y + 20, f"{i + 1}. {m}", 14, CHAR, 700 if i == 0 else 400))
        b.append(rect(400, y + 8, 180, 14, CREAM, 7) + rect(400, y + 8, 180 * v, 14, GINGER if i == 0 else GINGER_L, 7))
        b.append(text(600, y + 20, f"{v:.2f}", 14, CHAR, 700))
    b.append(rect(236, 360, 470, 92, "#FBF5EE", 12))
    b.append(line([(256, 430), (310, 410), (360, 418), (410, 392), (470, 396), (530, 378), (590, 382), (686, 372)],
                  GINGER, 3, 442))
    b.append(text(256, 382, "CV 分數 · 時間預算 3 分鐘", 12, CHAR_L, 400))
    return frame("AutoML Workbench · 離線可用", "".join(b))


def tongling():
    steps = ["需求說明", "知識檢索", "補充資料", "會議助理", "AI 分析", "人工確認", "流程架構", "預覽 PRD", "下載"]
    b = [text(90, 116, "彤靈談心 · PRD 工作台", 22, CHAR, 900)]
    for i, s in enumerate(steps):
        x = 92 + i * 70
        done = i < 5
        b.append(f'<circle cx="{x}" cy="150" r="12" fill="{GINGER if done else CREAM}"/>')
        if i < len(steps) - 1:
            b.append(rect(x + 12, 148, 46, 4, GINGER if i < 4 else CREAM, 2))
        b.append(text(x, 182, s, 11, CHAR if done else CHAR_L, 700 if i == 4 else 400, "middle"))
    b.append(rect(86, 204, 300, 246, "#FBF5EE", 12) + text(104, 232, "知識來源", 15, CHAR, 900))
    for i, (t, sc) in enumerate([("作業規範 v2026.08", "92%"), ("額度計算規則", "88%"),
                                 ("OTP 驗證規格 v3.2", "74%"), ("歷史 PRD v2.4", "69%")]):
        y = 250 + i * 48
        b.append(rect(104, y, 264, 38, WHITE, 8) + text(116, y + 24, t, 13, CHAR, 700)
                 + text(356, y + 24, sc, 12, GINGER, 900, "end"))
    b.append(rect(404, 204, 312, 246, CHAR, 12) + text(424, 234, "AI 建議（待審）", 15, WHITE, 900))
    for i, wdt in enumerate([250, 220, 268, 180, 240, 140]):
        b.append(rect(424, 254 + i * 26, wdt, 10, "#6A5A4E", 5))
    b.append(rect(424, 412, 120, 26, GINGER, 13) + text(484, 430, "人工確認", 12, WHITE, 700, "middle"))
    return frame("tongling · local-first workbench", "".join(b))


def cslab():
    b = [text(90, 116, "CS LAB", 26, CHAR, 900), text(196, 116, "資工互動自學", 16, CHAR_L, 400)]
    labs = ["OS", "NET", "DSA", "DM", "LA", "AI", "CO", "ASM", "ICS"]
    for i, l in enumerate(labs):
        x, y = 90 + (i % 3) * 112, 140 + (i // 3) * 104
        c = [GINGER, SAGE, GINGER_L][i % 3]
        b.append(rect(x, y, 100, 92, c, 14) + text(x + 50, y + 56, l, 24, WHITE if c != GINGER_L else CHAR, 900, "middle"))
    b.append(rect(440, 140, 280, 300, "#FBF5EE", 14) + text(460, 170, "CPU Scheduling · RR", 15, CHAR, 900))
    jobs = [(GINGER, [0, 2, 6]), (SAGE, [1, 4]), (GINGER_L, [3, 5, 7])]
    for r, (c, slots) in enumerate(jobs):
        y = 196 + r * 40
        b.append(text(460, y + 20, f"P{r + 1}", 13, CHAR, 700))
        for s in slots:
            b.append(rect(492 + s * 26, y + 4, 24, 24, c, 4))
    b.append(text(460, 340, "先預測 → 類比 → 機制", 13, CHAR_L, 400))
    b.append(text(460, 362, "→ 模擬器 → 測驗 → 錯題", 13, CHAR_L, 400))
    b.append(rect(460, 390, 120, 30, GINGER, 15) + text(520, 410, "開始模擬", 13, WHITE, 700, "middle"))
    return frame("cs-lab · 9 courses", "".join(b))


def research():
    b = [text(90, 116, "論文精讀室", 24, CHAR, 900)]
    for i, lvl in enumerate(["五歲", "大學生", "研究生"]):
        x = 90 + i * 96
        b.append(rect(x, 132, 88, 30, GINGER if i == 1 else CREAM, 15)
                 + text(x + 44, 152, lvl, 13, WHITE if i == 1 else CHAR, 700, "middle"))
    for i, wdt in enumerate([380, 350, 395, 300, 360, 240]):
        b.append(rect(90, 186 + i * 22, wdt, 10, CREAM_D, 5))
    b.append(rect(90, 330, 400, 110, "#FBF5EE", 12))
    b.append(text(110, 380, "L = Σ  w · ℓ(x, y)", 26, CHAR, 700))
    b.append(text(110, 414, "公式逐符號拆解", 12, CHAR_L, 400))
    b.append(rect(520, 112, 196, 328, CHAR, 14) + text(540, 144, "五維導航", 15, WHITE, 900))
    for i, d in enumerate(["Problem", "Method", "Benchmark", "Contribution", "Gap"]):
        y = 164 + i * 50
        b.append(rect(540, y, 156, 38, "#4E4238", 8) + text(556, y + 25, d, 14, WHITE, 700))
        b.append(paw(680, y + 19, 1.0, GINGER if i < 3 else "#7A6A5E"))
    return frame("self-research · paper reading", "".join(b))


def walk():
    b = [text(400, 96, "Walk 我可遛", 20, CHAR, 900, "middle")]
    for i, (name, info, c) in enumerate([("麻糬 · 柴犬", "週六 9:00 · 大安森林", GINGER),
                                         ("可樂 · 米克斯", "今天 18:30 · 河濱", SAGE),
                                         ("布丁 · 柯基", "週日 7:30 · 社區", GINGER_L)]):
        y = 118 + i * 112
        b.append(rect(298, y, 204, 100, "#FBF5EE", 14) + f'<circle cx="334" cy="{y + 36}" r="22" fill="{c}"/>'
                 + paw(334, y + 36, 1.4, WHITE) + text(366, y + 32, name, 14, CHAR, 900)
                 + text(366, y + 52, info, 11, CHAR_L, 400)
                 + rect(314, y + 68, 82, 22, GINGER, 11) + text(355, y + 83, "媒合", 11, WHITE, 700, "middle")
                 + rect(404, y + 68, 82, 22, CREAM, 11) + text(445, y + 83, "AI 推薦", 11, CHAR, 700, "middle"))
    b.append(rect(298, 456, 204, 24, CREAM, 12) + text(400, 473, "飼主 ⇄ 遛狗者", 11, CHAR, 700, "middle"))
    b.append(text(150, 220, "雙向媒合", 26, GINGER, 900, "middle") + text(150, 252, "React · Express", 14, CHAR_L, 400, "middle")
             + text(150, 274, "SQLite · Ollama", 14, CHAR_L, 400, "middle"))
    b.append(text(650, 220, "信任履歷", 26, SAGE, 900, "middle") + text(650, 252, "照片回報", 14, CHAR_L, 400, "middle")
             + text(650, 274, "AI 判讀", 14, CHAR_L, 400, "middle"))
    return frame("", "".join(b), device="phone")


def garmin():
    b = [text(90, 116, "Garmin Insight", 22, CHAR, 900), text(90, 138, "今日 · 示意資料", 12, CHAR_L, 400)]
    for i, (k, v, c) in enumerate([("HRV", "62 ms", SAGE), ("Body Battery", "78", GINGER), ("睡眠", "7h 24m", GINGER_L), ("訓練負荷", "312", CHAR)]):
        x = 90 + i * 156
        b.append(rect(x, 156, 144, 84, c, 12) + text(x + 14, 184, k, 12, WHITE if c != GINGER_L else CHAR, 700)
                 + text(x + 14, 222, v, 24, WHITE if c != GINGER_L else CHAR, 900))
    b.append(rect(90, 258, 400, 190, "#FBF5EE", 12) + text(108, 284, "HRV 30 天趨勢", 13, CHAR, 900))
    pts = [(110 + i * 12.5, 400 - v) for i, v in enumerate(
        [40, 52, 48, 60, 58, 70, 66, 62, 74, 80, 72, 68, 76, 84, 90, 82, 78, 86, 92, 88, 96, 90, 98, 104, 96, 100, 108, 102, 110, 114])]
    b.append(line(pts, GINGER, 3, 430))
    b.append(rect(506, 258, 204, 190, CHAR, 12) + text(524, 286, "AI 教練", 14, WHITE, 900))
    for i, wdt in enumerate([160, 140, 168, 120, 150]):
        b.append(rect(524, 306 + i * 24, wdt, 10, "#6A5A4E", 5))
    b.append(text(524, 432, "依你的數據回答", 11, GINGER_L, 700))
    return frame("garmin insight · web + iOS", "".join(b))


def avalon():
    b = [text(90, 116, "阿瓦隆 · 線上對局", 22, CHAR, 900)]
    cx, cy, r = 260, 300, 120
    import math
    b.append(f'<circle cx="{cx}" cy="{cy}" r="{r + 30}" fill="#FBF5EE"/><circle cx="{cx}" cy="{cy}" r="58" fill="{SAGE_L}"/>')
    b.append(text(cx, cy + 6, "第 3 回合", 14, CHAR, 900, "middle"))
    for i in range(7):
        a = -math.pi / 2 + i * 2 * math.pi / 7
        x, y = cx + r * math.cos(a), cy + r * math.sin(a)
        c = GINGER if i in (0, 3, 5) else (CHAR if i == 2 else SAGE)
        b.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="22" fill="{c}"/>' + text(x, y + 5, str(i + 1), 13, WHITE, 900, "middle"))
    b.append(rect(440, 112, 276, 150, CHAR, 12) + text(460, 142, "🎙 語音通話中", 14, WHITE, 700))
    for i, wdt in enumerate([200, 236, 170]):
        b.append(rect(460, 162 + i * 26, wdt, 10, "#6A5A4E", 5))
    b.append(rect(440, 280, 276, 160, "#FBF5EE", 12) + text(460, 308, "AI 復盤", 15, CHAR, 900))
    for i, (t, c) in enumerate([("任務 1 · 成功", SAGE), ("任務 2 · 失敗", GINGER), ("任務 3 · 投票中", GINGER_L)]):
        b.append(rect(460, 324 + i * 36, 236, 28, c, 8) + text(472, 343 + i * 36, t, 12, WHITE if c != GINGER_L else CHAR, 700))
    return frame("avalon · mobile multiplayer", "".join(b))


def digitalmaster():
    b = [text(400, 102, "數位達人", 20, CHAR, 900, "middle")]
    b.append(rect(298, 118, 204, 120, GINGER, 16) + text(320, 150, "LV. 進階", 14, WHITE, 900)
             + text(320, 200, "★ 1,280", 30, WHITE, 900) + text(320, 224, "距離下一級 220 ★", 11, WHITE, 400))
    for i, t in enumerate(["出席", "課程", "互動", "案例", "問卷", "測驗"]):
        x, y = 312 + (i % 3) * 62, 256 + (i // 3) * 80
        b.append(f'<circle cx="{x + 26}" cy="{y + 26}" r="26" fill="{[SAGE, GINGER_L, CREAM][i % 3]}"/>'
                 + paw(x + 26, y + 26, 1.4, CHAR, .7) + text(x + 26, y + 70, t, 11, CHAR, 700, "middle"))
    b.append(rect(312, 428, 176, 34, CHAR, 17) + text(400, 450, "兌換獎勵", 13, WHITE, 700, "middle"))
    b.append(text(150, 230, "遊戲化", 28, GINGER, 900, "middle") + text(150, 262, "數位學習激勵", 14, CHAR_L, 400, "middle"))
    b.append(text(650, 230, "徽章 · 等級", 26, SAGE, 900, "middle") + text(650, 262, "React · TypeScript", 14, CHAR_L, 400, "middle"))
    return frame("", "".join(b), device="phone")


def seatdraw():
    b = [text(90, 116, "派對抽座位", 22, CHAR, 900)]
    b.append(rect(90, 140, 300, 300, "#FBF5EE", 150))
    import math
    for i in range(10):
        a = i * 2 * math.pi / 10
        x, y = 240 + 118 * math.cos(a), 290 + 118 * math.sin(a)
        c = GINGER if i == 3 else (SAGE if i in (0, 6, 8) else WHITE)
        b.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="20" fill="{c}" stroke="{CREAM_D}" stroke-width="2"/>'
                 + text(x, y + 5, str(i + 1), 12, WHITE if c != WHITE else CHAR, 900, "middle"))
    b.append(f'<circle cx="240" cy="290" r="62" fill="{CREAM_D}"/>' + text(240, 296, "主桌", 16, CHAR, 900, "middle"))
    b.append(rect(440, 150, 276, 140, CHAR, 14) + text(578, 194, "你的座位", 16, WHITE, 700, "middle")
             + text(578, 254, "No. 4", 46, GINGER_L, 900, "middle"))
    b.append(rect(440, 312, 276, 56, GINGER, 28) + text(578, 347, "抽籤！", 20, WHITE, 900, "middle"))
    b.append(text(440, 400, "已分配 4 / 10 · 不重複", 13, CHAR_L, 400))
    return frame("seat-draw · party", "".join(b))


def classhat():
    b = [text(90, 116, "MBTI 測驗與分組", 22, CHAR, 900)]
    for i, q in enumerate(["聚會後，你通常…", "做決定時，你更依賴…", "面對新專案，你會…"]):
        y = 140 + i * 86
        b.append(rect(90, y, 330, 74, "#FBF5EE", 12) + text(108, y + 28, q, 14, CHAR, 700))
        for j in range(5):
            b.append(f'<circle cx="{120 + j * 34}" cy="{y + 52}" r="9" fill="{GINGER if j == (i + 1) % 5 else CREAM_D}"/>')
    cx, cy = 580, 290
    import math
    axes = ["E", "N", "T", "J", "I", "S", "F", "P"]
    vals = [.8, .6, .7, .5, .3, .5, .45, .65]
    for k in (1, .66, .33):
        pts = " ".join(f"{cx + 120 * k * math.cos(-math.pi / 2 + i * math.pi / 4):.0f},{cy + 120 * k * math.sin(-math.pi / 2 + i * math.pi / 4):.0f}" for i in range(8))
        b.append(f'<polygon points="{pts}" fill="none" stroke="{CREAM_D}" stroke-width="2"/>')
    pts = " ".join(f"{cx + 120 * v * math.cos(-math.pi / 2 + i * math.pi / 4):.0f},{cy + 120 * v * math.sin(-math.pi / 2 + i * math.pi / 4):.0f}" for i, v in enumerate(vals))
    b.append(f'<polygon points="{pts}" fill="{GINGER}" fill-opacity=".35" stroke="{GINGER}" stroke-width="3"/>')
    for i, a in enumerate(axes):
        x, y = cx + 142 * math.cos(-math.pi / 2 + i * math.pi / 4), cy + 142 * math.sin(-math.pi / 2 + i * math.pi / 4)
        b.append(text(x, y + 5, a, 14, CHAR, 900, "middle"))
    return frame("class-hat · mbti", "".join(b))


def news():
    b = [text(90, 116, "新聞時間軸", 22, CHAR, 900)]
    b.append(rect(146, 140, 4, 300, CREAM_D, 2))
    items = [("2023-06", "聯貸案統籌主辦", GINGER), ("2023-08", "數位帳戶新功能", SAGE),
             ("2023-10", "海外分行動態", GINGER_L), ("2023-12", "年度經營回顧", GINGER)]
    for i, (d, t, c) in enumerate(items):
        y = 160 + i * 74
        b.append(f'<circle cx="148" cy="{y}" r="10" fill="{c}"/>' + text(170, y + 5, d, 13, CHAR_L, 700)
                 + rect(250, y - 22, 300, 52, "#FBF5EE", 10) + text(266, y + 2, t, 14, CHAR, 700)
                 + rect(266, y + 12, 200, 6, CREAM_D, 3))
    b.append(rect(580, 140, 136, 300, CHAR, 12) + text(598, 170, "關鍵字", 14, WHITE, 900))
    for i, k in enumerate(["聯貸", "數位", "海外", "ESG", "財報"]):
        b.append(rect(598, 188 + i * 46, 100, 32, "#4E4238", 16) + text(648, 209 + i * 46, k, 13, WHITE, 700, "middle"))
    return frame("news-storage · timeline", "".join(b))


def crawler():
    b = [rect(60, 82, 680, 388, CHAR, 0), text(90, 120, "$ python crawler.py --market tw", 16, GINGER_L, 700)]
    rows = [("2330", "▲ 1.2%", SAGE), ("2317", "▼ 0.4%", GINGER), ("2454", "▲ 2.1%", SAGE), ("2881", "▲ 0.3%", SAGE), ("2412", "▼ 0.1%", GINGER)]
    for i, (c, p, col) in enumerate(rows):
        y = 160 + i * 34
        b.append(text(90, y, c, 15, WHITE, 400) + text(170, y, p, 15, col, 700))
    b.append(text(90, 350, "→ Flask API → AJAX → 前端排版", 14, CREAM_D, 400))
    b.append(text(90, 380, "→ MongoDB 會員 / 員工後台", 14, CREAM_D, 400))
    b.append(rect(420, 140, 290, 200, "#4E4238", 12))
    b.append(line([(440, 300), (480, 280), (520, 290), (560, 240), (600, 250), (640, 200), (690, 190)], GINGER_L, 3))
    b.append(text(440, 168, "股價走勢", 13, WHITE, 700))
    return frame("crawler + flask · 2023", "".join(b), bg="#EFE3D3")


def skuld():
    b = [text(400, 112, "Operation Skuld", 22, CHAR, 900, "middle")]
    b.append(f'<circle cx="400" cy="270" r="120" fill="#FBF5EE" stroke="{CREAM_D}" stroke-width="10"/>')
    b.append(f'<path d="M400 150 A120 120 0 1 1 296 330" fill="none" stroke="{GINGER}" stroke-width="10" stroke-linecap="round"/>')
    b.append(text(400, 282, "25:00", 40, CHAR, 900, "middle") + text(400, 312, "專注中", 14, CHAR_L, 400, "middle"))
    b.append(rect(320, 410, 160, 40, GINGER, 20) + text(400, 436, "開始", 15, WHITE, 700, "middle"))
    return frame("timer · python", "".join(b))


COVERS = {
    "meetbook": meetbook, "automl": automl, "tongling": tongling, "cslab": cslab,
    "research": research, "walk": walk, "garmin": garmin, "avalon": avalon,
    "digitalmaster": digitalmaster, "seatdraw": seatdraw, "classhat": classhat,
    "news": news, "crawler": crawler, "skuld": skuld,
}

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in COVERS.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
    print(f"wrote {len(COVERS)} covers to {OUT}")
