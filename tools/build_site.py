"""Build the static site from content/*.json and templates/. Run after any edit:

    pip install jinja2          # once
    python3 tools/build_site.py

The admin page (admin/) only edits content/*.json and images; a GitHub Action
runs this script on every push to main, so edits made there go live without
running anything locally.

What it writes:

1. index.html, works.html, growth.html (Chinese) and en/*.html (English), from
   templates/*.html and content/site.json. Each text field in the JSON is
   {"zh": ..., "en": ...}; an empty "en" falls back to the Chinese text and is
   listed as a warning.
2. assets/js/works.js (Chinese) and assets/js/works.en.js (English): the works,
   categories, growth timeline and contact settings, from content/works.json and
   content/site.json. Visitors download only the file for their language and
   the pages render without any extra request.
3. Version numbers on CSS / JS: pages load them with ?v=<content hash>, so a
   browser that cached an old copy fetches the new file as soon as it changes.
"""
import hashlib
import html
import json
import re
import sys
from pathlib import Path

try:
    from jinja2 import Environment, FileSystemLoader, StrictUndefined
    from markupsafe import Markup
except ImportError:  # pragma: no cover
    sys.exit("jinja2 is required: pip install jinja2")

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://duicn187532.github.io/HachimanStudio/"
PAGES = ["index.html", "works.html", "growth.html"]
ASSETS = ["assets/css/style.css", "assets/js/works.js", "assets/js/works.en.js", "assets/js/site.js"]

# Fixed interface text (navigation, buttons, labels). Page content lives in content/site.json.
UI = {
    "zh": {
        "studio": "HACHIMAN STUDIO 八萬工作室",
        "person": "八萬爸",
        "skip": "跳到主要內容",
        "home_aria": "HACHIMAN STUDIO 首頁",
        "menu_aria": "開啟選單",
        "nav_about": "關於", "nav_consult": "概念諮詢", "nav_works": "作品集", "nav_growth": "成長時間線",
        "nav_contact": "聯絡", "nav_cta": "來信聊聊",
        "footer_aria": "頁尾",
        "copyright": "© <span data-year>2026</span> HACHIMAN STUDIO 八萬工作室・八萬爸. 八萬、歐雷角色與標誌為八萬爸所有。",
        "visits": "累計瀏覽 <strong data-visits-count></strong> 次",
        "close_aria": "關閉",
        "see_works": "看作品集", "talk": "有想法？來聊聊",
        "hero_alt": "工作室吉祥物：橘色虎斑貓八萬與白貓歐雷趴在一起",
        "hug_alt": "八萬與歐雷依偎在一起",
        "peek_alt": "八萬從桌邊探出頭",
        "legend_aria": "標示說明",
        "legend_short": [
            ("live", "可實際使用", "公開上線，直接打開就能用。"),
            ("demo", "線上示範", "原本介面＋虛構資料，可操作但不儲存。"),
            ("none", "僅介紹", "沒有公開入口，只有介紹。"),
            ("src", "附原始碼", "可在 GitHub 看原始碼。"),
        ],
        "legend_long": [
            ("live", "可實際使用", "公開上線，任何人都能直接打開來用。"),
            ("demo", "線上示範", "原本的介面搭配虛構資料，可以操作，但不會儲存、也不連正式環境。"),
            ("none", "僅介紹", "目前沒有公開入口，只有介紹與截圖。"),
            ("src", "附原始碼", "可以在 GitHub 看到完整原始碼；<span class=\"av av-nosrc\">原始碼未公開</span> 則否。"),
        ],
        "see_all": "看全部作品 →", "see_growth": "看完整成長時間線 →", "email_btn": "寄信諮詢",
        "filter_avail": "可用性", "filter_avail_aria": "依可用性篩選",
        "filter_cat": "類別", "filter_cat_aria": "依類別篩選",
        "empty": "這個條件下沒有作品，換個篩選看看。",
        "timeline_aria": "作品時間線，由新到舊",
        "start": "起點・",
        "all": "全部",
    },
    "en": {
        "studio": "HACHIMAN STUDIO",
        "person": "Hachiman's Dad",
        "skip": "Skip to main content",
        "home_aria": "HACHIMAN STUDIO home",
        "menu_aria": "Open menu",
        "nav_about": "About", "nav_consult": "Consulting", "nav_works": "Portfolio", "nav_growth": "Growth",
        "nav_contact": "Contact", "nav_cta": "Email me",
        "footer_aria": "Footer",
        "copyright": "© <span data-year>2026</span> HACHIMAN STUDIO · Hachiman's Dad. The Hachiman and Olleh characters and logo belong to Hachiman's Dad.",
        "visits": "<strong data-visits-count></strong> views",
        "close_aria": "Close",
        "see_works": "See my work", "talk": "Got an idea? Let's talk",
        "hero_alt": "The mascots: Hachiman, an orange tabby, and Olleh, a white cat, lying together",
        "hug_alt": "Hachiman and Olleh cuddling",
        "peek_alt": "Hachiman peeking over the edge of a desk",
        "legend_aria": "Label guide",
        "legend_short": [
            ("live", "Live", "Publicly available; just open it."),
            ("demo", "Demo", "Original interface with made-up data; nothing is saved."),
            ("none", "Overview only", "No public version, just a description."),
            ("src", "Source code", "The code is on GitHub."),
        ],
        "legend_long": [
            ("live", "Live", "Publicly available; anyone can open and use it."),
            ("demo", "Demo", "The original interface with made-up data. You can use it, but nothing is saved and it never touches a live system."),
            ("none", "Overview only", "No public version yet, just a description and pictures."),
            ("src", "Source code", "The full code is on GitHub; <span class=\"av av-nosrc\">Private source</span> means it is not public."),
        ],
        "see_all": "See all works →", "see_growth": "See the full growth timeline →", "email_btn": "Email me",
        "filter_avail": "Availability", "filter_avail_aria": "Filter by availability",
        "filter_cat": "Category", "filter_cat_aria": "Filter by category",
        "empty": "No works match these filters. Try another combination.",
        "timeline_aria": "Timeline of works, newest first",
        "start": "The start · ",
        "all": "All",
    },
}

