// 作品集示範版（HACHIMAN STUDIO）：在瀏覽器內模擬 /api/* 後端。
//
// 原本的後端是 Cloudflare Worker + D1；這裡改以相同的遊戲邏輯（lib/game.mjs、lib/recap.mjs）
// 在記憶體中執行，房間只存在這個瀏覽器（localStorage），不會發出任何網路請求。
// 示範版只能開「單人測試房」（你＋機器人），沒有登入、排行榜與語音。
import { newPlayer, newRoom, move, view, makeSolo, alignment } from './lib/game.mjs';
import { buildRecap } from './lib/recap.mjs';
import { customAvatar } from './lib/profile.mjs';

type Row = { state: string; version: number };
const KEY = 'avalon-demo.rooms.v1';

function loadRooms(): Record<string, Row> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}
const rooms = loadRooms();
function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(rooms));
  } catch {
    /* 無法保存時只影響重新整理 */
  }
}

const reply = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

/* eslint-disable @typescript-eslint/no-explicit-any */
const seats = (s: any) =>
  s.solo
    ? {
        seats: s.players.map((p: any) => ({
          id: p.id,
          name: p.name,
          token: p.token,
          bot: !!p.bot,
          ...(s.phase !== 'lobby' && p.role ? { role: p.role, alignment: alignment(p) } : {}),
        })),
      }
    : {};
const snapshot = (s: any, id: string, revision: number) => ({
  ...view(s, id),
  revision,
  ...seats(s),
  ...(s.phase === 'ended' ? { recap: buildRecap(s) } : {}),
});
const codeOf = (v: unknown) => (typeof v === 'string' ? v.trim().toUpperCase() : '');

function read(code: string) {
  if (!/^[0-9]{4}$/.test(code)) throw Error('請輸入四碼數字房號');
  const row = rooms[code];
  if (!row) throw Object.assign(Error('找不到房間（示範版的房間只存在這個瀏覽器）'), { status: 404 });
  return { s: JSON.parse(row.state), version: row.version };
}

function gameGet(url: URL, auth: string | null) {
  const code = codeOf(url.searchParams.get('code'));
  const raw = url.searchParams.get('since');
  const since = raw && /^[0-9]{1,15}$/.test(raw) ? Number(raw) : NaN;
  if (Number.isSafeInteger(since) && rooms[code]?.version === since) return reply({ unchanged: true, revision: since });
  const { s, version } = read(code);
  const token = auth?.replace(/^Bearer /, '');
  const p = s.players.find((p: any) => p.token === token);
  if (!p) return reply({ error: '此裝置沒有有效的玩家身分，請重新加入' }, 401);
  return reply(snapshot(s, p.id, version));
}

function gamePost(body: string, auth: string | null) {
  const a = JSON.parse(body);
  if (a.type === 'create') {
    if (a.solo !== true) throw Error('示範版只能開「單人測試」房：你一個人操作所有座位，其他座位由機器人代打。');
    const p: any = newPlayer(a.name);
    p.avatar = customAvatar(a.avatar ?? null);
    let code = '';
    do code = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    while (rooms[code]);
    const s = newRoom(code, p);
    makeSolo(s, a.bots);
    rooms[code] = { state: JSON.stringify(s), version: 0 };
    persist();
    return reply({ token: p.token, room: snapshot(s, p.id, 0) });
  }
  const code = codeOf(a.code);
  const token = auth?.replace(/^Bearer /, '');
  const { s, version } = read(code);
  const p = s.players.find((p: any) => p.token === token);
  if (a.type === 'join') {
    if (p) return reply({ token: p.token, room: snapshot(s, p.id, version) });
    throw Error('示範版沒有連線功能，請改用「單人測試」');
  }
  if (!p) return reply({ error: '玩家憑證失效，請重新加入' }, 401);
  if (a.type === 'appearance') p.avatar = customAvatar(a.avatar ?? null);
  else move(s, p.id, a);
  rooms[code] = { state: JSON.stringify(s), version: version + 1 };
  persist();
  if (a.type === 'leave') return reply({ left: true });
  return reply({ room: snapshot(s, p.id, version + 1) });
}

async function handle(url: URL, init: RequestInit | undefined): Promise<Response> {
  const method = (init?.method || 'GET').toUpperCase();
  const headers = new Headers(init?.headers);
  const auth = headers.get('Authorization');
  await new Promise((r) => setTimeout(r, 120));
  try {
    switch (url.pathname) {
      case '/api/game':
        return method === 'GET' ? gameGet(url, auth) : gamePost(String(init?.body ?? ''), auth);
      case '/api/me':
        return method === 'GET' ? reply({ user: null, providers: [] }) : reply({ error: '示範版沒有登入功能' }, 401);
      case '/api/voice':
        return reply({ error: '示範版未開啟語音通話與逐字稿' }, 503);
      case '/api/stats':
        return reply({ error: '示範版沒有排行榜' }, 404);
      case '/api/auth/logout':
        return reply({ ok: true });
      default:
        return reply({ error: '示範版不支援此功能' }, 404);
    }
  } catch (e: any) {
    return reply({ error: e?.message || '操作失敗，請重試' }, e?.status || 400);
  }
}

// 攔截所有對本站 /api/ 的請求；其他網址照常（示範版本身不會發出其他請求）
const realFetch = window.fetch.bind(window);
window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const url = new URL(raw, window.location.href);
  if (url.origin === window.location.origin && url.pathname.startsWith('/api/')) return handle(url, init);
  return realFetch(input, init);
};
