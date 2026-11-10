# HACHIMAN STUDIO 八萬工作室 · 品牌形象網站

HACHIMAN STUDIO 八萬工作室是八萬爸的個人品牌（品牌名與吉祥物來自家裡的兩隻貓八萬與歐雷），目前沒有登記營業、不以營利為目的；以業餘、不收費的概念諮詢為主。

提供繁體中文與英文（`en/`）兩種語系，導覽列右上角可切換。

內容：首頁（關於、靈感來源、概念諮詢與範圍說明、精選作品、諮詢方式、歷程、聯絡與 FAQ）、作品集頁（標示可實際使用／線上示範／僅介紹與是否附原始碼，可篩選）、成長時間線（越往下越早），以及 404 頁。

純靜態網站：訪客打開的是已經產生好的 HTML、CSS 與一支資料 JS，沒有後端、不需要額外的 API 請求。

## 內容後台（admin/）

網址：`https://duicn187532.github.io/HachimanStudio/admin/`（不在導覽列上，也不會被搜尋引擎收錄）。

可以修改首頁每個區塊（主視覺、關於我、兩隻貓、概念諮詢、精選作品、諮詢流程、歷程、聯絡與 FAQ）、作品集頁、成長時間線（年度標題、里程碑）、網站設定（Email、GitHub、GoatCounter、搜尋與分享描述），以及新增、修改、排序、隱藏作品與上傳圖片。中文與英文並排編輯，英文留空時英文版會先顯示中文。

運作方式（沒有後端伺服器）：

1. 後台本身也是靜態網頁，用你的 GitHub 權杖直接呼叫 GitHub API，把修改提交到 `main`：只會改 `content/site.json`、`content/works.json` 與新上傳的 `assets/img/works/*.webp`。
2. 上傳的圖片在瀏覽器裡就縮到 1600px 寬並轉成 WebP，不會把手機原圖放上網站。
3. `.github/workflows/build.yml` 偵測到提交後執行 `tools/build_site.py` 產生頁面，提交回 `main` 並請 GitHub Pages 重新部署，大約 1–2 分鐘上線。
4. 還沒發布的修改會自動存成這台電腦的草稿，不小心關掉分頁也不會不見（新上傳的圖片除外）。

