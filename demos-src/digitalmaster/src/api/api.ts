// 作品集示範版（HACHIMAN STUDIO）：不連接任何後端，回傳虛構的達人資料。
// 任何帳號都能登入，看到的都是同一位虛構達人「示範達人」。
import { Master, CombinedResponse, StarData, ClassData } from "../types/common";

const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const MASTER: Master = { id: "demo", name: "示範達人", branchCode: "06" };

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

const STARS: StarData[] = [
  { masterId: "demo", score: 3, type: "1", date: daysAgo(2), remarks: "數位工具入門課出席" },
  { masterId: "demo", score: 2, type: "2", date: daysAgo(5), remarks: "課堂分享行動銀行小技巧" },
  { masterId: "demo", score: 5, type: "3", date: daysAgo(9), remarks: "協助客戶完成線上開戶" },
  { masterId: "demo", score: 3, type: "4", date: daysAgo(12), remarks: "課後測驗滿分" },
  { masterId: "demo", score: 2, type: "5", date: daysAgo(15), remarks: "填寫課程回饋問卷" },
  { masterId: "demo", score: 3, type: "1", date: daysAgo(20), remarks: "AI 應用工作坊出席" },
  { masterId: "demo", score: 4, type: "3", date: daysAgo(26), remarks: "推廣數位存款帳戶成功案例" },
  { masterId: "demo", score: 2, type: "2", date: daysAgo(33), remarks: "小組討論積極發言" },
  { masterId: "demo", score: 3, type: "6", date: daysAgo(40), remarks: "擔任新進同仁數位小幫手" },
];

function mdy(d: Date) {
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
}
function daysLater(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

const CLASSES: ClassData[] = [
  { _id: "c1", date: mdy(daysLater(3)), startTime: "14:00", endTime: "15:30", name: "生成式 AI 在職場的應用", type: "1" },
  { _id: "c2", date: mdy(daysLater(8)), startTime: "10:00", endTime: "11:00", name: "行動銀行新功能說明", type: "3" },
  { _id: "c3", date: mdy(daysLater(14)), startTime: "16:00", endTime: "16:30", name: "數位詐騙防制微課程", type: "2" },
  { _id: "c4", date: mdy(daysLater(21)), startTime: "13:30", endTime: "15:00", name: "資料視覺化入門", type: "1" },
];

export async function fetchMasters(): Promise<Master> {
  await wait();
  return MASTER;
}

export async function fetchStars() {
  await wait();
  return STARS;
}

export async function fetchClass() {
  await wait();
  return CLASSES;
}

export async function fetchCombinedData(account: string): Promise<CombinedResponse & { initInfo: { surveyUrl: string; surveyStartDay: string } }> {
  await wait();
  if (!account.trim()) throw new Error("請輸入帳號");
  return {
    master: MASTER,
    stars: STARS,
    classes: CLASSES,
    initInfo: { surveyUrl: "./survey.html", surveyStartDay: "示範問卷" },
  };
}
