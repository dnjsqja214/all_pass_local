import React from "react";
import styles from "./AdminSidebar.module.css";

interface AdminSidebarProps {
  activeMenu: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ activeMenu, isOpen, onClose }: AdminSidebarProps) {
  const menuItems = [
    { id: "today", label: "오늘 현황" },
    { id: "members", label: "회원 관리" },
    { id: "attendance", label: "출석 관리" },
    { id: "incorrect", label: "오답·위험군" },
    { id: "report", label: "리포트" },
  ];

  return (
    <>
      {/* 모바일 화면 백드롭 레이어 */}
      {isOpen && (
        <div
          onClick={onClose}
          className={styles.backdrop}
        />
      )}

      {/* 사이드바 본체 */}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
      >
        <div className="flex flex-col gap-8">
          {/* 로고 영역 */}
          <div className={styles.logoArea}>
            <div className={styles.logoBadge}>
              A
            </div>
            <div className="flex flex-col">
              <span className={styles.logoBrand}>
                ALLPASS
              </span>
              <span className={styles.logoSub}>Study OS Admin</span>
            </div>
          </div>

          {/* 메뉴 네비게이션 */}
          <nav className={styles.nav}>
            {menuItems.map((item) => {
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onClose();
                  }}
                  className={`${styles.navItem} ${isActive ? styles.navActive : styles.navInactive}`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 운영자 프로필 */}
        <div className={styles.profilePanel}>
          <div className={styles.profileAvatar}>
            OP
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>
              관리자(운영팀)
            </span>
            <span className={styles.profileEmail}>
              admin@allpass.com
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

