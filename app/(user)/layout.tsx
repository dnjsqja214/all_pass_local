"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "../../features/layout/components/Sidebar";
import { Header } from "../../features/layout/components/Header";
import { MobileBottomNav } from "../../features/user/dashboard/components/MobileBottomNav";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { authService } from "../../features/auth/services/authService";
import { ModeSwitcher } from "../../features/auth/components/ModeSwitcher";
import { ThemeToggle } from "../../features/theme/components/ThemeToggle/ThemeToggle";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { status: authStatus, user, error: authError } = useAuth();
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
    <div className="min-h-screen xl:h-screen xl:max-h-screen xl:overflow-hidden bg-[var(--color-page-background)] text-[var(--color-text-primary)] flex flex-col xl:flex-row w-full font-sans overflow-x-hidden">
      {authStatus === "loading" || authStatus === "unauthenticated" ? (
        <div className="min-h-screen bg-[var(--color-page-background)] flex items-center justify-center font-bold text-[var(--color-text-secondary)] w-full">
          로그인 확인 중...
        </div>
      ) : authStatus === "error" ? (
        <div className="min-h-screen bg-[var(--color-page-background)] flex flex-col gap-2 items-center justify-center px-4 text-center w-full">
          <p className="font-bold text-[var(--color-text-primary)]">로그인 상태를 확인할 수 없습니다.</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{authError}</p>
        </div>
      ) : (
        <>
          {/* 1. 사이드바 네비게이션 (데스크톱 전용) */}
          <Sidebar
            isCollapsed={isUserSidebarCollapsed}
            onToggleCollapse={handleToggleCollapse}
            onLogout={handleLogout}
          />

          {/* 2. 메인 영역 */}
          <div className="flex-1 flex flex-col min-h-screen xl:h-screen xl:max-h-screen xl:min-h-0 overflow-hidden">

            {/* 상단 Header (데스크톱 전용) */}
            <Header
              title={headerInfo.desktopTitle}
              subTitle={headerInfo.desktopSub}
              examDDay={examDDay}
              user={user}
              onLogout={handleLogout}
            />

            {/* 콘텐츠 뷰포트 영역 */}
            <div className={`flex-1 ${pathname === "/exams" || pathname.startsWith("/learning-management") ? "xl:overflow-hidden" : "xl:overflow-y-auto"} overflow-y-auto bg-[var(--color-content-background)]`}>
              <div className={`w-full max-w-md md:max-w-2xl lg:max-w-5xl xl:max-w-[1440px] mx-auto min-h-screen bg-[var(--color-content-background)] shadow-sm xl:shadow-none flex flex-col justify-between xl:justify-start relative overflow-hidden xl:overflow-visible transition-all duration-300 ${pathname === "/exams" || pathname.startsWith("/learning-management") ? "xl:h-full xl:min-h-0" : "xl:min-h-0"}`}>

                {/* 상단 타이틀 & D-Day & 로그아웃 (모바일 / 태블릿용 헤더 공통화) */}
                <div className="flex flex-wrap justify-between items-center gap-3 xl:hidden px-5 pt-6 pb-1">
                  <h1 className="text-[26px] font-extrabold text-[var(--color-text-primary)] tracking-tight">
                    {headerInfo.mobileTitle}
                  </h1>
                  <div className="ml-auto flex items-center gap-2">
                    <ModeSwitcher
                      activeMode="user"
                      roles={user?.roles ?? []}
                      compact
                    />
                    <span className="bg-[#B83A38] text-white text-[12px] font-extrabold px-3 py-1.5 rounded-full tracking-wide">
                      시험까지 D-{examDDay}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-[11px] font-bold bg-[var(--color-card-background)] text-[var(--color-primary)] border border-[var(--color-border)] px-2.5 py-1.5 rounded-full tracking-wide shadow-sm cursor-pointer"
                    >
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
  );
}
