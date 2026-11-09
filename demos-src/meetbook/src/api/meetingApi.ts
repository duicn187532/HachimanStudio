// api/meetingApi.ts — 作品集示範版（HACHIMAN STUDIO）
//
// ⚠ 這是 MeetBook 前端的「離線示範版」：所有預約都是虛構資料，只存在瀏覽者自己的瀏覽器（sessionStorage）。
//   這個檔案取代原本呼叫後端的 API，完全不發出任何網路請求，不會連到正式環境。
//   介面與元件沿用原本的程式碼，回應格式（狀態碼、衝突清單）比照正式後端，讓畫面行為一致。
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  ApiBooking,
  BookingApiResponse,
  BookingPayload,
  BookingResponseBody,
  BookingUpdatePayload,
  DateRange,
  Meeting,
} from "../types/common";
import type { Notices } from "../config/notices";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Taipei");

interface StoredBooking extends ApiBooking {
  editPassword: string;
  cancelled: boolean;
}

const STORE_KEY = "meetbook-demo.bookings.v1";
const ROOMS = ["A101", "A102", "A103"];

// 示範用的使用者（行編 → 姓名）；畫面上會提示可使用這些行編
const DEMO_USERS: Record<string, { name: string; extension: string; department: string; group: string }> = {
  "0001": { name: "王小明", extension: "1001", department: "產品部", group: "產品設計" },
  "0002": { name: "林小美", extension: "1002", department: "工程部", group: "前端開發" },
  "0003": { name: "陳大文", extension: "1003", department: "行銷部", group: "品牌推廣" },
  "1234": { name: "示範帳號", extension: "1234", department: "營運部", group: "資料分析" },
};

const SAMPLE_TITLES = ["週會", "需求訪談", "設計審查", "1:1", "專案啟動", "讀書會", "站會", "季度回顧", "廠商簡報", "面試"];

function userInfo(id: string) {
  const u = DEMO_USERS[id];
  return { name: u.name, extension: u.extension, department: { label: u.department }, group: { label: u.group } };
}

// 依日期產生固定的虛構預約（同一天每次都一樣）
function seed(): StoredBooking[] {
  const list: StoredBooking[] = [];
  const base = dayjs().tz("Asia/Taipei").startOf("day");
  const ids = Object.keys(DEMO_USERS);
  let n = 0;
  for (let d = -14; d <= 28; d++) {
    const day = base.add(d, "day");
    const dow = day.day();
    if (dow === 0 || dow === 6) continue;
    ROOMS.forEach((room, ri) => {
      const slots = [
        [9, 0, 10, 0],
        [10, 30, 12, 0],
        [13, 30, 14, 30],
        [15, 0, 16, 30],
        [16, 45, 17, 30],
      ];
      slots.forEach((s, si) => {
        // 用日期與房間決定這個時段有沒有預約，看起來自然又穩定
        const k = (day.date() * 7 + ri * 3 + si * 5) % 10;
        if (k > 4) return;
        const start = day.hour(s[0]).minute(s[1]);
        const end = day.hour(s[2]).minute(s[3]);
        const uid = ids[(k + si + ri) % ids.length];
        list.push({
          id: `demo-${++n}`,
          title: SAMPLE_TITLES[(k * 3 + si + ri) % SAMPLE_TITLES.length],
          user: userInfo(uid),
          room,
          participantsNum: 2 + ((k + si) % 8),
          startTime: start.utc().toISOString(),
          endTime: end.utc().toISOString(),
          date: start.format("YYYY-MM-DD"),
          updatedCount: 0,
          isMulti: [],
          editPassword: "demo",
          cancelled: false,
        });
      });
    });
  }
  return list;
}

function load(): StoredBooking[] {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* 無法讀取時使用新的示範資料 */
  }
  const fresh = seed();
  save(fresh);
  return fresh;
}

function save(list: StoredBooking[]) {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(list));
  } catch {
    /* 私密瀏覽等情況無法保存，僅影響重新整理後的資料 */
  }
}

let db: StoredBooking[] | null = null;
const store = () => (db ??= load());
const commit = () => save(store());

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function overlaps(room: string, start: number, end: number, ignoreId?: string) {
  return store().filter(
    (b) =>
      !b.cancelled &&
      b.room === room &&
      b.id !== ignoreId &&
      Date.parse(b.startTime) < end &&
      Date.parse(b.endTime) > start,
  );
}

