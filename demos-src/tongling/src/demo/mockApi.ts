// 作品集示範版（HACHIMAN STUDIO）：在瀏覽器內重播 /api/* 回應。
//
// fixtures.json 是在本機用正式版後端載入「範例專案（虛構測試資料）」後，操作一輪錄下的 GET 回應。
// 示範版不連任何後端：查詢直接回傳錄好的資料；會改變資料的操作（新增、儲存、AI 工作）
// 回傳「示範版不會儲存」的提示，畫面維持原狀。
import fixtures from "./fixtures.json";

type Fixture = { status: number; body: unknown };
const table = fixtures as Record<string, Fixture>;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

let toastTimer = 0;
function toast(text: string) {
  let el = document.getElementById("demo-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "demo-toast";
    el.setAttribute("role", "status");
    el.style.cssText =
      "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483647;background:#3B312A;color:#fff;" +
      "font:600 14px/1.5 system-ui,'PingFang TC','Noto Sans TC',sans-serif;padding:10px 18px;border-radius:12px;" +
      "box-shadow:0 10px 30px rgba(0,0,0,.25);max-width:calc(100% - 32px);text-align:center;transition:opacity .2s";
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.style.opacity = "1";
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el && (el.style.opacity = "0"), 3200);
}

// 依路徑找錄好的回應：先找完全相同（含查詢字串），再找去掉查詢字串的版本
function lookup(method: string, path: string, search: string): Fixture | undefined {
  return table[`${method} ${path}${search}`] ?? table[`${method} ${path}`];
}

// 沒錄到的查詢：清單類回空陣列，其他回空物件，讓畫面顯示「目前沒有資料」
function emptyFor(path: string): unknown {
  const last = path.split("/").filter(Boolean).pop() ?? "";
  return /s$|jobs|activities|history|revisions|trash|sessions/.test(last) ? [] : {};
}

// 專案的 Agent／手動模式：示範版在記憶體中切換，讓兩種介面都看得到
const modeOverride: Record<string, string> = {};
function withMode(path: string, body: unknown): unknown {
  const m = /^\/projects\/([^/]+)$/.exec(path);
  if (!m || !modeOverride[m[1]] || !body || typeof body !== "object") return body;
  return { ...(body as Record<string, unknown>), mode: modeOverride[m[1]] };
}

async function handle(url: URL, init?: RequestInit): Promise<Response> {
  const method = (init?.method || "GET").toUpperCase();
  const path = url.pathname.replace(/^\/api/, "");
  await new Promise((r) => setTimeout(r, 120));

  if (method === "GET") {
    const hit = lookup("GET", path, url.search);
    if (hit) return json(withMode(path, hit.body), hit.status);
    if (/^\/jobs\/[^/]+$/.test(path)) {
      return json({ job_id: path.split("/").pop(), status: "CANCELLED", error: "示範版不執行 AI 工作", progress: 0 });
    }
    return json(emptyFor(path));
  }

  // 切換 Agent／手動流程只影響畫面，可以照錄好的回應切換
  const modeMatch = /^\/projects\/([^/]+)\/workflow\/mode$/.exec(path);
  if (modeMatch) {
    let mode = "AGENT";
    try {
      mode = JSON.parse(String(init?.body ?? "{}")).mode === "MANUAL" ? "MANUAL" : "AGENT";
    } catch {
      /* 預設 Agent */
    }
    modeOverride[modeMatch[1]] = mode;
    const project = lookup("GET", `/projects/${modeMatch[1]}`, "");
    return json(withMode(`/projects/${modeMatch[1]}`, project?.body ?? {}));
  }

  if (path === "/jobs") {
    toast("示範版不執行 AI 工作；畫面上的分析與 PRD 是預先產生的範例結果。");
    return json({ detail: "示範版不執行 AI 工作，畫面上的結果是預先產生的範例。" }, 400);
  }
  toast("示範版不會儲存變更：這是正式版介面搭配虛構範例資料的離線展示。");
  return json({ detail: "示範版不會儲存變更。" }, 400);
}

const realFetch = window.fetch.bind(window);
window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const raw = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  const url = new URL(raw, window.location.href);
  if (url.origin === window.location.origin && url.pathname.startsWith("/api/")) return handle(url, init);
  return realFetch(input, init);
};
