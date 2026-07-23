"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { USER_MENU_ITEMS } from "../constants/navigation";
import styles from "./UserSidebar.module.css";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface UserSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export function UserSidebar({ isCollapsed, onToggleCollapse, onLogout }: UserSidebarProps) {
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
            className={styles.navIcon}
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
            className={styles.navIcon}
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
            className={styles.navIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        );
      case "apply-exam":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.navIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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
            className={styles.navIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
            />
          </svg>
        );
      case "chat":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.navIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside className={styles.sidebar} data-collapsed={isCollapsed}>
      <div className={styles.top}>
        {/* 로고 영역 (접힘 상태에 따라 수직 정렬로 변환) */}
        <div className={styles.logoArea}>
          <div className={styles.logoGroup}>
            <div className={styles.logoBadge}>A</div>
            <span className={styles.collapsible}>
              <span className={styles.logoBrand}>All Pass</span>
            </span>
          </div>

          {/* 사이드바 접기/펼치기 버튼 (데스크톱 전용) */}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
            className={styles.toggleButton}
          >
            {isCollapsed ? (
              <PanelLeftOpen className={styles.toggleIcon} />
            ) : (
              <PanelLeftClose className={styles.toggleIcon} />
            )}
          </button>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className={styles.nav}>
          {USER_MENU_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={styles.navLink}
              data-active={activeTab === item.id}
              title={isCollapsed ? item.label : undefined}
            >
              {getIcon(item.id)}
              <span className={styles.collapsible}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* 하단 로그아웃 버튼 */}
      <div className={styles.bottom}>
        <button
          onClick={onLogout}
          className={styles.logoutButton}
          title={isCollapsed ? "로그아웃" : undefined}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.logoutIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
          <span className={styles.collapsible}>로그아웃</span>
        </button>
      </div>
    </aside>
  );
}
