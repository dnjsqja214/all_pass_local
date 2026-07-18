"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserSidebar } from "../../features/dashboard/components/UserSidebar";
import { MobileBottomNav } from "../../features/dashboard/components/MobileBottomNav";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { authService } from "../../features/auth/services/authService";

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
    const saved = localStorage.getItem("allpass-user-sidebar-collapsed");
    if (saved !== null) {
      setIsUserSidebarCollapsed(saved === "true");
    }
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
    if (path.startsWith("/learning-management")) {
      return {
        desktopTitle: "학습관리",
        desktopSub: "성적 추이 분석",
        mobileTitle: "학습관리",
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
    <div className="min-h-screen bg-[#F0EFEA] flex flex-col xl:flex-row w-full font-sans overflow-x-hidden">
      {authStatus === "loading" || authStatus === "unauthenticated" ? (
        <div className="min-h-screen bg-[#F6F4F0] flex items-center justify-center font-bold text-[#817D76] w-full">
          로그인 확인 중...
        </div>
      ) : authStatus === "error" ? (
        <div className="min-h-screen bg-[#F6F4F0] flex flex-col gap-2 items-center justify-center px-4 text-center w-full">
          <p className="font-bold text-[#111111]">로그인 상태를 확인할 수 없습니다.</p>
          <p className="text-sm text-[#817D76]">{authError}</p>
        </div>
      ) : (
        <>
          {/* 1. 사이드바 네비게이션 (데스크톱 전용) */}
          <UserSidebar
            isCollapsed={isUserSidebarCollapsed}
            onToggleCollapse={handleToggleCollapse}
            onLogout={handleLogout}
          />

          {/* 2. 메인 영역 */}
          <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
            
            {/* 상단 Header (데스크톱 전용) */}
            <header className="hidden xl:flex justify-between items-center bg-white px-8 py-5 border-b border-[#EDEDED] w-full">
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-extrabold text-[#1A1A1A] tracking-tight">
                  {headerInfo.desktopTitle}
                </h2>
                <span className="text-[13px] font-semibold text-[#8E8E8E]">
                  {headerInfo.desktopSub}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-[#B83A38] text-white text-[13px] font-bold px-4 py-2 rounded-full tracking-wide">
                  시험까지 D-{examDDay}
                </span>
                
                {/* 상단 헤더로 옮겨진 사용자 프로필 카드 + 로그아웃 버튼 */}
                <div className="flex items-center gap-4 border-l border-[#E4E0D9] pl-4">
                  {displayName ? (
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#B83A38] flex items-center justify-center font-extrabold text-white text-[12px]">
                        {displayName[0]}
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[13px] font-bold text-[#111111] truncate leading-none">
                          {displayName} 님
                        </span>
                        <span className="text-[10px] text-[#817D76] truncate">
                          합격 목표
                        </span>
                      </div>
                    </div>
                  ) : null}
                  
                  <button
                    onClick={handleLogout}
                    className="text-[12px] font-bold text-[#C93A35] hover:text-[#111111] transition-all cursor-pointer border border-[#C93A35]/25 hover:border-[#111111]/20 px-3 py-1.5 rounded-lg bg-transparent"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </header>

            {/* 콘텐츠 뷰포트 영역 */}
            <div className={`flex-1 ${pathname === "/exams" ? "xl:overflow-hidden" : "xl:overflow-y-auto"} overflow-y-auto xl:bg-[#F7F6F2]/30`}>
              <div className={`w-full max-w-md md:max-w-2xl xl:max-w-[1440px] mx-auto min-h-screen bg-[#F7F6F2] xl:bg-transparent shadow-sm xl:shadow-none flex flex-col justify-between xl:justify-start relative overflow-hidden xl:overflow-visible transition-all duration-300 ${pathname === "/exams" ? "xl:h-full xl:min-h-0" : "xl:min-h-0"}`}>
                
                {/* 상단 타이틀 & D-Day & 로그아웃 (모바일 / 태블릿용 헤더 공통화) */}
                <div className="flex justify-between items-center xl:hidden px-5 pt-6 pb-1">
                  <h1 className="text-[26px] font-extrabold text-[#1A1A1A] tracking-tight">
                    {headerInfo.mobileTitle}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#B83A38] text-white text-[12px] font-extrabold px-3 py-1.5 rounded-full tracking-wide">
                      시험까지 D-{examDDay}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-[11px] font-bold bg-white text-[#C93A35] border border-[#E4E0D9] px-2.5 py-1.5 rounded-full tracking-wide shadow-sm active:bg-[#F6F4F0] cursor-pointer"
                    >
                      로그아웃
                    </button>
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
