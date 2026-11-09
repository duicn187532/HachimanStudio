import { NavigateFunction } from 'react-router-dom';
import { Master, StarData, ClassData, LevelInfo } from '../types/common';

export interface LocationState {
  masterInfo?: Master;
  stars?: StarData[];
  classes?: ClassData[];
  totalScore?: number;
  levelInfo?: LevelInfo;
  progressValue?: number;
}

export const navigateWithState = (
  navigate: NavigateFunction, 
  path: string, 
  currentState?: LocationState | null, 
  additionalState?: object
) => {
  const updatedState = { 
    ...currentState, 
    ...additionalState 
  };

  // 儲存到 localStorage，這是用於當頁面刷新或狀態丟失的時候可以從 localStorage 獲取
  localStorage.setItem('navigationState', JSON.stringify(updatedState));
  // console.log(updatedState);
  navigate(path, { 
    state: updatedState 
  });
};
