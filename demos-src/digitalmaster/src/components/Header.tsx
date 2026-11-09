"use client";

import React from "react";
// 可以改用您已安裝的 Icon 套件，例如 react-icons, heroicons, etc.
import { LogOut } from "lucide-react"; 
import { ChevronLeft } from "react-feather";

interface HeaderProps {
  // title?: string;            // 中間標題文字
  onLeftClick?: () => void;  // 左側按鈕點擊事件
  onRightClick?: () => void; // 右側按鈕點擊事件
  isIndex: boolean;
}

const Header: React.FC<HeaderProps> = ({
  // title = "數位達人通行證",
  isIndex =false,
  onLeftClick,
  // onRightClick,
}) => {
  return (
    <header className="flex items-center justify-between px-4 py-1">
      {/* 左側按鈕 */}
      <button
        onClick={onLeftClick}
        className="p-1 text-black rounded"
      >
        {isIndex === true ? (<LogOut size={24} />) : (<ChevronLeft  size={24}/>)}
      </button>

      {/* 中間標題 */}
      <h1 className="text-lg pr-5 font-semibold text-black">數位達人通行證</h1>

      {/* 右側按鈕
      <button
        onClick={onRightClick}
        className="p-1 text-black hover:bg-gray-100 rounded"
      >
        <Bell size={24} />
      </button> */}
      <div></div>
    </header>
  );
};

export default Header;
