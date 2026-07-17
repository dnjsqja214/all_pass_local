"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useExamData } from "../../../../features/exam/hooks/useExamData";

// OMR 컴포넌트 임포트
import { ExamTimer } from "../../../../features/exam/components/ExamTimer";
import { ExamNotice } from "../../../../features/exam/components/ExamNotice";
import { ExamProgress } from "../../../../features/exam/components/ExamProgress";
import { OMRGrid } from "../../../../features/exam/components/OMRGrid";
import { SubmitFooter } from "../../../../features/exam/components/SubmitFooter";
import { SubmitDialog } from "../../../../features/exam/components/SubmitDialog";

export default function LiveExam() {
  const router = useRouter();

  // OMR 성적 및 상태 관련 데이터 훅 호출
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
  } = useExamData();

  // 제출 다이얼로그 모달 노출 상태
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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
    router.push("/"); // 제출 완료 후 홈으로 이동
  };

  return (
    <div className="flex-1 px-4 pt-6 pb-28 md:px-8 xl:p-8 space-y-6">
      
      {/* 데스크톱 타이틀 (데스크톱용) */}
      <div className="hidden xl:flex flex-col gap-1 mb-2">
        <h1 className="text-[28px] font-black text-[#111111] tracking-tight">
          실시간 OMR 답안 입력
        </h1>
        <p className="text-[14px] text-[#817D76] font-medium">
          본인의 기출문제집을 풀며 아래 OMR 답안지에 정답을 입력하세요. 실시간 타이머 및 자동 저장 기능이 적용되어 있습니다.
        </p>
      </div>

      {/* 반응형 2단 레이아웃 분기 */}
      {/* 데스크톱: 좌측(정보/타이머/안내/진행상태) + 우측(OMR 입력) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* 좌측 영역 (데스크톱: 4열 / 모바일: 전체) */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          {/* 시험 정보 카드 & 타이머 */}
          <ExamTimer title={examInfo.title} remainingSeconds={remainingSeconds} />

          {/* 안내 카드 */}
          <ExamNotice />

          {/* OMR 마킹 진행 상태 */}
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

      {/* 고정 제출 푸터 */}
      <SubmitFooter onSubmitClick={handleSubmitClick} />

      {/* 제출 확인 모달 다이얼로그 */}
      <SubmitDialog
        isOpen={isDialogOpen}
        unansweredCount={unansweredCount}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmSubmit}
      />

      {/* 저장 실패 시 안내하는 토스트 메시지 팝업 */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#D93D35] text-white px-4 py-3 rounded-xl shadow-lg text-[13px] font-bold z-50 flex items-center gap-2 animate-bounce">
          <span>⚠️</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
