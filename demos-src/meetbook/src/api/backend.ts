// 作品集示範版：不連任何後端。保留原本的匯出名稱，呼叫時直接報錯，確保不會意外發出請求。
export const apiBase = () => "";
export const backendUrl = (path: string) => new URL(path, "about:blank");
export async function backendFetch(): Promise<Response> {
  throw new Error("示範版不連接後端");
}
