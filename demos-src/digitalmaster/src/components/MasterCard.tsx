"use client";

import React from "react";
import { LevelInfo, Master } from "../types/common"; // 請依實際路徑匯入

interface MasterCardProps {
  masterInfo: Master,
  totalScore: number;           // 累計星數
  progressValue: number;        // 進度百分比 (0 ~ 1)
  levelInfo: LevelInfo;
  handleViewDetails?: () => void;
}



const MasterCard: React.FC<MasterCardProps> = ({
  masterInfo,
  totalScore,
  progressValue,
  levelInfo,
  handleViewDetails
}) => {
  const nextGoal = levelInfo.threshold ? levelInfo.min + levelInfo.threshold : totalScore;

  return (
		<>
    <div className="bg-white rounded-3xl pb-4 px-4 ">
      {/* 頂部區域：等級標籤和徽章 */}
      <div className="flex justify-between">
        <div className="mt-5 flex flex-col block-inline">
          <div           
            style={{ backgroundColor: levelInfo.bgColor, color: levelInfo.fontColor }}
            className="px-4 py-1 rounded-full text-center text-sm font-bold">
            {levelInfo.level}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{masterInfo.name}</h2>
        </div>

        <div className="flex justify-end items-start mb-2">

          <img src={levelInfo.badge} alt="Level Badge" className="w-20 h-20" />
        </div>

      </div>

      {/* 底部區域：進度條和按鈕 */}
      <div className="flex items-start justify-between bg-[#FFF8DD] rounded-xl pt-1 px-3 mt-0.5">
        {/* 左側：進度資訊 & 條 */}
        <div className="flex-1 flex flex-col pr-3">
          {/* 文字 + 分數 */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-gray-700">
              {levelInfo.level !== "達人"
                ? `獲得${nextGoal}顆星星 晉升下一級`
                : "你是最高等級數位達人！"}
            </p>
            <div className="text-base font-bold">
              {totalScore}
              <span className="text-gray-400 text-xs">/{nextGoal}</span>
            </div>
          </div>

      {/* 進度條 track：allow overflow */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-visible mb-3">
        {/* filled bar */}
        <div
          className="relative h-full bg-gradient-to-r from-[#FFC107] to-[#E2AA27] rounded-full"
          style={{ width: `${progressValue * 100}%` }}
        >
          {/* 進度條上的星星圖標：center on the edge */}
          <div
            className="absolute right-0 top-1/2 transform -translate-y-1/2  bg-white rounded-full p-0.5"
          >
            <div
              style={{
                backgroundColor: progressValue == 1
                  ? "#E2AA27"       // e.g. "#FFC107", "#E2AA27", etc.
                  : "#D1D5DB"               // Tailwind’s gray-300 hex code
              }}
              className="w-5 h-5  rounded-full flex items-center justify-center"
            >
              <span className="text-[10px] text-white">★</span>
            </div>
          </div>
        </div>
      </div>
        </div>

        {/* 右側：自動適寬按鈕 */}
        <button
          className="flex-none inline-block my-4 px-4 py-1.5 text-sm text-white bg-[#E2AA27] rounded-full shadow-sm whitespace-nowrap"
          onClick={handleViewDetails}
        >
          瀏覽明細
        </button>
      </div>
    </div>
		</>
  );
};

export default MasterCard;
