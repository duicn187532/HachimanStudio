export interface AddMasterform {
    id: string,
    name: string,
    branchCode: string,
}

export interface StarForm {
    masterId: string,
    score: number,
    type: string,
    date: Date,
    remarks: string,
}

export interface Master {
    id: string,
    name: string,
    branchCode: string
}

export interface BranchInfo {
    name: string;
    area: string;
    class: string;
  }

export interface StarData {
  masterId: string,
  score: number,
  type: string,
  date: Date,
  remarks: string,
  valid?: boolean;
}

import attendImg from "../assets/attend.png";
import interactImg from "../assets/interact.png";
import casesImg from "../assets/cases.png";
import testImg from "../assets/test.png";
import surveyImg from "../assets/survey.png";
import others from "../assets/others.png"
import attendIcon from "../assets/A.png"
import interactIcon from "../assets/I.png"
import casesIcon from "../assets/C.png"
import testIcon from "../assets/T.png"
import surveyIcon from "../assets/S.png"
import otherIcon from "../assets/O.png"

export const StarType: Record<string, Record<string, any>> = {
  "1": { name: "出席紀錄", img: attendImg, icon: attendIcon},
  "2": { name: "課程互動", img: interactImg, icon: interactIcon},
  "3": { name: "成功案例", img: casesImg, icon: casesIcon},
  "4": { name: "課後作業/測驗", img: testImg, icon: testIcon},
  "5": { name: "問卷回饋", img: surveyImg, icon: surveyIcon},
  "6" : {name: "其他", img: others, icon: otherIcon},
}
// 定義等級資訊
export interface LevelInfo {
  level: string;
  threshold: number; // 當前級距的範圍大小
  min: number; // 當前級距的起始分數
  bgColor: string;
  badge: string;
  fontColor: string;
}

export interface ClassData {
  _id: string;
  date: string;      // mm/dd/yyyy
  startTime: string; // hh:mm
  endTime: string;   // hh:mm
  name: string;      // 課程名稱
  type: string;      // 課程型態
  remarks?: string;
}

export interface CombinedResponse {
  master: Master | null;
  stars: StarData[];
  classes: ClassData[];
}


export const classType: Record<string, { name: string; img: string }> = {
  "1": { name: "線上", img: "" },
  "2": { name: "影片", img: "" },
  "3": { name: "實體", img: "" },
};

export const branchList: Record<string, BranchInfo> = {
    // 北一區 (area: '1')
    "03": { name: "儲蓄部", area: "1", class: "1" },
    "06": { name: "城中", area: "1", class: "1" },
    "22": { name: "內湖", area: "1", class: "1" },
    "23": { name: "中山", area: "1", class: "2" },
    "28": { name: "松山", area: "1", class: "2" },
    "36": { name: "士林", area: "1", class: "2" },
    "44": { name: "承德", area: "1", class: "1" },
    "47": { name: "三民", area: "1", class: "1" },
    "51": { name: "天母", area: "1", class: "2" },
    "57": { name: "西湖", area: "1", class: "1" },
    "62": { name: "南港", area: "1", class: "3" },
    "65": { name: "宜蘭", area: "1", class: "3" },
    "68": { name: "敦北", area: "1", class: "3" },
    "81": { name: "永吉", area: "1", class: "" },
  
    // 北二區 (area: '2')
    "09": { name: "東台北", area: "2", class: "1" },
    "18": { name: "信義", area: "2", class: "2" },
    "19": { name: "民生", area: "2", class: "1" },
    "20": { name: "忠孝", area: "2", class: "1" },
    "21": { name: "龍山", area: "2", class: "1" },
    "24": { name: "仁愛", area: "2", class: "1" },
    "31": { name: "松南", area: "2", class: "1" },
    "40": { name: "南東", area: "2", class: "2" },
    "43": { name: "世貿", area: "2", class: "1" },
    "45": { name: "汐止", area: "2", class: "1" },
    "53": { name: "基隆", area: "2", class: "2" },
    "55": { name: "內科", area: "2", class: "2" },
    "66": { name: "文山", area: "2", class: "3" },
    "71": { name: "松江", area: "2", class: "3" },
  
    // 新北區 (area: '3')
    "13": { name: "三重", area: "3", class: "1" },
    "14": { name: "板橋", area: "3", class: "2" },
    "15": { name: "永和", area: "3", class: "1" },
    "25": { name: "新莊", area: "3", class: "1" },
    "29": { name: "新店", area: "3", class: "2" },
    "32": { name: "蘆洲", area: "3", class: "1" },
    "33": { name: "中和", area: "3", class: "1" },
    "39": { name: "北三重", area: "3", class: "2" },
    "42": { name: "土城", area: "3", class: "2" },
    "48": { name: "華江", area: "3", class: "2" },
    "52": { name: "樹林", area: "3", class: "2" },
    "56": { name: "北中和", area: "3", class: "2" },
    "59": { name: "二重", area: "3", class: "2" },
    "75": { name: "丹鳳", area: "3", class: "3" },
    "76": { name: "北新莊", area: "3", class: "3" },
    "79": { name: "林口", area: "3", class: "" },
  
    // 桃竹區 (area: '4')
    "11": { name: "桃園", area: "4", class: "2" },
    "26": { name: "中壢", area: "4", class: "1" },
    "34": { name: "新竹", area: "4", class: "2" },
    "54": { name: "楊梅", area: "4", class: "1" },
    "60": { name: "延平", area: "4", class: "3" },
    "61": { name: "南崁", area: "4", class: "3" },
    "63": { name: "北新竹", area: "4", class: "3" },
    "70": { name: "竹北", area: "4", class: "3" },
    "73": { name: "觀音", area: "4", class: "3" },
    "74": { name: "北桃園", area: "4", class: "3" },
    "80": { name: "竹科", area: "4", class: "" },
    "84": { name: "苗栗", area: "4", class: "" },
  
    // 中區 (area: '5')
    "08": { name: "台中", area: "5", class: "2" },
    "16": { name: "員林", area: "5", class: "3" },
    "35": { name: "中港", area: "5", class: "2" },
    "41": { name: "大里", area: "5", class: "3" },
    "49": { name: "豐原", area: "5", class: "3" },
    "72": { name: "市政", area: "5", class: "3" },
    "77": { name: "南屯", area: "5", class: "3" },
  
    // 南區 (area: '6')
    "04": { name: "高雄", area: "6", class: "2" },
    "10": { name: "台南", area: "6", class: "2" },
    "12": { name: "北高雄", area: "6", class: "2" },
    "30": { name: "前金", area: "6", class: "2" },
    "37": { name: "東台南", area: "6", class: "2" },
    "38": { name: "永康", area: "6", class: "3" },
    "46": { name: "屏東", area: "6", class: "3" },
    "50": { name: "鳳山", area: "6", class: "3" },
    "69": { name: "東高雄", area: "6", class: "3" },
    "83": { name: "南科", area: "6", class: "3" },
  
    // 其他資料 (無區域定義)
    "02": { name: "營業部", area: "7", class: "" },
    "05": { name: "國外部", area: "7", class: "" },
    "27": { name: "OBU", area: "7", class: "" },
    "64": { name: "香港", area: "7", class: "" },
    "67": { name: "同奈", area: "7", class: "" },
  };

  export const branchArea: Record<string, string> = {
    "1": "北一區",
    "2": "北二區",
    "3": "新北區",
    "4": "桃竹區",
    "5": "中區",
    "6": "南區",
    "7": "其他",
  };

  export interface InitInfo {
    surveyUrl: string,
    surveyStartDay: string,
  }