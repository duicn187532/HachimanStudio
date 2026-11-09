import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Star } from "react-feather";
import { navigateWithState } from '../services/navigateWithState';
import { LocationState } from '../services/navigateWithState';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState || {};

  // 優先從 localStorage 取得完整資料
  const storedState = JSON.parse(localStorage.getItem('navigationState') || '{}') as LocationState;

  // 合併 locationState 和 storedState，優先使用最新的資料
  const completeState = { ...storedState, ...locationState };

  const currentPath = location.pathname;

  const navItems = [
    { icon: Home, label: "首頁", path: "/profile", isActive: currentPath === "/profile" },
    { icon: BookOpen, label: "課程", path: "/class", isActive: currentPath.includes("/class") },
    { icon: Star, label: "星級", path: "/details", isActive: currentPath.includes("/details") },
  ];

  const handleNavigation = (path: string) => {
    navigateWithState(navigate, path, completeState);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t rounded-t-2xl border-gray-200 flex justify-around items-center h-16 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
              <div
                key={index}
                className="flex flex-col items-center justify-center w-1/4 h-full cursor-pointer"
                onClick={() => handleNavigation(item.path)}
              >
                <Icon size={24} className={item.isActive ? "text-black" : "text-gray-400"} />
                <span className={`text-xs mt-1 ${item.isActive ? "text-black" : "text-gray-400"}`}>{item.label}</span>
                {item.isActive && <div className="absolute bottom-0 w-10 h-1 bg-orange-400 rounded-t-md" />}
              </div>
          )
        })}
      </div>
    </>
  );
};

export default NavBar;