第一次使用：到 GitHub → Settings → Developer settings → [Fine-grained tokens](https://github.com/settings/personal-access-tokens/new) 產生權杖，Repository access 只選 `HachimanStudio`，Repository permissions 的 **Contents** 設為 Read and write（想在後台看到上線進度，再把 **Actions** 設為 Read-only）。權杖只會送到 api.github.com；沒勾「記住」時關掉分頁就會忘記。

## 檔案分工

| 想改什麼 | 改哪裡 |
| --- | --- |
| 網站文字、作品、時間線、聯絡方式 | 用後台，或直接改 `content/site.json`、`content/works.json`（每個文字欄位是 `{"zh": …, "en": …}`） |
| 版面與 HTML 結構 | `templates/*.html`（Jinja2） |
| 導覽列、按鈕等固定介面文字 | `tools/build_site.py` 的 `UI` |
| 圖示（關於我的特點、諮詢範圍） | `templates/icons.json` |
| 互動行為（作品卡片、篩選、詳細視窗、時間線） | `assets/js/site.js` |
| 顏色、字體 | `assets/css/style.css` 最上方的 `:root` |
| 作品封面 | 後台上傳，或放在 `assets/img/works/`；多數是實際畫面截圖（`*-shot*.webp`、手機框 `*-phone-*.webp`），抽獎與輿情用 `python3 tools/gen_covers.py` 產生的示意圖 |

以下檔案由建置產生，**不要直接修改**（會被覆蓋）：`index.html`、`works.html`、`growth.html`、`en/*.html`、`assets/js/works.js`、`assets/js/works.en.js`。

作品欄位：`featured` 會出現在首頁；`hidden` 先不公開；`date`（YYYY-MM）決定在成長時間線的位置；`access` 是可實際使用（live）、線上示範（demo）或僅介紹（none）；連到 github.com 的連結會自動標示「附原始碼」。作品在 `works.json` 裡的順序就是作品集頁的順序。

## 在自己電腦上修改

```bash
pip install -r tools/requirements.txt   # 只需要 jinja2
python3 tools/build_site.py             # 改完 content/、templates/、CSS 或 JS 後執行
python3 -m http.server 8000             # 預覽：http://localhost:8000（後台：/admin/，可選「不登入，只看看」）
```

- 建置會列出沒填英文的欄位（warning），不會中斷。
- 所有頁面引用 `style.css`、`works.js`、`works.en.js`、`site.js` 時都帶 `?v=<內容雜湊>`，檔案一改，瀏覽器就會重新下載。
- 推到 `main` 後 GitHub Action 也會自動建置一次，忘了在本機建置也沒關係。

## 部署（GitHub Pages）

Settings → Pages → Build and deployment → Source 選「Deploy from a branch」，Branch 選 `main`、資料夾 `/ (root)`。
網址會是 `https://duicn187532.github.io/HachimanStudio/`。

改用自訂網域時，把 `404.html` 裡的 `<base href="/HachimanStudio/">` 改成 `<base href="/">`。

## 訪客統計（GoatCounter）

使用 [GoatCounter](https://www.goatcounter.com/)：免費、不使用 cookie，不需要隱私同意視窗。統計首頁、作品集、成長時間線與 404 頁；線上示範（`demos/`）不統計。

1. 到 goatcounter.com 註冊，設定一個代碼（例如 `hachiman`，後台網址就是 `https://hachiman.goatcounter.com`）。
2. 在後台「網站設定」填入代碼（或改 `content/site.json` 的 `settings.goatcounter`）。
3. 要在頁尾顯示「累計瀏覽 N 次」：GoatCounter 後台 → Settings → 勾選「Allow adding visitor counts on your website」。沒開啟時頁尾不會顯示數字，但統計照常進行。

留空代碼時完全不統計。本機預覽（localhost）不會被計入。

## 線上示範（demos/）

不能公開正式入口或原始碼的作品，提供「原本介面＋虛構資料」的離線示範版。示範版都不發出任何 API 請求，資料只存在瀏覽者自己的瀏覽器。

| 示範 | 來源 | 做法 |
| --- | --- | --- |
| `demos/meetbook/` | MeetBook 前端（`demos-src/meetbook`） | 複製原本的 React 前端；會議室名稱、照片、部門改為通用的虛構內容；`src/api/meetingApi.ts` 換成瀏覽器內的虛構預約資料，`backend.ts` 改為一律拒絕連線 |
| `demos/avalon/` | avalon（私人 repo） | 只放建置結果，不放原始碼。以原本的頁面與遊戲邏輯建置，`/api/*` 在瀏覽器內模擬，只能開單人測試房 |
| `demos/digitalmaster/` | DigitalMaster 前端（`demos-src/digitalmaster`） | 複製原本的前端；`src/api/api.ts` 回傳虛構的「示範達人」，問卷改為本機頁面 |
| `demos/voteright/` | VoteRight（Magenga/VoteRight，公開 repo） | 原本的 Flask 頁面改為靜態版；題庫取自原專案，候選人以 A／B／C 匿名，不載入廣告與 Facebook，作答不送出 |
| `demos/tongling/` | tongling-alpha 正式版前端（`demos-src/tongling`） | 前端程式碼未改動；`src/demo/` 重播在本機用正式版後端載入虛構範例專案後錄下的回應，不執行 AI、不儲存 |

重新建置某個示範（輸出會覆蓋 `demos/<名稱>/`）：

```bash
cd demos-src/meetbook && npm ci && npx vite build
# vite.config.ts 會拿掉字型的 .woff 備援檔，只留 woff2
```

### 關於 MeetBook（正式營運中）

MeetBook 是正式營運中的系統，本網站**不使用任何正式環境資源**：不放正式站網址、不嵌入、不呼叫正式 API，也沒有正式站截圖。示範版的封面截圖來自上面的離線示範，會議與預約者都是虛構的。

## 素材授權

- 八萬、歐雷角色、標誌與插圖：© 八萬爸 / HACHIMAN STUDIO 八萬工作室，未經同意請勿重製（來源：AutoML repo 的 `src/assets/brand/`）。
- Lato 字型：SIL Open Font License 1.1（`assets/fonts/OFL-Lato.txt`）。
