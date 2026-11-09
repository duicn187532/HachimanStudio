import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading.json';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <Lottie 
        animationData={loadingAnimation} 
        loop={true} 
        style={{ width: 303, height: 75 }} 
      />
    </div>
  );
};

export default LoadingScreen;
