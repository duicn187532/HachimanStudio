# HACHIMAN STUDIO 八萬工作室 · 品牌形象網站

八萬工作室的品牌形象網站：首頁（關於、吉祥物、服務、精選作品、合作流程、歷程、聯絡與 FAQ）、作品集頁（可依類別篩選、點開看詳細內容），以及 404 頁。

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
| 新增／修改作品 | `assets/js/works.js`（每件作品一筆資料；`featured: true` 會出現在首頁） |
| 公開 Email | `assets/js/site.js` 最上方的 `SITE.email`（留空時只顯示 GitHub） |
| 文案 | `index.html`、`works.html` |
| 顏色、字體 | `assets/css/style.css` 最上方的 `:root` |
| 作品封面 | `python3 tools/gen_covers.py` 重新產生 `assets/img/works/*.svg`，或直接換成真實截圖 |

## 關於 MeetBook（正式營運中）

MeetBook 是正式營運中的系統，本網站**不使用任何正式環境資源**：

- 不放正式站網址、不嵌入（iframe）、不呼叫正式 API，也沒有正式站截圖。
- 作品卡片只連到原始碼 repo，封面是 `tools/gen_covers.py` 手繪的示意圖，會議室名稱與預約內容都是虛構的。

其他作品的封面也都是示意圖，畫面中的人名、資料與數字均為虛構。

## 素材授權

- 八萬、歐雷角色、標誌與插圖：© HACHIMAN STUDIO / 八萬工作室，未經同意請勿重製（來源：AutoML repo 的 `src/assets/brand/`）。
- Lato 字型：SIL Open Font License 1.1（`assets/fonts/OFL-Lato.txt`）。
