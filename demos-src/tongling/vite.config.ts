import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 作品集示範版：輸出到網站的 demos/tongling/，資源以相對路徑載入；/api 由 src/demo/mockApi.ts 在瀏覽器內回應
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { outDir: "../../demos/tongling", emptyOutDir: true },
});
