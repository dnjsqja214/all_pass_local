"use client";

import React from "react";
import { ModeSwitcher } from "../../auth/components/ModeSwitcher";
import { ThemeToggle } from "../../theme/components/ThemeToggle/ThemeToggle";
import { CurrentUser } from "../../auth/types/auth";
import styles from "./Header.module.css";

interface HeaderProps {
  isAdmin?: boolean;
  onMenuToggle?: () => void;
  title?: string;
  subTitle?: string;
  examDDay?: number;
  user: CurrentUser | null;
  onLogout: () => void;
}

export function Header({
  isAdmin = false,
  onMenuToggle,
  title = "대시보드",
  subTitle = "실시간 학습 현황",
  examDDay = 117,
  user,
  onLogout,
}: HeaderProps) {
  const displayName = user?.name?.trim() || user?.email?.trim() || null;

  if (isAdmin) {
    return (
      <header className={styles.adminHeader}>
        {/* Left Section (Admin) */}
        <div className={styles.leftSection}>
          {/* Hamburger menu toggle button (mobile only) */}
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="메뉴 토글"
            className={`${styles.menuToggle} lg:hidden`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={styles.menuIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          <div className={styles.titleArea}>
            <h2 className={styles.title}>관리자 대시보드</h2>
          </div>
        </div>

        {/* Right Section (Admin) */}
        <div className={styles.rightSection}>
          <ModeSwitcher activeMode="admin" roles={user?.roles ?? []} compact />
          <div className="flex items-center gap-3">
            {displayName ? (
              <div className={styles.adminUserArea}>
                <div className={styles.adminUserAvatar}>{displayName[0]}</div>
                <span className={styles.adminUserName}>{displayName}님</span>
              </div>
            ) : null}
            <button
              onClick={onLogout}
              className={styles.adminLogoutBtn}
            >
              로그아웃
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  // User Header (Desktop only)
  return (
    <header className={styles.userHeader}>
      {/* Left Section (User Desktop) */}
      <div className={styles.userTitleArea}>
        <h2 className={styles.userTitle}>{title}</h2>
        <span className={styles.userSubtitle}>{subTitle}</span>
      </div>

      {/* Right Section (User Desktop) */}
      <div className={styles.rightSection}>
        <ModeSwitcher activeMode="user" roles={user?.roles ?? []} />
        <span className={styles.ddayBadge}>시험까지 D-{examDDay}</span>

        <div className={styles.rightSectionWithBorder}>
          {displayName ? (
            <div className={styles.userArea}>
              <div className={styles.userAvatar}>{displayName[0]}</div>
              <div className={styles.userMeta}>
                <span className={styles.userName}>{displayName} 님</span>
                <span className={styles.userGoal}>합격 목표</span>
              </div>
            </div>
          ) : null}

          <button
            onClick={onLogout}
            className={styles.logoutBtn}
          >
            로그아웃
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
