import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LevelInfo, Master, StarData, ClassData, StarType, InitInfo } from '../types/common';
import Header from '@/components/Header';
import EventCard from '@/components/EventCard'
import MasterCard from '@/components/MasterCard';
import NavBar from '@/components/NavBar';
import classEvent from'@/assets/class.png';
import surveyEvent from '@/assets/survey.png'

interface LocationState {
  masterInfo: Master;
  stars: StarData[];
  classes: ClassData[];
  totalScore: number;
  levelInfo: LevelInfo;
  progressValue: number;
  initInfo: InitInfo;
}


const ProfilePage: React.FC = () => {
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

  const { masterInfo, stars, levelInfo, progressValue, totalScore, initInfo, classes } = data;

  const handleViewDetails = () => navigate('/details');
  const handleViewClassPreview = () => navigate('/class');
  const handleSurveyView = () => navigate('/survey');
  const handleLeftClick = () => navigate('/');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className='bg-white rounded-b-2xl shadow'>
        <div className="shrink-0 mt-3">
          <Header
            isIndex={true}
            onLeftClick={handleLeftClick}
          />
        </div>
        {/* Profile Content */}
        <div className="mx-4 ">
          <MasterCard
            masterInfo={masterInfo}
            totalScore={totalScore}
            progressValue={progressValue}
            levelInfo={levelInfo}
            handleViewDetails={handleViewDetails}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 mb-16 overflow-y-auto">
        <div className="my-3 pl-2">
          <div className="pl-2 font-bold text-xl">近期獲得</div>
          <div className="w-full flex overflow-x-auto snap-x scroll-smooth gap-1 hide-scrollbar">
            {stars && stars.length > 0 ? stars.slice(-10).map((star, index) => (
              <EventCard
                key={index}
                imageUrl={StarType[star.type].img}
                title={StarType[star.type].name}
                date={new Date(star.date).toLocaleDateString()}
                badgeIcon={<span>⭐</span>}
                onClick={handleViewDetails}
              />
            )) : <p>尚未獲得星星</p>}
          </div>
        </div>

        <div className="m-3">
          <div className="pl-2 font-bold text-xl">最新資訊</div>
          <div className="w-full flex flex-row justify-center gap-1">
            <EventCard
              imageUrl={classEvent}
              title="課程表"
              date={`${classes.length}堂課`}
              badgeIcon={<span>📘</span>}
              onClick={handleViewClassPreview}
            />
            <EventCard
              imageUrl={surveyEvent}
              title="問卷回饋"
              date={initInfo.surveyStartDay}
              badgeIcon={<span>✅</span>}
              onClick={handleSurveyView}
            />
          </div>
        </div>
      </div>
      {/* </div> */}
      <NavBar />
    </div>
  );
};

export default ProfilePage;