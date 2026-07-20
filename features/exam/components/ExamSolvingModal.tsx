"use client";

import React, { useState } from "react";
import { useExamData } from "../hooks/useExamData";
import { ExamTimer } from "./ExamTimer";
import { ExamNotice } from "./ExamNotice";
import { ExamProgress } from "./ExamProgress";
import { OMRGrid } from "./OMRGrid";
import { SubmitFooter } from "./SubmitFooter";
import { SubmitDialog } from "./SubmitDialog";
import { X } from "lucide-react";

interface ExamSolvingModalProps {
  examId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function ExamSolvingModal({
  examId,
  isOpen,
  onClose,
  onSubmitted,
}: ExamSolvingModalProps) {
  if (!isOpen) return null;

  const {
    examInfo,
    answers,
    remainingSeconds,
    saveStatus,
    isSubmitted,
    markedCount,
    unansweredCount,
    selectAnswer,
    submitExam,
    showToast,
    toastMessage,
  } = useExamData(examId);

  // 제출 다이얼로그 모달 노출 상태
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // 중단 확인 다이얼로그 노출 상태 (시험 도중 닫을 때)
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState<boolean>(false);

  // 정답지 제출하기 클릭 시
  const handleSubmitClick = () => {
    if (isSubmitted) return;
    setIsDialogOpen(true);
  };

  // 모달 확인 완료 시
  const handleConfirmSubmit = () => {
    setIsDialogOpen(false);
    submitExam();
    alert("정답지가 정상적으로 제출되었습니다!");
    if (onSubmitted) {
      onSubmitted();
    }
    onClose();
  };

  // 나가기 버튼 클릭 시
  const handleCloseClick = () => {
    if (markedCount > 0 && !isSubmitted) {
      setIsCloseConfirmOpen(true);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F6F4F0] z-50 overflow-y-auto flex flex-col animate-in fade-in duration-200">
      {/* 상단바 */}
      <header className="flex justify-between items-center bg-white px-6 py-4 border-b border-[#E4E0D9] shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-extrabold text-[#C93A35] bg-[#C93A35]/5 border border-[#C93A35]/15 px-2 py-0.5 rounded uppercase tracking-wider">
            실시간 풀이 중
          </span>
          <h2 className="text-[18px] font-extrabold text-[#111111] tracking-tight">
            {examInfo.title}
          </h2>
        </div>
        <button
          onClick={handleCloseClick}
          className="p-2 hover:bg-[#F6F4F0] rounded-full transition-colors cursor-pointer text-[#817D76] hover:text-[#111111] border-none outline-none bg-transparent"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* 본문 콘텐츠 */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 pt-6 pb-36 md:px-8 xl:p-8 space-y-6">
        
        {/* 설명 및 타이틀 */}
        <div className="flex flex-col gap-1 mb-2">
          <p className="text-[13px] text-[#817D76] font-semibold">
            본인의 기출문제집을 풀며 아래 OMR 답안지에 정답을 입력하세요. 실시간 타이머 및 자동 저장 기능이 적용되어 있습니다.
          </p>
        </div>

        {/* 반응형 2단 레이아웃 분기 */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* 좌측 영역 (데스크톱: 4열 / 모바일: 전체) */}
          <div className="xl:col-span-4 flex flex-col gap-5">
            <ExamTimer title={examInfo.title} remainingSeconds={remainingSeconds} />
            <ExamNotice />
            <ExamProgress
              markedCount={markedCount}
              totalQuestions={examInfo.totalQuestions}
              saveStatus={saveStatus}
            />
          </div>

          {/* 우측 영역 (데스크톱: 8열 / 모바일: 전체) */}
          <div className="xl:col-span-8">
            <OMRGrid
              totalQuestions={examInfo.totalQuestions}
              answers={answers}
              onSelectAnswer={selectAnswer}
            />
          </div>

        </div>
      </div>

      {/* 고정 제출 푸터 */}
      <SubmitFooter onSubmitClick={handleSubmitClick} />

      {/* 제출 확인 모달 다이얼로그 */}
      <SubmitDialog
        isOpen={isDialogOpen}
        unansweredCount={unansweredCount}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmSubmit}
      />

      {/* 중간 이탈 경고 모달 */}
      {isCloseConfirmOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#E4E0D9] shadow-2xl flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFFDF0] flex items-center justify-center text-[#D93D35] shrink-0 mt-0.5">
                <span>⚠️</span>
              </div>
              <div>
                <h3 className="text-[17px] font-extrabold text-[#111111] tracking-tight leading-tight">
                  시험 풀이를 중단하시겠습니까?
                </h3>
                <p className="text-[13px] text-[#817D76] font-medium mt-1">
                  작성 중인 답안은 임시 저장되지만, 타이머는 초기화될 수 있습니다.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCloseConfirmOpen(false)}
                className="w-full py-3 px-4 bg-[#F6F4F0] border border-[#E4E0D9] text-[#111111] font-bold text-[14px] rounded-xl hover:bg-[#EAE8E2] transition-colors cursor-pointer"
              >
                계속 풀기
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCloseConfirmOpen(false);
                  onClose();
                }}
                className="w-full py-3 px-4 bg-[#C93A35] text-white font-bold text-[14px] rounded-xl hover:bg-[#B82F2A] transition-colors cursor-pointer"
              >
                중단하고 나가기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 저장 실패 시 안내하는 토스트 메시지 팝업 */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#D93D35] text-white px-4 py-3 rounded-xl shadow-lg text-[13px] font-bold z-[55] flex items-center gap-2 animate-bounce">
          <span>⚠️</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
