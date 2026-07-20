import React from "react";

interface ExamDDayCardProps {
  examRound?: number;
  dDay?: number;
  weeksRemaining?: number;
  examDate?: string;
  registrationPeriod?: string;
  announcementDate?: string;
}

export function ExamDDayCard({
  examRound = 37,
  dDay = 117,
  weeksRemaining = 17,
  examDate = "2026-10-31 (토)",
  registrationPeriod = "2026-08-03 (월) ~ 2026-08-07 (금)",
  announcementDate = "2026-12-02 (수)",
}: ExamDDayCardProps) {
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
          <span className="text-[20px] font-black leading-none">D-{dDay}</span>
          <span className="text-[10px] font-bold opacity-90 mt-1">W-{weeksRemaining}주</span>
        </div>
      </div>

      {/* 시험 세부 일정 리스트 */}
      <div className="border-t border-b border-[#F6F4F0] py-3.5 space-y-3">
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-bold text-[#817D76]">시험 일정</span>
          <span className="font-black text-[#111111]">{examDate}</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-bold text-[#817D76]">접수 일자</span>
          <span className="font-black text-[#111111]">{registrationPeriod}</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="font-bold text-[#817D76]">합격자 발표</span>
          <span className="font-black text-[#111111]">{announcementDate}</span>
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
