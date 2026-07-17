"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { USER_MENU_ITEMS } from "../constants/navigation";

export function UserSidebar() {
  const pathname = usePathname();

  // 현재 URL 경로에 따라 활성 탭 식별
  const getActiveTab = () => {
    if (pathname === "/") return "today";
    const matched = USER_MENU_ITEMS.find((item) => item.path !== "/" && pathname.startsWith(item.path));
    return matched ? matched.id : "today";
  };

  const activeTab = getActiveTab();

  // SVG 아이콘 맵퍼
  const getIcon = (id: string) => {
    switch (id) {
      case "today":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        );
      case "exam":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
            />
          </svg>
        );
      case "incorrect":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        );
      case "profile":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-64 bg-[#1C1A17] text-white min-h-screen hidden xl:flex flex-col justify-between p-6 border-r border-[#2C2A27] shrink-0">
      <div className="flex flex-col gap-8">
        {/* 로고 영역 */}
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="w-8 h-8 rounded-lg bg-[#B83A38] flex items-center justify-center font-black text-white text-lg">
            A
          </div>
          <span className="text-lg font-black tracking-wider uppercase text-white">
            All Pass
          </span>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex flex-col gap-1.5">
          {USER_MENU_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[14px] font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#B83A38] text-white shadow-md shadow-[#B83A38]/10"
                    : "text-[#A8A7A5] hover:text-white hover:bg-[#FFFFFF0A]"
                }`}
              >
                {getIcon(item.id)}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

    </aside>
  );
}
