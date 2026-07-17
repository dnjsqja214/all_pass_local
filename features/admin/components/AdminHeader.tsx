import React from "react";
import styles from "./AdminHeader.module.css";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  return (
    <header className={styles.header}>
      {/* 좌측 영역 */}
      <div className={styles.leftSection}>
        {/* 햄버거 메뉴 토글 버튼 */}
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="메뉴 토글"
          className={styles.menuToggle}
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
        <div className={styles.userArea}>
          <div className={styles.userAvatar}>
            AD
          </div>
          <span className={styles.userName}>
            마스터님
          </span>
        </div>
      </div>
    </header>
  );
}

