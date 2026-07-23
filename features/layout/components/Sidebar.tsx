"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarClock,
  AlertTriangle,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
  ClipboardList,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isAdmin?: boolean;
  activeMenu?: string;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export function Sidebar({
  isAdmin = false,
  activeMenu,
  isOpen = false,
  onClose = () => { },
  isCollapsed,
  onToggleCollapse,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  // 1. Define menu items and paths based on role
  const menuItems = isAdmin
    ? [
      { id: "today", label: "오늘 현황", path: "/admin" },
      { id: "members", label: "회원 관리", path: "/admin/members" },
      // { id: "exam-schedules", label: "시험 관리", path: "/admin/exam-schedules" },
      // { id: "attendance", label: "출석 관리", path: "#" },
      // { id: "incorrect", label: "오답·위험군", path: "#" },
      // { id: "report", label: "리포트", path: "#" },
    ]
    : [
      { id: "today", label: "오늘 학습", path: "/" },
      { id: "apply-exam", label: "시험 신청", path: "/exam-registration" },
      { id: "incorrect", label: "오답 노트", path: "/wrong-notes" },
      { id: "profile", label: "학습 관리", path: "/learning-management" },
    ];

  // 2. Icon selector
  const getIcon = (id: string) => {
    const iconClass = "w-5 h-5 shrink-0";
    if (isAdmin) {
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
    } else {
      switch (id) {
        case "today":
          return <LayoutDashboard className={iconClass} />;
        case "apply-exam":
          return <ClipboardList className={iconClass} />;
        case "incorrect":
          return <AlertCircle className={iconClass} />;
        case "profile":
          return <TrendingUp className={iconClass} />;
        default:
          return null;
      }
    }
  };

  // 3. Check active state
  const checkIsActive = (item: typeof menuItems[0]) => {
    if (activeMenu) {
      return activeMenu === item.id;
    }
    if (item.path === "/") {
      return pathname === "/";
    }
    if (item.path === "/admin") {
      return pathname === "/admin";
    }
    return item.path !== "#" && pathname.startsWith(item.path);
  };

  // 4. Dynamic responsive class builders
  const asideClass = isAdmin
    ? `${styles.sidebar} ${styles.adminSidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed
    } ${isCollapsed ? "w-60 p-6 lg:w-[72px] lg:p-3" : "w-60 p-6 lg:w-60 lg:p-6"
    } lg:translate-x-0`
    : `${styles.sidebar} ${styles.userSidebar} ${isCollapsed ? "w-60 p-6 xl:w-[72px] xl:p-3" : "w-60 p-6 xl:w-64 xl:p-6"
    }`;

  const logoAreaClass = `flex items-center transition-all duration-200 ${isCollapsed
    ? "flex-col gap-4 px-0 pb-3 border-b border-[#ffffff0a] items-center"
    : "justify-between px-2 border-b border-[#ffffff0a] pb-3"
    }`;

  const navLinkClass = (isActive: boolean) => {
    const responsiveGap = isCollapsed
      ? `${isAdmin ? "lg" : "xl"}:justify-center ${isAdmin ? "lg" : "xl"}:px-0 ${isAdmin ? "lg" : "xl"}:gap-0`
      : "px-4";
    return `${styles.navItem} ${isActive ? styles.navActive : styles.navInactive} ${responsiveGap}`;
  };

  const labelSpanClass = `transition-all duration-200 overflow-hidden whitespace-nowrap ${isCollapsed
    ? `${isAdmin ? "lg" : "xl"}:opacity-0 ${isAdmin ? "lg" : "xl"}:invisible ${isAdmin ? "lg" : "xl"}:w-0 ${isAdmin ? "lg" : "xl"}:max-w-0 ${isAdmin ? "lg" : "xl"}:ml-0`
    : "opacity-100 visible max-w-xs ml-3"
    }`;

  const toggleButtonClass = `hidden ${isAdmin ? "lg:flex" : "xl:flex"} items-center justify-center w-10 h-10 rounded-xl border border-[#ffffff15] text-[#A8A7A5] hover:text-white hover:bg-[#ffffff0A] transition-all duration-200 cursor-pointer focus:outline-none shrink-0`;

  return (
    <>
      {/* Mobile background backdrop (Admin only) */}
      {isAdmin && isOpen && (
        <div
          onClick={onClose}
          className={styles.backdrop}
        />
      )}

      {/* Main Sidebar Wrapper */}
      <aside className={asideClass}>
        <div className="flex flex-col gap-8">
          {/* Logo Area */}
          <div className={logoAreaClass}>
            <div className="flex items-center gap-3">
              <div className={styles.logoBadge}>A</div>
              <div
                className={`flex flex-col transition-all duration-200 overflow-hidden whitespace-nowrap ${isCollapsed
                  ? "opacity-0 invisible w-0 max-w-0"
                  : "opacity-100 visible max-w-xs"
                  }`}
              >
                <span className={styles.logoBrand}>ALLPASS</span>
                <span className={styles.logoSub}>
                  {isAdmin ? "Study OS Admin" : "Study OS"}
                </span>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
              className={toggleButtonClass}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className={styles.nav}>
            {menuItems.map((item) => {
              const isActive = checkIsActive(item);
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={() => {
                    if (isAdmin && window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={navLinkClass(isActive)}
                  title={isCollapsed ? item.label : undefined}
                >
                  {getIcon(item.id)}
                  <span className={labelSpanClass}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