WARNINGS = []


def load(name):
    return json.loads((ROOT / "content" / name).read_text(encoding="utf-8"))


def pick(value, lang, where=""):
    """Return the text for a language from a {"zh", "en"} field; English falls back to Chinese."""
    if not isinstance(value, dict):
        return value
    v = value.get(lang)
    if lang == "en" and (v is None or v == "" or v == []):
        zh = value.get("zh")
        if zh not in (None, "", []):
            WARNINGS.append(f"missing English: {where or str(zh)[:60]}")
        return zh
    return v


def strip_tags(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or ""))


def asset_versions():
    return {a: hashlib.sha1((ROOT / a).read_bytes()).hexdigest()[:8] for a in ASSETS}


def stamp(text, versions, prefix=""):
    for a, v in versions.items():
        text = re.sub(r'(["\'])' + re.escape(prefix + a) + r'(\?v=[0-9a-f]+)?\1', r'\1' + prefix + a + "?v=" + v + r"\1", text)
    return text


def data_js(site, works, lang):
    """The works / timeline / settings data the browser needs, localized."""
    statuses = {s["key"]: s for s in site["statuses"]}
    out_works = []
    for w in works:
        if w.get("hidden"):
            continue
        where = f"work {w['id']}"
        st = statuses.get(w["status"], {"label": {"zh": w["status"], "en": w["status"]}, "live": False})
        # tech names are usually the same in both languages: an empty English list reuses the Chinese one
        stack = w["stack"].get(lang) or w["stack"]["zh"]
        o = {
            "id": w["id"], "date": w["date"], "year": w["year"], "category": w["category"],
            "access": w["access"], "featured": bool(w.get("featured")),
            "status": pick(st["label"], lang, f"status {w['status']}"), "live": bool(st.get("live")),
            "title": pick(w["title"], lang, where + " title"),
            "summary": pick(w["summary"], lang, where + " summary"),
            "role": pick(w["role"], lang, where + " role"),
            "growth": pick(w["growth"], lang, where + " growth"),
            "highlights": pick(w["highlights"], lang, where + " highlights"),
            "stack": stack,
            "cover": w["cover"],
            "links": [{"label": pick(l["label"], lang, where + " link"), "href": l["href"]} for l in w["links"]],
        }
        note = pick(w.get("note") or {}, lang, where + " note")
        if note:
            o["note"] = note
        if w.get("gallery"):
            o["gallery"] = w["gallery"]
        out_works.append(o)
    g = site["growth_page"]
    data = {
        "site": {k: site["settings"].get(k, "") for k in ("email", "github", "goatcounter")},
        "categories": {"all": UI[lang]["all"], **{c["key"]: pick(c["label"], lang, f"category {c['key']}") for c in site["categories"]}},
        "works": out_works,
        "eras": {e["year"]: {"title": pick(e["title"], lang, f"era {e['year']}"), "text": pick(e["text"], lang, f"era {e['year']}")} for e in g["eras"]},
        "milestones": [{"date": m["date"], "title": pick(m["title"], lang, "milestone"), "text": pick(m["text"], lang, "milestone"), "icon": "brand"} for m in g["milestones"]],
    }
    body = json.dumps(data, ensure_ascii=False, indent=1)
    return ("/* 此檔由 tools/build_site.py 從 content/works.json 與 content/site.json 產生，請勿直接修改。\n"
            "   Generated from content/*.json by tools/build_site.py; do not edit. */\n"
            "window.HS_DATA = " + body + ";\n")


