import React from "react";
import styles from "./AdminHeader.module.css";
import { CurrentUser } from "../../auth/types/auth";

interface AdminHeaderProps {
  onMenuToggle: () => void;
  user: CurrentUser | null;
  onLogout: () => void;
}

export function AdminHeader({ onMenuToggle, user, onLogout }: AdminHeaderProps) {
  const displayName = user?.name?.trim() || user?.email?.trim() || null;

  return (
    <header className={styles.header}>
      {/* 좌측 영역 */}
      <div className={styles.leftSection}>
        {/* 햄버거 메뉴 토글 버튼 (모바일 전용) */}
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="메뉴 토글"
          className={`${styles.menuToggle} lg:hidden`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <div className={styles.titleArea}>
          <h2 className={styles.title}>
            ALLPASS Study OS
          </h2>
          <span className={styles.prototypeBadge}>
            프로토타입
          </span>
        </div>
      </div>

      {/* 우측 영역 */}
      <div className={styles.rightSection}>
        <span className={styles.modeLabel}>
          운영 대시보드 모드
        </span>
        <div className="flex items-center gap-3">
          {displayName ? (
            <div className={styles.userArea}>
              <div className={styles.userAvatar}>
                {displayName[0]}
              </div>
              <span className={styles.userName}>
                {displayName}님
              </span>
            </div>
          ) : null}
          <button
            onClick={onLogout}
            className="text-[12px] font-bold text-[#C93A35] hover:text-[#111111] transition-all cursor-pointer border border-[#C93A35]/25 hover:border-[#111111]/20 px-3 py-1.5 rounded-lg bg-transparent ml-1"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
