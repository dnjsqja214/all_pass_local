"use client";

import React, { useRef, useEffect } from "react";
import { mockExams } from "./data/mockExams";
import { useExamSearch } from "./hooks/useExamSearch";
import { ExamSearchForm } from "./components/ExamSearchForm";
import { ExamCardList } from "./components/ExamCardList";
import { EmptyExamResult } from "./components/EmptyExamResult";
import { X } from "lucide-react";

interface ExamSelectionPageProps {
  onSelectExam?: (examId: string) => void;
  isModal?: boolean;
  onClose?: () => void;
}

export function ExamSelectionPage({
  onSelectExam,
  isModal = false,
  onClose,
}: ExamSelectionPageProps) {
  const {
    selectedType,
    setSelectedType,
    selectedSubject,
    setSelectedSubject,
    selectedRound,
    setSelectedRound,
    filteredExams,
    handleSearch,
    handleReset,
  } = useExamSearch(mockExams);

  const scrollRef = useRef<HTMLDivElement>(null);

  // 검색 조건(유형, 과목, 회차) 변경 시 스크롤을 맨 위로 리셋
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [selectedType, selectedSubject, selectedRound]);

  const content = (
    <div className={`flex-grow flex flex-col h-full min-h-0 overflow-hidden ${isModal ? "p-6" : "px-4 pt-6 md:px-8 xl:p-8"} space-y-5`}>
      {/* 상단 타이틀 영역 */}
      <div className="flex flex-col gap-1 mb-1 shrink-0">
        <div className="flex justify-between items-center">
          <h1 className="text-[28px] font-black text-[#111111] tracking-tight">
            시험 선택
          </h1>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#E4E0D9] rounded-full transition-colors cursor-pointer text-[#817D76] hover:text-[#111111]"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* 검색 필터 */}
      <div className="shrink-0">
        <ExamSearchForm
          type={selectedType}
          setType={setSelectedType}
          subject={selectedSubject}
          setSubject={setSelectedSubject}
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
        <ExamCardList exams={filteredExams} scrollRef={scrollRef} onSelectExam={onSelectExam} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <EmptyExamResult onReset={handleReset} />
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
        <div className="bg-[#F6F4F0] rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col border border-[#E4E0D9] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
