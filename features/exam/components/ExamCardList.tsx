import React, { RefObject } from "react";
import { useRouter } from "next/navigation";
import { ExamListItem } from "../types/exam";
import { Calendar, HelpCircle, Clock } from "lucide-react";

interface ExamCardListProps {
  exams: ExamListItem[];
  scrollRef?: RefObject<HTMLDivElement | null>;
  onSelectExam?: (exam: ExamListItem) => void;
}

export function ExamCardList({ exams, scrollRef, onSelectExam }: ExamCardListProps) {
  const router = useRouter();

  const handleSelect = (exam: ExamListItem) => {
    if (exam.status === "scheduled") return;
    if (onSelectExam) {
      onSelectExam(exam);
    } else {
      router.push(`/exams/${exam.id}/solve`);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 min-h-0 overflow-y-auto pr-1 pb-24 xl:pb-6 scrollbar-thin scrollbar-thumb-[#E4E0D9]"
    >
      <div className="flex flex-col gap-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-2xl border border-[#E4E0D9] p-5 shadow-sm hover:shadow-md hover:border-[#C93A35]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* 좌측 정보 영역 */}
            <div className="flex-1 min-w-0 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-[#C93A35] bg-[#C93A35]/5 border border-[#C93A35]/15 px-2 py-0.5 rounded uppercase tracking-wider">
                  {exam.round}회 기출
                </span>
              </div>

              <h3 className="text-[17px] font-black text-[#111111] tracking-tight truncate">
                {exam.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#817D76] font-semibold">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {exam.year}년 · {exam.round}회
                </span>
                <span className="text-[#E4E0D9]">|</span>
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  {exam.totalQuestions}문항
                </span>
                <span className="text-[#E4E0D9]">|</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {exam.durationMinutes}분
                </span>
              </div>
            </div>

            {/* 우측 단추 및 스코어 영역 */}
            <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 border-t border-[#F6F4F0] pt-3 md:border-t-0 md:pt-0">
              <div className="text-left md:text-right min-w-[70px]">
                {exam.status === "completed" && exam.score != null ? (
                  <div className={`text-[12px] font-bold ${exam.score >= 80
                      ? "text-[#3F7D4E]"
                      : exam.score >= 60
                        ? "text-[#D48A00]"
                        : "text-[#D93D35]"
                    }`}>
                    최근 점수 <div className="text-[16px] font-black mt-0.5">{exam.score}점</div>
                  </div>
                ) : (
                  <div className="text-[11px] font-bold text-[#817D76]">
                    {exam.status === "scheduled" ? "업데이트 예정" : "미응시 시험"}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleSelect(exam)}
                disabled={exam.status === "scheduled"}
                className={`px-5 py-2.5 rounded-xl text-[12px] font-extrabold tracking-wide transition-all min-h-[42px] cursor-pointer shrink-0 ${exam.status === "scheduled"
                    ? "bg-[#F6F4F0] text-[#A8A7A5] border border-[#E4E0D9] cursor-not-allowed"
                    : "bg-[#C93A35] hover:bg-[#A82A25] text-white"
                  }`}
              >
                시험 선택
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
