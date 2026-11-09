# HACHIMAN STUDIO 八萬工作室 · 品牌形象網站

HACHIMAN STUDIO 八萬工作室是八萬爸的個人品牌（品牌名與吉祥物來自家裡的兩隻貓八萬與歐雷），目前沒有登記營業、不以營利為目的；以業餘、不收費的概念諮詢為主。

內容：首頁（關於、靈感來源、概念諮詢與範圍說明、精選作品、諮詢方式、歷程、聯絡與 FAQ）、作品集頁（標示可實際使用／線上示範／僅介紹與是否附原始碼，可篩選）、成長時間線（越往下越早），以及 404 頁。

純靜態網站，不需要建置，也沒有任何後端或第三方追蹤。

## 本機預覽

```bash
python3 -m http.server 8000   # 打開 http://localhost:8000
```

## 部署（GitHub Pages）

Settings → Pages → Build and deployment → Source 選「Deploy from a branch」，Branch 選 `main`、資料夾 `/ (root)`。
網址會是 `https://duicn187532.github.io/HachimanStudio/`。

改用自訂網域時，把 `404.html` 裡的 `<base href="/HachimanStudio/">` 改成 `<base href="/">`。

## 常見修改

| 想改什麼 | 改哪裡 |
| --- | --- |
| 新增／修改作品 | `assets/js/works.js`（每件作品一筆資料；`featured: true` 會出現在首頁；`date` 決定在成長時間線的位置；`access` 決定「可實際使用／線上示範／僅介紹」標示） |
| 成長時間線的年度標題與里程碑 | `assets/js/site.js` 的 `ERAS`、`MILESTONES` |
| 公開 Email（概念諮詢的來信信箱） | `assets/js/site.js` 最上方的 `SITE.email`（留空時「寄信諮詢」按鈕會隱藏，只顯示 GitHub） |
| 文案（含概念諮詢的範圍說明與 FAQ） | `index.html`、`works.html`、`growth.html` |
| 顏色、字體 | `assets/css/style.css` 最上方的 `:root` |
| 作品封面 | `python3 tools/gen_covers.py` 重新產生 `assets/img/works/*.svg`；`*-shot.webp` 是示範版截圖 |

## 訪客統計（GoatCounter）

使用 [GoatCounter](https://www.goatcounter.com/)：免費、不使用 cookie，不需要隱私同意視窗。統計首頁、作品集、成長時間線與 404 頁；線上示範（`demos/`）不統計。

1. 到 goatcounter.com 註冊，設定一個代碼（例如 `hachiman`，後台網址就是 `https://hachiman.goatcounter.com`）。
2. 把代碼填進 `assets/js/site.js` 最上方的 `SITE.goatcounter`。
3. 要在頁尾顯示「累計瀏覽 N 次」：GoatCounter 後台 → Settings → 勾選「Allow adding visitor counts on your website」。沒開啟時頁尾不會顯示數字，但統計照常進行。

留空代碼時完全不統計。本機預覽（localhost）不會被計入。

## 線上示範（demos/）

不能公開正式入口或原始碼的作品，提供「原本介面＋虛構資料」的離線示範版。示範版都不發出任何 API 請求，資料只存在瀏覽者自己的瀏覽器。

| 示範 | 來源 | 做法 |
| --- | --- | --- |
| `demos/meetbook/` | MeetBook 前端（`demos-src/meetbook`） | 複製原本的 React 前端；會議室名稱、照片、部門改為通用的虛構內容；`src/api/meetingApi.ts` 換成瀏覽器內的虛構預約資料，`backend.ts` 改為一律拒絕連線 |
| `demos/avalon/` | avalon（私人 repo） | 只放建置結果，不放原始碼。以原本的頁面與遊戲邏輯建置，`/api/*` 在瀏覽器內模擬，只能開單人測試房 |
| `demos/digitalmaster/` | DigitalMaster 前端（`demos-src/digitalmaster`） | 複製原本的前端；`src/api/api.ts` 回傳虛構的「示範達人」，問卷改為本機頁面 |
| `demos/tongling/` | tongling-alpha 正式版前端（`demos-src/tongling`） | 前端程式碼未改動；`src/demo/` 重播在本機用正式版後端載入虛構範例專案後錄下的回應，不執行 AI、不儲存 |

重新建置某個示範（輸出會覆蓋 `demos/<名稱>/`）：

```bash
cd demos-src/meetbook && npm ci && npx vite build
```

### 關於 MeetBook（正式營運中）

MeetBook 是正式營運中的系統，本網站**不使用任何正式環境資源**：不放正式站網址、不嵌入、不呼叫正式 API，也沒有正式站截圖。示範版的封面截圖來自上面的離線示範，會議與預約者都是虛構的。

## 素材授權

- 八萬、歐雷角色、標誌與插圖：© 八萬爸 / HACHIMAN STUDIO 八萬工作室，未經同意請勿重製（來源：AutoML repo 的 `src/assets/brand/`）。
- Lato 字型：SIL Open Font License 1.1（`assets/fonts/OFL-Lato.txt`）。
