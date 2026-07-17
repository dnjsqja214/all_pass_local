import React, { useState, useEffect } from "react";
import styles from "./AdminHeader.module.css";
import { useRouter } from "next/navigation";
import { mockAuthService } from "../../auth/services/mockAuthService";
import { MockAccount } from "../../auth/types/auth";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<MockAccount | null>(null);

  useEffect(() => {
    setAdminUser(mockAuthService.getCurrentUser());
  }, []);

  const handleLogout = () => {
    mockAuthService.logout();
    router.push("/login");
  };

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
          <div className={styles.userArea}>
            <div className={styles.userAvatar}>
              {adminUser ? adminUser.name[0] : "AD"}
            </div>
            <span className={styles.userName}>
              {adminUser ? adminUser.name : "마스터"}님
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-[12px] font-bold text-[#C93A35] hover:text-[#111111] transition-all cursor-pointer border border-[#C93A35]/25 hover:border-[#111111]/20 px-3 py-1.5 rounded-lg bg-transparent ml-1"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}