function ruleError(start: number, end: number): string | null {
  if (!(end > start)) return "結束時間必須晚於開始時間";
  const s = dayjs(start).tz("Asia/Taipei");
  const e = dayjs(end).tz("Asia/Taipei");
  if (s.day() === 0 || s.day() === 6) return "只能預約週一到週五";
  const sm = s.hour() * 60 + s.minute();
  const em = e.hour() * 60 + e.minute();
  if (sm < 8 * 60 + 45 || em > 18 * 60 + 15 || !s.isSame(e, "day")) return "只能預約 08:45–18:15 之間的時段";
  return null;
}

const toPublic = (b: StoredBooking): ApiBooking => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { editPassword, cancelled, ...rest } = b;
  return rest;
};

export async function fetchEventsApi(range: DateRange): Promise<Meeting[]> {
  await wait(200);
  const from = Date.parse(range.from);
  const to = Date.parse(range.to);
  return store()
    .filter((b) => !b.cancelled && Date.parse(b.endTime) > from && Date.parse(b.startTime) < to)
    .map((event) => {
      const start = dayjs.utc(event.startTime).tz("Asia/Taipei");
      const end = dayjs.utc(event.endTime).tz("Asia/Taipei");
      return {
        ...toPublic(event),
        title: event.title || `${start.format("HH:mm")} ~ ${end.format("HH:mm")}`,
        date: start.format("YYYY-MM-DD"),
        TaipeiStartTime: start.format("HH:mm"),
        TaipeiEndTime: end.format("HH:mm"),
      };
    });
}

// 示範版的公告：第一次開啟時說明這是虛構資料
export async function fetchNoticesApi(): Promise<Notices> {
  const today = dayjs().tz("Asia/Taipei").format("YYYY-MM-DD");
  return {
    changelog: [],
    announcements: [
      {
        id: "portfolio-demo",
        title: "歡迎體驗 MeetBook 示範版",
        body:
          "這是 HACHIMAN STUDIO 作品集的離線示範版，畫面與正式版相同，但所有預約都是虛構資料，只存在你的瀏覽器，關閉分頁後就會重置。\n\n" +
          "預約時可使用示範員工編號：0001、0002、0003 或 1234。\n示範資料的編輯密碼都是 demo。",
        startDate: today,
        endDate: today,
      },
    ],
  };
}

// ---- 加入行事曆：示範版在瀏覽器內直接產生，不經過後端 ----
function findBooking(id: string) {
  return store().find((b) => b.id === id);
}

