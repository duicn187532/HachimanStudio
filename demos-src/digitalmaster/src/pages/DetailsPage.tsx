"use client";

import React from "react";
import { useNavigate, } from "react-router-dom";
import { ChevronDown, ChevronUp } from "react-feather";
import staricon from "../assets/staricon.png";
import { Master, StarData, LevelInfo, StarType, ClassData } from "../types/common";
import MasterCard from "../components/MasterCard";
import Header from "../components/Header";
import NavBar from "../components/NavBar";

interface LocationState {
  masterInfo: Master;
  stars: StarData[];
  totalScore: number;
  levelInfo: LevelInfo;
  progressValue: number;
  classes: ClassData[];
}

const DetailsPage: React.FC = () => {
  const navigate = useNavigate();

  const storedState = localStorage.getItem('navigationState');

  if (!storedState) {
    navigate('/');
    return null;
  }

  const data = JSON.parse(storedState) as LocationState;

  if (!data.masterInfo || !data.masterInfo.id) {
    navigate('/');
    return null;
  }

  const { masterInfo, stars, levelInfo, progressValue, totalScore } = data;

  // 用来控制每笔星星记录是否展开
  const [expandedStars, setExpandedStars] = React.useState<number[]>([]);
  
  // Using the index as identifier since Stars don't have reliable unique IDs
  const toggleStar = (index: number) => {
    setExpandedStars((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
    );
  };

  const handleBack = () => {
    navigate('/profile');
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className='bg-white rounded-b-2xl shadow'>
        <div className="shrink-0 mt-3">
          <Header
            isIndex={false}
            onLeftClick={handleBack}
          />
        </div>
        {/* Profile Content */}
        <div className="mx-4">
          <MasterCard
            masterInfo={masterInfo}
            totalScore={totalScore}
            progressValue={progressValue}
            levelInfo={levelInfo}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mx-6 text-start pt-4">星星明细</h2>


      {/* 星星明细列表 */}
      <div className="bg-white rounded-2xl flex flex-col flex-1 shadow-md mx-6 mt-4 mb-20 overflow-hidden">                
        {stars.length === 0 ? (
          <p className="text-center text-gray-500 flex-1 flex items-center justify-center">
            目前没有星星明细資料
          </p>
        ) : (
          <div className="flex-1 min-h-0 px-4 pb-2 overflow-y-auto pt-2">
            {stars.map((star, index) => {
              const isExpanded = expandedStars.includes(index);
              
              return (
                <div className="border-b last:border-b-0 py-3" key={index} onClick={() => toggleStar(index)}
                >
                  <div className="flex items-center">
                    <img 
                      src={StarType[star.type].icon} 
                      alt="Badge" 
                      className="w-8 h-8 mx-3 mb-1 " 
                    />
                    
                    <div className="flex-1">
                      <div className="text-base font-medium">{StarType[star.type].name}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(star.date).toLocaleDateString("zh-TW", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          timeZone: "Asia/Taipei",
                        }).replace(/\//g, '.')}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <img src={staricon} className="h-4 w-4" alt="Star" />
                      <div className="text-lg font-bold mx-1">{star.score}</div>
                      <button
                        className="p-1"
                      >
                        {isExpanded ? (
                          <ChevronUp size={18} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-2 ml-16 border-t pt-2">
                      <p className="text-base">
                        <strong>備註:</strong> {star.remarks || "-"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="shrink-0">
        <NavBar />
      </div>
    </div>
  );
};

export default DetailsPage;