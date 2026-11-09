import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { InitInfo } from '@/types/common';

interface LocationState {
    initInfo: InitInfo;
  }

const SurveyPage: React.FC = () => {
  
  const navigate = useNavigate();
  const storedState = localStorage.getItem('navigationState');

  if (!storedState) {
    navigate('/');
    return null;
  }

  const data = JSON.parse(storedState) as LocationState;

  const {initInfo} = data as LocationState


  const handleBack = () => navigate('/profile');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
    <div className='bg-white rounded-b-2xl shadow'>
      <div className="shrink-0 mt-3">
        <Header
          isIndex={false}
          onLeftClick={handleBack}
        />
      </div>
    </div>
    <div className='h-screen'>
      <iframe 
        className="h-[calc(100vh-160px)] w-full" 
        src={initInfo.surveyUrl}
      >載入中…</iframe>
    </div>
      <NavBar />
  </div>
  );
};

export default SurveyPage;