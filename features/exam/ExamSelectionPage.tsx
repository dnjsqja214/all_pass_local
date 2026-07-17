"use client";

import React, { useRef, useEffect } from "react";
import { mockExams } from "./data/mockExams";
import { useExamSearch } from "./hooks/useExamSearch";
import { ExamSearchForm } from "./components/ExamSearchForm";
import { ExamCardList } from "./components/ExamCardList";
import { EmptyExamResult } from "./components/EmptyExamResult";

export function ExamSelectionPage() {
  const {
    examNameInput,
    setExamNameInput,
    appliedExamName,
    selectedYear,
    setSelectedYear,
    selectedRound,
    setSelectedRound,
    filteredExams,
    handleSearch,
    handleReset,
  } = useExamSearch(mockExams);

  const scrollRef = useRef<HTMLDivElement>(null);

  // 검색 조건(시험명 적용값, 연도 선택값, 회차 선택값) 변경 시 스크롤을 맨 위로 리셋
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [appliedExamName, selectedYear, selectedRound]);

  return (
    <div className="flex-grow flex flex-col h-full min-h-0 overflow-hidden px-4 pt-6 md:px-8 xl:p-8 space-y-5">
      {/* 상단 타이틀 영역 */}
      <div className="hidden xl:flex flex-col gap-1 mb-1 shrink-0">
        <h1 className="text-[28px] font-black text-[#111111] tracking-tight">
          시험 선택
        </h1>
        <p className="text-[14px] text-[#817D76] font-medium">
          응시할 시험을 검색한 후 시험을 선택하세요.
        </p>
      </div>

      {/* 검색 필터 */}
      <div className="shrink-0">
        <ExamSearchForm
          title={examNameInput}
          setTitle={setExamNameInput}
          year={selectedYear}
          setYear={setSelectedYear}
          round={selectedRound}
          setRound={setSelectedRound}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </div>

      {/* 결과 건수 */}
      <div className="flex items-center justify-between shrink-0">
        <div className="text-[14px] font-bold text-[#111111] tracking-tight">
          검색 결과 <span className="text-[#C93A35] font-black">{filteredExams.length}</span>개
        </div>
      </div>

      {/* 시험 목록 또는 빈 화면 (스크롤 가능하도록 배치) */}
      {filteredExams.length > 0 ? (
        <ExamCardList exams={filteredExams} scrollRef={scrollRef} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <EmptyExamResult onReset={handleReset} />
        </div>
      )}
    </div>
  );
}
