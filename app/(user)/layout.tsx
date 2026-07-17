"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { UserSidebar } from "../../features/dashboard/components/UserSidebar";
import { MobileBottomNav } from "../../features/dashboard/components/MobileBottomNav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
    if (path.startsWith("/exam/live")) {
      return {
        desktopTitle: "실시간 문제풀이",
        desktopSub: "OMR 답안지 입력 및 자동 저장",
        mobileTitle: "실시간 문제풀이",
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

  return (
    <div className="min-h-screen bg-[#F0EFEA] flex flex-col xl:flex-row w-full font-sans overflow-x-hidden">
      {/* 1. 사이드바 네비게이션 (데스크톱 전용) */}
      <UserSidebar />

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
            {/* 상단 헤더로 옮겨진 사용자 프로필 카드 */}
            <div className="flex items-center gap-2.5 border-l border-[#E4E0D9] pl-4">
              <div className="w-8 h-8 rounded-full bg-[#B83A38] flex items-center justify-center font-extrabold text-white text-[12px]">
                홍
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[13px] font-bold text-[#111111] truncate leading-none">
                  홍길동 님
                </span>
                <span className="text-[10px] text-[#817D76] truncate">
                  합격 목표
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 콘텐츠 뷰포트 영역 */}
        <div className="flex-1 overflow-y-auto xl:bg-[#F7F6F2]/30">
          {/* 
            모바일: max-w-md, min-h-screen
            태블릿: max-w-2xl, min-h-screen, padding 확대
            데스크톱: max-w-[1440px], min-h-0, grid 레이아웃, 정렬 
          */}
          <div className="w-full max-w-md md:max-w-2xl xl:max-w-[1440px] mx-auto min-h-screen xl:min-h-0 bg-[#F7F6F2] xl:bg-transparent shadow-sm xl:shadow-none flex flex-col justify-between xl:justify-start relative overflow-hidden xl:overflow-visible transition-all duration-300">
            
            {/* 상단 타이틀 & D-Day (모바일 / 태블릿용 헤더 공통화) */}
            <div className="flex justify-between items-center xl:hidden px-5 pt-6 pb-1">
              <h1 className="text-[26px] font-extrabold text-[#1A1A1A] tracking-tight">
                {headerInfo.mobileTitle}
              </h1>
              <span className="bg-[#B83A38] text-white text-[12px] font-extrabold px-3 py-1.5 rounded-full tracking-wide">
                시험까지 D-{examDDay}
              </span>
            </div>

            {/* 개별 페이지 본문 삽입 */}
            {children}

            {/* 하단 탭바 (모바일/태블릿용) */}
            <MobileBottomNav />
          </div>
        </div>
      </div>
    </div>
  );
}
