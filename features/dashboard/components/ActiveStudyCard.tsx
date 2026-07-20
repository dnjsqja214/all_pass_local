import React, { useState, useEffect } from "react";
import { StudySessionInfo } from "../hooks/useDashboardData";
import { ExamRegistration } from "../../exam/services/examRegistrationService";
import styles from "./ActiveStudyCard.module.css";

interface ActiveStudyCardProps {
  closestRegistration: ExamRegistration | null;
  session: StudySessionInfo;
  onSelectExamClick?: () => void;
  onSolveClick?: () => void;
  onApplyExamClick?: () => void;
}

export function ActiveStudyCard({
  closestRegistration,
  session,
  onSelectExamClick,
  onSolveClick,
  onApplyExamClick,
}: ActiveStudyCardProps) {
  const [isParticipating, setIsParticipating] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // 참여 시작 시 시험 일정(오전 10시)까지의 남은 시간을 1초마다 업데이트하는 타이머
  useEffect(() => {
    if (!isParticipating || !closestRegistration) return;

    const updateCountdown = () => {
      const now = new Date();
      const [year, month, day] = closestRegistration.registrationDate.split("-").map(Number);
      const targetTime = new Date(year, month - 1, day, 10, 0, 0);
      const diffMs = targetTime.getTime() - now.getTime();
      const secondsLeft = Math.max(0, Math.floor(diffMs / 1000));
      setRemainingSeconds(secondsLeft);
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [closestRegistration, isParticipating]);

  // 남은 초를 D-day 및 시/분/초 단위 카운트다운 포맷으로 변환
  const formatCountdown = (totalSec: number) => {
    if (totalSec <= 0) return "00:00";

    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");

    if (d > 0) {
      return `D-${d} ${hh}:${mm}:${ss}`;
    }
    if (h > 0) {
      return `${hh}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleButtonClick = () => {
    if (!isParticipating) {
      setIsParticipating(true);
    }
  };

  return (
    <div className={styles.card}>
      <div className="flex justify-between items-start">
        <div className={styles.textGroup}>
          <span className={styles.title}>
            {session.title}
          </span>
          <h2 className={styles.time}>
            {session.timeRange}
          </h2>
        </div>
      </div>

      {closestRegistration ? (
        <>
          {/* 가장 가까운 시험 정보 영역 */}
          <div className="bg-[#FFFFFF15] border border-[#FFFFFF1A] px-4 py-3.5 rounded-2xl text-left text-red-50 text-[13px] font-semibold space-y-1 mt-3.5 backdrop-blur-xs">
            <div className="text-[10px] opacity-75 uppercase font-bold tracking-wider">
              다음 목표 시험일 ({closestRegistration.registrationDate})
            </div>
            <div className="text-[15.5px] font-black text-white tracking-tight truncate">
              {closestRegistration.examTitle}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={handleButtonClick} className={`${styles.button} flex-grow`}>
              <span>{isParticipating ? formatCountdown(remainingSeconds) : "참여"}</span>
            </button>
            <button
              onClick={onSolveClick}
              className="py-3 px-4 bg-[#1A1A1A] hover:bg-[#2A2A2A] active:bg-black text-white font-extrabold text-[12.5px] rounded-xl transition-all cursor-pointer border-none outline-none shadow-xs shrink-0 flex items-center justify-center"
            >
              OMR 테스트
            </button>
          </div>
        </>
      ) : (
        /* 신청한 시험이 하나도 없는 상태 */
        <div className="mt-4 py-4 flex flex-col items-center justify-center gap-3 bg-[#FFFFFF0A] border border-[#FFFFFF15] rounded-2xl">
          <span className="text-red-100 text-[12.5px] font-bold opacity-90">
            💡 신청된 시험 일정이 없습니다.
          </span>
          <button
            onClick={onApplyExamClick}
            className="py-2.5 px-6 bg-[#1A1A1A] hover:bg-[#2A2A2A] active:bg-black text-white font-extrabold text-[12.5px] rounded-xl transition-all cursor-pointer border-none outline-none shadow-xs"
          >
            시험 신청
          </button>
        </div>
      )}
    </div>
  );
}
