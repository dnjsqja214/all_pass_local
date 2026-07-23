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
    const iconClass = styles.icon;
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
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
        data-collapsed={isCollapsed}
      >
        <div className={styles.top}>
          {/* 로고 영역 (접힘 상태에 따라 수직 정렬로 변환) */}
          <div className={styles.logoArea}>
            <div className={styles.logoGroup}>
              <div className={styles.logoBadge}>A</div>
              <div className={`${styles.logoText} ${styles.collapsible}`}>
                <span className={styles.logoBrand}>ALLPASS</span>
                <span className={styles.logoSub}>Study OS Admin</span>
              </div>
            </div>

            {/* 사이드바 접기/펼치기 버튼 (데스크톱 전용) */}
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
              className={styles.toggleButton}
            >
              {isCollapsed ? (
                <PanelLeftOpen className={styles.icon} />
              ) : (
                <PanelLeftClose className={styles.icon} />
              )}
            </button>
          </div>

          {/* 메뉴 네비게이션 */}
          <nav className={styles.nav}>
            {menuItems.map((item) => {
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
                  className={styles.navItem}
                  data-active={activeMenu === item.id}
                  title={isCollapsed ? item.label : undefined}
                >
                  {getMenuIcon(item.id)}
                  <span className={styles.collapsible}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 하단 로그아웃 버튼 */}
        <div className={styles.bottom}>
          <button
            onClick={onLogout}
            className={styles.navItem}
            title={isCollapsed ? "로그아웃" : undefined}
          >
            <LogOut className={styles.icon} />
            <span className={styles.collapsible}>로그아웃</span>
          </button>
        </div>
      </aside>
    </>
  );
}
