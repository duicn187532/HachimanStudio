// 作品集示範版進入點：先裝上模擬後端，再顯示原本的頁面（app/page.tsx）
import './mockServer';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/globals.css';
import Page from './app/page';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
