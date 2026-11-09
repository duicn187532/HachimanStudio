import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// 作品集示範版：輸出到網站的 demos/meetbook/，以相對路徑載入資源；不產生 version.json、不檢查新版
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: '../../demos/meetbook', emptyOutDir: true },
  define: { __APP_VERSION__: JSON.stringify('dev-portfolio-demo') },
})
