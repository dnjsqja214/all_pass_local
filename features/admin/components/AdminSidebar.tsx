import React from "react";
import styles from "./AdminSidebar.module.css";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarClock,
  AlertTriangle,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";

interface AdminSidebarProps {
  activeMenu: string;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export function AdminSidebar({
  activeMenu,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  onLogout,
}: AdminSidebarProps) {
  const menuItems = [
    { id: "today", label: "오늘 현황" },
    { id: "members", label: "회원 관리" },
    { id: "exam-schedules", label: "시험 관리" },
    { id: "attendance", label: "출석 관리" },
    { id: "incorrect", label: "오답·위험군" },
    { id: "report", label: "리포트" },
  ];

  // 메뉴 아이콘 반환 함수
  const getMenuIcon = (id: string) => {
    const iconClass = "w-5 h-5 shrink-0";
    switch (id) {
      case "today":
        return <LayoutDashboard className={iconClass} />;
      case "members":
        return <Users className={iconClass} />;
      case "attendance":
        return <Calendar className={iconClass} />;
      case "exam-schedules":
        return <CalendarClock className={iconClass} />;
      case "incorrect":
        return <AlertTriangle className={iconClass} />;
      case "report":
        return <BarChart3 className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* 모바일 화면 백드롭 레이어 */}
      {isOpen && (
        <div
          onClick={onClose}
          className={styles.backdrop}
        />
      )}

      {/* 사이드바 본체 (접힘 상태에 따라 너비/패딩 조절, 데스크톱에서 항상 유지) */}
      <aside
        className={`${styles.sidebar} ${
          isOpen ? styles.sidebarOpen : styles.sidebarClosed
        } ${
          isCollapsed ? "lg:w-[72px] lg:p-3" : "lg:w-60 lg:p-6"
        } lg:translate-x-0 w-60 p-6`}
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
              <div
                className={`flex flex-col transition-all duration-200 overflow-hidden whitespace-nowrap ${
                  isCollapsed
                    ? "opacity-0 invisible w-0 max-w-0"
                    : "opacity-100 visible max-w-xs"
                }`}
              >
                <span className={styles.logoBrand}>
                  ALLPASS
                </span>
                <span className={styles.logoSub}>Study OS Admin</span>
              </div>
            </div>

            {/* 사이드바 접기/펼치기 버튼 (데스크톱 전용) */}
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl border border-[#ffffff15] text-[#A8A7A5] hover:text-white hover:bg-[#ffffff0A] transition-all duration-200 cursor-pointer focus:outline-none shrink-0"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* 메뉴 네비게이션 */}
          <nav className={styles.nav}>
            {menuItems.map((item) => {
              const isActive = activeMenu === item.id;
              const path = item.id === "members"
                ? "/admin/members"
                : item.id === "exam-schedules" ? "/admin/exam-schedules" : item.id === "today" ? "/admin" : "#";
              return (
                <Link
                  key={item.id}
                  href={path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={`${styles.navItem} ${
                    isActive ? styles.navActive : styles.navInactive
                  } ${isCollapsed ? "lg:justify-center lg:px-0" : "px-4"}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {getMenuIcon(item.id)}
                  <span
                    className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
                      isCollapsed
                        ? "lg:opacity-0 lg:invisible lg:w-0 lg:max-w-0 lg:ml-0"
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
        <div className={`border-t border-[#FFFFFF15] pt-4 mt-auto ${isCollapsed ? "lg:flex lg:justify-center" : ""}`}>
          <button
            onClick={onLogout}
            className={`${styles.navItem} ${styles.navInactive} ${
              isCollapsed ? "lg:justify-center lg:px-0" : "px-4"
            } w-full cursor-pointer text-left`}
            title={isCollapsed ? "로그아웃" : undefined}
          >
            <LogOut className="w-5 h-5 text-[#A8A7A5] shrink-0" />
            <span
              className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
                isCollapsed
                  ? "lg:opacity-0 lg:invisible lg:w-0 lg:max-w-0 lg:ml-0"
                  : "opacity-100 visible max-w-xs ml-3"
              }`}
            >
              로그아웃
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
