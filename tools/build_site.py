"""Build step for the static site. Run after editing any page or asset:

    python3 tools/build_site.py

It does two things:

1. Version numbers on CSS / JS: every page loads assets/css/style.css and the
   scripts with ?v=<content hash>, so a browser that cached an old copy fetches
   the new file as soon as it changes.
2. English pages: en/index.html, en/works.html and en/growth.html are generated
   from the Chinese pages with the translation table below. If a Chinese page
   has text the table does not cover, the script stops and lists it, so the
   English site never shows untranslated or stale text. Add the missing pair to
   TEXT and run again. Work descriptions are translated in assets/js/works.en.js.
"""
import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://duicn187532.github.io/HachimanStudio/"
PAGES = ["index.html", "works.html", "growth.html"]
ASSETS = ["assets/css/style.css", "assets/js/works.js", "assets/js/works.en.js", "assets/js/site.js"]

# Chinese -> English, applied in order (longer strings first where one contains another).
TEXT = [
    # ---- head ----
    ("<title>HACHIMAN STUDIO 八萬工作室｜八萬爸的作品與概念諮詢</title>",
     "<title>HACHIMAN STUDIO | Hachiman's Dad: works and concept consulting</title>"),
    ("<title>作品集｜HACHIMAN STUDIO 八萬工作室</title>", "<title>Portfolio | HACHIMAN STUDIO</title>"),
    ("<title>成長時間線｜HACHIMAN STUDIO 八萬工作室</title>", "<title>Growth timeline | HACHIMAN STUDIO</title>"),
    ("HACHIMAN STUDIO 八萬工作室是八萬爸的個人品牌：收錄個人或合作完成的作品（內部系統、AI 工具、互動教材），也提供不收費的概念諮詢。",
     "HACHIMAN STUDIO is the personal brand of Hachiman's Dad: solo and collaborative work on internal tools, AI tools and interactive learning, plus free concept consulting."),
    ("八萬爸（HACHIMAN STUDIO 八萬工作室）的作品集，個人或合作完成：會議室預約系統、AutoML Workbench、彤靈談心、CS LAB 互動教材等。",
     "Portfolio of Hachiman's Dad (HACHIMAN STUDIO), solo and collaborative: a meeting-room booking system, AutoML Workbench, TongLing, CS LAB interactive lessons and more."),
    ("從 2023 年的第一支爬蟲到現在：依時間排列的作品與成長紀錄，越往下越早。",
     "From my first crawler in 2023 to today: works and what I learned, newest first."),
    ("八萬爸的個人作品集：把日常的麻煩做成好用的小工具。有想法卻不知道怎麼做，歡迎來信聊聊。",
     "Hachiman's Dad's portfolio: turning everyday hassles into handy little tools. Have an idea but not sure how to build it? Drop me an email."),
    ('<meta property="og:site_name" content="HACHIMAN STUDIO 八萬工作室">', '<meta property="og:site_name" content="HACHIMAN STUDIO">'),
    ('<meta property="og:title" content="HACHIMAN STUDIO 八萬工作室">', '<meta property="og:title" content="HACHIMAN STUDIO">'),
    ('"name":"八萬爸","alternateName":"HACHIMAN STUDIO 八萬工作室"', '"name":"Hachiman\'s Dad","alternateName":"HACHIMAN STUDIO"'),
    # ---- header / footer ----
    ("跳到主要內容", "Skip to main content"),
    ('aria-label="HACHIMAN STUDIO 首頁"', 'aria-label="HACHIMAN STUDIO home"'),
    ('aria-label="開啟選單"', 'aria-label="Open menu"'),
    (">關於</a>", ">About</a>"),
    (">概念諮詢</a>", ">Consulting</a>"),
    (">作品集</a>", ">Portfolio</a>"),
    (">成長時間線</a>", ">Growth</a>"),
    (">來信聊聊</a>", ">Email me</a>"),
    (">聯絡</a>", ">Contact</a>"),
    ('aria-label="頁尾"', 'aria-label="Footer"'),
    ("© <span data-year>2026</span> HACHIMAN STUDIO 八萬工作室・八萬爸. 八萬、歐雷角色與標誌為八萬爸所有。",
     "© <span data-year>2026</span> HACHIMAN STUDIO · Hachiman's Dad. The Hachiman and Olleh characters and logo belong to Hachiman's Dad."),
    ("累計瀏覽 <strong data-visits-count></strong> 次", "<strong data-visits-count></strong> views"),
    ('aria-label="關閉"', 'aria-label="Close"'),
    # ---- home: hero ----
    ("把日常的麻煩，<br>做成<em>好用的小工具</em>。", "Turning everyday hassles<br>into <em>handy little tools</em>."),
    ("HACHIMAN STUDIO 八萬工作室是<strong>八萬爸</strong>的個人品牌。這裡收錄我在工作之餘，自己或和夥伴一起完成的作品——會議室搶不到、需求文件寫不完、教材讀不懂——把這些日常的麻煩，做成大家願意打開的小工具。",
     "HACHIMAN STUDIO is the personal brand of <strong>Hachiman's Dad</strong>. Here is what I have built outside my day job, on my own or with partners: meeting rooms nobody can book, requirement documents that never end, course material nobody understands. I turn everyday hassles like these into small tools people actually want to open."),
    (">看作品集</a>", ">See my work</a>"),
    (">有想法？來聊聊</a>", ">Got an idea? Let's talk</a>"),
    ("<span>件作品</span>", "<span>works</span>"),
    ("<span>預約入口：網頁・LINE・AI</span>", "<span>booking channels: web, LINE, AI</span>"),
    ("<span>門互動資工課程</span>", "<span>interactive CS courses</span>"),
    ("<span>從一支爬蟲開始</span>", "<span>started with one crawler</span>"),
    ('alt="工作室吉祥物：橘色虎斑貓八萬與白貓歐雷趴在一起"', 'alt="The mascots: Hachiman, an orange tabby, and Olleh, a white cat, lying together"'),
    ("<strong>八萬發現了新點子！</strong><span>有想法不知道怎麼做？歡迎來信</span>",
     "<strong>Hachiman spotted a new idea!</strong><span>Not sure how to build yours? Email me</span>"),
    # ---- home: about ----
    ('alt="八萬與歐雷依偎在一起"', 'alt="Hachiman and Olleh cuddling"'),
    ("嗨，我是八萬爸。", "Hi, I'm Hachiman's Dad."),
    ("HACHIMAN STUDIO 八萬工作室是我的個人品牌，目前沒有登記營業，也不以營利為目的。工作室只有我一個人：網站上的作品有些是我獨立完成，有些是和同事、朋友合作，每件作品都寫著我負責的部分。",
     "HACHIMAN STUDIO is my personal brand. It is not a registered business and not run for profit. The studio is just me: some works here I built alone and some with colleagues and friends, and each one says which part was mine."),
    ("從銀行臨櫃起步，做過分行企業金融，現在在數位金融部規劃企業金融的數位產品。2023 年開始自學寫程式，2025 年進入資訊工程碩士在職專班，研究 LLM Agent 的長期記憶。",
     "I started at a bank counter, moved into branch corporate banking, and now plan digital products for corporate banking in the digital finance department. I began teaching myself to code in 2023, and in 2025 started a part-time master's in computer science, researching long-term memory for LLM agents."),
    ("<strong>懂金融業的限制，也能自己做出來</strong><span>熟悉法遵、資安與跨部門流程，主導過 3 項企業金融系統上線；能從法規與業務需求寫到 PRD 與系統分析，也能用 Python、React 親手做出原型。</span>",
     "<strong>I know finance's constraints, and I can build within them</strong><span>I know compliance, security and cross-department processes, and have led 3 corporate banking system launches. I can go from regulations and business needs to PRDs and systems analysis, and build the prototype myself in Python and React.</span>"),
    ("<strong>自學三年，16 件作品</strong><span>2023 年從一支爬蟲開始，現在有 3 套內部工具每天在用（合計約 150 人），也在部門裡開 JavaScript 與 Python 課。</span>",
     "<strong>Three years self-taught, 16 works</strong><span>I started with one crawler in 2023. Now 3 internal tools I helped build are used every day by about 150 people in total, and I teach JavaScript and Python classes at work.</span>"),
    ("<strong>邊做產品，邊讀論文</strong><span>在職攻讀資工碩士，精讀 Agent 記憶相關論文並做成論文精讀室；做產品時也守同一套標準：AI 只給建議、來源要能追溯。</span>",
     "<strong>Building products while reading papers</strong><span>I am studying for a CS master's while working, and turn the agent-memory papers I read closely into the Paper Reading Room. My products follow the same rule: AI only suggests, and every source must be traceable.</span>"),
    ("<h3>學歷</h3>", "<h3>Education</h3>"),
    ("<strong>輔仁大學 資訊工程學系碩士在職專班</strong><span>2025 – 在學</span>",
     "<strong>M.S. in Computer Science and Information Engineering (part-time), Fu Jen Catholic University</strong><span>2025 – present</span>"),
    ("<strong>淡江大學 財務金融學系</strong><span>學士</span>", "<strong>B.B.A. in Banking and Finance, Tamkang University</strong><span>Bachelor's degree</span>"),
    ("<h3>經歷</h3>", "<h3>Experience</h3>"),
    ("<strong>金融業・數位金融部</strong><span>2024 – 現在｜企業金融數位產品規劃，主導 3 項系統上線；UAT 自動化（150 個測試模組）；內部講師</span>",
     "<strong>Financial services · Digital finance department</strong><span>2024 – present · Corporate banking digital product planning; led 3 system launches; UAT automation (150 test modules); internal instructor</span>"),
    ("<strong>金融業・分行企業金融</strong><span>2022 – 2024｜企業授信報告、KYC 與洗錢防制審查</span>",
     "<strong>Financial services · Branch corporate banking</strong><span>2022 – 2024 · Corporate credit reports, KYC and anti-money-laundering reviews</span>"),
    ("<strong>金融業・分行存匯</strong><span>2021 – 2022｜臨櫃存匯與開戶法遵審核</span>",
     "<strong>Financial services · Branch deposits and remittances</strong><span>2021 – 2022 · Counter service and account-opening compliance checks</span>"),
    ("<h3>技能</h3>", "<h3>Skills</h3>"),
    ("<dt>AI／LLM</dt><dd>RAG（BM25 + FAISS 混合檢索）、GraphRAG、AI Agent（ReAct、Tool／Skill）、Ollama 本機部署、RoBERTa、GCN</dd>",
     "<dt>AI / LLM</dt><dd>RAG (hybrid BM25 + FAISS), GraphRAG, AI agents (ReAct, tools and skills), local models with Ollama, RoBERTa, GCN</dd>"),
    ("<dt>開發</dt><dd>Python（FastAPI、Flask）、JavaScript／TypeScript（React、Node.js、Deno）、Java（Spring Boot）、SQL、MongoDB、SQLite</dd>",
     "<dt>Development</dt><dd>Python (FastAPI, Flask), JavaScript / TypeScript (React, Node.js, Deno), Java (Spring Boot), SQL, MongoDB, SQLite</dd>"),
    ("<dt>自動化</dt><dd>UAT 測試自動化、UiPath RPA、VBA</dd>", "<dt>Automation</dt><dd>UAT test automation, UiPath RPA, VBA</dd>"),
    ("<dt>產品</dt><dd>需求訪談、PRD、系統分析、營運計畫書、法規審查文件</dd>", "<dt>Product</dt><dd>Requirements interviews, PRDs, systems analysis, operations plans, regulatory filings</dd>"),
    ("<h3>研究領域</h3>", "<h3>Research</h3>"),
    ("<p><strong>LLM Agent 的長期記憶</strong>：選擇性遺忘、記憶圖譜、跨情境的記憶干擾。</p>",
     "<p><strong>Long-term memory for LLM agents</strong>: selective forgetting, memory graphs and interference between contexts.</p>"),
    ("<p>我關心的問題是：當對話中斷、記憶過期或互相干擾時，Agent 怎麼還能記得對的事。讀過的論文都整理在<a href=\"https://duicn187532.github.io/self-research/\" target=\"_blank\" rel=\"noopener\">論文精讀室</a>。</p>",
     "<p>The question I care about: when a conversation breaks off, or memories go stale or interfere with each other, how can an agent still remember the right things? The papers I have read are in the <a href=\"https://duicn187532.github.io/self-research/\" target=\"_blank\" rel=\"noopener\">Paper Reading Room</a> (in Chinese).</p>"),
    # ---- home: cats ----
    ("靈感來自家裡的兩隻貓", "Inspired by my two cats"),
    ("八萬和歐雷是我養的兩隻貓。牠們的個性剛好是我做東西時的兩種狀態，於是就成了這個品牌的名字與吉祥物。",
     "Hachiman and Olleh are my two cats. Their personalities match the two moods I am in when I build things, so they became the brand's name and mascots."),
    ('alt="八萬伏低身體準備撲擊"', 'alt="Hachiman crouching, ready to pounce"'),
    ("<span class=\"tag\">行動派・橘色虎斑</span><h3>八萬 Hachiman</h3>", "<span class=\"tag\">The doer · orange tabby</span><h3>Hachiman</h3>"),
    ("家裡的橘色虎斑，好奇心旺盛，看到新東西就想撲上去。就像我一想到點子，總是忍不住先動手做出原型再說。",
     "My orange tabby, endlessly curious, pounces on anything new. Just like me: when I get an idea, I can't help building a prototype first."),
    ('alt="白貓歐雷抬頭微笑"', 'alt="Olleh, a white cat, looking up and smiling"'),
    ("<span class=\"tag\">守護派・白色長毛</span><h3>歐雷 Olleh</h3>", "<span class=\"tag\">The guardian · white long-hair</span><h3>Olleh</h3>"),
    ("家裡的白色長毛貓，冷靜細心，什麼都要先聞過一遍才放心。提醒我上線前，把資料、隱私與細節再檢查一次。",
     "My white long-haired cat, calm and careful, sniffs everything before trusting it. She reminds me to check data, privacy and details once more before launch."),
    # ---- home: consulting ----
    ("概念諮詢：有想法，卻不知道怎麼做？", "Concept consulting: got an idea but not sure how to build it?"),
    ("手上有個點子，或是工作上有個麻煩，不知道能不能、該怎麼用程式解決？歡迎來信。我會用自己的經驗幫你想想可行的做法。下面是我比較熟悉、能給出具體建議的範圍。",
     "Have an idea, or a problem at work, and wonder whether code could solve it, and how? Email me. I will use my experience to help you think through what could work. These are the areas I know well enough to give concrete advice."),
    ("<h3>內部系統與流程工具</h3>", "<h3>Internal systems and workflow tools</h3>"),
    ("預約、排班、簽核、統計後台——Excel 和群組訊息，能不能換成一個好用的網頁？",
     "Bookings, rotas, approvals, stats dashboards: could those spreadsheets and group chats become one good web page?"),
    ("<li>全端開發</li>", "<li>Full-stack</li>"),
    ("<li>管理後台</li>", "<li>Admin dashboards</li>"),
    ("<h3>AI 工具導入</h3>", "<h3>Bringing in AI tools</h3>"),
    ("AI 能不能接上你的流程？MCP 連接器、知識檢索、本機模型，以及哪裡該保留人工確認。",
     "Can AI plug into your workflow? MCP connectors, knowledge search, local models, and where a human should still confirm."),
    ("<h3>需求整理與原型</h3>", "<h3>Requirements and prototypes</h3>"),
    ("把模糊的想法整理成需求、流程圖與可點擊的原型，先看清楚要做什麼、不做什麼。",
     "Turn a fuzzy idea into requirements, flowcharts and a clickable prototype, so it is clear what to build and what not to."),
    ("<h3>互動教材與學習網站</h3>", "<h3>Interactive lessons and learning sites</h3>"),
    ("難懂的知識，怎麼用模擬器、測驗與遊戲化設計，變成可以「玩」懂的內容？",
     "How can simulators, quizzes and game design turn hard topics into something you learn by playing?"),
    ("<li>模擬器</li><li>測驗</li><li>靜態網站</li>", "<li>Simulators</li><li>Quizzes</li><li>Static sites</li>"),
    ("<strong>以不收費、業餘為主</strong><span>概念諮詢是我的個人興趣，以分享經驗、幫你釐清方向為主，不收費。我會在下班時間回信，可能需要幾天。</span>",
     "<strong>Free, and a hobby</strong><span>Concept consulting is a personal interest: I share experience and help you find a direction, free of charge. I reply after work hours, so it may take a few days.</span>"),
    ("<strong>超出範圍，歡迎一起合作</strong><span>諮詢會限制在上面我熟悉的技術範疇；超過的部分我會直接說明，也很歡迎有相關專長的人來一起合作。</span>",
     "<strong>Beyond my scope? Let's team up</strong><span>Consulting stays within the technical areas above. If something goes beyond them I will say so plainly, and people with the right skills are very welcome to collaborate.</span>"),
    ("<strong>想談商業合作也可以</strong><span>但請留意這是個人，不是公司：時間與規模都有一定上限，比較適合小型工具或原型，無法承接需要全職投入或長期保固的專案。</span>",
     "<strong>Paid work is possible too</strong><span>But this is one person, not a company: time and scale are limited. It suits small tools or prototypes, not projects that need full-time work or long-term support.</span>"),
    # ---- home: works ----
    (">精選作品</h2>", ">Selected works</h2>"),
    ("點開卡片看詳細內容；部分作品提供可以實際操作的線上示範（資料皆為虛構）。",
     "Open a card for details. Some works have a demo you can try, with made-up data. Demos and linked sites are in Chinese."),
    ('aria-label="標示說明"', 'aria-label="Label guide"'),
    ("<span class=\"av av-live\">可實際使用</span><br>公開上線，直接打開就能用。", "<span class=\"av av-live\">Live</span><br>Publicly available; just open it."),
    ("<span class=\"av av-demo\">線上示範</span><br>原本介面＋虛構資料，可操作但不儲存。", "<span class=\"av av-demo\">Demo</span><br>Original interface with made-up data; nothing is saved."),
    ("<span class=\"av av-none\">僅介紹</span><br>沒有公開入口，只有介紹。", "<span class=\"av av-none\">Overview only</span><br>No public version, just a description."),
    ("<span class=\"av av-src\">附原始碼</span><br>可在 GitHub 看原始碼。", "<span class=\"av av-src\">Source code</span><br>The code is on GitHub."),
    (">看全部作品 →</a>", ">See all works →</a>"),
    # ---- home: process ----
    ("諮詢怎麼進行", "How consulting works"),
    ("不用準備完整的文件，幾句話的描述就夠了。", "No need for a full document; a few sentences are enough."),
    ("<h3>來信說說想法</h3><p>想解決什麼、誰會用、現在怎麼做。三五句話就可以。</p>",
     "<h3>Tell me your idea</h3><p>What you want to solve, who would use it, how it is done today. A few sentences will do.</p>"),
    ("<h3>一起釐清</h3><p>我會回信問幾個問題，幫你把想法整理成比較清楚的需求與範圍。</p>",
     "<h3>Clarify together</h3><p>I reply with a few questions to help shape the idea into clearer requirements and scope.</p>"),
    ("<h3>給你方向</h3><p>建議可行的做法、適合的工具或技術，以及可以先試的最小版本。</p>",
     "<h3>Get a direction</h3><p>Suggested approaches, suitable tools or technology, and the smallest version worth trying first.</p>"),
    ("<h3>需要的話再合作</h3><p>剛好是我做得來又有興趣的，可以一起做原型；超出範圍就找夥伴一起來。</p>",
     "<h3>Build together if needed</h3><p>If it is something I can do and enjoy, we can build a prototype together; if it is beyond me, we bring in partners.</p>"),
    # ---- home: journey ----
    (">我的歷程</h2>", ">My journey</h2>"),
    (">看完整成長時間線 →</a>", ">See the full growth timeline →</a>"),
    ("<h3>從一支爬蟲開始</h3><p>用 Python 抓股價、Flask 發 API、MongoDB 做會員系統，一步步把網站做起來。</p>",
     "<h3>It started with a crawler</h3><p>Scraping stock prices with Python, serving an API with Flask, a MongoDB member system: building a website step by step.</p>"),
    ("<h3>走進辦公室的小工具</h3><p>派對抽座位、MBTI 分組、數位達人激勵平台，以及第一版會議室預約系統。</p>",
     "<h3>Small tools for the office</h3><p>Party seat draws, MBTI grouping, a learning-rewards platform and the first meeting-room booking system.</p>"),
    ("<h3>AI 工具與互動教材</h3><p>MeetBook 加入 LINE 與 AI 助理入口並遷移到 Cloudflare；AutoML Workbench、彤靈談心、CS LAB 陸續推出。</p>",
     "<h3>AI tools and interactive lessons</h3><p>MeetBook added LINE and AI-assistant access and moved to Cloudflare; AutoML Workbench, TongLing and CS LAB followed.</p>"),
    ("<h3>HACHIMAN STUDIO 成立</h3><p>以家裡的兩隻貓八萬與歐雷為品牌，整理過去的作品，也開始提供概念諮詢。</p>",
     "<h3>HACHIMAN STUDIO founded</h3><p>Named after my two cats, Hachiman and Olleh, gathering past work and starting concept consulting.</p>"),
    # ---- home: contact ----
    ("有想法，卻不知道該怎麼做？", "Got an idea but not sure how to build it?"),
    ("不管是一個還沒成形的點子、一個想解決的麻煩，或是好奇 AI 能不能幫上忙，都歡迎來信聊聊。這是我的業餘時間，回覆可能需要幾天，請多包涵。",
     "A half-formed idea, a hassle you want gone, or curiosity about whether AI could help: all welcome. Write in English or Chinese. This is my spare time, so replies may take a few days."),
    (">寄信諮詢</a>", ">Email me</a>"),
    ('alt="八萬從桌邊探出頭"', 'alt="Hachiman peeking over the edge of a desk"'),
    ("<summary>概念諮詢要收費嗎？</summary><p>不收費。這是我的個人興趣，以分享經驗、幫你釐清方向為主，不會提供正式的報價或合約。</p>",
     "<summary>Does concept consulting cost anything?</summary><p>No. It is a personal interest: sharing experience and helping you find a direction. There are no formal quotes or contracts.</p>"),
    ("<summary>可以請你直接幫我做嗎？</summary><p>看情況。小型工具或原型、又剛好在我熟悉的範疇內，可以討論一起做。想談正式的商業合作也可以，但這是個人，時間與規模有一定上限，無法像公司一樣承接大型或需要長期保固的專案。</p>",
     "<summary>Can you just build it for me?</summary><p>It depends. For a small tool or prototype within the areas I know, we can talk about building it together. Formal paid work is possible too, but I am one person with limited time and scale, so I cannot take on large projects or long-term support the way a company can.</p>"),
    ("<summary>超出你熟悉的範圍怎麼辦？</summary><p>我會直接告訴你，盡量提供可以找的方向；也很歡迎有相關專長的人來一起合作。</p>",
     "<summary>What if it is outside what you know?</summary><p>I will tell you plainly and point you in a useful direction where I can. People with the right skills are very welcome to collaborate.</p>"),
    ("<summary>作品都是你一個人做的嗎？</summary><p>有些是我獨立完成，有些是和同事、朋友合作。每件作品的介紹裡都寫著「我的角色」，就是我負責的部分。</p>",
     "<summary>Did you build all of these alone?</summary><p>Some alone, some with colleagues and friends. Each work's details include \"My role\", the part I was responsible for.</p>"),
    # ---- works page ----
    ("<h1>作品集</h1>", "<h1>Portfolio</h1>"),
    ("從 2023 年的第一支爬蟲，到每天有人在用的預約系統。有些是我獨立完成，有些是和同事、朋友合作；點開卡片可以看到每件作品的重點、技術、連結，以及「我的角色」。",
     "From my first crawler in 2023 to a booking system people use every day. Some I built alone, some with colleagues and friends. Open a card for highlights, tech, links and \"My role\". Demos and linked sites are in Chinese."),
    ("<span class=\"av av-live\">可實際使用</span><br>公開上線，任何人都能直接打開來用。", "<span class=\"av av-live\">Live</span><br>Publicly available; anyone can open and use it."),
    ("<span class=\"av av-demo\">線上示範</span><br>原本的介面搭配虛構資料，可以操作，但不會儲存、也不連正式環境。",
     "<span class=\"av av-demo\">Demo</span><br>The original interface with made-up data. You can use it, but nothing is saved and it never touches a live system."),
    ("<span class=\"av av-none\">僅介紹</span><br>目前沒有公開入口，只有介紹與截圖。", "<span class=\"av av-none\">Overview only</span><br>No public version yet, just a description and pictures."),
    ("<span class=\"av av-src\">附原始碼</span><br>可以在 GitHub 看到完整原始碼；<span class=\"av av-nosrc\">原始碼未公開</span> 則否。",
     "<span class=\"av av-src\">Source code</span><br>The full code is on GitHub; <span class=\"av av-nosrc\">Private source</span> means it is not public."),
    ("<span class=\"label\">可用性</span>", "<span class=\"label\">Availability</span>"),
    ('aria-label="依可用性篩選"', 'aria-label="Filter by availability"'),
    ("<span class=\"label\">類別</span>", "<span class=\"label\">Category</span>"),
    ('aria-label="依類別篩選"', 'aria-label="Filter by category"'),
    ("這個條件下沒有作品，換個篩選看看。", "No works match these filters. Try another combination."),
    ("※ 封面為我繪製的示意圖或示範版截圖，畫面中的人名、資料與數字均為虛構。標示「線上示範」的作品是原本介面搭配虛構資料的離線版本，不會連到任何正式環境。",
     "※ Covers are my own illustrations or screenshots of the demos; all names, data and numbers in them are made up. Works marked \"Demo\" are offline versions of the original interface with made-up data and never connect to a live system."),
    # ---- growth page ----
    ("<h1>成長時間線</h1>", "<h1>Growth timeline</h1>"),
    ("最新的作品在最上面，往下滑會一路回到起點。每件作品旁邊寫著它讓我學到的事（不論是個人還是合作完成）；點開卡片可以看詳細內容與試用連結。",
     "The newest work is at the top; scroll down to go all the way back to the start. Next to each work is what it taught me, whether I built it alone or with others. Open a card for details and links."),
    ('aria-label="作品時間線，由新到舊"', 'aria-label="Timeline of works, newest first"'),
    ("起點・<span data-timeline-start></span>", "The start · <span data-timeline-start></span>"),
    ("<span>一切從一支爬蟲開始。</span>", "<span>It all began with one crawler.</span>"),
]

