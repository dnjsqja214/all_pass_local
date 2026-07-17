"use client";

import React from "react";
import { useDashboardData } from "../../features/dashboard/hooks/useDashboardData";
import { ActiveStudyCard } from "../../features/dashboard/components/ActiveStudyCard";
import { TodoItemCard } from "../../features/dashboard/components/TodoItemCard";
import { StatSummaryCard } from "../../features/dashboard/components/StatSummaryCard";
import { RecentExamsCard } from "../../features/dashboard/components/RecentExamsCard";
import { StudyTimeGraphCard } from "../../features/dashboard/components/StudyTimeGraphCard";

export default function Home() {
  const {
    activeSession,
    todoList,
    weeklyStats,
    recentExams,
    dailyStudyTime,
  } = useDashboardData();

  return (
    <div className="flex-1 px-5 pt-6 pb-6 md:px-8 xl:p-8 space-y-6">
      {/* 대시보드 타이틀 (데스크톱용) */}
      <div className="hidden xl:flex flex-col gap-1 mb-2">
        <h1 className="text-[28px] font-black text-[#1A1A1A] tracking-tight">
          오늘의 학습 요약
        </h1>
        <p className="text-[14px] text-[#8E8E8E] font-medium">
          실시간 강의 및 오늘 할 일을 완료하고 학습 목표를 달성하세요.
        </p>
      </div>

      {/* Grid Layout 구성 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">
        
        {/* 좌측 컬럼 (데스크톱): 실시간 스터디 + 오늘 할 일 */}
        <div className="xl:col-span-7 space-y-6">
          {/* 실시간 스터디 카드 */}
          <ActiveStudyCard session={activeSession} />

          {/* 오늘 할 일 섹션 */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-[#B83A38] tracking-widest uppercase">
              오늘 할 일
            </h3>
            <div className="space-y-3">
              {todoList.map((todo) => (
                <TodoItemCard key={todo.id} todo={todo} />
              ))}
            </div>
          </div>
        </div>

        {/* 우측 컬럼 (데스크톱): 이번 주 통계 + 최근 시험 + 그래프 */}
        <div className="xl:col-span-5 space-y-6">
          {/* 이번 주 학습 통계 */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-[#B83A38] tracking-widest uppercase">
              이번 주 학습
            </h3>
            <StatSummaryCard stats={weeklyStats} />
          </div>

          {/* 최근 시험 결과 (데스크톱 전용) */}
          <div className="hidden xl:block">
            <RecentExamsCard exams={recentExams} />
          </div>

          {/* 공부 시간 그래프 (데스크톱 전용) */}
          <div className="hidden xl:block">
            <StudyTimeGraphCard studyTimes={dailyStudyTime} />
          </div>
        </div>

      </div>
    </div>
  );
}
