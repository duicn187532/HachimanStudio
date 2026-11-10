/* 此檔由 tools/build_site.py 從 content/works.json 與 content/site.json 產生，請勿直接修改。
   Generated from content/*.json by tools/build_site.py; do not edit. */
window.HS_DATA = {
 "site": {
  "email": "duicn187532@gmail.com",
  "github": "https://github.com/duicn187532",
  "goatcounter": "duicn187532"
 },
 "categories": {
  "all": "All",
  "product": "Products",
  "ai": "AI & data",
  "edu": "Interactive learning",
  "fun": "Events & fun",
  "early": "Early work"
 },
 "works": [
  {
   "id": "meetbook",
   "date": "2025-02",
   "year": "2025 – 2026",
   "category": "product",
   "access": "demo",
   "featured": true,
   "status": "In production",
   "live": true,
   "title": "MeetBook meeting-room booking",
   "summary": "A meeting-room booking service 60 people in a department use daily. The web app, a LINE official account and an AI assistant (MCP) share one conflict check.",
   "role": "Product planning, full-stack development, operations",
   "growth": "The first thing I built that a whole department uses every day: real user feedback, data migration and operations, then the same booking rules extended to LINE and an AI assistant.",
   "highlights": [
    "Book several rooms at once; if any room conflicts, nothing is written, so there are no half-made bookings.",
    "The LINE account handles quick lookups and bookings; AI assistants can find free slots and create booking links through an /ai text page or an MCP connector.",
    "Admin dashboard: usage, peak hours, department stats, user list and announcements.",
    "Migrated smoothly from Deno + MongoDB to Cloudflare Workers + D1, with a relay mode for the company network."
   ],
   "stack": [
    "React 19",
    "Vite",
    "Tailwind",
    "Cloudflare Workers",
    "D1",
    "LINE Messaging API",
    "MCP"
   ],
   "cover": "assets/img/works/meetbook-shot.webp",
   "links": [
    {
     "label": "Demo",
     "href": "demos/meetbook/"
    },
    {
     "label": "Source code",
     "href": "https://github.com/duicn187532/MeetBook"
    }
   ],
   "note": "This is a live production service, so its real site is not linked. The demo is the original frontend code with the backend replaced by made-up data inside your browser; it never contacts the real system."
  },
  {
   "id": "automl",
   "date": "2025-08",
   "year": "2025 – 2026",
   "category": "ai",
   "access": "live",
   "featured": true,
   "status": "Open source",
   "live": false,
   "title": "AutoML Workbench",
   "summary": "An ML / DL workbench in the browser: no backend, works offline, and your data never leaves your computer. Unzip it and double-click index.html.",
   "role": "Design and development",
   "growth": "Bringing a machine-learning workflow into the browser with WebAssembly, Web Workers and offline packaging, so people without a Python setup can train models.",
   "highlights": [
    "Six modules: data, auto-training, model library, experiments, network design and Live Script.",
    "k-fold OOF bagging, TPE + successive halving, Caruana ensemble selection.",
    "Data-quality report and target-leakage detection: Hachiman finds the problems, Olleh guards the privacy."
   ],
   "stack": [
    "TypeScript",
    "React",
    "TensorFlow.js",
    "Pyodide",
    "XGBoost / LightGBM",
    "ECharts"
   ],
   "cover": "assets/img/works/automl-shot-1.webp",
   "links": [
    {
     "label": "Try it",
     "href": "https://duicn187532.github.io/AutoML/"
    },
    {
     "label": "Source code",
     "href": "https://github.com/duicn187532/AutoML"
    }
   ],
   "gallery": [
    "assets/img/works/automl-shot-1.webp",
    "assets/img/works/automl-shot-2.webp",
    "assets/img/works/automl-shot-3.webp"
   ]
  },
  {
   "id": "tongling",
   "date": "2026-10",
   "year": "2026",
   "category": "ai",
   "access": "demo",
   "featured": true,
   "status": "Alpha",
   "live": false,
   "title": "TongLing",
   "summary": "A local-first workspace for turning financial-services requirements into PRDs: knowledge search, source tracing, agent help, human decisions and IT hand-off checks in one flow.",
   "role": "Product design, prototyping, development",
   "growth": "From prototype to a real release: a local-first architecture, agent workflows, and the rule that AI only suggests while people decide.",
   "highlights": [
    "PM project overview, sorted by what needs attention, shows where each requirement is stuck.",
    "Agent mode runs search, analysis and the PRD draft on its own and only stops when a person needs to decide; you can switch back to the manual flow at any time.",
    "Everything the AI produces is a suggestion awaiting review, and every requirement traces back to its source documents; includes PRD quality checks, gap filling and an IT hand-off pack.",
    "Host and client are separate; data, models and keys stay on the host machine."
   ],
   "stack": [
    "Python",
    "FastAPI",
    "SQLite",
    "React",
    "TypeScript",
    "Mermaid",
    "Ollama (optional)"
   ],
   "cover": "assets/img/works/tongling-shot.webp",
   "links": [
    {
     "label": "Demo",
     "href": "demos/tongling/"
    },
    {
     "label": "Source code",
     "href": "https://github.com/duicn187532/tongling-alpha"
    },
    {
     "label": "Prototype source",
     "href": "https://github.com/duicn187532/tongling-prototype"
    }
   ],
   "note": "The demo is the real Alpha interface. I loaded a made-up sample project into the real backend on my own machine, recorded one session, and the demo replays it in your browser. You can browse every page and switch between agent and manual mode, but no AI runs and nothing is saved."
  },
  {
   "id": "cslab",
   "date": "2026-10",
   "year": "2026",
   "category": "edu",
   "access": "live",
   "featured": true,
   "status": "Open source",
   "live": false,
   "title": "CS LAB interactive self-study",
   "summary": "A hub for nine interactive computer-science courses. The main course, OS LAB, has 29 chapters, 29 dedicated simulators and 174 quiz questions.",
   "role": "Course design and development",
   "growth": "Turning my computer-science self-study notes into interactive lessons, where simulators make abstract mechanisms something you can play with and predict.",
   "highlights": [
    "Each lesson goes: predict, everyday analogy, real mechanism, simulator, quiz, review of mistakes.",
    "Hands-on CPU scheduling, paging and TLB, the banker's algorithm, disk scheduling and more.",
    "NET LAB grew to 28 chapters, 27 interactive labs and coding challenges in four languages."
   ],
   "stack": [
    "HTML",
    "JavaScript",
    "MathML",
    "Static site"
   ],
   "cover": "assets/img/works/cslab-shot-1.webp",
   "links": [
    {
     "label": "Open the course",
     "href": "https://duicn187532.github.io/os-lab/"
    },
    {
     "label": "Source code",
     "href": "https://github.com/duicn187532/os-lab"
    }
   ],
   "gallery": [
    "assets/img/works/cslab-shot-1.webp",
    "assets/img/works/cslab-shot-2.webp",
    "assets/img/works/cslab-shot-3.webp"
   ]
  },
  {
   "id": "research",
   "date": "2026-10",
   "year": "2026",
   "category": "edu",
   "access": "live",
   "featured": true,
   "status": "Open source",
   "live": false,
   "title": "Paper Reading Room",
   "summary": "A static site for close reading of papers. Each passage is explained at three depths (for a five-year-old, an undergraduate and a graduate student), and formulas are taken apart symbol by symbol.",
   "role": "Design and development",
   "growth": "Building a method for reading papers: layered explanations, formulas broken down symbol by symbol, and a clear line between derivation and the authors' conclusions.",
   "highlights": [
    "Five-way navigation: Problem, Method, Benchmark, Contribution, Gap.",
    "Each section has self-checks, a notes field and reading progress, plus game-like quests.",
    "Source-check cards and a reference list mark where derivation ends and the authors' claims begin."
   ],
   "stack": [
    "HTML",
    "JavaScript",
    "localStorage"
   ],
   "cover": "assets/img/works/research-shot-1.webp",
   "links": [
    {
     "label": "Open the site",
     "href": "https://duicn187532.github.io/self-research/"
    },
    {
     "label": "Source code",
     "href": "https://github.com/duicn187532/self-research"
    }
   ],
   "gallery": [
    "assets/img/works/research-shot-1.webp",
    "assets/img/works/research-shot-2.webp"
   ]
  },
  {
   "id": "walk",
   "date": "2026-10",
   "year": "2026",
   "category": "product",
   "access": "demo",
   "featured": true,
   "status": "MVP",
   "live": false,
   "title": "Walk",
   "summary": "An MVP that matches dog owners with dog walkers both ways, rebuilt from a single static mockup into a working full-stack app.",
   "role": "Course project: product design, full-stack development",
   "growth": "Rebuilt a single-file mockup into a fully working full-stack MVP, and recorded architecture decisions in ADRs for the first time.",
   "highlights": [
    "One account can switch between owner and walker.",
    "AI explains recommendations and reads photos; without AI it falls back to rule-based templates.",
    "Comes with architecture decision records (ADRs) and a one-command start script for hands-on testing."
   ],
   "stack": [
    "React",
    "Express",
    "SQLite",
    "Ollama"
   ],
   "cover": "assets/img/works/walk-shot-1.webp",
   "links": [
    {
     "label": "Demo",
     "href": "https://duicn187532.github.io/walk6/"
    },
    {
     "label": "Source code",
     "href": "https://github.com/duicn187532/walk6"
    }
   ],
   "note": "The demo is an interactive UI concept on GitHub Pages with sample data. The full-stack MVP (React + Express + SQLite) runs locally.",
   "gallery": [
    "assets/img/works/walk-shot-1.webp",
    "assets/img/works/walk-shot-2.webp",
    "assets/img/works/walk-shot-3.webp"
   ]
  },
  {
   "id": "garmin",
   "date": "2026-07",
   "year": "2026",
   "category": "ai",
   "access": "none",
   "featured": false,
   "status": "MVP",
   "live": false,
   "title": "Garmin Insight",
   "summary": "Search, health trends, training load and grounded AI analysis for my own Garmin data. A web PWA and an iOS app share one API.",
   "role": "Full-stack development",
   "growth": "My first web + iOS monorepo, and practice making AI answer only from real data.",
   "highlights": [
    "Data is normalised into my own database first, and AI answers cite only real numbers.",
    "Keeps the official API connector behind a clear service boundary; demo mode runs fully offline.",
    "Monorepo: backend / web / mobile / shared."
   ],
   "stack": [
    "FastAPI",
    "SQLAlchemy",
    "React",
    "Expo React Native",
    "Gemini"
   ],
   "cover": "assets/img/works/garmin-shot-1.webp",
   "links": [
    {
     "label": "Source code",
     "href": "https://github.com/duicn187532/garmin-dashboard"
    }
   ],
   "note": "The screenshots come from running the app locally with its built-in demo data (DEMO_MODE), not my real health data.",
   "gallery": [
    "assets/img/works/garmin-shot-1.webp",
    "assets/img/works/garmin-shot-2.webp"
   ]
  },
  {
   "id": "avalon",
   "date": "2026-10",
   "year": "2026",
   "category": "fun",
   "access": "demo",
   "featured": false,
   "status": "Private project",
   "live": false,
   "title": "Avalon for phones",
   "summary": "The Avalon board game played together on phones, with extra roles, voice chat, transcripts and an exportable AI game review.",
   "role": "Design and development",
   "growth": "Real-time multiplayer, WebRTC voice and AI game reviews: turning a friends' game night into a complete online product.",
   "highlights": [
    "Start a game at a get-together with nothing but phones.",
    "Voice is transcribed, and after the game AI helps review what happened."
   ],
   "stack": [
    "React",
    "Next.js (vinext)",
    "Cloudflare Workers",
    "D1",
    "WebRTC voice"
   ],
   "cover": "assets/img/works/avalon-phone-1.webp",
   "links": [
    {
     "label": "Demo",
     "href": "demos/avalon/"
    }
   ],
   "note": "The source code is private. The demo uses the original interface and game logic with the backend simulated in your browser. It only opens a solo test room (you plus bots), with no networking, sign-in or voice.",
   "gallery": [
    "assets/img/works/avalon-phone-1.webp",
    "assets/img/works/avalon-phone-2.webp",
    "assets/img/works/avalon-shot.webp"
   ]
  },
  {
   "id": "digitalmaster",
   "date": "2025-03",
   "year": "2025 – 2026",
   "category": "product",
   "access": "demo",
   "featured": false,
   "status": "Internal project",
   "live": false,
   "title": "Digital Master",
   "summary": "A digital-learning rewards platform used by 70 people: attending, taking courses, joining in and sharing cases earn stars that level you up and unlock badges.",
   "role": "Frontend and backend development",
   "growth": "Using game design to encourage internal digital learning: levels, badges and an admin back office.",
   "highlights": [
    "Levels, badges and rewards, with a member site and an admin back office."
   ],
   "stack": [
    "React",
    "TypeScript",
    "Python",
    "MongoDB",
    "Docker"
   ],
   "cover": "assets/img/works/digitalmaster-phone-1.webp",
   "links": [
    {
     "label": "Demo",
     "href": "demos/digitalmaster/"
    },
    {
     "label": "Source code",
     "href": "https://github.com/duicn187532/DigitalMaster"
    }
   ],
   "note": "The demo is the original frontend with made-up data for a sample learner. Sign in with any ID.",
   "gallery": [
    "assets/img/works/digitalmaster-phone-1.webp",
    "assets/img/works/digitalmaster-phone-2.webp"
   ]
  },
  {
   "id": "seatdraw",
   "date": "2025-04",
   "year": "2025",
   "category": "fun",
   "access": "none",
   "featured": false,
   "status": "Open source",
   "live": false,
   "title": "SeatDraw party seating",
   "summary": "A seat-drawing tool for events and year-end parties. The server makes sure no seat is assigned twice.",
   "role": "Development",
   "growth": "My first Go backend, practising how a server can guarantee that no seat is drawn twice.",
   "highlights": [
    "Enter the number of seats and start drawing; taken seats update live."
   ],
   "stack": [
    "React",
    "TypeScript",
    "Go",
    "Docker"
   ],
   "cover": "assets/img/works/seatdraw-phone-1.webp",
   "links": [
    {
     "label": "Source code",
     "href": "https://github.com/duicn187532/SeatDraw"
    }
   ],
   "note": "The screenshots use the live frontend with backend responses simulated in the browser; no real seat was drawn.",
   "gallery": [
    "assets/img/works/seatdraw-phone-1.webp",
    "assets/img/works/seatdraw-shot-2.webp"
   ]
  },
  {
   "id": "classhat",
   "date": "2025-08",
   "year": "2025",
   "category": "fun",
   "access": "none",
   "featured": false,
   "status": "Open source",
   "live": false,
   "title": "ClassHat MBTI groups",
   "summary": "An MBTI quiz with radar-chart results for internal events, plus an admin page that helps form groups.",
   "role": "Development",
   "growth": "A small, fast tool for an internal event: from questionnaire to radar chart, live in one weekend.",
   "highlights": [
    "Results are shown as a radar chart, and the admin page collects them into groups."
   ],
   "stack": [
    "HTML",
    "CSS",
    "Chart.js",
    "Python"
   ],
   "cover": "assets/img/works/classhat-shot-1.webp",
   "links": [
    {
     "label": "Source code",
     "href": "https://github.com/duicn187532/ClassHat"
    }
   ],
   "gallery": [
    "assets/img/works/classhat-shot-1.webp",
    "assets/img/works/classhat-shot-2.webp",
    "assets/img/works/classhat-phone-1.webp"
   ]
  },
  {
   "id": "news",
   "date": "2025-08",
   "year": "2025",
   "category": "ai",
   "access": "none",
   "featured": false,
   "status": "Open source",
   "live": false,
   "title": "News timeline",
   "summary": "Newsletter stories organised into a searchable timeline, for a quick look back at industry and company news.",
   "role": "Data preparation and development",
   "growth": "Turning scattered newsletters into data, then into a timeline you can browse.",
   "highlights": [
    "Documents converted to JSON and browsable by date and keyword, with sentiment scores for headlines and body text."
   ],
   "stack": [
    "HTML",
    "JavaScript",
    "JSON"
   ],
   "cover": "assets/img/works/news-shot-1.webp",
   "links": [
    {
     "label": "Source code",
     "href": "https://github.com/duicn187532/newsStorage"
    }
   ],
   "note": "The bank name in the screenshot is replaced with \"示範銀行\" (sample bank)."
  },
  {
   "id": "sentiment",
   "date": "2025-01",
   "year": "2025",
   "category": "ai",
   "access": "none",
   "featured": false,
   "status": "Internal project",
   "live": false,
   "title": "Public-opinion dashboard",
   "summary": "A public-opinion analysis tool used by 20 people and built in three phases: standalone keyword sentiment analysis, then trending keywords and a report request form, then an opinion database that collects stories from major news outlets automatically.",
   "role": "Team project: I did the full-stack engineering",
   "growth": "One product in three phases: from a standalone search tool, to a request form, to a database that collects news automatically.",
   "highlights": [
    "Phase 1 (January 2025): a standalone version where users search by keyword, connected to an on-premise RoBERTa sentiment model and the GPT API.",
    "Phase 2 (June 2025): trending keywords and a form for requesting opinion reports.",
    "Phase 3 (July 2025): an opinion database that collects major news stories for the configured keywords automatically."
   ],
   "stack": [
    "Python",
    "FastAPI",
    "RoBERTa",
    "GPT API",
    "News database"
   ],
   "cover": "assets/img/works/sentiment.svg",
   "links": [],
   "note": "An internal team project. The source code is private and there is no public demo. The cover is an illustration with made-up numbers and keywords."
  },
  {
   "id": "lottery",
   "date": "2025-03",
   "year": "2025",
   "category": "fun",
   "access": "none",
   "featured": false,
   "status": "Private project",
   "live": false,
   "title": "Fair prize draw",
   "summary": "A prize-draw tool for a fun fair: enter the prizes in the back office, then draw on the front page. There are two versions, frontend-only and full-stack, sharing one interface.",
   "role": "Built the frontend-only version (a colleague built the full-stack version; both share one UI)",
   "growth": "A colleague and I each built a version on one shared UI, which showed me why separating the interface from the data layer pays off.",
   "highlights": [
    "Enter prizes in the back office and draw on the front page, so the booth needs no paper lots.",
    "Two versions: the frontend-only one works as soon as you open it, with no server; the full-stack one, built by a colleague, runs with a server. Both share one UI."
   ],
   "stack": [
    "Frontend-only version",
    "Full-stack version (colleague)",
    "Shared UI"
   ],
   "cover": "assets/img/works/lottery.svg",
   "links": [],
   "note": "The source code is in a collaborator's private repository. The cover is an illustration and the prizes are made up."
  },
  {
   "id": "voteright",
   "date": "2023-12",
   "year": "2023 – 2024",
   "category": "fun",
   "access": "demo",
   "featured": false,
   "status": "Open source",
   "live": false,
   "title": "VoteRight: 2024 policy match",
   "summary": "A policy-matching quiz for Taiwan's 2024 presidential election: 10 issues, each with the three candidates' policies in random order, and a pie chart at the end showing whose policies you lean towards.",
   "role": "With a partner: Flask backend, MongoDB question bank, result chart and interface",
   "growth": "My first time splitting work with a partner and collaborating in Git; it went live before the election within two weeks, used by strangers.",
   "highlights": [
    "Options never show the candidate and are shuffled each question, to reduce bias.",
    "Answers were saved to MongoDB, and the result is a pie chart plus the full policy comparison."
   ],
   "stack": [
    "Python",
    "Flask",
    "MongoDB",
    "Chart.js",
    "Render"
   ],
   "cover": "assets/img/works/voteright-phone-1.webp",
   "links": [
    {
     "label": "Demo",
     "href": "demos/voteright/"
    },
    {
     "label": "Source code",
     "href": "https://github.com/Magenga/VoteRight"
    }
   ],
   "note": "The demo is a static copy of the original page, in Chinese. The questions come from the original project, the candidates are anonymised as A, B and C, no ads or Facebook load, and your answers are never sent or saved.",
   "gallery": [
    "assets/img/works/voteright-phone-1.webp",
    "assets/img/works/voteright-shot.webp"
   ]
  },
  {
   "id": "crawler",
   "date": "2023-08",
   "year": "2023",
   "category": "early",
   "access": "none",
   "featured": false,
   "status": "Early work",
   "live": false,
   "title": "Stock crawler × Flask site",
   "summary": "Starting from a crawler: scraping stock prices, serving them through a Flask API, laying them out with AJAX, then adding MongoDB members and a staff back office.",
   "role": "Self-study project",
   "growth": "Starting from zero: my first crawler, my first Flask site, my first database.",
   "highlights": [
    "A full record of development from scratch, and where my programming started."
   ],
   "stack": [
    "Python",
    "Flask",
    "MongoDB",
    "AJAX"
   ],
   "cover": "assets/img/works/crawler-shot-1.webp",
   "links": [
    {
     "label": "Crawler",
     "href": "https://github.com/duicn187532/Crawler"
    },
    {
     "label": "websiteResume",
     "href": "https://github.com/duicn187532/websiteResume"
    }
   ],
   "note": "The screenshots come from running the original Flask site again on my machine, with stock prices saved in 2023. The background photos are Hachiman and Olleh.",
   "gallery": [
    "assets/img/works/crawler-shot-1.webp",
    "assets/img/works/crawler-shot-2.webp"
   ]
  }
 ],
 "eras": {
  "2026": {
   "title": "AI tools, made into products",
   "text": "Connecting AI to real workflows while turning my work into products other people can use: local-first, traceable and maintainable."
  },
  "2025": {
   "title": "Into the office",
   "text": "Solving my colleagues' everyday problems: bookings, events and learning rewards. For the first time, people used something I built every day."
  },
  "2023": {
   "title": "Teaching myself from zero",
   "text": "A crawler and a Flask site: where programming started. At the end of the year I first split work with a partner and shipped a policy quiz before the election."
  }
 },
 "milestones": [
  {
   "date": "2026-11",
   "title": "HACHIMAN STUDIO founded",
   "text": "Named after my two cats, Hachiman and Olleh. I gathered three years of solo and collaborative work and started offering concept consultations.",
   "icon": "brand"
  }
 ]
};
