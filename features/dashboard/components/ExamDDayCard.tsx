import React from "react";

interface ExamDDayCardProps {
  examRound?: number;
  examDate?: string; // ISO format (e.g. "2026-10-31")
  registrationStart?: string; // ISO format (e.g. "2026-08-03")
  registrationEnd?: string; // ISO format (e.g. "2026-08-07")
  announcementDate?: string; // ISO format (e.g. "2026-12-02")
}

// 요일 포함 날짜 포맷팅 헬퍼 (YYYY-MM-DD -> YYYY-MM-DD (요일))
function formatDateWithDayOfWeek(dateStr: string): string {
  if (!dateStr) return "";
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  
  // 타임존 방지를 위해 로컬 기준으로 파싱
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  
  if (isNaN(date.getTime())) return dateStr;
  
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const dayOfWeek = days[date.getDay()];
  
  return `${y}-${m}-${d} (${dayOfWeek})`;
}

// 로컬 자정 기준 Date 객체 생성
function parseLocalMidnight(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

export function ExamDDayCard({
  examRound = 37,
  examDate = "2026-10-31",
  registrationStart = "2026-08-03",
  registrationEnd = "2026-08-07",
  announcementDate = "2026-12-02",
}: ExamDDayCardProps) {
  // 실시간 D-Day 및 남은 주차 계산
  const targetDate = parseLocalMidnight(examDate);
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  
  const diffMs = targetDate.getTime() - todayMidnight.getTime();
  const dDay = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const weeksRemaining = Math.max(0, Math.ceil(dDay / 7));

  // 화면 출력용 포맷팅
  const formattedExamDate = formatDateWithDayOfWeek(examDate);
  const formattedRegPeriod = `${formatDateWithDayOfWeek(registrationStart)} ~ ${formatDateWithDayOfWeek(registrationEnd)}`;
  const formattedAnnounceDate = formatDateWithDayOfWeek(announcementDate);

  return (
    <div className="bg-white rounded-2xl border border-[#E4E0D9] p-5 shadow-xs flex flex-col gap-4">
      {/* 상단 타이틀 & D-day 뱃지 영역 */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-[#C93A35] tracking-wider uppercase">
            {examRound}th License Exam
          </span>
          <h4 className="text-[19px] font-black text-[#111111] tracking-tight mt-0.5 leading-tight">
            제{examRound}회 공인중개사
          </h4>
        </div>

        {/* D-Day 뱃지 */}
        <div className="bg-[#C93A35] text-white py-2 px-3.5 rounded-2xl flex flex-col items-center justify-center min-w-[90px] shrink-0 shadow-xs">
          <span className="text-[20px] font-black leading-none">
            {dDay > 0 ? `D-${dDay}` : dDay === 0 ? "D-Day" : `D+${Math.abs(dDay)}`}
          </span>
          <span className="text-[10px] font-bold opacity-90 mt-1">W-{weeksRemaining}주</span>
        </div>
      </div>

      {/* 시험 세부 일정 리스트 */}
      <div className="border-t border-b border-[#F6F4F0] py-3.5 space-y-3">
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-bold text-[#817D76]">시험 일정</span>
          <span className="font-black text-[#111111]">{formattedExamDate}</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-bold text-[#817D76]">접수 일자</span>
          <span className="font-black text-[#111111]">{formattedRegPeriod}</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-bold text-[#817D76]">합격자 발표</span>
          <span className="font-black text-[#111111]">{formattedAnnounceDate}</span>
        </div>
      </div>

      {/* 2차 시험 과목 안내 박스 */}
      <div className="bg-[#F6F4F0] p-4 rounded-xl border border-[#E4E0D9] space-y-2">
        <h5 className="text-[12px] font-black text-[#C93A35] tracking-wider uppercase">
          2차 시험 과목
        </h5>
        <div className="space-y-1 text-[11.5px] text-[#111111] font-semibold leading-relaxed">
          <div>
            <span className="text-[#817D76]">1교시 :</span> 공인중개사법령 및 중개실무, 부동산공법
          </div>
          <div>
            <span className="text-[#817D76]">2교시 :</span> 부동산공시법 및 부동산세법
          </div>
        </div>
      </div>
    </div>
  );
}