# Text allowed to stay in Chinese on English pages: the logo's Chinese name.
ALLOWED = ['<span>八萬工作室</span>']
CJK = re.compile(r"[　-〿㐀-鿿＀-￯]+")


def asset_versions():
    return {a: hashlib.sha1((ROOT / a).read_bytes()).hexdigest()[:8] for a in ASSETS}


def stamp(html, versions, prefix=""):
    for a, v in versions.items():
        html = re.sub(r'(["\'])' + re.escape(prefix + a) + r'(\?v=[0-9a-f]+)?\1', r'\1' + prefix + a + "?v=" + v + r"\1", html)
    return html


def to_english(name, html):
    for zh, en in TEXT:
        html = html.replace(zh, en)
    html = html.replace('<html lang="zh-Hant-TW" class="no-js">', '<html lang="en" class="no-js" data-root="../">')
    # paths: pages live one folder down
    html = re.sub(r'((?:src|href)=")(assets/|demos/)', r"\1../\2", html)
    html = html.replace('"image":"assets/', '"image":"../assets/')
    html = html.replace('content="assets/', 'content="../assets/')
    # the language switch points back to the Chinese page
    zh_href = "../" + ("" if name == "index.html" else name)
    html = re.sub(r'<a class="lang-switch" href="[^"]*" lang="en" hreflang="en">EN</a>',
                  f'<a class="lang-switch" href="{zh_href}" lang="zh-Hant" hreflang="zh-Hant">中文</a>', html)
    html = html.replace('<script src="../assets/js/site.js',
                        '<script src="../assets/js/works.en.js"></script>\n  <script src="../assets/js/site.js')
    return html


def leftovers(html):
    body = html
    for a in ALLOWED + ['>中文</a>']:
        body = body.replace(a, "")
    out = []
    for i, line in enumerate(body.splitlines(), 1):
        if CJK.search(line):
            out.append(f"  line {i}: {line.strip()[:160]}")
    return out


def main():
    versions = asset_versions()
    problems = []
    for name in PAGES:
        zh = (ROOT / name).read_text(encoding="utf-8")
        en = to_english(name, zh)
        left = leftovers(en)
        if left:
            problems.append(f"en/{name}: untranslated Chinese text (add it to TEXT):\n" + "\n".join(left))
            continue
        out = ROOT / "en" / name
        out.parent.mkdir(exist_ok=True)
        out.write_text(stamp(en, versions, "../"), encoding="utf-8")
    for name in PAGES + ["404.html"]:
        p = ROOT / name
        p.write_text(stamp(p.read_text(encoding="utf-8"), versions), encoding="utf-8")
    if problems:
        print("\n\n".join(problems))
        sys.exit(1)
    print("asset versions:", ", ".join(f"{Path(a).name}={v}" for a, v in versions.items()))
    print("wrote en/" + ", en/".join(PAGES))


if __name__ == "__main__":
    main()
