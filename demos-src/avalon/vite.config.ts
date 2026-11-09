import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// 作品集示範版：輸出到網站的 demos/avalon/，以相對路徑載入資源
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: { outDir: '../../demos/avalon', emptyOutDir: true },
});
