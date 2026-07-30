"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserSidebar } from "@/features/dashboard/components/UserSidebar";
import { MobileBottomNav } from "@/features/dashboard/components/MobileBottomNav";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authService } from "@/features/auth/services/authService";
import { ModeSwitcher } from "@/features/auth/components/ModeSwitcher";
import { ThemeToggle } from "@/features/theme/components/ThemeToggle/ThemeToggle";
import { MessengerWidget } from "@/features/chat/components/MessengerWidget/MessengerWidget";
import { useExamPhase } from "@/features/exam/hooks/useExamPhase";
import { ExamCountdown } from "@/features/exam/components/ExamCountdown";
import { ExamSolvingModal } from "@/features/exam/components/ExamSolvingModal";
import { useVoiceReminders } from "@/features/exam/hooks/useVoiceReminder";
import { useGetDashboardContentQuery } from "@/features/dashboard/api/dashboardContentApi";
import styles from "./layout.module.css";

function getExamDDay(examDate: string | null | undefined): string | null {
  if (!examDate) return null;
  const [year, month, day] = examDate.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const difference = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (difference === 0) return "시험 D-Day";
  return difference > 0 ? `시험까지 D-${difference}` : null;
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { status: authStatus, user, error: authError } = useAuth();
  const dashboardQuery = useGetDashboardContentQuery();
  // 시험 시간이 되면 사이드바·본문 대신 대기 화면을 그린다. 덮는 게 아니라 바꿔치기라
  // 뒤에 아무것도 남지 않는다(주소로 빠져나갈 수도 없다).
  const {
    phase: examPhase,
    remainingSeconds,
    secondsUntilStart,
    registration,
    error: examError,
    markRegistrationSubmitted,
    refreshRegistrations,
  } = useExamPhase();
  /** 시작 버튼을 누른 신청 건. 누르기 전까지는 대기 화면에 머문다. */
  const [startedRegistrationId, setStartedRegistrationId] = useState<string | null>(null);
  // 시작 시각 전이거나, 시작했지만 아직 버튼을 안 누른 동안 대기 화면을 띄운다.
  const isExamGateOpen =
    (examPhase === "waiting" || examPhase === "running") && registration !== null;
  const [isUserSidebarCollapsed, setIsUserSidebarCollapsed] = useState(false);

  useVoiceReminders({
    notificationKey: registration ? `${registration.id}:start` : null,
    reminders: registration?.startReminders ?? [],
    remainingSeconds: secondsUntilStart,
    active: registration !== null,
  });

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
    void refreshRegistrations();
  };

  // 현재 경로에 맞는 헤더 제목 및 D-Day 매핑
  const getHeaderInfo = (path: string) => {
    if (path === "/") {
      return {
        desktopTitle: "대시보드",
        desktopSub: "학습 및 시험 현황",
        mobileTitle: "대시보드",
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
      desktopSub: "학습 및 시험 현황",
      mobileTitle: "대시보드",
    };
  };

  const headerInfo = getHeaderInfo(pathname);
  const examDDay = getExamDDay(
    dashboardQuery.data?.find((content) => content.type === "EXAM")?.examDate,
  );
  const displayName = user?.name?.trim() || user?.email?.trim() || null;

  return (
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
          endReminders={registration?.id === startedRegistrationId ? registration.endReminders : undefined}
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
                {examDDay ? <span className={styles.dDayBadge}>{examDDay}</span> : null}

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
                    {examDDay ? <span className={styles.mobileDDay}>{examDDay}</span> : null}
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

          {/* 공개방과 초대받은 비공개방을 제공하는 메신저. 시험 대기·응시 중에는 감춘다. */}
          <MessengerWidget
            currentUserId={user?.id ?? ""}
            roles={user?.roles ?? []}
            mode="user"
          />
        </>
      )}
    </div>
  );
}
