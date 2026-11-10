/*
 * 作品集資料。新增或修改作品只需要改這個檔案。
 *
 *  id        唯一代號（也用於網址 #work-<id>）
 *  cover     封面圖（assets/img/works/<id>.svg 由 tools/gen_covers.py 產生；*-shot*.webp 是實際畫面截圖）
 *  gallery   （選填）詳細視窗中的多張實際畫面，點縮圖切換
 *  category  product | ai | edu | fun | early
 *  links     [{ label, href }]，留空陣列就不顯示連結；連到 github.com 的連結會自動標示「附原始碼」
 *  date      開始時間 YYYY-MM（成長時間線依此排序，新的在上）
 *  access    live＝可以實際使用｜demo＝線上示範（原本介面＋虛構資料）｜none＝僅介紹
 *  growth    成長時間線上的一句話：這件作品讓我學到什麼
 *
 * ⚠ MeetBook 是正式營運中的系統：不放正式站網址、不嵌入、不呼叫任何正式 API。
 *   「線上示範」連到 demos/meetbook/：原本前端 + 瀏覽器內的虛構資料（demos-src/meetbook）。
 */
window.HS_WORKS = [
  {
    id: 'meetbook',
    date: '2025-02',
    access: 'demo',
    growth: '第一次把作品交給整個部門每天使用：學會處理真實使用者的回饋、資料遷移與維運，並把同一套預約規則延伸到 LINE 與 AI 助理。',
    title: 'MeetBook 會議室預約系統',
    year: '2025 – 2026',
    category: 'product',
    status: '營運中',
    featured: true,
    summary: '部門 60 人每天在用的會議室預約服務：網頁、LINE 官方帳號、AI 助理（MCP）三個入口共用同一套衝突檢查。',
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
    date: '2025-08',
    access: 'live',
    growth: '把機器學習流程搬進瀏覽器：WebAssembly、Web Worker 與離線打包，讓沒有環境的人也能訓練模型。',
    title: 'AutoML Workbench',
    year: '2025 – 2026',
    category: 'ai',
    status: '開源',
    featured: true,
    summary: '瀏覽器裡的 ML / DL 工作台：無後端、可離線，資料不離開電腦；解壓縮後雙擊 index.html 就能用。',
    role: '設計與開發',
    stack: ['TypeScript', 'React', 'TensorFlow.js', 'Pyodide', 'XGBoost / LightGBM', 'ECharts'],
    highlights: [
      '六大模組：資料、自動訓練、模型庫、實驗管理、網路設計、Live Script。',
      'k-fold OOF bagging、TPE + successive halving、Caruana ensemble selection。',
      '資料品質報告與 target leakage 偵測——由八萬負責抓問題、歐雷負責守隱私。'
    ],
    cover: 'assets/img/works/automl-shot-1.webp',
    gallery: ['assets/img/works/automl-shot-1.webp', 'assets/img/works/automl-shot-2.webp', 'assets/img/works/automl-shot-3.webp'],
    links: [
      { label: '線上試用', href: 'https://duicn187532.github.io/AutoML/' },
      { label: '原始碼', href: 'https://github.com/duicn187532/AutoML' }
    ]
  },
  {
    id: 'tongling',
    date: '2026-10',
    access: 'demo',
    growth: '從原型到正式版：本機優先的架構、Agent 工作流程與「AI 只給建議、人來決策」的產品原則。',
    title: '彤靈談心 TongLing',
    year: '2026',
    category: 'ai',
    status: 'Alpha',
    featured: true,
    summary: '本機優先的金融需求整理與 PRD 工作台：知識檢索、來源追溯、Agent 輔助、人工決策與 IT 交付檢查串成一條流程。',
    role: '產品設計、原型、開發',
    stack: ['Python', 'FastAPI', 'SQLite', 'React', 'TypeScript', 'Mermaid', 'Ollama（選用）'],
    highlights: [
      'PM 專案總覽：依待處理程度排序，一眼看到每個需求卡在哪一步。',
      'Agent 模式自動跑完檢索、分析與 PRD 草稿，只在需要人決策時跳出來；也可隨時切回手動流程。',
      'AI 產出一律是「待審建議」，每條需求都能追溯到來源文件；PRD 品質檢查、缺口補齊與 IT 交付包。',
      '主機／客戶端分離，資料、模型與金鑰只留在執行主機。'
    ],
    cover: 'assets/img/works/tongling-shot.webp',
    note: '「線上示範」是正式版（Alpha）介面：在本機用正式版後端載入虛構的範例專案、操作一輪後錄下資料，在瀏覽器內重播。可以瀏覽各頁面與切換 Agent／手動流程，但不會執行 AI 或儲存變更。',
    links: [
      { label: '線上示範', href: 'demos/tongling/' },
      { label: '原始碼', href: 'https://github.com/duicn187532/tongling-alpha' },
      { label: 'Prototype 原始碼', href: 'https://github.com/duicn187532/tongling-prototype' }
    ]
  },
  {
    id: 'cslab',
    date: '2026-10',
    access: 'live',
    growth: '把自學資工的筆記做成互動教材：用模擬器把抽象機制變成可以操作、可以預測的東西。',
    title: 'CS LAB 資工互動自學',
    year: '2026',
    category: 'edu',
    status: '開源',
    featured: true,
    summary: '九門資工課的互動教材入口，主課程 OS LAB 有 29 章、29 個專屬模擬器與 174 題測驗。',
    role: '教材設計與開發',
    stack: ['HTML', 'JavaScript', 'MathML', '純靜態'],
    highlights: [
      '「先預測 → 生活類比 → 真實機制 → 模擬器 → 測驗 → 錯題複習」的學習節奏。',
      'CPU 排程、分頁與 TLB、銀行家演算法、磁碟排程等都能動手操作。',
      'NET LAB 擴充至 28 章、27 種互動實驗與四語言程式挑戰。'
    ],
    cover: 'assets/img/works/cslab-shot-1.webp',
    gallery: ['assets/img/works/cslab-shot-1.webp', 'assets/img/works/cslab-shot-2.webp', 'assets/img/works/cslab-shot-3.webp'],
    links: [
      { label: '開啟課程', href: 'https://duicn187532.github.io/os-lab/' },
      { label: '原始碼', href: 'https://github.com/duicn187532/os-lab' }
    ]
  },
  {
    id: 'research',
    date: '2026-10',
    access: 'live',
    growth: '建立讀論文的方法：分層解釋、逐符號拆公式，並清楚標示哪些是推導、哪些是作者結論。',
    title: '論文精讀室',
    year: '2026',
    category: 'edu',
    status: '開源',
    featured: true,
    summary: '幫助精讀論文的靜態網站：同一段內容提供五歲／大學生／研究生三種解釋深度，公式逐符號拆解。',
    role: '設計與開發',
    stack: ['HTML', 'JavaScript', 'localStorage'],
    highlights: [
      'Problem／Method／Benchmark／Contribution／Gap 五維導航。',
      '每節附自我檢測、筆記欄與閱讀進度，搭配遊戲化任務。',
      '附原文核對卡與來源清單，清楚標示推導與作者結論的界線。'
    ],
    cover: 'assets/img/works/research-shot-1.webp',
    gallery: ['assets/img/works/research-shot-1.webp', 'assets/img/works/research-shot-2.webp'],
    links: [
      { label: '開啟網站', href: 'https://duicn187532.github.io/self-research/' },
      { label: '原始碼', href: 'https://github.com/duicn187532/self-research' }
    ]
  },
  {
    id: 'walk',
    date: '2026-10',
    access: 'demo',
    growth: '把單檔 mockup 重構成可完整操作的全端 MVP，第一次用 ADR 記錄架構決策。',
    title: 'Walk 我可遛',
    year: '2026',
    category: 'product',
    status: 'MVP',
    featured: true,
    summary: '飼主與遛狗者的雙向媒合平台 MVP，從單檔靜態 mockup 重構成可完整操作的全端應用。',
    role: '課程專案：產品設計、全端開發',
    stack: ['React', 'Express', 'SQLite', 'Ollama'],
    highlights: [
      '角色可兼任：同一帳號能切換「飼主／遛狗者」。',
      'AI 推薦理由與照片判讀；沒有 AI 時自動改用規則模板。',
      '附架構決策紀錄（ADR）與一鍵啟動腳本，方便實際體驗測試。'
    ],
    cover: 'assets/img/works/walk-shot-1.webp',
    gallery: ['assets/img/works/walk-shot-1.webp', 'assets/img/works/walk-shot-2.webp', 'assets/img/works/walk-shot-3.webp'],
    note: '「線上示範」是放在 GitHub Pages 的互動原型（UI Concept），資料皆為示範用；完整的全端 MVP（React＋Express＋SQLite）需要在本機啟動。',
    links: [
      { label: '線上示範', href: 'https://duicn187532.github.io/walk6/' },
      { label: '原始碼', href: 'https://github.com/duicn187532/walk6' }
    ]
  },
  {
    id: 'garmin',
    date: '2026-07',
    access: 'none',
    growth: '第一次做 Web＋iOS 的 monorepo，練習讓 AI 回答只根據實際數據。',
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
    note: '截圖是在本機用專案內建的示範資料（DEMO_MODE）啟動，不是我的真實健康資料。',
    cover: 'assets/img/works/garmin-shot-1.webp',
    gallery: ['assets/img/works/garmin-shot-1.webp', 'assets/img/works/garmin-shot-2.webp'],
    links: [{ label: '原始碼', href: 'https://github.com/duicn187532/garmin-dashboard' }]
  },
  {
    id: 'avalon',
    date: '2026-10',
    access: 'demo',
    growth: '即時多人連線、WebRTC 語音與 AI 復盤：把朋友聚會的需求做成完整的線上產品。',
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
    note: '原始碼為私人專案，不公開。「線上示範」使用原本的介面與遊戲邏輯，後端改在瀏覽器內模擬，只能開「單人測試房」（你＋機器人），沒有連線、登入與語音。',
    cover: 'assets/img/works/avalon-shot.webp',
    links: [{ label: '線上示範', href: 'demos/avalon/' }]
  },
  {
    id: 'digitalmaster',
    date: '2025-03',
    access: 'demo',
    growth: '用遊戲化設計推動內部數位學習：等級、徽章與後台管理。',
    title: '數位達人',
    year: '2025 – 2026',
    category: 'product',
    status: '內部專案',
    featured: false,
    summary: '70 人使用的數位學習激勵平台：出席、課程、互動、案例等任務累積星數，升級並解鎖徽章。',
    role: '前後端開發',
    stack: ['React', 'TypeScript', 'Python', 'MongoDB', 'Docker'],
    highlights: ['等級、徽章與兌換機制，前台＋後台管理。'],
    note: '「線上示範」為原本的前端畫面，資料換成虛構的「示範達人」，任意輸入帳號即可登入。',
    cover: 'assets/img/works/digitalmaster-shot-1.webp',
    links: [
      { label: '線上示範', href: 'demos/digitalmaster/' },
      { label: '原始碼', href: 'https://github.com/duicn187532/DigitalMaster' }
    ]
  },
  {
    id: 'seatdraw',
    date: '2025-04',
    access: 'none',
    growth: '第一次用 Go 寫後端，練習用伺服器保證抽籤結果不重複。',
    title: 'SeatDraw 派對抽座位',
    year: '2025',
    category: 'fun',
    status: '開源',
    featured: false,
    summary: '活動與尾牙用的抽座位小工具，伺服器端確保座位不重複分配。',
    role: '開發',
    stack: ['React', 'TypeScript', 'Go', 'Docker'],
    highlights: ['輸入座位數即可開抽，已分配狀態即時更新。'],
    note: '截圖用的是線上的前端，後端回應在瀏覽器內模擬，沒有真的抽座位。',
    cover: 'assets/img/works/seatdraw-shot-1.webp',
    gallery: ['assets/img/works/seatdraw-shot-1.webp', 'assets/img/works/seatdraw-shot-2.webp'],
    links: [{ label: '原始碼', href: 'https://github.com/duicn187532/SeatDraw' }]
  },
  {
    id: 'classhat',
    date: '2025-08',
    access: 'none',
    growth: '小而快的內部活動工具：從問卷到雷達圖，一個週末上線。',
    title: 'ClassHat MBTI 分組',
    year: '2025',
    category: 'fun',
    status: '開源',
    featured: false,
    summary: '內部活動用的 MBTI 測驗與雷達圖結果，搭配管理頁協助分組。',
    role: '開發',
    stack: ['HTML', 'CSS', 'Chart.js', 'Python'],
    highlights: ['測驗結果以雷達圖呈現，管理端彙整分組。'],
    cover: 'assets/img/works/classhat-shot-1.webp',
    gallery: ['assets/img/works/classhat-shot-1.webp', 'assets/img/works/classhat-shot-2.webp', 'assets/img/works/classhat-shot-3.webp'],
    links: [{ label: '原始碼', href: 'https://github.com/duicn187532/ClassHat' }]
  },
  {
    id: 'news',
    date: '2025-08',
    access: 'none',
    growth: '把散落的電子報整理成資料，再做成可以瀏覽的時間軸。',
    title: '新聞時間軸',
    year: '2025',
    category: 'ai',
    status: '開源',
    featured: false,
    summary: '把電子報新聞整理成可搜尋的時間軸，快速回顧產業與公司動態。',
    role: '資料整理與開發',
    stack: ['HTML', 'JavaScript', 'JSON'],
    highlights: ['文件轉 JSON，依日期與關鍵字瀏覽，並標出標題與內文的情緒分數。'],
    note: '截圖中的銀行名稱已改為「示範銀行」。',
    cover: 'assets/img/works/news-shot-1.webp',
    links: [{ label: '原始碼', href: 'https://github.com/duicn187532/newsStorage' }]
  },
  {
    id: 'sentiment',
    date: '2025-01',
    access: 'none',
    growth: '同一個產品做了三個階段：從單機搜尋，到申請表單，再到自動蒐集新聞的資料庫。',
    title: '輿情分析儀表板',
    year: '2025',
    category: 'ai',
    status: '內部專案',
    featured: false,
    summary: '20 人使用、分三個階段打造的輿情分析工具：從單機版的關鍵字情緒分析，到熱搜關鍵字與報告申請表單，再到自動蒐集各大新聞的輿情資料庫。',
    role: '團隊合作：負責全端工程',
    stack: ['Python', 'FastAPI', 'RoBERTa', 'GPT API', '新聞資料庫'],
    highlights: [
      '第一階段（2025 年 1 月）：單機版，使用者輸入關鍵字搜尋，串接地端 RoBERTa 情感模型與 GPT API 做分析。',
      '第二階段（2025 年 6 月）：加入熱搜關鍵字與輿情報告申請表單。',
      '第三階段（2025 年 7 月）：建立輿情資料庫，依設定的關鍵字自動蒐集各大新聞。'
    ],
    note: '團隊的內部專案，原始碼不公開，也不提供試用入口。封面是示意畫面，數字與關鍵字均為虛構。',
    cover: 'assets/img/works/sentiment.svg',
    links: []
  },
  {
    id: 'lottery',
    date: '2025-03',
    access: 'none',
    growth: '和同事各做一個版本、共用同一套 UI：第一次體會到介面與資料層分開的好處。',
    title: '園遊會抽獎',
    year: '2025',
    category: 'fun',
    status: '私人專案',
    featured: false,
    summary: '園遊會用的抽獎工具：在後台輸入獎品後，就可以在前台抽獎。有純前端與前後端兩個版本，共用同一套介面。',
    role: '純前端版本的開發（前後端版本由同事開發，兩版共用同一套 UI）',
    stack: ['純前端版', '前後端版（同事）', '共用 UI'],
    highlights: [
      '後台輸入獎品，前台直接抽獎，攤位現場不用另外準備籤筒。',
      '雙版本：純前端版打開就能用、不需要伺服器；前後端版由同事開發，搭配伺服器運作。兩版共用同一套 UI。'
    ],
    note: '原始碼放在合作夥伴的私人 repo，不公開；封面是示意畫面，獎品為虛構。',
    cover: 'assets/img/works/lottery.svg',
    links: []
  },
  {
    id: 'voteright',
    date: '2023-12',
    access: 'demo',
    growth: '第一次和夥伴分工、用 Git 協作，兩週內在選前上線，給陌生人使用。',
    title: 'VoteRight 2024 政見的選擇',
    year: '2023 – 2024',
    category: 'fun',
    status: '開源',
    featured: false,
    summary: '2024 總統大選的政見配對測驗：10 個議題、三位候選人的政見隨機排序，選完後用圓餅圖看看你支持的政見偏向誰。',
    role: '與夥伴合作：Flask 後端、MongoDB 題庫、結果圖表與介面',
    stack: ['Python', 'Flask', 'MongoDB', 'Chart.js', 'Render'],
    highlights: [
      '政見選項不顯示候選人、每題隨機排序，降低先入為主的影響。',
      '作答結果存進 MongoDB，最後以圓餅圖與完整政見對照呈現。'
    ],
    note: '「線上示範」是原本頁面的靜態版：題庫取自原專案，候選人改以 A／B／C 匿名，不載入廣告與 Facebook，作答不會送出或儲存。',
    cover: 'assets/img/works/voteright-shot.webp',
    gallery: ['assets/img/works/voteright-shot.webp', 'assets/img/works/voteright-shot-2.webp', 'assets/img/works/voteright-shot-1.webp'],
    links: [
      { label: '線上示範', href: 'demos/voteright/' },
      { label: '原始碼', href: 'https://github.com/Magenga/VoteRight' }
    ]
  },
  {
    id: 'crawler',
    date: '2023-08',
    access: 'none',
    growth: '從零開始：第一支爬蟲、第一個 Flask 網站、第一次接資料庫。',
    title: '股價爬蟲 × Flask 網站',
    year: '2023',
    category: 'early',
    status: '早期作品',
    featured: false,
    summary: '從爬蟲出發：抓取股價、用 Flask 發 API、前端 AJAX 排版，再加上 MongoDB 會員與員工後台。',
    role: '自學專案',
    stack: ['Python', 'Flask', 'MongoDB', 'AJAX'],
    highlights: ['完整記錄從 0 開始的開發歷程，是我寫程式的起點。'],
    note: '截圖是在本機重新啟動當年的 Flask 網站，股價為 2023 年存下的資料；背景照片就是八萬和歐雷。',
    cover: 'assets/img/works/crawler-shot-1.webp',
    gallery: ['assets/img/works/crawler-shot-1.webp', 'assets/img/works/crawler-shot-2.webp'],
    links: [
      { label: 'Crawler', href: 'https://github.com/duicn187532/Crawler' },
      { label: 'websiteResume', href: 'https://github.com/duicn187532/websiteResume' }
    ]
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
