/*
 * 作品集資料。新增或修改作品只需要改這個檔案。
 *
 *  id        唯一代號（也用於網址 #work-<id>）
 *  cover     封面圖（assets/img/works/<id>.svg 由 tools/gen_covers.py 產生，可換成真實截圖）
 *  category  product | ai | edu | fun | early
 *  links     [{ label, href }]，留空陣列就不顯示連結
 *
 * ⚠ MeetBook 是正式營運中的系統：不放正式站網址、不嵌入、不呼叫任何正式 API。
 *   「線上示範」連到 demos/meetbook/：原本前端 + 瀏覽器內的虛構資料（demos-src/meetbook）。
 */
window.HS_WORKS = [
  {
    id: 'meetbook',
    title: 'MeetBook 會議室預約系統',
    year: '2025 – 2026',
    category: 'product',
    status: '營運中',
    featured: true,
    summary: '部門每天在用的會議室預約服務：網頁、LINE 官方帳號、AI 助理（MCP）三個入口共用同一套衝突檢查。',
    role: '產品規劃、全端開發、維運',
    stack: ['React 19', 'Vite', 'Tailwind', 'Cloudflare Workers', 'D1', 'LINE Messaging API', 'MCP'],
    highlights: [
      '一次預約多間會議室，任一間衝突即整筆不寫入，避免半套預約。',
      'LINE 官方帳號可快速查詢／預約；AI 助理可透過 /ai 文字頁或 MCP 連接器查空檔並產生預約連結。',
      '管理後台：使用率、熱門時段、部門統計、使用者名單與公告管理。',
      '從 Deno + MongoDB 平滑遷移到 Cloudflare Workers + D1，並以中繼模式處理公司網路限制。'
    ],
    note: '此系統為正式營運服務，不公開正式站入口。「線上示範」是複製原本前端程式碼、把後端換成瀏覽器內虛構資料的離線版本，不會連到正式環境。',
    cover: 'assets/img/works/meetbook-shot.webp',
    links: [
      { label: '線上示範', href: 'demos/meetbook/' },
      { label: '原始碼', href: 'https://github.com/duicn187532/MeetBook' }
    ]
  },
  {
    id: 'automl',
    title: 'AutoML Workbench',
    year: '2026',
    category: 'ai',
    status: '公開',
    featured: true,
    summary: '瀏覽器裡的 ML / DL 工作台：無後端、可離線，資料不離開電腦；解壓縮後雙擊 index.html 就能用。',
    role: '設計與開發',
    stack: ['TypeScript', 'React', 'TensorFlow.js', 'Pyodide', 'XGBoost / LightGBM', 'ECharts'],
    highlights: [
      '六大模組：資料、自動訓練、模型庫、實驗管理、網路設計、Live Script。',
      'k-fold OOF bagging、TPE + successive halving、Caruana ensemble selection。',
      '資料品質報告與 target leakage 偵測——由八萬負責抓問題、歐雷負責守隱私。'
    ],
    cover: 'assets/img/works/automl.svg',
    links: [
      { label: '線上試用', href: 'https://duicn187532.github.io/AutoML/' },
      { label: '原始碼', href: 'https://github.com/duicn187532/AutoML' }
    ]
  },
  {
    id: 'tongling',
    title: '彤靈談心 TongLing',
    year: '2026',
    category: 'ai',
    status: 'Alpha',
    featured: true,
    summary: '本機優先的金融需求整理與 PRD 工作台：知識檢索、來源追溯、Agent 輔助、人工決策與 IT 交付檢查串成一條流程。',
    role: '產品設計、原型、開發',
    stack: ['Python', 'FastAPI', 'React', 'Ollama（選用）', 'Windows 一鍵啟動'],
    highlights: [
      '九步驟流程：需求說明 → 知識檢索 → 補充資料 → 會議助理 → AI 分析 → 人工確認 → 流程架構 → 預覽 → 下載 PRD。',
      'AI 產出一律是「待審建議」，每條需求都能追溯到來源文件。',
      '主機／客戶端分離，資料、模型與金鑰只留在執行主機。'
    ],
    cover: 'assets/img/works/tongling.svg',
    note: '「原型示範」為 Prototype v16 靜態原型，AI 分析、知識檢索等皆為情境模擬。',
    links: [
      { label: '原型示範', href: 'demos/tongling/' },
      { label: 'Alpha 原始碼', href: 'https://github.com/duicn187532/tongling-alpha' },
      { label: 'Prototype', href: 'https://github.com/duicn187532/tongling-prototype' }
    ]
  },
  {
    id: 'cslab',
    title: 'CS LAB 資工互動自學',
    year: '2026',
    category: 'edu',
    status: '公開',
    featured: true,
    summary: '九門資工課的互動教材入口，主課程 OS LAB 有 29 章、29 個專屬模擬器與 174 題測驗。',
    role: '教材設計與開發',
    stack: ['HTML', 'JavaScript', 'MathML', '純靜態'],
    highlights: [
      '「先預測 → 生活類比 → 真實機制 → 模擬器 → 測驗 → 錯題複習」的學習節奏。',
      'CPU 排程、分頁與 TLB、銀行家演算法、磁碟排程等都能動手操作。',
      'NET LAB 擴充至 28 章、27 種互動實驗與四語言程式挑戰。'
    ],
    cover: 'assets/img/works/cslab.svg',
    links: [
      { label: '開啟課程', href: 'https://duicn187532.github.io/os-lab/' },
      { label: '原始碼', href: 'https://github.com/duicn187532/os-lab' }
    ]
  },
  {
    id: 'research',
    title: '論文精讀室',
    year: '2026',
    category: 'edu',
    status: '公開',
    featured: true,
    summary: '幫助精讀論文的靜態網站：同一段內容提供五歲／大學生／研究生三種解釋深度，公式逐符號拆解。',
    role: '設計與開發',
    stack: ['HTML', 'JavaScript', 'localStorage'],
    highlights: [
      'Problem／Method／Benchmark／Contribution／Gap 五維導航。',
      '每節附自我檢測、筆記欄與閱讀進度，搭配遊戲化任務。',
      '附原文核對卡與來源清單，清楚標示推導與作者結論的界線。'
    ],
    cover: 'assets/img/works/research.svg',
    links: [{ label: '原始碼', href: 'https://github.com/duicn187532/self-research' }]
  },
  {
    id: 'walk',
    title: 'Walk 我可遛',
    year: '2026',
    category: 'product',
    status: 'MVP',
    featured: true,
    summary: '飼主與遛狗者的雙向媒合平台 MVP，從單檔靜態 mockup 重構成可完整操作的全端應用。',
    role: '產品設計、全端開發',
    stack: ['React', 'Express', 'SQLite', 'Ollama'],
    highlights: [
      '角色可兼任：同一帳號能切換「飼主／遛狗者」。',
      'AI 推薦理由與照片判讀；沒有 AI 時自動改用規則模板。',
      '附架構決策紀錄（ADR）與一鍵啟動腳本，方便實際體驗測試。'
    ],
    cover: 'assets/img/works/walk.svg',
    links: [{ label: '原始碼', href: 'https://github.com/duicn187532/walk6' }]
  },
  {
    id: 'garmin',
    title: 'Garmin Insight',
    year: '2026',
    category: 'ai',
    status: 'MVP',
    featured: false,
    summary: '個人 Garmin 資料的搜尋、健康趨勢、訓練負荷與有根據的 AI 分析，Web PWA 與 iOS App 共用 API。',
    role: '全端開發',
    stack: ['FastAPI', 'SQLAlchemy', 'React', 'Expo React Native', 'Gemini'],
    highlights: [
      '資料先正規化存到自己的資料庫，AI 回答只引用實際數據。',
      '保留官方 API connector 的服務邊界，示範模式可完全離線。',
      'Monorepo：backend / web / mobile / shared。'
    ],
    cover: 'assets/img/works/garmin.svg',
    links: [{ label: '原始碼', href: 'https://github.com/duicn187532/garmin-dashboard' }]
  },
  {
    id: 'avalon',
    title: '阿瓦隆 · 手機多人連線',
    year: '2026',
    category: 'fun',
    status: '私人專案',
    featured: false,
    summary: '手機多人連線的阿瓦隆桌遊：擴充角色、語音通話、逐字稿與 AI 復盤匯出。',
    role: '設計與開發',
    stack: ['React', 'Next.js（vinext）', 'Cloudflare Workers', 'D1', 'WebRTC 語音'],
    highlights: [
      '朋友聚會時只要手機就能開局。',
      '語音轉逐字稿，遊戲結束後由 AI 協助復盤。'
    ],
    note: '原始碼為私人專案。「線上示範」使用原本的介面與遊戲邏輯，後端改在瀏覽器內模擬，只能開「單人測試房」（你＋機器人），沒有連線、登入與語音。',
    cover: 'assets/img/works/avalon-shot.webp',
    links: [{ label: '線上示範', href: 'demos/avalon/' }]
  },
  {
    id: 'digitalmaster',
    title: '數位達人',
    year: '2025 – 2026',
    category: 'product',
    status: '內部專案',
    featured: false,
    summary: '數位學習激勵平台：出席、課程、互動、案例等任務累積星數，升級並解鎖徽章。',
    role: '前後端開發',
    stack: ['React', 'TypeScript', 'Python', 'MongoDB', 'Docker'],
    highlights: ['等級、徽章與兌換機制，前台＋後台管理。'],
    note: '「線上示範」為原本的前端畫面，資料換成虛構的「示範達人」，任意輸入帳號即可登入。',
    cover: 'assets/img/works/digitalmaster.svg',
    links: [
      { label: '線上示範', href: 'demos/digitalmaster/' },
      { label: '原始碼', href: 'https://github.com/duicn187532/DigitalMaster' }
    ]
  },
  {
    id: 'seatdraw',
    title: 'SeatDraw 派對抽座位',
    year: '2025',
    category: 'fun',
    status: '公開',
    featured: false,
    summary: '活動與尾牙用的抽座位小工具，伺服器端確保座位不重複分配。',
    role: '開發',
    stack: ['React', 'TypeScript', 'Go', 'Docker'],
    highlights: ['輸入座位數即可開抽，已分配狀態即時更新。'],
    cover: 'assets/img/works/seatdraw.svg',
    links: [{ label: '原始碼', href: 'https://github.com/duicn187532/SeatDraw' }]
  },
  {
    id: 'classhat',
    title: 'ClassHat MBTI 分組',
    year: '2025',
    category: 'fun',
    status: '公開',
    featured: false,
    summary: '內部活動用的 MBTI 測驗與雷達圖結果，搭配管理頁協助分組。',
    role: '開發',
    stack: ['HTML', 'CSS', 'Chart.js', 'Python'],
    highlights: ['測驗結果以雷達圖呈現，管理端彙整分組。'],
    cover: 'assets/img/works/classhat.svg',
    links: [{ label: '原始碼', href: 'https://github.com/duicn187532/ClassHat' }]
  },
  {
    id: 'news',
    title: '新聞時間軸',
    year: '2025',
    category: 'ai',
    status: '公開',
    featured: false,
    summary: '把電子報新聞整理成可搜尋的時間軸，快速回顧產業與公司動態。',
    role: '資料整理與開發',
    stack: ['HTML', 'JavaScript', 'JSON'],
    highlights: ['文件轉 JSON，依日期與關鍵字瀏覽。'],
    cover: 'assets/img/works/news.svg',
    links: [{ label: '原始碼', href: 'https://github.com/duicn187532/newsStorage' }]
  },
  {
    id: 'crawler',
    title: '股價爬蟲 × Flask 網站',
    year: '2023',
    category: 'early',
    status: '早期作品',
    featured: false,
    summary: '從爬蟲出發：抓取股價、用 Flask 發 API、前端 AJAX 排版，再加上 MongoDB 會員與員工後台。',
    role: '自學專案',
    stack: ['Python', 'Flask', 'MongoDB', 'AJAX'],
    highlights: ['完整記錄從 0 開始的開發歷程，是工作室的起點。'],
    cover: 'assets/img/works/crawler.svg',
    links: [
      { label: 'Crawler', href: 'https://github.com/duicn187532/Crawler' },
      { label: 'websiteResume', href: 'https://github.com/duicn187532/websiteResume' }
    ]
  },
  {
    id: 'skuld',
    title: 'Operation Skuld',
    year: '2023',
    category: 'early',
    status: '早期作品',
    featured: false,
    summary: '管理日常時間的計時器程式，命名取自命運三女神中掌管未來的詩寇蒂。',
    role: '自學專案',
    stack: ['Python'],
    highlights: ['第一個想「讓自己的生活更順」的小工具。'],
    cover: 'assets/img/works/skuld.svg',
    links: [{ label: '原始碼', href: 'https://github.com/duicn187532/Operation_Skuld' }]
  }
];

window.HS_CATEGORIES = {
  all: '全部',
  product: '產品服務',
  ai: 'AI 與資料',
  edu: '互動教材',
  fun: '活動與娛樂',
  early: '早期作品'
};