def render_pages(site, versions):
    icons = json.loads((ROOT / "templates" / "icons.json").read_text(encoding="utf-8"))
    env = Environment(loader=FileSystemLoader(ROOT / "templates"), autoescape=True,
                      undefined=StrictUndefined, keep_trailing_newline=True)
    meta_key = {"index.html": "index", "works.html": "works", "growth.html": "growth"}
    for lang in ("zh", "en"):
        r = "../" if lang == "en" else ""
        ui = UI[lang]
        for name in PAGES:
            ctx = {
                "lang": lang, "r": r, "ui": ui, "site": site, "c": site, "base": BASE,
                "path": "" if name == "index.html" else name,
                "home": "" if name == "index.html" else "./",
                "meta": site["pages"][meta_key[name]],
                "data_js": "assets/js/works.en.js" if lang == "en" else "assets/js/works.js",
                # page content may hold inline HTML (<strong>, <em>, <br>, <a>); it is written by the site owner
                "t": lambda v, _l=lang: Markup(pick(v, _l) or ""),
                "attr": lambda v, _l=lang: strip_tags(pick(v, _l)),
                "icon": lambda k: Markup(icons.get(k, icons["star"])),
                "asset": lambda a, _r=r: _r + a + "?v=" + versions[a],
                "ld_json": Markup(json.dumps({
                    "@context": "https://schema.org", "@type": "Person", "name": ui["person"], "alternateName": ui["studio"],
                    "image": r + "assets/img/brand/logo-icon.webp", "sameAs": [site["settings"]["github"]],
                }, ensure_ascii=False, separators=(",", ":"))),
            }
            out = env.get_template(name).render(**ctx)
            # in templates every page-level text is checked once for English fallbacks
            dest = ROOT / ("en/" + name if lang == "en" else name)
            dest.parent.mkdir(exist_ok=True)
            dest.write_text(out, encoding="utf-8")


def check_site(site):
    """Walk site.json once in English so missing translations are reported with their place."""
    def walk(v, path):
        if isinstance(v, dict) and "zh" in v and "en" in v:
            pick(v, "en", path)
        elif isinstance(v, dict):
            for k, x in v.items():
                walk(x, f"{path}.{k}" if path else k)
        elif isinstance(v, list):
            for i, x in enumerate(v):
                walk(x, f"{path}[{i}]")
    walk(site, "")


def main():
    site, works = load("site.json"), load("works.json")
    ids = [w["id"] for w in works]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        sys.exit("duplicate work id: " + ", ".join(sorted(dup)))
    (ROOT / "assets/js/works.js").write_text(data_js(site, works, "zh"), encoding="utf-8")
    (ROOT / "assets/js/works.en.js").write_text(data_js(site, works, "en"), encoding="utf-8")
    check_site(site)
    versions = asset_versions()
    render_pages(site, versions)
    p = ROOT / "404.html"
    p.write_text(stamp(p.read_text(encoding="utf-8"), versions), encoding="utf-8")
    seen = set()
    for w in WARNINGS:
        if w not in seen:
            seen.add(w)
            print("warning:", w)
    print("asset versions:", ", ".join(f"{Path(a).name}={v}" for a, v in versions.items()))
    print("wrote", ", ".join(PAGES), "and en/" + ", en/".join(PAGES))


if __name__ == "__main__":
    main()
