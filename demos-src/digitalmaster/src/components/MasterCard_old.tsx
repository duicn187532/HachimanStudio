"use client";

import React from "react";
import ProgressCircle from "./ProgressCircle"; // 請依實際路徑匯入
import { LevelInfo, Master, branchArea, branchList } from "../types/common"; // 請依實際路徑匯入

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
    <div className="bg-white rounded-2xl pb-2 px-2 flex items-center">
      {/* 左側徽章 */}
      <div className="relative ml-2 mr-4">
        <img
          src={levelInfo.badge || "/placeholder.svg"}
          alt="User Badge"
          className="w-20 h-20"
        />
      </div>
      
      {/* 中間文字區域 */}
      <div className="flex-1 ">
        <div
          style={{ backgroundColor: levelInfo.bgColor, color: levelInfo.fontColor }}
          // className="text-cneter inline-block mb-1 px-4 py-1 rounded-xl text-sm font-semibold"
          className="text-cneter inline-block flex justify-center mx-8 mb-1 px-4 py-1 rounded-xl text-sm font-semibold"
          >
          {levelInfo.level}
        </div>
        {/* <div className="flex mb-1"> */}
          {/* <h2 className="text-xl flex justify-center font-bold m-0 ">{masterInfo.name || "未知"}</h2> */}
          <h2 className="text-xl flex justify-center font-bold mt-2 ">{masterInfo.name || "未知"}</h2>
          {/* <p className="text-sm flex-1 text-gray-600 pl-1 pt-1">{masterInfo.id}</p> */}
        {/* </div> */}
        {/* <div className="flex">
          <p className="text-sm text-gray-600">
            {branchArea[branchList[masterInfo.branchCode]?.area] || "未知區域"}
          </p>
          <p className="text-sm text-gray-600 pl-3">
            {branchList[masterInfo.branchCode]?.name || "未知分行"}分行
          </p> 
        </div> */}
      </div>

      

      {/* 右側星數圓圈 + 等級 */}
      <div className="mr-4 flex flex-col items-center">
        <div className="relative w-14 h-14 mb-2 flex justify-center items-center">
        {totalScore !== 0 && (
            <ProgressCircle progress={progressValue+1} size={80} strokeWidth={5} />
          )}
          <div className="absolute flex items-baseline">
            <span className="text-lg font-bold">{totalScore}</span>
            {levelInfo.threshold > 0 && (
              <span className="text-[8px] text-gray-500">/{nextGoal}</span>
            )}
					</div>
        </div>
        <button 
          className="bg-[#E2AA27] px-4 py-1 text-sm text-white rounded-xl cursor-pointer inline-block shadow-xl"
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
