"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserSidebar } from "@/features/dashboard/components/UserSidebar";
import { MobileBottomNav } from "@/features/dashboard/components/MobileBottomNav";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authService } from "@/features/auth/services/authService";
import { ModeSwitcher } from "@/features/auth/components/ModeSwitcher";
import { ThemeToggle } from "@/features/theme/components/ThemeToggle/ThemeToggle";
import { SocketProvider } from "@/features/socket/SocketProvider";
import { useExamPhase } from "@/features/exam/hooks/useExamPhase";
import { ExamCountdown } from "@/features/exam/components/ExamCountdown";
import { ExamSolvingModal } from "@/features/exam/components/ExamSolvingModal";
import styles from "./layout.module.css";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { status: authStatus, user, error: authError } = useAuth();
  // 시험 시간이 되면 사이드바·본문 대신 대기 화면을 그린다. 덮는 게 아니라 바꿔치기라
  // 뒤에 아무것도 남지 않는다(주소로 빠져나갈 수도 없다).
  const {
    phase: examPhase,
    remainingSeconds,
    registration,
    error: examError,
    markRegistrationSubmitted,
  } = useExamPhase();
  /** 시작 버튼을 누른 신청 건. 누르기 전까지는 대기 화면에 머문다. */
  const [startedRegistrationId, setStartedRegistrationId] = useState<string | null>(null);
  // 시작 시각 전이거나, 시작했지만 아직 버튼을 안 누른 동안 대기 화면을 띄운다.
  const isExamGateOpen =
    (examPhase === "waiting" || examPhase === "running") && registration !== null;
  const [isUserSidebarCollapsed, setIsUserSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [authStatus, router]);

  // 로컬 스토리지에서 사이드바 접힘 선호도를 불러옵니다.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("allpass-user-sidebar-collapsed");
      if (saved !== null) setIsUserSidebarCollapsed(saved === "true");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleToggleCollapse = () => {
    const newVal = !isUserSidebarCollapsed;
    setIsUserSidebarCollapsed(newVal);
    localStorage.setItem("allpass-user-sidebar-collapsed", String(newVal));
  };

  const handleLogout = () => {
    authService.redirectToLogout(`${window.location.origin}/login`);
  };

  const handleExamSubmitted = () => {
    if (startedRegistrationId) {
      markRegistrationSubmitted(startedRegistrationId);
    }
    setStartedRegistrationId(null);
  };

  // 현재 경로에 맞는 헤더 제목 및 D-Day 매핑
  const getHeaderInfo = (path: string) => {
    if (path === "/") {
      return {
        desktopTitle: "대시보드",
        desktopSub: "실시간 학습 현황",
        mobileTitle: "오늘의 학습",
      };
    }
    if (path.startsWith("/chat")) {
      return {
        desktopTitle: "스터디 채팅",
        desktopSub: "함께 공부하는 사람들",
        mobileTitle: "채팅",
      };
    }
    if (path.startsWith("/learning-management")) {
      return {
        desktopTitle: "학습관리",
        desktopSub: "성적 추이 분석",
        mobileTitle: "학습관리",
      };
    }
    if (path.startsWith("/exam-registration")) {
      return {
        desktopTitle: "시험 신청",
        desktopSub: "응시할 시험 일정을 추가하고 관리합니다.",
        mobileTitle: "시험 신청",
      };
    }
    if (path.startsWith("/wrong-notes")) {
      return {
        desktopTitle: "오답노트",
        desktopSub: "과목 및 원인별 통계",
        mobileTitle: "오답노트",
      };
    }
    if (path.startsWith("/exams")) {
      if (path.endsWith("/solve")) {
        return {
          desktopTitle: "실시간 문제풀이",
          desktopSub: "OMR 답안지 입력 및 자동 저장",
          mobileTitle: "실시간 문제풀이",
        };
      }
      return {
        desktopTitle: "시험 선택",
        desktopSub: "응시할 시험을 검색한 후 시험을 선택하세요.",
        mobileTitle: "시험 선택",
      };
    }
    return {
      desktopTitle: "대시보드",
      desktopSub: "실시간 학습 현황",
      mobileTitle: "오늘의 학습",
    };
  };

  const headerInfo = getHeaderInfo(pathname);
  const examDDay = 117; // 상수 D-Day
  const displayName = user?.name?.trim() || user?.email?.trim() || null;

  return (
    // SocketProvider 는 화면 분기보다 바깥이어야 한다. 안쪽에 두면 나중에 시험 대기
    // 화면으로 바뀌는 순간 언마운트되면서 연결이 끊긴다.
    <SocketProvider>
    <div className={styles.shell}>
      {authStatus === "loading" || authStatus === "unauthenticated" ? (
        <div className={styles.state}>로그인 확인 중...</div>
      ) : authStatus === "error" ? (
        <div className={styles.state}>
          <p className={styles.stateTitle}>로그인 상태를 확인할 수 없습니다.</p>
          <p className={styles.stateDetail}>{authError}</p>
        </div>
      ) : startedRegistrationId ? (
        <ExamSolvingModal
          registrationId={startedRegistrationId}
          isOpen
          onClose={() => setStartedRegistrationId(null)}
          onSubmitted={handleExamSubmitted}
        />
      ) : isExamGateOpen && registration ? (
        <ExamCountdown
          remainingSeconds={remainingSeconds}
          registration={registration}
          canStart={examPhase === "running"}
          isStarting={false}
          onStart={() => setStartedRegistrationId(registration.id)}
          error={examError}
        />
      ) : (
        <>
          {/* 1. 사이드바 네비게이션 (데스크톱 전용) */}
          <UserSidebar
            isCollapsed={isUserSidebarCollapsed}
            onToggleCollapse={handleToggleCollapse}
            onLogout={handleLogout}
          />

          {/* 2. 메인 영역 */}
          <div className={styles.main}>

            {/* 상단 Header (데스크톱 전용) */}
            <header className={styles.desktopHeader}>
              <div className={styles.titleGroup}>
                <h2 className={styles.title}>{headerInfo.desktopTitle}</h2>
                <span className={styles.subtitle}>{headerInfo.desktopSub}</span>
              </div>
              <div className={styles.actions}>
                <ModeSwitcher activeMode="user" roles={user?.roles ?? []} />
                <span className={styles.dDayBadge}>시험까지 D-{examDDay}</span>

                {/* 상단 헤더로 옮겨진 사용자 프로필 카드 + 로그아웃 버튼 */}
                <div className={styles.profileGroup}>
                  {displayName ? (
                    <div className={styles.profile}>
                      <div className={styles.avatar}>{displayName[0]}</div>
                      <div className={styles.profileText}>
                        <span className={styles.profileName}>{displayName} 님</span>
                        <span className={styles.profileGoal}>합격 목표</span>
                      </div>
                    </div>
                  ) : null}

                  <button onClick={handleLogout} className={styles.logoutButton}>
                    로그아웃
                  </button>
                  <ThemeToggle />
                </div>
              </div>
            </header>

            {/* 콘텐츠 뷰포트 영역 */}
            <div className={styles.viewport} data-fixed-height={pathname === "/exams"}>
              <div className={styles.contentBox}>

                {/* 상단 타이틀 & D-Day & 로그아웃 (모바일 / 태블릿용 헤더 공통화) */}
                <div className={styles.mobileHeader}>
                  <h1 className={styles.mobileTitle}>{headerInfo.mobileTitle}</h1>
                  <div className={styles.mobileActions}>
                    <ModeSwitcher activeMode="user" roles={user?.roles ?? []} compact />
                    <span className={styles.mobileDDay}>시험까지 D-{examDDay}</span>
                    <button onClick={handleLogout} className={styles.mobileLogout}>
                      로그아웃
                    </button>
                    <ThemeToggle />
                  </div>
                </div>

                {/* 개별 페이지 본문 삽입 */}
                {children}

                {/* 하단 탭바 (모바일/태블릿용) */}
                <MobileBottomNav />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    </SocketProvider>
  );
}
