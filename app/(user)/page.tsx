"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDashboardData } from "../../features/dashboard/hooks/useDashboardData";
import { ActiveStudyCard } from "../../features/dashboard/components/ActiveStudyCard";
import { StudyTimeGraphCard } from "../../features/dashboard/components/StudyTimeGraphCard";
import { ExamDDayCard } from "../../features/dashboard/components/ExamDDayCard";
import { ExamSelectionPage } from "../../features/exam/ExamSelectionPage";
import { ExamSolvingModal } from "../../features/exam/components/ExamSolvingModal";
import { examRegistrationService, ExamRegistration } from "../../features/exam/services/examRegistrationService";
import { ExamListItem } from "../../features/exam/types/exam";

interface ExamScoreRow {
  round: string;
  taxLaw: string | number;
  publicLaw: string | number;
  brokerageProperty: string | number;
}

const MOCK_SCORE_ROWS: ExamScoreRow[] = [
  { round: "35회차", taxLaw: 50, publicLaw: 80, brokerageProperty: 70 },
  { round: "24회차", taxLaw: "미응시", publicLaw: 40, brokerageProperty: "미응시" },
];

function isBackendExamId(examId: string): boolean {
  return /^exam-\d+-\d+$/.test(examId);
}

export default function Home() {
  const router = useRouter();
  const {
    activeSession,
    dailyStudyTime,
  } = useDashboardData();

  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [isSolvingOpen, setIsSolvingOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [closestRegistration, setClosestRegistration] = useState<ExamRegistration | null>(null);
  const hasAutoOpenedRef = useRef(false);

  // 마운트 시 신청된 시험 중 가장 일정이 빠른 것 가져오기
  useEffect(() => {
    const regs = examRegistrationService.getRegistrations();
    const activeRegs = regs.filter((reg) => reg.status === "applied");
    if (activeRegs.length > 0) {
      activeRegs.sort((a, b) => a.registrationDate.localeCompare(b.registrationDate));
      setClosestRegistration(activeRegs[0]);
    } else {
      setClosestRegistration(null);
    }
  }, []);

  // 가장 가까운 시험이 교체될 때 자동 팝업 실행 플래그 초기화
  useEffect(() => {
    setHasAutoOpened(false);
  }, [closestRegistration]);

  // 선택한 시험일의 오전 10시가 되면 자동으로 OMR 문제풀이 모달 띄우기
  useEffect(() => {
    if (!closestRegistration || hasAutoOpenedRef.current) return;

    // YYYY-MM-DD 파싱
    const [year, month, day] = closestRegistration.registrationDate.split("-").map(Number);
    // 목표 일시: 오전 10시 0분 0초
    const targetTime = new Date(year, month - 1, day, 10, 0, 0);
    const now = new Date();

    if (now >= targetTime) {
      setHasAutoOpened(true);
      setSelectedExamId(closestRegistration.examId);
      setIsSolvingOpen(true);
    }
  };

  const timerId = setInterval(checkTimeAndTransition, 1000);
  return () => clearInterval(timerId);
}, [closestRegistration, hasAutoOpened]);

const handleSelectExamClick = () => {
  setIsSelectionOpen(true);
};

const handleSolveClick = () => {
  if (closestRegistration && isBackendExamId(closestRegistration.examId)) {
    setSelectedExamId(closestRegistration.examId);
    setIsSolvingOpen(true);
  } else {
    setIsSelectionOpen(true);
  }
};

const handleApplyExamClick = () => {
  router.push("/exam-registration?openForm=true");
};

const handleSelectExam = (exam: ExamListItem) => {
  setIsSelectionOpen(false);
  setSelectedExamId(exam.id);
  setIsSolvingOpen(true);
};

// 점수에 따른 텍스트 컬러 포맷팅
const renderScoreCell = (score: string | number) => {
  if (typeof score === "string") {
    return <span className="text-[#817D76] font-semibold">{score}</span>;
  }
  const colorClass =
    score >= 80
      ? "text-[#3F7D4E] font-black"
      : score >= 60
        ? "text-[#D48A00] font-black"
        : "text-[#D93D35] font-black";
  return <span className={colorClass}>{score}점</span>;
};

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

      {/* 좌측 컬럼 (데스크톱): 실시간 스터디 + 회차별 성적 테이블 */}
      <div className="xl:col-span-7 space-y-6">
        {/* 실시간 스터디 카드 */}
        <ActiveStudyCard
          session={activeSession}
          closestRegistration={closestRegistration}
          onSolveClick={handleSolveClick}
          onApplyExamClick={handleApplyExamClick}
        />

        {/* 회차별 성적 현황 테이블 섹션 */}
        <div className="space-y-3">
          <h3 className="text-[14px] font-bold text-[#B83A38] tracking-widest uppercase">
            회차별 성적 현황
          </h3>
          <div className="bg-white rounded-2xl border border-[#E4E0D9] p-5 shadow-xs overflow-x-auto">
            <table className="w-full text-[13.5px] border-collapse min-w-[400px]">
              <thead>
                <tr className="border-b border-[#E4E0D9] text-[#817D76] font-bold text-left">
                  <th className="pb-3 font-black">회차</th>
                  <th className="pb-3 font-black">부동산세법</th>
                  <th className="pb-3 font-black">부동산공법</th>
                  <th className="pb-3 font-black">중개·물권</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F4F0]">
                {MOCK_SCORE_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F6F4F0]/30 transition-colors">
                    <td className="py-3.5 font-extrabold text-[#111111]">{row.round}</td>
                    <td className="py-3.5">{renderScoreCell(row.taxLaw)}</td>
                    <td className="py-3.5">{renderScoreCell(row.publicLaw)}</td>
                    <td className="py-3.5">{renderScoreCell(row.brokerageProperty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 우측 컬럼 (데스크톱): 이번 주 학습 (D-day 일정) + 최근 시험 + 그래프 */}
      <div className="xl:col-span-5 space-y-6">
        {/* 이번 주 학습 (D-day 일정) */}
        <div className="space-y-3">
          <ExamDDayCard />
        </div>
        {/* 공부 시간 그래프 (데스크톱 전용) */}
        <div className="hidden xl:block">
          <StudyTimeGraphCard studyTimes={dailyStudyTime} />
        </div>
      </div>

    </div>

    {/* 시험 선택 팝업 모달 */}
    {isSelectionOpen && (
      <ExamSelectionPage
        isModal
        onClose={() => setIsSelectionOpen(false)}
        onSelectExam={handleSelectExam}
      />
    )}

    {/* 문제 풀이 팝업 모달 */}
    {isSolvingOpen && selectedExamId && (
      <ExamSolvingModal
        examId={selectedExamId}
        isOpen={isSolvingOpen}
        onClose={() => {
          setIsSolvingOpen(false);
          setSelectedExamId(null);
        }}
      />
    )}
  </div>
);
}