function icsText(b: StoredBooking): string {
  const fmt = (iso: string) => dayjs.utc(iso).format("YYYYMMDD[T]HHmmss[Z]");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HACHIMAN STUDIO//MeetBook Demo//ZH-TW",
    "BEGIN:VEVENT",
    `UID:${b.id}@meetbook-demo`,
    `DTSTAMP:${fmt(new Date().toISOString())}`,
    `DTSTART:${fmt(b.startTime)}`,
    `DTEND:${fmt(b.endTime)}`,
    `SUMMARY:${b.title}（示範）`,
    `LOCATION:${b.room}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function googleUrl(b: StoredBooking): string {
  const fmt = (iso: string) => dayjs.utc(iso).format("YYYYMMDD[T]HHmmss[Z]");
  const u = new URL("https://calendar.google.com/calendar/render");
  u.searchParams.set("action", "TEMPLATE");
  u.searchParams.set("text", `${b.title}（示範）`);
  u.searchParams.set("dates", `${fmt(b.startTime)}/${fmt(b.endTime)}`);
  u.searchParams.set("location", b.room);
  return u.toString();
}

export const calendarFileUrl = (bookingId: string) => {
  const b = findBooking(bookingId);
  return b ? URL.createObjectURL(new Blob([icsText(b)], { type: "text/calendar" })) : "#";
};

export const calendarGoogleUrl = (bookingId: string) => {
  const b = findBooking(bookingId);
  return b ? googleUrl(b) : "#";
};

export async function fetchGoogleCalendarUrl(bookingId: string): Promise<string> {
  const b = findBooking(bookingId);
  if (!b) throw new Error("找不到預約");
  return googleUrl(b);
}

export async function fetchCalendarFile(bookingId: string): Promise<File> {
  const b = findBooking(bookingId);
  if (!b) throw new Error("找不到預約");
  const t = dayjs.utc(b.startTime).tz("Asia/Taipei");
  return new File([icsText(b)], `meeting-${t.format("YYYYMMDD-HHmm")}.ics`, { type: "text/calendar" });
}

// ---- 新增／修改／刪除 ----
export async function submitBookingApi(bookingData: BookingPayload): Promise<BookingApiResponse> {
  await wait();
  const uid = bookingData.user.trim().replace(/\D/g, "").slice(0, 4);
  if (!DEMO_USERS[uid]) {
    return { ok: false, status: 404, body: { error: "找不到這個員工編號（示範版可用 0001、0002、0003、1234）" } };
  }
  const start = Date.parse(bookingData.startTime);
  const end = Date.parse(bookingData.endTime);
  const err = ruleError(start, end);
  if (err) return { ok: false, status: 400, body: { error: err } };
  if (start < Date.now()) return { ok: false, status: 400, body: { error: "不能預約已經過去的時段" } };

  const conflicts = bookingData.room
    .map((room) => ({ room, conflicts: overlaps(room, start, end).map(toPublic) }))
    .filter((c) => c.conflicts.length > 0);
  if (conflicts.length > 0) {
    return { ok: false, status: 400, body: { error: "時段重複", conflicts } };
  }

  const ids: string[] = [];
  for (const room of bookingData.room) {
    const id = `demo-${Date.now().toString(36)}-${room}`;
    ids.push(id);
    store().push({
      id,
      title: bookingData.title,
      user: userInfo(uid),
      room,
      participantsNum: bookingData.participantsNum,
      startTime: new Date(start).toISOString(),
      endTime: new Date(end).toISOString(),
      date: bookingData.date,
      updatedCount: 0,
      isMulti: bookingData.room.length > 1 ? bookingData.room : [],
      editPassword: bookingData.editPassword ?? "",
      cancelled: false,
    });
  }
  commit();
  const body: BookingResponseBody = { success: true, message: "預約成功", bookedRooms: bookingData.room, ids };
  return { ok: true, status: 201, body };
}

function checkAccess(meetingId: string, editPassword: string): StoredBooking | Response {
  const b = store().find((x) => x.id === meetingId && !x.cancelled);
  if (!b) return json(404, { error: "找不到這筆預約" });
  if (b.editPassword && b.editPassword !== editPassword) return json(403, { error: "編輯密碼錯誤" });
  return b;
}

export async function cancelMeetingApi(meetingId: string, editPassword: string): Promise<Response> {
  await wait();
  const b = checkAccess(meetingId, editPassword);
  if (b instanceof Response) return b;
  b.cancelled = true;
  commit();
  return json(200, { success: true });
}

export async function editMeetingApi(
  meetingId: string,
  editPassword: string,
  editData: BookingUpdatePayload,
): Promise<Response> {
  await wait();
  const b = checkAccess(meetingId, editPassword);
  if (b instanceof Response) return b;
  const start = Date.parse(editData.startTime);
  const end = Date.parse(editData.endTime);
  const err = ruleError(start, end);
  if (err) return json(400, { error: err });
  const conflicts = overlaps(editData.room, start, end, b.id).map(toPublic);
  if (conflicts.length > 0) return json(400, { error: "時段重複", conflicts: [{ room: editData.room, conflicts }] });
  Object.assign(b, {
    title: editData.title,
    participantsNum: editData.participantsNum,
    room: editData.room,
    date: editData.date,
    startTime: new Date(start).toISOString(),
    endTime: new Date(end).toISOString(),
    updatedCount: b.updatedCount + 1,
  });
  commit();
  return json(200, { success: true });
}

// 讀取修改／刪除回應的內容；格式不正確時回傳空物件
export async function readResponseBody(res: Response): Promise<BookingResponseBody> {
  try {
    const body = await res.json();
    return body && typeof body === "object" ? body : {};
  } catch {
    return {};
  }
}
