import React from "react";
import { useRouter } from "next/navigation";
import { ExamListItem } from "../types/exam";
import { ExamStatusBadge } from "./ExamStatusBadge";
import { Calendar, HelpCircle, Clock } from "lucide-react";

interface ExamCardProps {
  exam: ExamListItem;
}

export function ExamCard({ exam }: ExamCardProps) {
  const router = useRouter();

  const handleSelect = () => {
    if (exam.status === "scheduled") return;
    router.push(`/exams/${exam.id}/solve`);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E4E0D9] p-5 shadow-sm hover:shadow-md hover:border-[#C93A35]/30 transition-all flex flex-col justify-between h-[280px]">
      <div>
        {/* 상단 배지 영역 */}
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[10px] font-extrabold text-[#C93A35] bg-[#C93A35]/5 border border-[#C93A35]/15 px-2 py-0.5 rounded uppercase tracking-wider">
            {exam.round}회 기출
          </span>
          <ExamStatusBadge status={exam.status} />
        </div>

        {/* 본문 정보 */}
        <div className="space-y-2">
          <h3 className="text-[18px] font-black text-[#111111] tracking-tight truncate">
            {exam.title}
          </h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[#817D76] font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {exam.year}년 · {exam.round}회
            </span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              {exam.totalQuestions}문항
            </span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {exam.durationMinutes}분
            </span>
          </div>
          <p className="text-[12px] text-[#817D76] font-medium leading-relaxed line-clamp-2 mt-1.5">
            {exam.description || "실제 기출문제집을 보며 OMR 답안을 입력하고 실시간으로 성적을 집계합니다."}
          </p>
        </div>
      </div>

      {/* 하단 단추 및 채점 스코어 */}
      <div className="mt-4 pt-3 border-t border-[#F6F4F0] flex items-center justify-between gap-3">
        {exam.status === "completed" && exam.score !== undefined ? (
          <div className="text-[12px] font-bold text-[#3F7D4E]">
            최근 점수: <strong className="text-[15px] font-extrabold">{exam.score}점</strong>
          </div>
        ) : (
          <div className="text-[11px] font-semibold text-[#817D76]">
            {exam.status === "scheduled" ? "업데이트 예정" : "미응시 시험"}
          </div>
        )}

        <button
          onClick={handleSelect}
          disabled={exam.status === "scheduled"}
          className={`px-4 py-2.5 rounded-xl text-[12px] font-extrabold tracking-wide transition-all min-h-[40px] cursor-pointer ${
            exam.status === "scheduled"
              ? "bg-[#F6F4F0] text-[#A8A7A5] border border-[#E4E0D9] cursor-not-allowed"
              : exam.status === "completed"
              ? "bg-[#F6F4F0] hover:bg-[#E4E0D9] text-[#111111] border border-[#E4E0D9]"
              : "bg-[#C93A35] hover:bg-[#A82A25] text-white"
          }`}
        >
          {exam.status === "completed"
            ? "다시 풀기"
            : exam.status === "scheduled"
            ? "응시 예정"
            : "시험 선택"}
        </button>
      </div>
    </div>
  );
}
