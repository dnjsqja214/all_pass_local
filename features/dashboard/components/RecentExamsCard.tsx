import React from "react";
import { RecentExam } from "../hooks/useDashboardData";

interface RecentExamsCardProps {
  exams: RecentExam[];
}

export function RecentExamsCard({ exams }: RecentExamsCardProps) {
  return (
    <div className="w-full bg-white rounded-[24px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[#EDEDED] flex flex-col gap-4">
      <div className="flex justify-between items-center pb-2 border-b border-[#F5F5F5]">
        <h4 className="text-[15px] font-bold text-[#1A1A1A] tracking-tight">
          최근 시험 결과
        </h4>
        <span className="text-[12px] text-[#8E8E8E] font-medium">
          최근 3회 기준
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="flex items-center justify-between py-1.5"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-[14px] font-bold text-[#333] tracking-tight leading-tight">
                {exam.title}
              </span>
              <span className="text-[11px] text-[#8E8E8E]">
                풀이일: {exam.date}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-extrabold text-[#1A1A1A]">
                {exam.score}점
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  exam.isPassed
                    ? "bg-[#E6F4EA] text-[#137333]"
                    : "bg-[#FDF1F0] text-[#B83A38]"
                }`}
              >
                {exam.isPassed ? "합격" : "불합격"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
