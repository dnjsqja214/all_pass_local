import React, { RefObject } from "react";
import { ExamListItem } from "../types/exam";
import { ExamCard } from "./ExamCard";

interface ExamCardListProps {
  exams: ExamListItem[];
  scrollRef?: RefObject<HTMLDivElement | null>;
}

export function ExamCardList({ exams, scrollRef }: ExamCardListProps) {
  return (
    <div
      ref={scrollRef}
      className="flex-1 min-h-0 overflow-y-auto pr-1 pb-24 xl:pb-6 scrollbar-thin scrollbar-thumb-[#E4E0D9]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  );
}
