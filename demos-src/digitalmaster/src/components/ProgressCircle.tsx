import React from 'react';

interface ProgressCircleProps {
  progress: number; // 0 ~ 1 之間，代表完成百分比
  size?: number; // SVG 寬高，例如 80
  strokeWidth?: number; // 線寬，例如 5
  circleColor?: string; // 進度顏色，例如 "#ffb74d"
  backgroundColor?: string; // 背景圓圈顏色，例如 "#f0f0f0"
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 80,
  strokeWidth = 5,
  circleColor = "#ffb74d",
  backgroundColor = "#f0f0f0",
}) => {
  // 計算圓的半徑，確保線條不會被裁切
  const radius = (size - strokeWidth) / 2;
  // 圓周長：用於設定 dash array
  const circumference = 2 * Math.PI * radius;
  // 計算 dash offset，progress 越高，offset 越低
  const dashoffset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 背景圓圈 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
      />
      {/* 進度圓圈 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={circleColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={isNaN(dashoffset) ? "0" : dashoffset.toString()}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
};

export default ProgressCircle;
