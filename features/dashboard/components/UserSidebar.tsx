"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { USER_MENU_ITEMS } from "../constants/navigation";
import styles from "./UserSidebar.module.css";
import { mockAuthService } from "../../auth/services/mockAuthService";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface UserSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function UserSidebar({ isCollapsed, onToggleCollapse }: UserSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    mockAuthService.logout();
    router.push("/login");
  };

  // 현재 URL 경로에 따라 활성 탭 식별
  const getActiveTab = () => {
    if (pathname === "/") return "today";
    const matched = USER_MENU_ITEMS.find((item) => item.path !== "/" && pathname.startsWith(item.path));
    return matched ? matched.id : "today";
  };

  const activeTab = getActiveTab();

  // SVG 아이콘 맵퍼
  const getIcon = (id: string) => {
    const iconClass = "w-5 h-5 shrink-0";
    switch (id) {
      case "today":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={iconClass}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
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
            className={iconClass}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
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
            className={iconClass}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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
            className={iconClass}
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
    <aside
      className={`${styles.sidebar} ${
        isCollapsed ? "xl:w-[72px] xl:p-3" : "xl:w-64 xl:p-6"
      } w-64 p-6`}
    >
      <div className="flex flex-col gap-8">
        {/* 로고 영역 (접힘 상태에 따라 수직 정렬로 변환) */}
        <div
          className={`flex items-center transition-all duration-200 ${
            isCollapsed
              ? "flex-col gap-4 px-0 pb-3 border-b border-[#ffffff0a] items-center"
              : "justify-between px-2 border-b border-[#ffffff0a] pb-3"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={styles.logoBadge}>
              A
            </div>
            <span
              className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
                isCollapsed
                  ? "opacity-0 invisible w-0 max-w-0"
                  : "opacity-100 visible max-w-xs"
              }`}
            >
              <span className={styles.logoBrand}>
                All Pass
              </span>
            </span>
          </div>

          {/* 사이드바 접기/펼치기 버튼 (데스크톱 전용) */}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
            className="hidden xl:flex items-center justify-center w-10 h-10 rounded-xl border border-[#ffffff15] text-[#A8A7A5] hover:text-white hover:bg-[#ffffff0A] transition-all duration-200 cursor-pointer focus:outline-none shrink-0"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className={styles.nav}>
          {USER_MENU_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`${styles.navLink} ${isActive ? styles.navActive : styles.navInactive} ${
                  isCollapsed ? "xl:justify-center xl:px-0 xl:gap-0" : "px-4"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {getIcon(item.id)}
                <span
                  className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
                    isCollapsed
                      ? "xl:opacity-0 xl:invisible xl:w-0 xl:max-w-0 xl:ml-0"
                      : "opacity-100 visible max-w-xs ml-3"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 하단 로그아웃 버튼 */}
      <div className={`border-t border-[#FFFFFF15] pt-4 mt-auto ${isCollapsed ? "xl:flex xl:justify-center" : ""}`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center rounded-xl text-[14px] font-bold text-[#A8A7A5] hover:text-white hover:bg-[#FFFFFF0A] transition-all duration-200 cursor-pointer text-left ${
            isCollapsed ? "xl:justify-center xl:px-0 xl:py-3.5 xl:gap-0" : "px-4 py-3.5"
          }`}
          title={isCollapsed ? "로그아웃" : undefined}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-[#A8A7A5] shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
          <span
            className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
              isCollapsed
                ? "xl:opacity-0 xl:invisible xl:w-0 xl:max-w-0 xl:ml-0"
                : "opacity-100 visible max-w-xs ml-3.5"
            }`}
          >
            로그아웃
          </span>
        </button>
      </div>
    </aside>
  );
}

