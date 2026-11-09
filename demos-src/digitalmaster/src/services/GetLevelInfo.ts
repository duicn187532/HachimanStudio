import highestBadge from "../assets/level-highest.png"
import internBadge from "../assets/level-intern.png"
import advancedBadge from "../assets/level-advanced.png"
import highBadge from "../assets/level-high.png"
import proBadge from "../assets/level-pro.png"
import masterBadge from "../assets/level-master.png"
import { LevelInfo } from "../types/common";

// 根據累計星數返回對應的等級與顏色
const getLevelInfo = (score: number): LevelInfo => {
    if (score < 15) {
        return { level: "初階", threshold: 15, min: 0, bgColor: "#F0F1F1", fontColor: "#6B6A7B", badge: internBadge };
      } else if (score < 30) {
        return { level: "進階", threshold: 15, min: 15, bgColor: "#F3EBE3", fontColor: "#87704F", badge: advancedBadge };
      } else if (score < 45) {
        return { level: "專業", threshold: 15, min: 30, bgColor: "#C7FFDE", fontColor: "#41A971", badge: proBadge };
      } else if (score < 60) {
        return { level: "高級", threshold: 15, min: 45, bgColor: "#CDE6FF", fontColor: "#3F85F6", badge: highBadge };
      } else if (score < 75) {
        return { level: "大師", threshold: 15, min: 60, bgColor: "#E6E7FF", fontColor: "#9699B5", badge: masterBadge };
      } else if (score < 9999) {
        return { level: "達人", threshold: 0, min: 60, bgColor: "#FCF3DE", fontColor: "#E3A302", badge: highestBadge };
    } else {
    return { level: "\b\b\b\b\b\b",threshold: 0, min: 99999, bgColor: "#DADADA", fontColor: "#202224", badge: internBadge};
  }
};

export default getLevelInfo;
