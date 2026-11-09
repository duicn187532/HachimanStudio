# 彤靈談心 Alpha · 示範版（作品集用）

前端複製自 [tongling-alpha](https://github.com/duicn187532/tongling-alpha)（Apache-2.0，見 `LICENSE`）的 `frontend/`，程式碼未改動，只在 `src/main.tsx` 最前面載入 `src/demo/mockApi.ts`：

- `src/demo/fixtures.json`：在本機用正式版後端載入「範例專案（虛構測試資料）」後，操作一輪錄下的 GET 回應。
- `src/demo/mockApi.ts`：攔截 `/api/*`，查詢回傳錄好的資料；儲存、AI 工作等操作只顯示「示範版不會儲存」。

```bash
npm install && npx vite build   # 輸出到 ../../demos/tongling/
```
