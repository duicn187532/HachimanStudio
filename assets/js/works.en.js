/*
 * English text for the portfolio (used by the pages under en/).
 * Only text lives here; dates, covers, links and availability come from works.js.
 * When you add or edit a work in works.js, update its entry here too.
 * A field left out falls back to the Chinese text in works.js.
 *   links: labels in the same order as the links in works.js
 */
window.HS_I18N_EN = {
  categories: {
    all: 'All',
    product: 'Products',
    ai: 'AI & data',
    edu: 'Interactive learning',
    fun: 'Events & fun',
    early: 'Early work'
  },
  status: {
    '營運中': 'In production',
    '開源': 'Open source',
    'Alpha': 'Alpha',
    'MVP': 'MVP',
    '內部專案': 'Internal project',
    '私人專案': 'Private project',
    '早期作品': 'Early work'
  },
  works: {
    meetbook: {
      title: 'MeetBook meeting-room booking',
      growth: 'The first thing I built that a whole department uses every day: real user feedback, data migration and operations, then the same booking rules extended to LINE and an AI assistant.',
      summary: 'A meeting-room booking service a department uses daily. The web app, a LINE official account and an AI assistant (MCP) share one conflict check.',
      role: 'Product planning, full-stack development, operations',
      highlights: [
        'Book several rooms at once; if any room conflicts, nothing is written, so there are no half-made bookings.',
        'The LINE account handles quick lookups and bookings; AI assistants can find free slots and create booking links through an /ai text page or an MCP connector.',
        'Admin dashboard: usage, peak hours, department stats, user list and announcements.',
        'Migrated smoothly from Deno + MongoDB to Cloudflare Workers + D1, with a relay mode for the company network.'
      ],
      note: 'This is a live production service, so its real site is not linked. The demo is the original frontend code with the backend replaced by made-up data inside your browser; it never contacts the real system.',
      links: ['Demo', 'Source code']
    },
    automl: {
      title: 'AutoML Workbench',
      growth: 'Bringing a machine-learning workflow into the browser with WebAssembly, Web Workers and offline packaging, so people without a Python setup can train models.',
      summary: 'An ML / DL workbench in the browser: no backend, works offline, and your data never leaves your computer. Unzip it and double-click index.html.',
      role: 'Design and development',
      highlights: [
        'Six modules: data, auto-training, model library, experiments, network design and Live Script.',
        'k-fold OOF bagging, TPE + successive halving, Caruana ensemble selection.',
        'Data-quality report and target-leakage detection: Hachiman finds the problems, Olleh guards the privacy.'
      ],
      links: ['Try it', 'Source code']
    },
    tongling: {
      title: 'TongLing',
      growth: 'From prototype to a real release: a local-first architecture, agent workflows, and the rule that AI only suggests while people decide.',
      summary: 'A local-first workspace for turning financial-services requirements into PRDs: knowledge search, source tracing, agent help, human decisions and IT hand-off checks in one flow.',
      role: 'Product design, prototyping, development',
      stack: ['Python', 'FastAPI', 'SQLite', 'React', 'TypeScript', 'Mermaid', 'Ollama (optional)'],
      highlights: [
        'PM project overview, sorted by what needs attention, shows where each requirement is stuck.',
        'Agent mode runs search, analysis and the PRD draft on its own and only stops when a person needs to decide; you can switch back to the manual flow at any time.',
        'Everything the AI produces is a suggestion awaiting review, and every requirement traces back to its source documents; includes PRD quality checks, gap filling and an IT hand-off pack.',
        'Host and client are separate; data, models and keys stay on the host machine.'
      ],
      note: 'The demo is the real Alpha interface. I loaded a made-up sample project into the real backend on my own machine, recorded one session, and the demo replays it in your browser. You can browse every page and switch between agent and manual mode, but no AI runs and nothing is saved.',
      links: ['Demo', 'Source code', 'Prototype source']
    },
    cslab: {
      title: 'CS LAB interactive self-study',
      growth: 'Turning my computer-science self-study notes into interactive lessons, where simulators make abstract mechanisms something you can play with and predict.',
      summary: 'A hub for nine interactive computer-science courses. The main course, OS LAB, has 29 chapters, 29 dedicated simulators and 174 quiz questions.',
      role: 'Course design and development',
      stack: ['HTML', 'JavaScript', 'MathML', 'Static site'],
      highlights: [
        'Each lesson goes: predict, everyday analogy, real mechanism, simulator, quiz, review of mistakes.',
        'Hands-on CPU scheduling, paging and TLB, the banker\'s algorithm, disk scheduling and more.',
        'NET LAB grew to 28 chapters, 27 interactive labs and coding challenges in four languages.'
      ],
      links: ['Open the course', 'Source code']
    },
    research: {
      title: 'Paper Reading Room',
      growth: 'Building a method for reading papers: layered explanations, formulas broken down symbol by symbol, and a clear line between derivation and the authors\' conclusions.',
      summary: 'A static site for close reading of papers. Each passage is explained at three depths (for a five-year-old, an undergraduate and a graduate student), and formulas are taken apart symbol by symbol.',
      role: 'Design and development',
      highlights: [
        'Five-way navigation: Problem, Method, Benchmark, Contribution, Gap.',
        'Each section has self-checks, a notes field and reading progress, plus game-like quests.',
        'Source-check cards and a reference list mark where derivation ends and the authors\' claims begin.'
      ],
      links: ['Open the site', 'Source code']
    },
    walk: {
      title: 'Walk',
      growth: 'Rebuilt a single-file mockup into a fully working full-stack MVP, and recorded architecture decisions in ADRs for the first time.',
      summary: 'An MVP that matches dog owners with dog walkers both ways, rebuilt from a single static mockup into a working full-stack app.',
      role: 'Product design, full-stack development',
      highlights: [
        'One account can switch between owner and walker.',
        'AI explains recommendations and reads photos; without AI it falls back to rule-based templates.',
        'Comes with architecture decision records (ADRs) and a one-command start script for hands-on testing.'
      ],
      note: 'The demo is an interactive UI concept on GitHub Pages with sample data. The full-stack MVP (React + Express + SQLite) runs locally.',
      links: ['Demo', 'Source code']
    },
    garmin: {
      title: 'Garmin Insight',
      growth: 'My first web + iOS monorepo, and practice making AI answer only from real data.',
      summary: 'Search, health trends, training load and grounded AI analysis for my own Garmin data. A web PWA and an iOS app share one API.',
      role: 'Full-stack development',
      highlights: [
        'Data is normalised into my own database first, and AI answers cite only real numbers.',
        'Keeps the official API connector behind a clear service boundary; demo mode runs fully offline.',
        'Monorepo: backend / web / mobile / shared.'
      ],
      links: ['Source code']
    },
    avalon: {
      title: 'Avalon for phones',
      growth: 'Real-time multiplayer, WebRTC voice and AI game reviews: turning a friends\' game night into a complete online product.',
      summary: 'The Avalon board game played together on phones, with extra roles, voice chat, transcripts and an exportable AI game review.',
      role: 'Design and development',
      stack: ['React', 'Next.js (vinext)', 'Cloudflare Workers', 'D1', 'WebRTC voice'],
      highlights: [
        'Start a game at a get-together with nothing but phones.',
        'Voice is transcribed, and after the game AI helps review what happened.'
      ],
      note: 'The source code is private. The demo uses the original interface and game logic with the backend simulated in your browser. It only opens a solo test room (you plus bots), with no networking, sign-in or voice.',
      links: ['Demo']
    },
    digitalmaster: {
      title: 'Digital Master',
      growth: 'Using game design to encourage internal digital learning: levels, badges and an admin back office.',
      summary: 'A digital-learning rewards platform: attending, taking courses, joining in and sharing cases earn stars that level you up and unlock badges.',
      role: 'Frontend and backend development',
      highlights: ['Levels, badges and rewards, with a member site and an admin back office.'],
      note: 'The demo is the original frontend with made-up data for a sample learner. Sign in with any ID.',
      links: ['Demo', 'Source code']
    },
    seatdraw: {
      title: 'SeatDraw party seating',
      growth: 'My first Go backend, practising how a server can guarantee that no seat is drawn twice.',
      summary: 'A seat-drawing tool for events and year-end parties. The server makes sure no seat is assigned twice.',
      role: 'Development',
      highlights: ['Enter the number of seats and start drawing; taken seats update live.'],
      links: ['Source code']
    },
    classhat: {
      title: 'ClassHat MBTI groups',
      growth: 'A small, fast tool for an internal event: from questionnaire to radar chart, live in one weekend.',
      summary: 'An MBTI quiz with radar-chart results for internal events, plus an admin page that helps form groups.',
      role: 'Development',
      highlights: ['Results are shown as a radar chart, and the admin page collects them into groups.'],
      links: ['Source code']
    },
    news: {
      title: 'News timeline',
      growth: 'Turning scattered newsletters into data, then into a timeline you can browse.',
      summary: 'Newsletter stories organised into a searchable timeline, for a quick look back at industry and company news.',
      role: 'Data preparation and development',
      highlights: ['Documents converted to JSON and browsable by date and keyword.'],
      links: ['Source code']
    },
    sentiment: {
      title: 'Public-opinion dashboard',
      growth: 'One product in three phases: from a standalone search tool, to a request form, to a database that collects news automatically.',
      summary: 'A public-opinion analysis tool built in three phases: standalone keyword sentiment analysis, then trending keywords and a report request form, then an opinion database that collects stories from major news outlets automatically.',
      role: 'Team project: I did the full-stack engineering',
      stack: ['Python', 'FastAPI', 'On-premise sentiment model', 'GPT API', 'News database'],
      highlights: [
        'Phase 1 (January 2025): a standalone version where users search by keyword, connected to an on-premise sentiment model and the GPT API.',
        'Phase 2 (June 2025): trending keywords and a form for requesting opinion reports.',
        'Phase 3 (July 2025): an opinion database that collects major news stories for the configured keywords automatically.'
      ],
      note: 'An internal team project. The source code is private and there is no public demo. The cover is an illustration with made-up numbers and keywords.'
    },
    lottery: {
      title: 'Fair prize draw',
      growth: 'A colleague and I each built a version on one shared UI, which showed me why separating the interface from the data layer pays off.',
      summary: 'A prize-draw tool for a fun fair: enter the prizes in the back office, then draw on the front page. There are two versions, frontend-only and full-stack, sharing one interface.',
      role: 'Built the frontend-only version (a colleague built the full-stack version; both share one UI)',
      stack: ['Frontend-only version', 'Full-stack version (colleague)', 'Shared UI'],
      highlights: [
        'Enter prizes in the back office and draw on the front page, so the booth needs no paper lots.',
        'Two versions: the frontend-only one works as soon as you open it, with no server; the full-stack one, built by a colleague, runs with a server. Both share one UI.'
      ],
      note: 'The source code is in a collaborator\'s private repository. The cover is an illustration and the prizes are made up.'
    },
    voteright: {
      title: 'VoteRight: 2024 policy match',
      growth: 'My first time splitting work with a partner and collaborating in Git; it went live before the election within two weeks, used by strangers.',
      summary: 'A policy-matching quiz for Taiwan\'s 2024 presidential election: 10 issues, each with the three candidates\' policies in random order, and a pie chart at the end showing whose policies you lean towards.',
      role: 'With a partner: Flask backend, MongoDB question bank, result chart and interface',
      highlights: [
        'Options never show the candidate and are shuffled each question, to reduce bias.',
        'Answers were saved to MongoDB, and the result is a pie chart plus the full policy comparison.'
      ],
      note: 'The demo is a static copy of the original page, in Chinese. The questions come from the original project, the candidates are anonymised as A, B and C, no ads or Facebook load, and your answers are never sent or saved.',
      links: ['Demo', 'Source code']
    },
    crawler: {
      title: 'Stock crawler × Flask site',
      growth: 'Starting from zero: my first crawler, my first Flask site, my first database.',
      summary: 'Starting from a crawler: scraping stock prices, serving them through a Flask API, laying them out with AJAX, then adding MongoDB members and a staff back office.',
      role: 'Self-study project',
      highlights: ['A full record of development from scratch, and where my programming started.'],
      links: ['Crawler', 'websiteResume']
    },
    skuld: {
      title: 'Operation Skuld',
      growth: 'Where programming started: a small tool to make my own days run smoother.',
      summary: 'A timer for managing everyday time, named after Skuld, the Norn who governs the future.',
      role: 'Self-study project',
      highlights: ['The first tool I built to make my own life run smoother.'],
      links: ['Source code']
    }
  }
};
