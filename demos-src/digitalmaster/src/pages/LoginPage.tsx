import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import badgeIcon from '../assets/level-highest.png';
import { fetchCombinedData } from '../api/api';
import LoadingScreen from '../components/LoadingScreen';
import { StarData ,Master, ClassData, InitInfo } from '@/types/common';
import getLevelInfo from '@/services/GetLevelInfo';

interface LocationState {
  master: Master;
  stars: StarData[];
  classes: ClassData[];
  initInfo: InitInfo;
}

const LoginPage: React.FC = () => {
  const [account, setAccount] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    else if (account.trim()) {
      try {
        setIsLoading(true);
        const response = await fetchCombinedData(account) as LocationState;
        
        if (!response) {
          alert("伺服器無回應");
          setIsLoading(false);
          return;
        }
        
        // ✅ 檢查是否有 master 資料
        if (!response.master) {
          alert("無此達人資料");
          setIsLoading(false);
          return;
        }
        const filteredStars = response.stars.filter(star => star.valid !== false);
        const sortedStars = [...filteredStars].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
  
        // 計算 totalScore 和 levelInfo
        const totalScore = sortedStars.reduce((sum: number, star: StarData) => sum + star.score, 0);
        const levelInfo = getLevelInfo(totalScore);
        //因進度條顯示問題，+ 0.9才顯示得正常且不會溢滿
        const progressValue = levelInfo.threshold > 0 ? (totalScore - levelInfo.min + 0.9) / levelInfo.threshold : 1;
  
        // 將所有資料存到 localStorage
        localStorage.setItem('navigationState', JSON.stringify({
          masterInfo: response.master,
          stars: sortedStars,
          classes: response.classes,
          levelInfo,
          totalScore,
          progressValue,
          initInfo: response.initInfo
        }));
  
        navigate('/profile');
      } catch (error) {
        alert(error);
        setIsLoading(false);
      }
    }
  };
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  

  return (
    <div className="flex items-center pb-36 justify-center font-sans">
      
      {/* Main Content */}
      <div className=" flex flex-col items-center justify-center w-full px-5">
        <div className="mb-5">
          <img src={badgeIcon || "/placeholder.svg"} alt="Badge" className="w-24 h-24" />
        </div>
        
        <h4 className="text-3xl font-bold mb-5">數位達人系統</h4>
        
        <form onSubmit={handleLogin} className="w-full flex flex-col">
          <div className="w-full">
            <input 
              type="text" 
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="請輸入您帳號登入"
              className="w-full py-4 rounded-xl border border-gray-200 bg-white text-center text-base"
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-[#ffb74d] mx-10 text-white rounded-3xl py-4 text-lg font-bold shadow cursor-pointer mt-10"
          >
            登入
          </button>
        </form>
      </div>
      
      {/* Bank Logo */}
      {/* <div className="mt-auto p-5 flex justify-center"> */}
        {/* <img src={bankLogo || "/placeholder.svg"} alt="上海商業儲蓄銀行" className="h-12" /> */}
      {/* </div> */}
    </div>
  );
};

export default LoginPage;