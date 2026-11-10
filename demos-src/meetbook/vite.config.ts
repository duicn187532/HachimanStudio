import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'

// 所有支援的瀏覽器都讀 woff2，拿掉 @fontsource 附帶的 .woff 備援檔，示範版少約 18 MB
const woff2Only = (): Plugin => ({
  name: 'woff2-only',
  enforce: 'post',
  generateBundle(_, bundle) {
    for (const [name, file] of Object.entries(bundle)) {
      if (name.endsWith('.woff')) delete bundle[name]
      else if (file.type === 'asset' && name.endsWith('.css')) {
        file.source = String(file.source).replace(/,\s*url\([^)]*\.woff\)\s*format\(["']woff["']\)/g, '')
      }
    }
  },
})

// 作品集示範版：輸出到網站的 demos/meetbook/，以相對路徑載入資源；不產生 version.json、不檢查新版
export default defineConfig({
  plugins: [react(), woff2Only()],
  base: './',
  build: { outDir: '../../demos/meetbook', emptyOutDir: true },
  define: { __APP_VERSION__: JSON.stringify('dev-portfolio-demo') },
})
